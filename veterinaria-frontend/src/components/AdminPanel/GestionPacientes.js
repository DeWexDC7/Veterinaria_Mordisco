import React, { useState, useEffect, useMemo, useCallback } from 'react';
import pacienteService from '../../services/paciente.service';
import clienteService from '../../services/cliente.service';
import authService from '../../services/auth.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import '../../estilo/Usuarios.css'; // Primero se importan los estilos base
import '../../estilo/Pacientes.css'; // Después los estilos específicos

// Componente para la gestión de pacientes con DataTable sin jQuery
function GestionPacientes() {
  // Estados
  const [pacientes, setPacientes] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [especieFilter, setEspecieFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: 'id_paciente', direction: 'asc' });
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' o 'edit'
  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    especie: '',
    raza: '',
    edad: '',
    peso: '',
    genero: '',
    id_cliente: '',
    historial_clinico: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pacienteToDelete, setPacienteToDelete] = useState(null);
  const [alertInfo, setAlertInfo] = useState({ show: false, type: '', message: '' });
  const [showFicha, setShowFicha] = useState(false);
  const [pacienteFicha, setPacienteFicha] = useState(null);
  const [searchCliente, setSearchCliente] = useState('');
  const [showClienteOptions, setShowClienteOptions] = useState(false);
  const [filteredClientes, setFilteredClientes] = useState([]);

  // Verificar si el usuario es administrador
  const isAdmin = authService.hasRole('administrador');

  // Opciones para selects
  const especiesOpciones = ['Perro', 'Gato', 'Ave', 'Reptil', 'Roedor', 'Otro'];
  const generoOpciones = ['Macho', 'Hembra'];

  // Cargar pacientes y clientes al iniciar
  useEffect(() => {
    fetchPacientes();
    fetchClientes();
  }, []);

  // Cargar pacientes
  const fetchPacientes = async () => {
    try {
      setLoading(true);
      const response = await pacienteService.getAll();
      setPacientes(response.data || response);
      setFilteredData(response.data || response);
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar los pacientes:', error);
      setError('Error al cargar los pacientes. Intente nuevamente más tarde.');
      setLoading(false);
    }
  };

  // Cargar clientes
  const fetchClientes = async () => {
    try {
      const response = await clienteService.getAll();
      setClientes(response.data || response);
      console.log('Clientes cargados:', response.data || response);
    } catch (error) {
      console.error('Error al cargar los clientes:', error);
    }
  };

  // Actualizar datos filtrados cuando cambian los pacientes o el término de búsqueda
  useEffect(() => {
    let result = [...pacientes];
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(paciente => 
        paciente.nombre.toLowerCase().includes(term) ||
        paciente.especie.toLowerCase().includes(term) ||
        paciente.raza.toLowerCase().includes(term) ||
        String(paciente.edad).includes(term)
      );
    }
    
    // Filtrar por especie
    if (especieFilter) {
      result = result.filter(paciente => 
        paciente.especie.toLowerCase() === especieFilter.toLowerCase()
      );
    }
    
    // Ordenar datos
    if (sortConfig.key) {
      result.sort((a, b) => {
        // Manejar valores nulos o indefinidos
        if (a[sortConfig.key] === null) return sortConfig.direction === 'asc' ? -1 : 1;
        if (b[sortConfig.key] === null) return sortConfig.direction === 'asc' ? 1 : -1;
        
        // Comparación para strings
        if (typeof a[sortConfig.key] === 'string') {
          return sortConfig.direction === 'asc' 
            ? a[sortConfig.key].localeCompare(b[sortConfig.key])
            : b[sortConfig.key].localeCompare(a[sortConfig.key]);
        }
        
        // Comparación para números
        return sortConfig.direction === 'asc' 
          ? a[sortConfig.key] - b[sortConfig.key]
          : b[sortConfig.key] - a[sortConfig.key];
      });
    }
    
    setFilteredData(result);
  }, [pacientes, searchTerm, especieFilter, sortConfig]);

  // Filtrar clientes para la búsqueda
  useEffect(() => {
    if (!searchCliente.trim()) {
      setFilteredClientes([]);
      setShowClienteOptions(false);
      return;
    }

    // Si ya hay un cliente seleccionado y el texto coincide exactamente, no mostrar opciones
    if (formData.id_cliente) {
      const clienteSeleccionado = clientes.find(c => c.id_cliente === formData.id_cliente);
      if (clienteSeleccionado && clienteSeleccionado.nombre_completo === searchCliente) {
        setFilteredClientes([]);
        setShowClienteOptions(false);
        return;
      }
    }

    const searchTerm = searchCliente.toLowerCase();
    const filtered = clientes.filter(cliente => {
      const nombreCompleto = cliente.nombre_completo?.toLowerCase() || '';
      const cedula = cliente.cedula?.toString() || '';
      
      return nombreCompleto.includes(searchTerm) || cedula.includes(searchTerm);
    });

    setFilteredClientes(filtered.slice(0, 10)); // Limitar a 10 resultados
    setShowClienteOptions(filtered.length > 0);
  }, [searchCliente, clientes, formData.id_cliente]);

  // Cerrar opciones de cliente al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.cliente-search-container')) {
        setShowClienteOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Calcular datos paginados
  const currentData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * itemsPerPage;
    const lastPageIndex = firstPageIndex + itemsPerPage;
    return filteredData.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, filteredData, itemsPerPage]);

  // Manejo de paginación
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  
  const handlePageChange = (newPage) => {
    if (newPage === currentPage) return;
    setCurrentPage(newPage);
  };
  
  const nextPage = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };
  
  const goToPage = (page) => {
    handlePageChange(page);
  };

  // Manejo de ordenamiento
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortDirection = (name) => {
    if (!sortConfig.key) {
      return '';
    }
    return sortConfig.key === name ? sortConfig.direction === 'asc' ? 'sorted-asc' : 'sorted-desc' : '';
  };

  // Funciones para gestionar modales
  const openCreateModal = () => {
    setModalMode('create');
    setFormData({
      nombre: '',
      especie: '',
      raza: '',
      edad: '',
      peso: '',
      genero: '',
      id_cliente: '',
      historial_clinico: ''
    });
    setFormErrors({});
    setSearchCliente('');
    setShowClienteOptions(false);
    setShowModal(true);
  };

  const openEditModal = (paciente) => {
    setModalMode('edit');
    setSelectedPaciente(paciente);
    setFormData({
      nombre: paciente.nombre,
      especie: paciente.especie,
      raza: paciente.raza,
      edad: paciente.edad,
      peso: paciente.peso,
      genero: paciente.genero,
      id_cliente: paciente.id_cliente,
      historial_clinico: paciente.historial_clinico || ''
    });
    setFormErrors({});
    
    // Establecer el texto de búsqueda con el cliente actual
    const clienteActual = clientes.find(c => c.id_cliente === paciente.id_cliente);
    setSearchCliente(clienteActual ? clienteActual.nombre_completo : ''); // Solo mostrar el nombre del cliente
    setShowClienteOptions(false);
    setShowModal(true);
  };

  const openDeleteModal = (paciente) => {
    setPacienteToDelete(paciente);
    setShowDeleteModal(true);
  };

  const openFichaPaciente = (paciente) => {
    // Buscar el cliente asociado
    const clienteAsociado = clientes.find(c => c.id_cliente === paciente.id_cliente);
    setPacienteFicha({...paciente, cliente: clienteAsociado});
    setShowFicha(true);
  };

  // Generar PDF de ficha técnica del paciente
  const generatePDF = async (paciente) => {
    try {
      // Buscar el cliente asociado
      const clienteAsociado = clientes.find(c => c.id_cliente === paciente.id_cliente);
      
      // Crear un nuevo documento PDF
      const pdf = new jsPDF();
      
      // Configurar fuente
      pdf.setFont('helvetica');
      
      // Título principal
      pdf.setFontSize(20);
      pdf.setTextColor(92, 173, 138); // Color verde del tema
      pdf.text('FICHA TÉCNICA DE PACIENTE', 20, 30);
      
      // Línea separadora
      pdf.setDrawColor(92, 173, 138);
      pdf.line(20, 35, 190, 35);
      
      // Información del paciente
      pdf.setFontSize(14);
      pdf.setTextColor(0, 0, 0);
      pdf.text('INFORMACIÓN DEL PACIENTE', 20, 50);
      
      pdf.setFontSize(12);
      let yPosition = 60;
      
      // Datos básicos
      pdf.text(`Nombre: ${paciente.nombre}`, 20, yPosition);
      yPosition += 10;
      
      pdf.text(`Especie: ${paciente.especie}`, 20, yPosition);
      yPosition += 10;
      
      pdf.text(`Raza: ${paciente.raza || 'No especificada'}`, 20, yPosition);
      yPosition += 10;
      
      pdf.text(`Género: ${paciente.genero || 'No especificado'}`, 20, yPosition);
      yPosition += 10;
      
      pdf.text(`Edad: ${paciente.edad ? `${paciente.edad} ${paciente.edad === 1 ? 'año' : 'años'}` : 'No especificada'}`, 20, yPosition);
      yPosition += 10;
      
      pdf.text(`Peso: ${paciente.peso ? `${paciente.peso} kg` : 'No especificado'}`, 20, yPosition);
      yPosition += 20;
      
      // Información del propietario
      pdf.setFontSize(14);
      pdf.text('INFORMACIÓN DEL PROPIETARIO', 20, yPosition);
      yPosition += 10;
      
      pdf.setFontSize(12);
      if (clienteAsociado) {
        pdf.text(`Nombre: ${clienteAsociado.nombre_completo}`, 20, yPosition);
        yPosition += 10;
        
        if (clienteAsociado.cedula) {
          pdf.text(`Cédula: ${clienteAsociado.cedula}`, 20, yPosition);
          yPosition += 10;
        }
        
        pdf.text(`Teléfono: ${clienteAsociado.telefono || 'No disponible'}`, 20, yPosition);
        yPosition += 10;
        
        pdf.text(`Email: ${clienteAsociado.correo || 'No disponible'}`, 20, yPosition);
        yPosition += 10;
        
        pdf.text(`Dirección: ${clienteAsociado.direccion || 'No disponible'}`, 20, yPosition);
        yPosition += 20;
      } else {
        pdf.text('No hay información del propietario disponible', 20, yPosition);
        yPosition += 20;
      }
      
      // Comentarios
      pdf.setFontSize(14);
      pdf.text('COMENTARIOS', 20, yPosition);
      yPosition += 10;
      
      pdf.setFontSize(12);
      const historial = paciente.historial_clinico || 'No hay comentarios registrados.';
      
      // Dividir el texto del historial en líneas para que encaje en la página
      const historialLines = pdf.splitTextToSize(historial, 170);
      pdf.text(historialLines, 20, yPosition);
      yPosition += (historialLines.length * 6) + 20;
      
      // Información adicional
      pdf.setFontSize(10);
      pdf.setTextColor(128, 128, 128);
      
      // Agregar nueva página si es necesario
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = 20;
      }
      
      pdf.text(`Fecha de generación: ${new Date().toLocaleDateString('es-ES')} ${new Date().toLocaleTimeString('es-ES')}`, 20, yPosition);
      yPosition += 10;
      pdf.text('Veterinaria Mordisco - Sistema de Gestión', 20, yPosition);
      
      // Guardar el PDF
      pdf.save(`Ficha_${paciente.nombre.replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`);
      
      // Mostrar mensaje de éxito
      setAlertInfo({
        show: true,
        type: 'success',
        message: 'PDF generado exitosamente.'
      });
      
      // Ocultar alerta después de 3 segundos
      setTimeout(() => {
        setAlertInfo({ show: false, type: '', message: '' });
      }, 3000);
      
    } catch (error) {
      console.error('Error al generar el PDF:', error);
      setAlertInfo({
        show: true,
        type: 'danger',
        message: 'Error al generar el PDF. Intente nuevamente.'
      });
    }
  };

  // Manejo de cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Validación del formulario
  const validateForm = () => {
    const errors = {};
    
    if (!formData.nombre.trim()) errors.nombre = "El nombre es obligatorio";
    if (!formData.especie) errors.especie = "La especie es obligatoria";
    if (!formData.id_cliente) errors.id_cliente = "Debe seleccionar un cliente";
    
    if (formData.edad) {
      const edad = parseInt(formData.edad);
      if (isNaN(edad) || edad < 0) errors.edad = "La edad debe ser un número positivo";
    }
    
    if (formData.peso) {
      const peso = parseFloat(formData.peso);
      if (isNaN(peso) || peso <= 0) errors.peso = "El peso debe ser un número positivo";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Guardar paciente (creación o edición)
  const handleSaveForm = async () => {
    if (!validateForm()) return;
    
    try {
      if (modalMode === 'create') {
        // Crear nuevo paciente
        await pacienteService.create(formData);
        setAlertInfo({
          show: true,
          type: 'success',
          message: 'Paciente creado con éxito.'
        });
      } else {
        // Actualizar paciente existente
        await pacienteService.update(selectedPaciente.id_paciente, formData);
        setAlertInfo({
          show: true,
          type: 'success',
          message: 'Paciente actualizado con éxito.'
        });
      }
      
      // Cerrar modal y actualizar lista
      setShowModal(false);
      fetchPacientes();
      
      // Ocultar alerta después de 5 segundos
      setTimeout(() => {
        setAlertInfo({ show: false, type: '', message: '' });
      }, 5000);
    } catch (error) {
      console.error('Error al guardar el paciente:', error);
      setAlertInfo({
        show: true,
        type: 'danger',
        message: `Error al ${modalMode === 'create' ? 'crear' : 'actualizar'} el paciente. ${error.response?.data?.message || 'Intente nuevamente.'}`
      });
    }
  };

  // Eliminar paciente
  const handleDeletePaciente = async () => {
    try {
      await pacienteService.delete(pacienteToDelete.id_paciente);
      setShowDeleteModal(false);
      fetchPacientes();
      setAlertInfo({
        show: true,
        type: 'success',
        message: 'Paciente eliminado con éxito.'
      });
      
      // Ocultar alerta después de 5 segundos
      setTimeout(() => {
        setAlertInfo({ show: false, type: '', message: '' });
      }, 5000);
    } catch (error) {
      console.error('Error al eliminar el paciente:', error);
      setAlertInfo({
        show: true,
        type: 'danger',
        message: `Error al eliminar el paciente. ${error.response?.data?.message || 'Intente nuevamente.'}`
      });
    }
  };

  // Manejar actualización de comentarios
  const handleUpdateHistorial = async () => {
    try {
      await pacienteService.update(pacienteFicha.id_paciente, {
        historial_clinico: formData.historial_clinico
      });
      
      setAlertInfo({
        show: true,
        type: 'success',
        message: 'Comentarios actualizados con éxito.'
      });
      
      fetchPacientes();
      setShowFicha(false);
      
      // Ocultar alerta después de 5 segundos
      setTimeout(() => {
        setAlertInfo({ show: false, type: '', message: '' });
      }, 5000);
    } catch (error) {
      console.error('Error al actualizar el historial:', error);
      setAlertInfo({
        show: true,
        type: 'danger',
        message: 'Error al actualizar los comentarios. Intente nuevamente.'
      });
    }
  };

  // Generar números de página para la paginación
  const pageNumbers = useMemo(() => {
    const pages = [];
    // Mostrar máximo 5 páginas en la paginación
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Ajustar si estamos cerca del final
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }, [currentPage, totalPages]);

  // Calcular datos paginados
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  // Obtener el nombre del cliente por ID (para mostrar en la tabla)
  const getClienteName = (id_cliente) => {
    const cliente = clientes.find(c => c.id_cliente === id_cliente);
    return cliente ? cliente.nombre_completo : 'No asignado';
  };

  // Obtener cédula y nombre del cliente (para el select del modal)
  const getClienteSelectOption = (cliente) => {
    return `${cliente.cedula || 'Sin cédula'} - ${cliente.nombre_completo}`;
  };

  // Funciones para manejar la búsqueda de clientes
  const handleClienteSearch = (e) => {
    const value = e.target.value;
    setSearchCliente(value);
    
    // Si el campo está vacío, limpiar la selección
    if (!value.trim()) {
      setFormData({...formData, id_cliente: ''});
      setShowClienteOptions(false);
    } else {
      // Si estamos escribiendo, mostrar opciones pero mantener selección previa
      if (filteredClientes.length > 0) {
        setShowClienteOptions(true);
      }
    }
  };

  const selectCliente = (cliente) => {
    // Actualizar el formulario con el ID del cliente seleccionado
    setFormData(prevData => ({...prevData, id_cliente: cliente.id_cliente}));
    
    // Autocompletar el input solo con el nombre del cliente
    setSearchCliente(cliente.nombre_completo);
    
    // Ocultar las opciones inmediatamente
    setShowClienteOptions(false);
    setFilteredClientes([]);
    
    // Limpiar errores si había alguno
    setFormErrors(prevErrors => {
      if (prevErrors.id_cliente) {
        const {id_cliente, ...rest} = prevErrors;
        return rest;
      }
      return prevErrors;
    });
    
    // Forzar el foco para confirmar el cambio
    setTimeout(() => {
      const input = document.getElementById('cliente-search');
      if (input) {
        input.blur();
        input.focus();
      }
    }, 10);
  };

  const clearClienteSelection = () => {
    setFormData({...formData, id_cliente: ''});
    setSearchCliente('');
    setShowClienteOptions(false);
    setFilteredClientes([]);
  };

  // Función para mantener la sincronización del texto de búsqueda
  const updateSearchClienteText = () => {
    if (formData.id_cliente && clientes.length > 0) {
      const clienteActual = clientes.find(c => c.id_cliente === formData.id_cliente);
      if (clienteActual && !searchCliente) {
        setSearchCliente(clienteActual.nombre_completo); // Solo mostrar el nombre del cliente
      }
    }
  };

  // Sincronizar texto de búsqueda con cliente seleccionado
  useEffect(() => {
    updateSearchClienteText();
  }, [clientes, formData.id_cliente]);

  return (
    <div className="pacientes-container fade-in">
      <div className="pacientes-header">
        <div className="header-content">
          <h2 className="pacientes-title">Gestión de Pacientes</h2>
        </div>
        <div className="pacientes-actions">
          {isAdmin && (
            <button className="btn btn-primary" onClick={openCreateModal}>
              <i className="fa fa-plus"></i> Nuevo Paciente
            </button>
          )}
        </div>
      </div>

      {/* Alerta de información */}
      {alertInfo.show && (
        <div className={`alert alert-${alertInfo.type}`}>
          <div className="alert-icon">
            {alertInfo.type === 'success' ? '✅' : '❌'}
          </div>
          <div className="alert-content">
            <p className="alert-message">{alertInfo.message}</p>
          </div>
        </div>
      )}

      {/* Alerta informativa para usuarios no administradores */}
      {!isAdmin && (
        <div className="alert alert-info">
          <div className="alert-icon">
            ℹ️
          </div>
          <div className="alert-content">
            <p className="alert-message">
              Está viendo el módulo de pacientes con permisos de veterinario. Puede ver y editar información de pacientes, pero no puede crear nuevos pacientes ni eliminar existentes.
            </p>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', flex: 2 }}>
          {/* Barra de búsqueda */}
          <div className="datatable-search">
            <input
              type="text"
              placeholder="Buscar pacientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Buscar pacientes"
            />
          </div>
          
          {/* Indicador de filtros activos */}
          {(searchTerm || especieFilter) && (
            <>
              <span className="active-filters">
                {filteredData.length} resultados
              </span>
              <button
                className="reset-filters"
                onClick={() => {
                  setSearchTerm('');
                  setEspecieFilter('');
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
          {/* Filtro de especies */}
          <div className="filtro-grupo">
            <label className="filtro-label">Especie:</label>
            <select 
              className="filtro-select"
              value={especieFilter} 
              onChange={e => setEspecieFilter(e.target.value)}
              aria-label="Filtrar por especie"
            >
              <option value="">Todas las especies</option>
              {especiesOpciones.map(especie => (
                <option key={especie} value={especie}>{especie}</option>
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
                setCurrentPage(1); // Reiniciar a la primera página al cambiar
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
          <p className="spinner-text">Cargando información de pacientes...</p>
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

      {/* Tabla de pacientes */}
      {!loading && !error && (
        <div className="datatable-container">
          <table className="datatable">
            <thead>
              <tr>
                <th 
                  className={`sortable ${getSortDirection('id_paciente')}`} 
                  onClick={() => requestSort('id_paciente')}
                  style={{width: '50px'}}
                >
                  ID
                </th>
                <th 
                  className={`sortable ${getSortDirection('nombre')}`} 
                  onClick={() => requestSort('nombre')}
                  style={{width: '140px'}}
                >
                  Nombre
                </th>
                <th 
                  className={`sortable ${getSortDirection('especie')}`} 
                  onClick={() => requestSort('especie')}
                  style={{width: '120px'}}
                >
                  Especie
                </th>
                <th 
                  className={`sortable ${getSortDirection('raza')}`} 
                  onClick={() => requestSort('raza')}
                  style={{width: '120px'}}
                >
                  Raza
                </th>
                <th 
                  className={`sortable ${getSortDirection('edad')}`} 
                  onClick={() => requestSort('edad')}
                  style={{width: '80px'}}
                >
                  Edad
                </th>
                <th 
                  className={`sortable ${getSortDirection('peso')}`} 
                  onClick={() => requestSort('peso')}
                  style={{width: '90px'}}
                >
                  Peso (kg)
                </th>
                <th style={{width: '150px'}}>Propietario</th>
                <th style={{width: '110px', textAlign: 'center'}}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentData.length > 0 ? (
                currentData.map((paciente, index) => (
                  <tr key={paciente.id_paciente} style={{"--row-index": index}}>
                    <td>{paciente.id_paciente}</td>
                    <td>{paciente.nombre}</td>
                    <td>
                      <span className={`badge-especie ${paciente.especie}`}>{paciente.especie}</span>
                    </td>
                    <td>{paciente.raza || 'No especificada'}</td>
                    <td>{paciente.edad ? `${paciente.edad} ${paciente.edad === 1 ? 'año' : 'años'}` : 'No especificada'}</td>
                    <td>{paciente.peso ? `${paciente.peso} kg` : 'No especificado'}</td>
                    <td>
                      <div style={{display: 'flex', alignItems: 'center'}}>
                        <span style={{marginRight: '5px'}}>👤</span>
                        {getClienteName(paciente.id_cliente)}
                      </div>
                    </td>
                    <td>
                      <div className="datatable-actions">
                        <button 
                          className="btn btn-info btn-sm btn-action pdf"
                          onClick={() => generatePDF(paciente)} 
                          title="Generar PDF de ficha técnica"
                        >
                          📄
                        </button>
                        <button 
                          className="btn btn-secondary btn-sm btn-action edit"
                          onClick={() => openEditModal(paciente)} 
                          title="Editar paciente"
                        >
                          ✏️
                        </button>
                        {isAdmin && (
                          <button 
                            className="btn btn-danger btn-sm btn-action delete"
                            onClick={() => openDeleteModal(paciente)} 
                            title="Eliminar paciente"
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
                  <td colSpan="8" style={{textAlign: 'center', padding: '30px 0'}}>
                    <div className="no-data-container">
                      <span className="no-data-icon">
                        {searchTerm || especieFilter ? '🔎' : '🐾'}
                      </span>
                      <p className="no-data-message">
                        {searchTerm || especieFilter ? 'No se encontraron coincidencias' : 'No hay pacientes registrados'}
                      </p>
                      <p className="no-data-description">
                        {searchTerm || especieFilter ? (
                          <>
                            No se encontraron pacientes que coincidan con los criterios de búsqueda.
                            <div className="empty-search">
                              {searchTerm && <div>Búsqueda: "<strong>{searchTerm}</strong>"</div>}
                              {especieFilter && <div>Especie: <strong>{especieFilter}</strong></div>}
                            </div>
                          </>
                        ) : (
                          'Comience a registrar pacientes haciendo clic en el botón "Nuevo Paciente"'
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

      {/* Modal para Crear/Editar paciente - Solo permitir crear a administradores */}
      {showModal && (isAdmin || modalMode === 'edit') && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">
                {modalMode === 'create' ? 'Nuevo Paciente' : 'Editar Paciente'}
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
                  <label htmlFor="nombre">Nombre *</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    className={formErrors.nombre ? 'input-error' : ''}
                    value={formData.nombre}
                    onChange={handleInputChange}
                    placeholder="Ingrese nombre del paciente"
                  />
                  {formErrors.nombre && (
                    <div className="form-error">{formErrors.nombre}</div>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor="especie">Especie *</label>
                  <select
                    id="especie"
                    name="especie"
                    className={formErrors.especie ? 'input-error' : ''}
                    value={formData.especie}
                    onChange={handleInputChange}
                  >
                    <option value="">Seleccione una especie</option>
                    {especiesOpciones.map(especie => (
                      <option key={especie} value={especie}>{especie}</option>
                    ))}
                  </select>
                  {formErrors.especie && (
                    <div className="form-error">{formErrors.especie}</div>
                  )}
                </div>
              </div>
              
              <div className="row">
                <div className="form-group">
                  <label htmlFor="raza">Raza</label>
                  <input
                    type="text"
                    id="raza"
                    name="raza"
                    value={formData.raza}
                    onChange={handleInputChange}
                    placeholder="Ingrese la raza"
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="genero">Género</label>
                  <select
                    id="genero"
                    name="genero"
                    value={formData.genero}
                    onChange={handleInputChange}
                  >
                    <option value="">Seleccione un género</option>
                    {generoOpciones.map(genero => (
                      <option key={genero} value={genero}>{genero}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="row">
                <div className="form-group">
                  <label htmlFor="edad">Edad (años)</label>
                  <input
                    type="number"
                    id="edad"
                    name="edad"
                    className={formErrors.edad ? 'input-error' : ''}
                    value={formData.edad}
                    onChange={handleInputChange}
                    min="0"
                    placeholder="Edad en años"
                  />
                  {formErrors.edad && (
                    <div className="form-error">{formErrors.edad}</div>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor="peso">Peso (kg)</label>
                  <input
                    type="number"
                    id="peso"
                    name="peso"
                    className={formErrors.peso ? 'input-error' : ''}
                    value={formData.peso}
                    onChange={handleInputChange}
                    step="0.1"
                    min="0"
                    placeholder="Peso en kilogramos"
                  />
                  {formErrors.peso && (
                    <div className="form-error">{formErrors.peso}</div>
                  )}
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="cliente-search">Propietario *</label>
                <div className={`cliente-search-container ${formData.id_cliente ? 'has-selection' : ''}`}>
                  <input
                    id="cliente-search"
                    type="text"
                    className={formErrors.id_cliente ? 'input-error' : ''}
                    value={searchCliente}
                    onChange={handleClienteSearch}
                    onFocus={() => {
                      // Solo mostrar opciones si hay texto y no hay cliente seleccionado
                      // o si el texto no coincide exactamente con el cliente seleccionado
                      if (searchCliente && filteredClientes.length > 0) {
                        setShowClienteOptions(true);
                      } else if (searchCliente && !formData.id_cliente) {
                        // Activar búsqueda si hay texto pero no hay selección
                        const searchTerm = searchCliente.toLowerCase();
                        const filtered = clientes.filter(cliente => {
                          const nombreCompleto = cliente.nombre_completo?.toLowerCase() || '';
                          const cedula = cliente.cedula?.toString() || '';
                          return nombreCompleto.includes(searchTerm) || cedula.includes(searchTerm);
                        });
                        if (filtered.length > 0) {
                          setFilteredClientes(filtered.slice(0, 10));
                          setShowClienteOptions(true);
                        }
                      }
                    }}
                    onBlur={() => {
                      // Retrasar el cierre para permitir clicks en las opciones
                      setTimeout(() => {
                        setShowClienteOptions(false);
                      }, 150);
                    }}
                    placeholder="Buscar por nombre o cédula del propietario..."
                    autoComplete="off"
                  />
                  
                  {showClienteOptions && filteredClientes.length > 0 && (
                    <div className="cliente-options">
                      {filteredClientes.map(cliente => (
                        <div
                          key={cliente.id_cliente}
                          onMouseDown={(e) => {
                            e.preventDefault(); // Prevenir que el onBlur se ejecute antes
                            selectCliente(cliente);
                          }}
                          className={`cliente-option ${formData.id_cliente === cliente.id_cliente ? 'selected' : ''}`}
                        >
                          {cliente.cedula && (
                            <div className="cliente-cedula">
                              {cliente.cedula}
                            </div>
                          )}
                          <div className="cliente-name">
                            {cliente.nombre_completo}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {formErrors.id_cliente && (
                  <div className="form-error">{formErrors.id_cliente}</div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="historial_clinico">Comentarios</label>
                <input
                  type="text"
                  id="historial_clinico"
                  name="historial_clinico"
                  value={formData.historial_clinico}
                  onChange={handleInputChange}
                  placeholder="Información sobre historia médica, vacunas, tratamientos..."
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
                className="btn btn-primary" 
                onClick={handleSaveForm}
              >
                {modalMode === 'create' ? 'Crear Paciente' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación - Solo para administradores */}
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
                  ¿Está seguro que desea eliminar al paciente <strong>{pacienteToDelete?.nombre}</strong>?
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
                onClick={handleDeletePaciente}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de ficha de paciente */}
      {showFicha && pacienteFicha && (
        <div className="modal-backdrop">
          <div className="modal-content modal-ficha" style={{maxWidth: '700px'}}>
            <div className="modal-header">
              <h3 className="modal-title">
                <span className="icon-title">📋</span> Ficha de Paciente
              </h3>
              <button 
                className="modal-close"
                onClick={() => setShowFicha(false)}
                aria-label="Cerrar"
              >
                &times;
              </button>
            </div>
            <div className="modal-body">
              <div className="ficha-paciente">
                <div className="ficha-item">
                  <span className="ficha-label">Nombre</span>
                  <div className="ficha-value">
                    {pacienteFicha.nombre}
                    {pacienteFicha.genero && (
                      <span style={{marginLeft: '10px', opacity: '0.7'}}>
                        ({pacienteFicha.genero})
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="ficha-item">
                  <span className="ficha-label">Especie</span>
                  <div className="ficha-value">
                    <span className={`badge-especie ${pacienteFicha.especie}`}>{pacienteFicha.especie}</span>
                  </div>
                </div>
                
                <div className="ficha-item">
                  <span className="ficha-label">Raza</span>
                  <div className="ficha-value">{pacienteFicha.raza || 'No especificada'}</div>
                </div>
                
                <div className="ficha-item">
                  <span className="ficha-label">Edad</span>
                  <div className="ficha-value">
                    {pacienteFicha.edad ? `${pacienteFicha.edad} ${pacienteFicha.edad === 1 ? 'año' : 'años'}` : 'No especificada'}
                  </div>
                </div>
                
                <div className="ficha-item">
                  <span className="ficha-label">Peso</span>
                  <div className="ficha-value">
                    {pacienteFicha.peso ? `${pacienteFicha.peso} kg` : 'No especificado'}
                  </div>
                </div>
                
                <div className="ficha-item">
                  <span className="ficha-label">Propietario</span>
                  <div className="ficha-value">
                    {pacienteFicha.cliente ? pacienteFicha.cliente.nombre_completo : 'No asignado'}
                  </div>
                </div>
                
                <div className="ficha-item">
                  <span className="ficha-label">Teléfono</span>
                  <div className="ficha-value">
                    {pacienteFicha.cliente && pacienteFicha.cliente.telefono ? (
                      <a href={`tel:${pacienteFicha.cliente.telefono}`}>
                        {pacienteFicha.cliente.telefono}
                      </a>
                    ) : 'No disponible'}
                  </div>
                </div>
                
                {pacienteFicha.cliente && pacienteFicha.cliente.correo && (
                  <div className="ficha-item">
                    <span className="ficha-label">Email</span>
                    <div className="ficha-value">
                      <a href={`mailto:${pacienteFicha.cliente.correo}`}>
                        {pacienteFicha.cliente.correo}
                      </a>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="historial-clinico">
                <div className="historial-clinico-header">
                  <h4 className="historial-clinico-title">Comentarios</h4>
                </div>
                <textarea
                  id="ficha_historial"
                  className="historial-content"
                  value={formData.historial_clinico || pacienteFicha.historial_clinico || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    historial_clinico: e.target.value
                  })}
                  placeholder="Ingrese aquí el historial clínico del paciente..."
                  rows="5"
                ></textarea>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-secondary"
                onClick={() => setShowFicha(false)}
              >
                Cerrar
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleUpdateHistorial}
              >
                Actualizar Historial
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GestionPacientes;
