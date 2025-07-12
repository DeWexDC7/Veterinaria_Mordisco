import React, { useState, useEffect, useMemo, useCallback } from 'react';
import citaService from '../../services/cita.service';
import pacienteService from '../../services/paciente.service';
import usuarioService from '../../services/usuario.service';
import catalogoService from '../../services/catalogo.service';
import authService from '../../services/auth.service';
import '../../estilo/Usuarios.css';
import './AdminPanel.css';

// Componente para la gestión de citas
function GestionCitas() {
  // Estados
  const [citas, setCitas] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [veterinarios, setVeterinarios] = useState([]);
  const [estadosCitas, setEstadosCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: 'id_cita', direction: 'desc' });
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' o 'edit'
  const [selectedCita, setSelectedCita] = useState(null);
  const [formData, setFormData] = useState({
    id_paciente: '',
    id_veterinario: '',
    fecha: '',
    hora: '',
    motivo: '',
    id_estado_cita: '',
    observaciones: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [citaToDelete, setCitaToDelete] = useState(null);
  const [alertInfo, setAlertInfo] = useState({ show: false, type: '', message: '' });
  
  // Estados para búsqueda de pacientes
  const [searchPaciente, setSearchPaciente] = useState('');
  const [filteredPacientes, setFilteredPacientes] = useState([]);
  const [showPacienteOptions, setShowPacienteOptions] = useState(false);

  // Verificar si el usuario es administrador y obtener datos del usuario actual
  const isAdmin = authService.hasRole('administrador');
  const currentUser = authService.getCurrentUser();

  // Cargar datos iniciales
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [citasData, pacientesData, veterinariosData, estadosData] = await Promise.all([
        citaService.getAll(),
        pacienteService.getAll(),
        usuarioService.getAll(),
        catalogoService.getEstadosCitas()
      ]);

      setCitas(citasData || []);
      setPacientes(pacientesData || []);
      // Filtrar usuarios que pueden actuar como veterinarios (usuarios con rol 'usuario')
      setVeterinarios(veterinariosData?.filter(u => u.rol === 'usuario') || []);
      setEstadosCitas(estadosData || []);
      
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setError('Error al cargar la información. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Actualizar datos filtrados cuando cambian las citas o el término de búsqueda
  useEffect(() => {
    let result = [...citas];
    
    // Si es veterinario (no admin), filtrar solo las citas asignadas a él
    if (!isAdmin && currentUser?.id_usuario) {
      result = result.filter(cita => 
        cita.id_veterinario?.toString() === currentUser.id_usuario?.toString()
      );
    }
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(cita => 
        cita.motivo?.toLowerCase().includes(term) ||
        cita.Paciente?.nombre?.toLowerCase().includes(term) ||
        cita.Usuario?.nombre?.toLowerCase().includes(term) ||
        cita.observaciones?.toLowerCase().includes(term)
      );
    }
    
    // Filtrar por estado
    if (estadoFilter) {
      result = result.filter(cita => 
        cita.id_estado_cita?.toString() === estadoFilter
      );
    }
    
    // Ordenar datos
    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        
        // Manejar casos especiales
        if (sortConfig.key === 'paciente_nombre') {
          aValue = a.Paciente?.nombre || '';
          bValue = b.Paciente?.nombre || '';
        } else if (sortConfig.key === 'veterinario_nombre') {
          aValue = a.Usuario?.nombre || '';
          bValue = b.Usuario?.nombre || '';
        } else if (sortConfig.key === 'cliente_nombre') {
          aValue = a.Paciente?.Cliente?.nombre_completo || '';
          bValue = b.Paciente?.Cliente?.nombre_completo || '';
        } else if (sortConfig.key === 'estado_nombre') {
          aValue = catalogoService.getEstadoNombre(estadosCitas, a.id_estado_cita);
          bValue = catalogoService.getEstadoNombre(estadosCitas, b.id_estado_cita);
        }
        
        // Manejar valores nulos o indefinidos
        if (aValue === null || aValue === undefined) return sortConfig.direction === 'asc' ? -1 : 1;
        if (bValue === null || bValue === undefined) return sortConfig.direction === 'asc' ? 1 : -1;
        
        // Comparación para strings
        if (typeof aValue === 'string') {
          return sortConfig.direction === 'asc' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        
        // Comparación para números y fechas
        return sortConfig.direction === 'asc' 
          ? aValue > bValue ? 1 : -1
          : aValue < bValue ? 1 : -1;
      });
    }
    
    setFilteredData(result);
  }, [citas, searchTerm, estadoFilter, sortConfig, estadosCitas, isAdmin, currentUser]);

  // Filtrar pacientes para la búsqueda
  useEffect(() => {
    if (!searchPaciente.trim()) {
      setFilteredPacientes([]);
      setShowPacienteOptions(false);
      return;
    }

    // Si ya hay un paciente seleccionado y el texto coincide exactamente, no mostrar opciones
    if (formData.id_paciente) {
      const pacienteSeleccionado = pacientes.find(p => p.id_paciente === parseInt(formData.id_paciente));
      if (pacienteSeleccionado && pacienteSeleccionado.nombre === searchPaciente) {
        setFilteredPacientes([]);
        setShowPacienteOptions(false);
        return;
      }
    }

    const searchTerm = searchPaciente.toLowerCase();
    const filtered = pacientes.filter(paciente => {
      const nombre = paciente.nombre?.toLowerCase() || '';
      const especie = paciente.especie?.toLowerCase() || '';
      const raza = paciente.raza?.toLowerCase() || '';
      const propietario = paciente.Cliente?.nombre_completo?.toLowerCase() || '';
      
      return nombre.includes(searchTerm) || 
             especie.includes(searchTerm) || 
             raza.includes(searchTerm) || 
             propietario.includes(searchTerm);
    });

    setFilteredPacientes(filtered.slice(0, 10)); // Limitar a 10 resultados
    setShowPacienteOptions(filtered.length > 0);
  }, [searchPaciente, pacientes, formData.id_paciente]);

  // Cerrar opciones de paciente al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.paciente-search-container')) {
        setShowPacienteOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Funciones auxiliares
  const showAlert = (type, message, duration = null) => {
    // Dividir el mensaje en líneas para mejor presentación
    const formattedMessage = message.replace(/\n/g, '<br>');
    setAlertInfo({ show: true, type, message: formattedMessage });
    
    // Duración personalizada según el tipo de mensaje
    const alertDuration = duration || (type === 'error' ? 8000 : type === 'success' ? 5000 : 7000);
    
    setTimeout(() => {
      setAlertInfo({ show: false, type: '', message: '' });
    }, alertDuration);
  };

  const getPacienteName = (idPaciente) => {
    const paciente = pacientes.find(p => p.id_paciente === idPaciente);
    return paciente ? paciente.nombre : 'No asignado';
  };

  const getVeterinarioName = (idVeterinario) => {
    const veterinario = veterinarios.find(v => v.id_usuario === idVeterinario);
    return veterinario ? veterinario.nombre : 'No asignado';
  };

  const formatDate = (date) => {
    if (!date) return '';
    // Evitar problemas de zona horaria añadiendo T00:00:00 al string de fecha
    const fechaFormateada = date.includes('T') ? date : date + 'T00:00:00';
    return new Date(fechaFormateada).toLocaleDateString('es-ES');
  };

  const formatTime = (time) => {
    if (!time) return '';
    return time.substring(0, 5); // HH:MM
  };

  // Validación automática de conflictos de horarios
  const validateScheduleConflicts = useCallback(() => {
    if (!formData.fecha || !formData.hora) return true;

    const selectedDate = formData.fecha;
    const selectedTime = formData.hora;
    const currentCitaId = selectedCita?.id_cita; // Para excluir la cita actual al editar

    // Buscar conflictos en las citas existentes
    const conflictingCitas = citas.filter(cita => {
      // Excluir la cita actual si estamos editando
      if (currentCitaId && cita.id_cita === currentCitaId) return false;
      
      // Normalizar fechas para comparación (eliminar tiempo si existe)
      const citaFecha = cita.fecha ? cita.fecha.split('T')[0] : cita.fecha;
      const selectedFecha = selectedDate.split('T')[0];
      
      // Normalizar horas para comparación (formato HH:MM)
      const citaHora = cita.hora ? cita.hora.substring(0, 5) : cita.hora;
      const selectedHora = selectedTime.substring(0, 5);
      
      return citaFecha === selectedFecha && citaHora === selectedHora;
    });

    let hasConflicts = false;
    const newErrors = { ...formErrors };

    // Limpiar errores anteriores de conflictos
    delete newErrors.conflicto_paciente;
    delete newErrors.conflicto_veterinario;
    delete newErrors.conflicto_general;

    // Validar conflicto de paciente
    if (formData.id_paciente) {
      const pacienteConflict = conflictingCitas.find(cita => 
        cita.id_paciente?.toString() === formData.id_paciente?.toString()
      );
      
      if (pacienteConflict) {
        const veterinarioConflicto = getVeterinarioName(pacienteConflict.id_veterinario);
        const mensaje = `El paciente ya tiene una cita programada el ${formatDate(selectedDate)} a las ${formatTime(selectedTime)} con Dr. ${veterinarioConflicto}`;
        newErrors.conflicto_paciente = mensaje;
        hasConflicts = true;
      }
    }

    // Validar conflicto de veterinario
    if (formData.id_veterinario) {
      const veterinarioConflict = conflictingCitas.find(cita => 
        cita.id_veterinario?.toString() === formData.id_veterinario?.toString()
      );
      
      if (veterinarioConflict) {
        const pacienteConflicto = getPacienteName(veterinarioConflict.id_paciente);
        const mensaje = `El veterinario ya tiene una cita programada el ${formatDate(selectedDate)} a las ${formatTime(selectedTime)} con el paciente ${pacienteConflicto}`;
        newErrors.conflicto_veterinario = mensaje;
        hasConflicts = true;
      }
    }

    setFormErrors(newErrors);
    return !hasConflicts;
  }, [formData.fecha, formData.hora, formData.id_paciente, formData.id_veterinario, citas, selectedCita, formErrors, pacientes, veterinarios]);

  // Validación automática de conflictos cuando cambian fecha, hora, paciente o veterinario
  useEffect(() => {
    if (showModal && formData.fecha && formData.hora && (formData.id_paciente || formData.id_veterinario)) {
      // Usar setTimeout para evitar llamadas excesivas durante la escritura
      const timeoutId = setTimeout(() => {
        validateScheduleConflicts();
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [formData.fecha, formData.hora, formData.id_paciente, formData.id_veterinario, showModal, citas, validateScheduleConflicts]);

  // Calcular datos paginados
  const currentData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * itemsPerPage;
    const lastPageIndex = firstPageIndex + itemsPerPage;
    return filteredData.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, filteredData, itemsPerPage]);

  // Manejo de paginación
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Generar números de página para la paginación
  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }, [currentPage, totalPages]);

  // Manejo de ordenamiento
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortDirection = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? 'sort-asc' : 'sort-desc';
    }
    return '';
  };

  // Funciones de modal
  const openCreateModal = () => {
    setModalMode('create');
    setSelectedCita(null);
    setFormData({
      id_paciente: '',
      id_veterinario: '',
      fecha: '',
      hora: '',
      motivo: '',
      id_estado_cita: '1', // AGENDADA por defecto
      observaciones: ''
    });
    setFormErrors({});
    setSearchPaciente('');
    setShowModal(true);
  };

  const openEditModal = (cita) => {
    setModalMode('edit');
    setSelectedCita(cita);
    setFormData({
      id_paciente: cita.id_paciente || '',
      id_veterinario: cita.id_veterinario || '',
      fecha: cita.fecha || '',
      hora: cita.hora || '',
      motivo: cita.motivo || '',
      id_estado_cita: cita.id_estado_cita || '',
      observaciones: cita.observaciones || ''
    });
    setFormErrors({});
    // Establecer el nombre del paciente en el campo de búsqueda
    const pacienteActual = pacientes.find(p => p.id_paciente === cita.id_paciente);
    setSearchPaciente(pacienteActual ? pacienteActual.nombre : '');
    setShowModal(true);
  };

  const openDeleteModal = (cita) => {
    setCitaToDelete(cita);
    setShowDeleteModal(true);
  };

  // Manejo de cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo si existe
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Limpiar errores de conflicto de horarios si se cambió fecha, hora, paciente o veterinario
    if (['fecha', 'hora', 'id_paciente', 'id_veterinario'].includes(name)) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        
        // Limpiar todos los errores relacionados con conflictos
        delete newErrors.conflicto_paciente;
        delete newErrors.conflicto_veterinario;
        
        return newErrors;
      });
    }
  };

  // Validación del formulario
  const validateForm = () => {
    const errors = {};
    
    if (!formData.id_paciente) errors.id_paciente = 'El paciente es obligatorio';
    if (!formData.id_veterinario) errors.id_veterinario = 'El veterinario es obligatorio';
    if (!formData.fecha) errors.fecha = 'La fecha es obligatoria';
    if (!formData.hora) errors.hora = 'La hora es obligatoria';
    if (!formData.motivo?.trim()) errors.motivo = 'El motivo es obligatorio';
    if (!formData.id_estado_cita) errors.id_estado_cita = 'El estado es obligatorio';

    // Validar que la fecha y hora no sean en el pasado
    if (formData.fecha && formData.hora) {
      // Combinar fecha y hora para crear una comparación precisa
      const selectedDateTime = new Date(`${formData.fecha}T${formData.hora}:00`);
      const currentDateTime = new Date();
      
      if (selectedDateTime <= currentDateTime) {
        const today = new Date();
        const selectedDate = new Date(formData.fecha + 'T00:00:00');
        const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        
        if (selectedDate < todayDate) {
          errors.fecha = 'No se puede agendar citas en fechas pasadas';
        } else {
          errors.hora = `La hora debe ser posterior a las ${today.getHours().toString().padStart(2, '0')}:${today.getMinutes().toString().padStart(2, '0')}`;
        }
      }
    } else if (formData.fecha && !formData.hora) {
      // Solo validar fecha si no hay hora seleccionada
      const selectedDate = new Date(formData.fecha + 'T00:00:00');
      const today = new Date();
      const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      
      if (selectedDate < todayDate) {
        errors.fecha = 'No se puede agendar citas en fechas pasadas';
      }
    }

    // Validar conflictos de horarios - BLOQUEAR si hay conflictos
    const scheduleValid = validateScheduleConflicts();
    
    // Si hay conflictos de horarios, agregar errores específicos
    if (!scheduleValid) {
      if (formErrors.conflicto_paciente) {
        errors.conflicto_general = 'No se puede agendar: el paciente ya tiene una cita en esta fecha y hora';
      }
      if (formErrors.conflicto_veterinario) {
        errors.conflicto_general = formErrors.conflicto_general 
          ? 'No se puede agendar: tanto el paciente como el veterinario tienen conflictos de horario'
          : 'No se puede agendar: el veterinario ya tiene una cita en esta fecha y hora';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Guardar cita (creación o edición)
  const handleSaveForm = async () => {
    if (!validateForm()) {
      showAlert('error', '⚠️ Por favor, corrija los errores en el formulario antes de continuar');
      return;
    }

    try {
      setShowModal(false); // Cerrar modal primero
      
      if (modalMode === 'create') {
        await citaService.create(formData);
        await loadData(); // Recargar datos
        setCurrentPage(1);
        showAlert('success', '✅ ¡Cita creada exitosamente!\n\nLa nueva cita ha sido registrada en el sistema.', 4000);
      } else {
        await citaService.update(selectedCita.id_cita, formData);
        await loadData(); // Recargar datos
        setCurrentPage(1);
        showAlert('success', '✅ ¡Cita actualizada exitosamente!\n\nLos cambios han sido guardados correctamente.', 4000);
      }
      
    } catch (error) {
      console.error('Error al guardar cita:', error);
      
      // Verificar si es un error de conflicto de horarios del backend
      if (error.response?.data?.message?.includes('Conflicto de horario')) {
        showAlert('error', `🚫 ${error.response.data.message}\n\n⚠️ Por favor, seleccione una fecha y hora diferentes.`, 8000);
      } else {
        showAlert('error', '❌ Error al guardar la cita\n\nPor favor, intente nuevamente. Si el problema persiste, contacte al administrador.');
      }
      
      // Reabrir el modal si hubo error
      setShowModal(true);
    }
  };

  // Eliminar cita
  const handleDeleteCita = async () => {
    try {
      setShowDeleteModal(false); // Cerrar modal primero
      await citaService.delete(citaToDelete.id_cita);
      await loadData(); // Recargar datos
      setCurrentPage(1);
      showAlert('success', '✅ ¡Cita eliminada exitosamente!\n\nLa cita ha sido eliminada correctamente del sistema.', 4000);
    } catch (error) {
      console.error('Error al eliminar cita:', error);
      showAlert('error', '❌ Error al eliminar la cita\n\nPor favor, intente nuevamente. Si el problema persiste, contacte al administrador.');
    }
  };

  // Funciones para búsqueda de pacientes
  const handlePacienteSearch = (e) => {
    const value = e.target.value;
    setSearchPaciente(value);
    
    // Si se borra el texto, limpiar la selección
    if (!value.trim()) {
      setFormData(prev => ({ ...prev, id_paciente: '' }));
    }
  };

  const selectPaciente = (paciente) => {
    setSearchPaciente(paciente.nombre);
    setFormData(prev => ({ ...prev, id_paciente: paciente.id_paciente }));
    setShowPacienteOptions(false);
    
    // Limpiar error si existe
    if (formErrors.id_paciente) {
      setFormErrors(prev => ({ ...prev, id_paciente: '' }));
    }

    // Limpiar errores de conflicto de horarios previos
    setFormErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.conflicto_paciente;
      delete newErrors.conflicto_veterinario;
      return newErrors;
    });
  };

  return (
    <div className="pacientes-container fade-in">
      <div className="pacientes-header">
        <div className="header-content">
          <h2 className="pacientes-title">Gestión de Citas</h2>
        </div>
        <div className="pacientes-actions">
          {isAdmin && (
            <button className="btn btn-primary" onClick={openCreateModal}>
              <i className="fa fa-plus"></i> Nueva Cita
            </button>
          )}
        </div>
      </div>

      {/* Alerta */}
      {alertInfo.show && (
        <div className={`alert alert-${alertInfo.type}`} style={{
          border: alertInfo.type === 'error' ? '3px solid #dc3545' : '3px solid #28a745',
          borderRadius: '12px',
          background: alertInfo.type === 'error' ? 
            'linear-gradient(135deg, #fff5f5 0%, #ffe6e6 100%)' : 
            'linear-gradient(135deg, #f0fff4 0%, #d4edda 100%)',
          boxShadow: '0 6px 20px rgba(0,0,0,0.25)',
          margin: '15px 0',
          padding: '20px 25px',
          position: 'relative',
          zIndex: 1000,
          animation: 'slideInDown 0.3s ease-out',
          maxWidth: '900px',
          width: '90%',
          minWidth: '450px'
        }}>
          <div className="alert-icon" style={{ fontSize: '1.8em', marginRight: '10px' }}>
            {alertInfo.type === 'success' ? '✅' : '🚫'}
          </div>
          <div className="alert-content">
            <div 
              className="alert-message" 
              style={{ 
                lineHeight: '1.6',
                whiteSpace: 'pre-line',
                color: alertInfo.type === 'error' ? '#721c24' : '#155724',
                fontWeight: '500',
                fontSize: '1.05em'
              }}
              dangerouslySetInnerHTML={{ __html: alertInfo.message }}
            />
          </div>
        </div>
      )}

      {/* Información para veterinarios */}
      {!isAdmin && (
        <div className="alert alert-info">
          <div className="alert-icon">
            ℹ️
          </div>
          <div className="alert-content">
            <p className="alert-message">
              Vista de Veterinario - Aquí puede ver y editar únicamente las citas que tiene asignadas. Se muestran los datos del paciente, propietario, fecha, hora, motivo y observaciones de sus citas programadas.
            </p>
          </div>
        </div>
      )}

      {/* Filtros y búsqueda */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', flex: 2 }}>
          <div className="datatable-search">
            <input
              type="text"
              placeholder="Buscar citas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Buscar citas"
            />
          </div>
          
          {(searchTerm || estadoFilter) && (
            <>
              <span className="active-filters">
                {filteredData.length} resultados
              </span>
              <button
                className="reset-filters"
                onClick={() => {
                  setSearchTerm('');
                  setEstadoFilter('');
                  setCurrentPage(1);
                }}
                title="Limpiar filtros"
              >
                Limpiar
              </button>
            </>
          )}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {/* Filtro de estados */}
          <div className="filtro-grupo">
            <label className="filtro-label">Estado:</label>
            <select 
              className="filtro-select"
              value={estadoFilter} 
              onChange={e => setEstadoFilter(e.target.value)}
              aria-label="Filtrar por estado"
            >
              <option value="">Todos los estados</option>
              {estadosCitas.map(estado => (
                <option key={estado.id_catalogo_detalle} value={estado.id_catalogo_detalle}>
                  {estado.nombre_catalogo_cabecera}
                </option>
              ))}
            </select>
          </div>
          
          {/* Selector de registros por página */}
          <div className="items-per-page">
            <span>Mostrar</span>
            <select 
              value={itemsPerPage} 
              onChange={e => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              aria-label="Registros por página"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>registros</span>
          </div>
        </div>
      </div>

      {/* Estado de carga */}
      {loading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p className="spinner-text">Cargando información de citas...</p>
        </div>
      )}

      {/* Mensaje de error */}
      {error && (
        <div className="alert alert-danger">
          <div className="alert-icon">❌</div>
          <div className="alert-content">
            <p className="alert-message">{error}</p>
          </div>
        </div>
      )}

      {/* Tabla de citas */}
      {!loading && !error && (
        <div className="datatable-container">
          <table className="datatable">
            <thead>
              <tr>
                {isAdmin && (
                  <th 
                    className={`sortable ${getSortDirection('id_cita')}`} 
                    onClick={() => requestSort('id_cita')}
                    style={{width: '50px'}}
                  >
                    ID
                  </th>
                )}
                <th 
                  className={`sortable ${getSortDirection('paciente_nombre')}`} 
                  onClick={() => requestSort('paciente_nombre')}
                  style={{width: isAdmin ? '140px' : '180px'}}
                >
                  Paciente
                </th>
                {!isAdmin && (
                  <th 
                    className={`sortable ${getSortDirection('cliente_nombre')}`} 
                    onClick={() => requestSort('cliente_nombre')}
                    style={{width: '180px'}}
                  >
                    Propietario
                  </th>
                )}
                {isAdmin && (
                  <th 
                    className={`sortable ${getSortDirection('veterinario_nombre')}`} 
                    onClick={() => requestSort('veterinario_nombre')}
                    style={{width: '140px'}}
                  >
                    Veterinario
                  </th>
                )}
                <th 
                  className={`sortable ${getSortDirection('fecha')}`} 
                  onClick={() => requestSort('fecha')}
                  style={{width: '100px'}}
                >
                  Fecha
                </th>
                <th 
                  className={`sortable ${getSortDirection('hora')}`} 
                  onClick={() => requestSort('hora')}
                  style={{width: '80px'}}
                >
                  Hora
                </th>
                <th 
                  className={`sortable ${getSortDirection('motivo')}`} 
                  onClick={() => requestSort('motivo')}
                  style={{width: isAdmin ? '200px' : '250px'}}
                >
                  Motivo
                </th>
                {!isAdmin && (
                  <th 
                    className={`sortable ${getSortDirection('observaciones')}`} 
                    onClick={() => requestSort('observaciones')}
                    style={{width: '250px'}}
                  >
                    Observaciones
                  </th>
                )}
                {isAdmin && (
                  <th 
                    className={`sortable ${getSortDirection('estado_nombre')}`} 
                    onClick={() => requestSort('estado_nombre')}
                    style={{width: '120px'}}
                  >
                    Estado
                  </th>
                )}
                {isAdmin && (
                  <th style={{width: '110px', textAlign: 'center'}}>Acciones</th>
                )}
                {!isAdmin && (
                  <th style={{width: '80px', textAlign: 'center'}}>Acciones</th>
                )}
              </tr>
            </thead>
            <tbody>
              {currentData.length > 0 ? (
                currentData.map((cita, index) => (
                  <tr key={cita.id_cita} style={{"--row-index": index}}>
                    {isAdmin && <td>{cita.id_cita}</td>}
                    <td>{cita.Paciente?.nombre || 'Sin asignar'}</td>
                    {!isAdmin && (
                      <td>{cita.Paciente?.Cliente?.nombre_completo || 'Sin propietario'}</td>
                    )}
                    {isAdmin && <td>{cita.Usuario?.nombre || 'Sin asignar'}</td>}
                    <td>{formatDate(cita.fecha)}</td>
                    <td>{formatTime(cita.hora)}</td>
                    <td className="motivo-cell" title={cita.motivo}>
                      {cita.motivo?.length > (isAdmin ? 50 : 80) ? 
                        `${cita.motivo.substring(0, isAdmin ? 50 : 80)}...` : 
                        cita.motivo || 'Sin motivo'
                      }
                    </td>
                    {!isAdmin && (
                      <td className="observaciones-cell" title={cita.observaciones}>
                        {cita.observaciones?.length > 80 ? 
                          `${cita.observaciones.substring(0, 80)}...` : 
                          cita.observaciones || 'Sin observaciones'
                        }
                      </td>
                    )}
                    {isAdmin && (
                      <td>
                        <span className={`badge-estado ${catalogoService.getEstadoClase(
                          catalogoService.getEstadoNombre(estadosCitas, cita.id_estado_cita)
                        )}`}>
                          {catalogoService.getEstadoNombre(estadosCitas, cita.id_estado_cita)}
                        </span>
                      </td>
                    )}
                    <td>
                      <div className="datatable-actions">
                        <button 
                          className="btn btn-secondary btn-sm btn-action edit"
                          onClick={() => openEditModal(cita)} 
                          title="Editar cita"
                        >
                          ✏️
                        </button>
                        {isAdmin && (
                          <button 
                            className="btn btn-danger btn-sm btn-action delete"
                            onClick={() => openDeleteModal(cita)} 
                            title="Eliminar cita"
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={isAdmin ? "8" : "6"} style={{textAlign: 'center', padding: '30px 0'}}>
                    <div className="no-data-container">
                      <span className="no-data-icon">
                        {searchTerm || estadoFilter ? '🔎' : '📅'}
                      </span>
                      <p className="no-data-message">
                        {searchTerm || estadoFilter ? 'No se encontraron coincidencias' : 
                         isAdmin ? 'No hay citas registradas' : 'No tienes citas programadas'}
                      </p>
                      <p className="no-data-description">
                        {searchTerm || estadoFilter ? (
                          <>
                            No se encontraron citas que coincidan con los criterios de búsqueda.
                            <div className="empty-search">
                              {searchTerm && <div>Búsqueda: "<strong>{searchTerm}</strong>"</div>}
                              {estadoFilter && <div>Estado: <strong>{catalogoService.getEstadoNombre(estadosCitas, parseInt(estadoFilter))}</strong></div>}
                            </div>
                          </>
                        ) : (
                          isAdmin ? 
                            'Comience a registrar citas haciendo clic en el botón "Nueva Cita"' :
                            'No tienes citas programadas en este momento'
                        )}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer con paginación */}
      {!loading && !error && filteredData.length > 0 && (
        <div className="datatable-footer">
          <div className="datatable-info">
            Mostrando {filteredData.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} a{' '}
            {Math.min(currentPage * itemsPerPage, filteredData.length)} de {filteredData.length} registros
          </div>
          
          <div className="datatable-pagination">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              &laquo;
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              &lt;
            </button>
            
            {pageNumbers.map(num => (
              <button
                key={num}
                className={currentPage === num ? 'active' : ''}
                onClick={() => setCurrentPage(num)}
              >
                {num}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              &gt;
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              &raquo;
            </button>
          </div>
        </div>
      )}

      {/* Modal para Crear/Editar cita */}
      {showModal && (isAdmin || modalMode === 'edit') && (
        <div className="modal-backdrop">
          <div className={`modal-content ${(formErrors.conflicto_paciente || formErrors.conflicto_veterinario) ? 'has-conflicts' : ''}`}>
            <div className="modal-header">
              <h3 className="modal-title">
                {modalMode === 'create' ? 'Nueva Cita' : 'Editar Cita'}
              </h3>
              <button 
                className="modal-close"
                onClick={() => setShowModal(false)}
                aria-label="Cerrar"
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="form-group">
                  <label htmlFor="paciente-search">Paciente *</label>
                  <div className={`paciente-search-container ${formData.id_paciente ? 'has-selection' : ''}`}>
                    <input
                      id="paciente-search"
                      type="text"
                      className={formErrors.id_paciente ? 'input-error' : ''}
                      value={searchPaciente}
                      onChange={handlePacienteSearch}
                      onFocus={() => {
                        // Solo mostrar opciones si hay texto y no hay paciente seleccionado
                        // o si el texto no coincide exactamente con el paciente seleccionado
                        if (searchPaciente && filteredPacientes.length > 0) {
                          setShowPacienteOptions(true);
                        } else if (searchPaciente && !formData.id_paciente) {
                          // Activar búsqueda si hay texto pero no hay selección
                          const searchTerm = searchPaciente.toLowerCase();
                          const filtered = pacientes.filter(paciente => {
                            const nombre = paciente.nombre?.toLowerCase() || '';
                            const especie = paciente.especie?.toLowerCase() || '';
                            const raza = paciente.raza?.toLowerCase() || '';
                            const propietario = paciente.Cliente?.nombre_completo?.toLowerCase() || '';
                            return nombre.includes(searchTerm) || especie.includes(searchTerm) || 
                                   raza.includes(searchTerm) || propietario.includes(searchTerm);
                          });
                          if (filtered.length > 0) {
                            setFilteredPacientes(filtered.slice(0, 10));
                            setShowPacienteOptions(true);
                          }
                        }
                      }}
                      onBlur={() => {
                        // Retrasar el cierre para permitir clicks en las opciones
                        setTimeout(() => {
                          setShowPacienteOptions(false);
                        }, 150);
                      }}
                      placeholder="Buscar por nombre, especie, raza o propietario..."
                      autoComplete="off"
                    />
                    
                    {showPacienteOptions && filteredPacientes.length > 0 && (
                      <div className="paciente-options">
                        {filteredPacientes.map(paciente => (
                          <div
                            key={paciente.id_paciente}
                            onMouseDown={(e) => {
                              e.preventDefault(); // Prevenir que el onBlur se ejecute antes
                              selectPaciente(paciente);
                            }}
                            className={`paciente-option ${formData.id_paciente === paciente.id_paciente ? 'selected' : ''}`}
                          >
                            <div className="paciente-info">
                              <div className="paciente-nombre">{paciente.nombre}</div>
                              <div className="paciente-detalles">
                                {paciente.especie} - {paciente.raza}
                                {paciente.Cliente?.nombre_completo && (
                                  <span className="paciente-propietario"> | {paciente.Cliente.nombre_completo}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {formErrors.id_paciente && (
                    <div className="form-error">{formErrors.id_paciente}</div>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor="id_veterinario">Veterinario *</label>
                  <select
                    id="id_veterinario"
                    name="id_veterinario"
                    className={formErrors.id_veterinario ? 'input-error' : ''}
                    value={formData.id_veterinario}
                    onChange={handleInputChange}
                  >
                    <option value="">Seleccione un veterinario</option>
                    {veterinarios.map(veterinario => (
                      <option key={veterinario.id_usuario} value={veterinario.id_usuario}>
                        {veterinario.nombre}
                      </option>
                    ))}
                  </select>
                  {formErrors.id_veterinario && (
                    <div className="form-error">{formErrors.id_veterinario}</div>
                  )}
                </div>
              </div>
              
              <div className="row">
                <div className="form-group">
                  <label htmlFor="fecha">Fecha *</label>
                  <input
                    type="date"
                    id="fecha"
                    name="fecha"
                    className={`
                      ${formErrors.fecha ? 'input-error' : ''}
                      ${formErrors.conflicto_paciente ? 'input-conflict conflict-highlight' : ''}
                    `.trim()}
                    value={formData.fecha}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  {formErrors.fecha && (
                    <div className="form-error">{formErrors.fecha}</div>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor="hora">Hora *</label>
                  <input
                    type="time"
                    id="hora"
                    name="hora"
                    className={`
                      ${formErrors.hora ? 'input-error' : ''}
                      ${formErrors.conflicto_veterinario ? 'input-conflict conflict-highlight' : ''}
                    `.trim()}
                    value={formData.hora}
                    onChange={handleInputChange}
                  />
                  {formErrors.hora && (
                    <div className="form-error">{formErrors.hora}</div>
                  )}
                </div>
              </div>

              {/* Alertas de conflicto de horarios */}
              {(formErrors.conflicto_paciente || formErrors.conflicto_veterinario) && (
                <div className="alert alert-danger" style={{ 
                  margin: '15px 0', 
                  border: '2px solid #dc3545',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #fff5f5 0%, #ffe6e6 100%)',
                  width: '100%',
                  maxWidth: 'none',
                  padding: '20px',
                  boxSizing: 'border-box'
                }}>
                  <div className="alert-icon" style={{ fontSize: '1.5em' }}>🚫</div>
                  <div className="alert-content">
                    <p className="alert-title" style={{ 
                      fontWeight: 'bold', 
                      marginBottom: '10px',
                      color: '#721c24',
                      fontSize: '1.1em'
                    }}>
                      ⚠️ Conflicto de Horarios Detectado
                    </p>
                    {formErrors.conflicto_paciente && (
                      <div style={{ 
                        backgroundColor: '#fff2f2', 
                        padding: '15px', 
                        borderRadius: '8px', 
                        marginBottom: '12px',
                        border: '1px solid #f5c6cb'
                      }}>
                        <p style={{ 
                          marginBottom: '5px', 
                          fontWeight: '500',
                          color: '#721c24'
                        }}>
                          🐕 <strong>Conflicto de Paciente:</strong>
                        </p>
                        <p style={{ marginBottom: '0', fontSize: '0.95em', color: '#856404' }}>
                          {formErrors.conflicto_paciente}
                        </p>
                      </div>
                    )}
                    {formErrors.conflicto_veterinario && (
                      <div style={{ 
                        backgroundColor: '#fff2f2', 
                        padding: '15px', 
                        borderRadius: '8px', 
                        marginBottom: '12px',
                        border: '1px solid #f5c6cb'
                      }}>
                        <p style={{ 
                          marginBottom: '5px', 
                          fontWeight: '500',
                          color: '#721c24'
                        }}>
                          👨‍⚕️ <strong>Conflicto de Veterinario:</strong>
                        </p>
                        <p style={{ marginBottom: '0', fontSize: '0.95em', color: '#856404' }}>
                          {formErrors.conflicto_veterinario}
                        </p>
                      </div>
                    )}
                    {formErrors.conflicto_general && (
                      <div style={{ 
                        backgroundColor: '#ffe6e6', 
                        padding: '15px', 
                        borderRadius: '10px', 
                        marginBottom: '12px',
                        border: '2px solid #ff8080',
                        boxShadow: '0 2px 4px rgba(255, 0, 0, 0.1)'
                      }}>
                        <p style={{ 
                          marginBottom: '5px', 
                          fontWeight: '600',
                          color: '#cc0000',
                          fontSize: '1rem'
                        }}>
                          ⚠️ <strong>Error de Conflicto:</strong>
                        </p>
                        <p style={{ marginBottom: '0', fontSize: '0.95em', color: '#990000' }}>
                          {formErrors.conflicto_general}
                        </p>
                      </div>
                    )}
                    <div style={{ 
                      marginTop: '15px', 
                      padding: '12px 15px',
                      backgroundColor: '#d1ecf1',
                      borderRadius: '6px',
                      border: '1px solid #bee5eb'
                    }}>
                      <p style={{ 
                        fontSize: '0.9em', 
                        marginBottom: '0', 
                        fontStyle: 'italic',
                        color: '#0c5460'
                      }}>
                        💡 <strong>Sugerencia:</strong> Seleccione una fecha y hora diferentes para continuar con el agendamiento.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="motivo">Motivo *</label>
                <textarea
                  id="motivo"
                  name="motivo"
                  className={formErrors.motivo ? 'input-error' : ''}
                  value={formData.motivo}
                  onChange={handleInputChange}
                  placeholder="Describa el motivo de la cita"
                  rows="3"
                />
                {formErrors.motivo && (
                  <div className="form-error">{formErrors.motivo}</div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="id_estado_cita">Estado *</label>
                <select
                  id="id_estado_cita"
                  name="id_estado_cita"
                  className={formErrors.id_estado_cita ? 'input-error' : ''}
                  value={formData.id_estado_cita}
                  onChange={handleInputChange}
                >
                  <option value="">Seleccione un estado</option>
                  {estadosCitas.map(estado => (
                    <option key={estado.id_catalogo_detalle} value={estado.id_catalogo_detalle}>
                      {estado.nombre_catalogo_cabecera}
                    </option>
                  ))}
                </select>
                {formErrors.id_estado_cita && (
                  <div className="form-error">{formErrors.id_estado_cita}</div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="observaciones">Observaciones</label>
                <textarea
                  id="observaciones"
                  name="observaciones"
                  value={formData.observaciones}
                  onChange={handleInputChange}
                  placeholder="Observaciones adicionales sobre la cita"
                  rows="3"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary" 
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
              <button 
                className={`btn ${(formErrors.conflicto_paciente || formErrors.conflicto_veterinario) ? 'btn-disabled' : 'btn-primary'}`}
                onClick={handleSaveForm}
                disabled={formErrors.conflicto_paciente || formErrors.conflicto_veterinario || formErrors.conflicto_general}
                style={{
                  opacity: (formErrors.conflicto_paciente || formErrors.conflicto_veterinario) ? 0.6 : 1,
                  cursor: (formErrors.conflicto_paciente || formErrors.conflicto_veterinario) ? 'not-allowed' : 'pointer',
                  position: 'relative'
                }}
                title={(formErrors.conflicto_paciente || formErrors.conflicto_veterinario) ? 
                  '🚫 No se puede guardar: hay conflictos de horarios que deben resolverse primero' : 
                  'Guardar la cita'
                }
              >
                {(formErrors.conflicto_paciente || formErrors.conflicto_veterinario) ? (
                  <>
                    🚫 No se puede guardar
                  </>
                ) : (
                  <>
                    {modalMode === 'create' ? '✅ Crear Cita' : '💾 Guardar Cambios'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {isAdmin && showDeleteModal && (
        <div className="modal-backdrop">
          <div className="modal-content modal-confirm">
            <div className="modal-header">
              <h3 className="modal-title">Confirmar Eliminación</h3>
              <button 
                className="modal-close"
                onClick={() => setShowDeleteModal(false)}
                aria-label="Cerrar"
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="confirm-message">
                <p>
                  ¿Está seguro que desea eliminar la cita del paciente <strong>{citaToDelete?.Paciente?.nombre}</strong> programada para el <strong>{formatDate(citaToDelete?.fecha)}</strong>?
                </p>
                <p className="warning-text">Esta acción no se puede deshacer.</p>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancelar
              </button>
              <button 
                className="btn btn-danger"
                onClick={handleDeleteCita}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GestionCitas;
