import React, { useState, useEffect, useMemo } from 'react';
import clienteService from '../../services/cliente.service';
import authService from '../../services/auth.service';
import '../../estilo/Usuarios.css';

// Componente para la gestión de clientes con DataTable sin jQuery
function GestionClientes() {
  // Estados
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: 'id_cliente', direction: 'asc' });
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' o 'edit'
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [formData, setFormData] = useState({
    nombre_completo: '',
    cedula: '',
    correo: '',
    telefono: '',
    direccion: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clienteToDelete, setClienteToDelete] = useState(null);
  const [alertInfo, setAlertInfo] = useState({ show: false, type: '', message: '' });

  // Verificar si el usuario es administrador
  const isAdmin = authService.hasRole('administrador');

  // Cargar clientes al iniciar
  useEffect(() => {
    fetchClientes();
  }, []);

  // Actualizar datos filtrados cuando cambian los clientes o el término de búsqueda
  useEffect(() => {
    let result = [...clientes];
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(cliente => 
        cliente.nombre_completo.toLowerCase().includes(term) ||
        cliente.cedula.toLowerCase().includes(term) ||
        cliente.correo.toLowerCase().includes(term) ||
        cliente.telefono.toLowerCase().includes(term) ||
        cliente.direccion.toLowerCase().includes(term)
      );
    }
    
    // Ordenar datos
    if (sortConfig.key) {
      result.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    
    setFilteredData(result);
    setCurrentPage(1); // Reset a la primera página cuando se filtra
  }, [clientes, searchTerm, sortConfig]);

  // Función para cargar clientes desde la API
  const fetchClientes = async () => {
    try {
      setLoading(true);
      const data = await clienteService.getAll();
      setClientes(data);
      setError(null);
    } catch (err) {
      console.error("Error al cargar clientes:", err);
      setError("Error al cargar los clientes. Por favor, intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  // Ordenar columnas al hacer clic en los encabezados
  const requestSort = (key) => {
    let direction = 'asc';
    if (
      sortConfig.key === key &&
      sortConfig.direction === 'asc'
    ) {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Calcular datos paginados
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  // Calcular total de páginas
  const totalPages = useMemo(() => {
    return Math.ceil(filteredData.length / itemsPerPage);
  }, [filteredData, itemsPerPage]);

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

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      nombre_completo: '',
      cedula: '',
      correo: '',
      telefono: '',
      direccion: ''
    });
    setFormErrors({});
  };

  // Abrir modal para crear cliente
  const handleOpenCreateModal = () => {
    resetForm();
    setModalMode('create');
    setShowModal(true);
  };

  // Abrir modal para editar cliente
  const handleOpenEditModal = (cliente) => {
    setSelectedCliente(cliente);
    setFormData({
      nombre_completo: cliente.nombre_completo,
      cedula: cliente.cedula || '', // Asegurarse de que cedula esté definido
      correo: cliente.correo,
      telefono: cliente.telefono,
      direccion: cliente.direccion
    });
    setModalMode('edit');
    setShowModal(true);
  };

  // Abrir modal para confirmar eliminación
  const handleOpenDeleteModal = (cliente) => {
    setClienteToDelete(cliente);
    setShowDeleteModal(true);
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Validar formulario
  const validateForm = () => {
    const errors = {};
    
    if (!formData.nombre_completo.trim()) {
      errors.nombre_completo = 'El nombre es obligatorio';
    }

    if (!formData.cedula.trim()) {
      errors.cedula = 'La cédula es obligatoria';
    } else {
      // Validar formato de cédula
      if (!/^\d{6,15}$/.test(formData.cedula)) {
        errors.cedula = 'Formato de cédula inválido';
      } else {
        // Validar unicidad de la cédula (solo en modo crear o si cambió en editar)
        const cedulaExistente = clientes.find(
          c =>
            c.cedula === formData.cedula &&
            (modalMode === 'create' || (modalMode === 'edit' && c.id_cliente !== selectedCliente?.id_cliente))
        );
        if (cedulaExistente) {
          errors.cedula = 'La cédula ya está registrada';
        }
      }
    }
    
    if (!formData.correo.trim()) {
      errors.correo = 'El correo es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      errors.correo = 'Formato de correo inválido';
    }
    
    if (!formData.telefono.trim()) {
      errors.telefono = 'El teléfono es obligatorio';
    }
    
    if (!formData.direccion.trim()) {
      errors.direccion = 'La dirección es obligatoria';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Guardar cliente (crear o actualizar)
  const handleSaveCliente = async () => {
    if (!validateForm()) return;
    
    try {
      if (modalMode === 'create') {
        // Crear nuevo cliente
        await clienteService.create(formData);
        setAlertInfo({
          show: true,
          type: 'success',
          message: 'Cliente creado exitosamente'
        });
      } else {
        // Actualizar cliente existente
        await clienteService.update(selectedCliente.id_cliente, formData);
        setAlertInfo({
          show: true,
          type: 'success',
          message: 'Cliente actualizado exitosamente'
        });
      }
      
      // Cerrar modal y recargar clientes
      setShowModal(false);
      await fetchClientes();
      
      // Ocultar la alerta después de 5 segundos
      setTimeout(() => {
        setAlertInfo({ show: false, type: '', message: '' });
      }, 5000);
    } catch (err) {
      console.error("Error al guardar cliente:", err);
      setAlertInfo({
        show: true,
        type: 'danger',
        message: `Error al ${modalMode === 'create' ? 'crear' : 'actualizar'} cliente: ${err.message || 'Error desconocido'}`
      });
    }
  };

  // Eliminar cliente
  const handleDeleteCliente = async () => {
    if (!clienteToDelete) return;
    
    try {
      await clienteService.delete(clienteToDelete.id_cliente);
      setShowDeleteModal(false);
      setClienteToDelete(null);
      
      setAlertInfo({
        show: true,
        type: 'success',
        message: 'Cliente eliminado exitosamente'
      });
      
      // Recargar clientes
      await fetchClientes();
      
      // Ocultar la alerta después de 5 segundos
      setTimeout(() => {
        setAlertInfo({ show: false, type: '', message: '' });
      }, 5000);
    } catch (err) {
      console.error("Error al eliminar cliente:", err);
      setAlertInfo({
        show: true,
        type: 'danger',
        message: `Error al eliminar cliente: ${err.message || 'Error desconocido'}`
      });
    }
  };

  // Manejar el cambio de registros por página
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1); // Volver a la primera página
  };

  return (
    <div className="page-content">
      <div className="usuarios-container fade-in">
        <div className="usuarios-header">
          <h2 className="usuarios-title">Gestión de Clientes</h2>
          <div className="usuarios-actions">
            {isAdmin && (
              <button 
                className="btn btn-primary" 
                onClick={handleOpenCreateModal}
              >
                  Nuevo Cliente
              </button>
            )}
          </div>
        </div>
        
        {/* Alerta de notificación */}
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
                Está viendo el módulo en modo de solo lectura. Las funciones de crear, editar y eliminar están disponibles únicamente para administradores.
              </p>
            </div>
          </div>
        )}
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          {/* Barra de búsqueda */}
          <div className="datatable-search">
            <input
              type="text"
              placeholder="Buscar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Buscar clientes"
            />
          </div>
          
          {/* Selector de registros por página */}
          <div className="items-per-page">
            <span>Mostrar</span>
            <select 
              value={itemsPerPage} 
              onChange={handleItemsPerPageChange}
              aria-label="Registros por página"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
            </select>
            <span>registros</span>
          </div>
        </div>
        
          <div className="datatable-container">
            <table className="datatable">
              <thead>
                <tr>
            <th 
              className={`sortable ${sortConfig.key === 'id_cliente' ? `sorted-${sortConfig.direction}` : ''}`}
              onClick={() => requestSort('id_cliente')}
              style={{width: '50px'}}
            >
              ID
            </th>
             <th 
              className={`sortable ${sortConfig.key === 'cedula' ? `sorted-${sortConfig.direction}` : ''}`}
              onClick={() => requestSort('cedula')}
              style={{width: '100px'}}
              
            >
              Cédula
            </th>
            <th 
              className={`sortable ${sortConfig.key === 'nombre_completo' ? `sorted-${sortConfig.direction}` : ''}`}
              onClick={() => requestSort('nombre_completo')}
            >
              Nombre
            </th>
            <th 
              className={`sortable ${sortConfig.key === 'correo' ? `sorted-${sortConfig.direction}` : ''}`}
              onClick={() => requestSort('correo')}
            >
              Correo
            </th>
            <th 
              className={`sortable ${sortConfig.key === 'telefono' ? `sorted-${sortConfig.direction}` : ''}`}
              onClick={() => requestSort('telefono')}
              style={{width: '120px'}}
            >
              Teléfono
            </th>
            <th 
              className={`sortable ${sortConfig.key === 'creado_en' ? `sorted-${sortConfig.direction}` : ''}`}
              onClick={() => requestSort('creado_en')}
              style={{width: '140px'}}
            >
              Fecha Registro
            </th>
            {isAdmin && <th style={{width: '100px'}}>Acciones</th>}
                </tr>
              </thead>
              <tbody>
                {loading ? (
            <tr>
              <td colSpan={isAdmin ? "7" : "6"}>
                <div className="loading-spinner">
                  <div className="spinner"></div>
                </div>
              </td>
            </tr>
                ) : error ? (
            <tr>
              <td colSpan={isAdmin ? "7" : "6"} style={{ color: 'var(--error-color)', textAlign: 'center', padding: '20px' }}>
                {error}
              </td>
            </tr>
                ) : paginatedData.length === 0 ? (
            <tr>
              <td colSpan={isAdmin ? "7" : "6"} style={{ textAlign: 'center', padding: '20px' }}>
                No se encontraron clientes
              </td>
            </tr>
                ) : (
            paginatedData.map(cliente => (
              <tr key={cliente.id_cliente}>
                <td>{cliente.id_cliente}</td>
                <td>{cliente.cedula}</td>
                <td>{cliente.nombre_completo}</td>
                <td>{cliente.correo}</td>
                <td>{cliente.telefono}</td>
                <td>{new Date(cliente.creado_en).toLocaleDateString()}</td>
                {isAdmin && (
                  <td>
                    <div className="datatable-actions">
                <button 
                  className="btn btn-secondary btn-sm btn-action" 
                  onClick={() => handleOpenEditModal(cliente)}
                  title="Editar cliente"
                >
                  ✏️
                </button>
                <button 
                  className="btn btn-danger btn-sm btn-action"
                  onClick={() => handleOpenDeleteModal(cliente)}
                  title="Eliminar cliente"
                >
                  🗑️
                </button>
                    </div>
                  </td>
                )}
              </tr>
            ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Footer con paginación */}
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
      </div>
      
      {/* Modal para crear/editar cliente */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">
                {modalMode === 'create' ? 'Crear Nuevo Cliente' : 'Editar Cliente'}
              </h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="cedula">Cédula</label>
                <input
                  type="text"
                  id="cedula"
                  name="cedula"
                  value={formData.cedula}
                  onChange={handleInputChange}
                  placeholder="Ingrese número de cédula"
                />
                {formErrors.cedula && (
                  <div className="form-error">{formErrors.cedula}</div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="nombre_completo">Nombre completo</label>
                <input
                  type="text"
                  id="nombre_completo"
                  name="nombre_completo"
                  value={formData.nombre_completo}
                  onChange={handleInputChange}
                  placeholder="Ingrese nombre completo del cliente"
                />
                {formErrors.nombre_completo && (
                  <div className="form-error">{formErrors.nombre_completo}</div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="correo">Correo electrónico</label>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  value={formData.correo}
                  onChange={handleInputChange}
                  placeholder="Ingrese correo electrónico"
                />
                {formErrors.correo && (
                  <div className="form-error">{formErrors.correo}</div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="telefono">Teléfono</label>
                <input
                  type="text"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  placeholder="Ingrese número telefónico"
                />
                {formErrors.telefono && (
                  <div className="form-error">{formErrors.telefono}</div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="direccion">Dirección</label>
                <input
                  type="text"
                  id="direccion"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  placeholder="Ingrese dirección completa"
                  rows="3"
                ></input>
                {formErrors.direccion && (
                  <div className="form-error">{formErrors.direccion}</div>
                )}
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
                onClick={handleSaveCliente}
              >
                {modalMode === 'create' ? 'Crear Cliente' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal para confirmar eliminación */}
      {showDeleteModal && clienteToDelete && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Confirmar Eliminación</h3>
              <button className="modal-close" onClick={() => setShowDeleteModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <p>¿Está seguro de que desea eliminar al cliente <strong>{clienteToDelete.nombre_completo}</strong>?</p>
              <p>Esta acción no se puede deshacer.</p>
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
                onClick={handleDeleteCliente}
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

export default GestionClientes;