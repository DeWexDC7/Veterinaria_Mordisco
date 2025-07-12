import React, { useState, useEffect, useMemo } from 'react';
import usuarioService from '../../services/usuario.service';
import authService from '../../services/auth.service';
import '../../estilo/Usuarios.css';

// Componente para la gestión de usuarios con DataTable sin jQuery
function GestionUsuarios() {
  // Estados
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [sortConfig, setSortConfig] = useState({ key: 'id_usuario', direction: 'asc' });
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' o 'edit'
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    correo: '',
    contrasenia: '',
    rol: 'usuario'
  });
  const [formErrors, setFormErrors] = useState({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [alertInfo, setAlertInfo] = useState({ show: false, type: '', message: '' });

  // Verificar si el usuario es administrador
  const isAdmin = authService.hasRole('administrador');

  // Cargar usuarios al iniciar
  useEffect(() => {
    fetchUsuarios();
  }, []);

  // Actualizar datos filtrados cuando cambian los usuarios o el término de búsqueda
  useEffect(() => {
    let result = [...usuarios];
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(user => 
        user.nombre.toLowerCase().includes(term) ||
        user.correo.toLowerCase().includes(term) ||
        user.rol.toLowerCase().includes(term)
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
  }, [usuarios, searchTerm, sortConfig]);

  // Función para cargar usuarios desde la API
  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const data = await usuarioService.getAll();
      setUsuarios(data);
      setError(null);
    } catch (err) {
      console.error("Error al cargar usuarios:", err);
      setError("Error al cargar los usuarios. Por favor, intente nuevamente.");
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
      nombre: '',
      correo: '',
      contrasenia: '',
      rol: 'usuario'
    });
    setFormErrors({});
  };

  // Abrir modal para crear usuario
  const handleOpenCreateModal = () => {
    resetForm();
    setModalMode('create');
    setShowModal(true);
  };

  // Abrir modal para editar usuario
  const handleOpenEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      nombre: user.nombre,
      correo: user.correo,
      contrasenia: '', // No mostrar contraseña por seguridad
      rol: user.rol
    });
    setModalMode('edit');
    setShowModal(true);
  };

  // Abrir modal para confirmar eliminación
  const handleOpenDeleteModal = (user) => {
    setUserToDelete(user);
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
    
    if (!formData.nombre.trim()) {
      errors.nombre = 'El nombre es obligatorio';
    }
    
    if (!formData.correo.trim()) {
      errors.correo = 'El correo es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      errors.correo = 'Formato de correo inválido';
    }
    
    if (modalMode === 'create' && !formData.contrasenia) {
      errors.contrasenia = 'La contraseña es obligatoria';
    } else if (formData.contrasenia && formData.contrasenia.length < 6) {
      errors.contrasenia = 'La contraseña debe tener al menos 6 caracteres';
    }
    
    if (!formData.rol) {
      errors.rol = 'Seleccione un rol';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Guardar usuario (crear o actualizar)
  const handleSaveUser = async () => {
    if (!validateForm()) return;
    
    try {
      if (modalMode === 'create') {
        // Crear nuevo usuario
        await usuarioService.create(formData);
        setAlertInfo({
          show: true,
          type: 'success',
          message: 'Usuario creado exitosamente'
        });
      } else {
        // Actualizar usuario existente
        const dataToUpdate = { ...formData };
        // Solo enviar contraseña si se ha modificado
        if (!dataToUpdate.contrasenia) {
          delete dataToUpdate.contrasenia;
        }
        
        await usuarioService.update(selectedUser.id_usuario, dataToUpdate);
        setAlertInfo({
          show: true,
          type: 'success',
          message: 'Usuario actualizado exitosamente'
        });
      }
      
      // Cerrar modal y recargar usuarios
      setShowModal(false);
      await fetchUsuarios();
      
      // Ocultar la alerta después de 5 segundos
      setTimeout(() => {
        setAlertInfo({ show: false, type: '', message: '' });
      }, 5000);
    } catch (err) {
      console.error("Error al guardar usuario:", err);
      setAlertInfo({
        show: true,
        type: 'danger',
        message: `Error al ${modalMode === 'create' ? 'crear' : 'actualizar'} usuario: ${err.message || 'Error desconocido'}`
      });
    }
  };

  // Eliminar usuario
  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      await usuarioService.delete(userToDelete.id_usuario);
      setShowDeleteModal(false);
      setUserToDelete(null);
      
      setAlertInfo({
        show: true,
        type: 'success',
        message: 'Usuario eliminado exitosamente'
      });
      
      // Recargar usuarios
      await fetchUsuarios();
      
      // Ocultar la alerta después de 5 segundos
      setTimeout(() => {
        setAlertInfo({ show: false, type: '', message: '' });
      }, 5000);
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
      setAlertInfo({
        show: true,
        type: 'danger',
        message: `Error al eliminar usuario: ${err.message || 'Error desconocido'}`
      });
    }
  };

  // Manejar el cambio de registros por página
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1); // Volver a la primera página
  };

  // Función para formatear el rol de usuario
  const formatUserRole = (role) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'usuario':
        return 'Veterinario';
      default:
        return role.charAt(0).toUpperCase() + role.slice(1);
    }
  };

  return (
    <div className="page-content">
      {/* Verificar si el usuario tiene permisos */}
      {!isAdmin ? (
        <div className="usuarios-container fade-in">
          <div className="alert alert-danger">
            <div className="alert-icon">
              🚫
            </div>
            <div className="alert-content">
              <p className="alert-message">
                <strong>Acceso Denegado:</strong> No tiene permisos para acceder a la gestión de usuarios. Esta función está disponible únicamente para administradores.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="usuarios-container fade-in">
        <div className="usuarios-header">
          <h2 className="usuarios-title">Gestión de Usuarios</h2>
          <div className="usuarios-actions">
            <button 
              className="btn btn-primary" 
              onClick={handleOpenCreateModal}
            >
                Nuevo Usuario
            </button>
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
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          {/* Barra de búsqueda */}
          <div className="datatable-search">
            <input
              type="text"
              placeholder="Buscar usuarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Buscar usuarios"
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
        
        {/* Tabla de datos */}
        <div className="datatable-container">
          <table className="datatable">
            <thead>
              <tr>
                <th 
                  className={`sortable ${sortConfig.key === 'id_usuario' ? `sorted-${sortConfig.direction}` : ''}`}
                  onClick={() => requestSort('id_usuario')}
                  style={{width: '50px'}}
                >
                  ID
                </th>
                <th 
                  className={`sortable ${sortConfig.key === 'nombre' ? `sorted-${sortConfig.direction}` : ''}`}
                  onClick={() => requestSort('nombre')}
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
                  className={`sortable ${sortConfig.key === 'rol' ? `sorted-${sortConfig.direction}` : ''}`}
                  onClick={() => requestSort('rol')}
                  style={{width: '100px'}}
                >
                  Rol
                </th>
                <th 
                  className={`sortable ${sortConfig.key === 'creado_en' ? `sorted-${sortConfig.direction}` : ''}`}
                  onClick={() => requestSort('creado_en')}
                  style={{width: '140px'}}
                >
                  Fecha Registro
                </th>
                <th style={{width: '100px'}}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6">
                    <div className="loading-spinner">
                      <div className="spinner"></div>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" style={{ color: 'var(--error-color)', textAlign: 'center', padding: '20px' }}>
                    {error}
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                    No se encontraron usuarios
                  </td>
                </tr>
              ) : (
                paginatedData.map(user => (
                  <tr key={user.id_usuario}>
                    <td>{user.id_usuario}</td>
                    <td>{user.nombre}</td>
                    <td>{user.correo}</td>
                    <td>{formatUserRole(user.rol)}</td>
                    <td>{new Date(user.creado_en).toLocaleDateString()}</td>
                    <td>
                      <div className="datatable-actions">
                        <button 
                          className="btn btn-secondary btn-sm btn-action" 
                          onClick={() => handleOpenEditModal(user)}
                          title="Editar usuario"
                        >
                          ✏️
                        </button>
                        <button 
                          className="btn btn-danger btn-sm btn-action"
                          onClick={() => handleOpenDeleteModal(user)}
                          title="Eliminar usuario"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
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
      )}
      
      {/* Modal para crear/editar usuario - Solo mostrar si es admin */}
      {isAdmin && showModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">
                {modalMode === 'create' ? 'Crear Nuevo Usuario' : 'Editar Usuario'}
              </h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="nombre">Nombre</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  placeholder="Ingrese nombre completo"
                />
                {formErrors.nombre && (
                  <div className="form-error">{formErrors.nombre}</div>
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
                <label htmlFor="contrasenia">
                  Contraseña {modalMode === 'edit' && '(Dejar en blanco para no cambiar)'}
                </label>
                <input
                  type="password"
                  id="contrasenia"
                  name="contrasenia"
                  value={formData.contrasenia}
                  onChange={handleInputChange}
                  placeholder={modalMode === 'create' ? "Ingrese contraseña" : "Ingrese nueva contraseña (opcional)"}
                />
                {formErrors.contrasenia && (
                  <div className="form-error">{formErrors.contrasenia}</div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="rol">Rol</label>
                <select
                  id="rol"
                  name="rol"
                  value={formData.rol}
                  onChange={handleInputChange}
                >
                  <option value="usuario">Veterinario</option>
                  <option value="admin">Administrador</option>
                </select>
                {formErrors.rol && (
                  <div className="form-error">{formErrors.rol}</div>
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
                onClick={handleSaveUser}
              >
                {modalMode === 'create' ? 'Crear Usuario' : 'Guardar Cambios'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Modal para confirmar eliminación - Solo mostrar si es admin */}
      {isAdmin && showDeleteModal && userToDelete && (
        <div className="modal-backdrop">
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <h3 className="modal-title">Confirmar Eliminación</h3>
              <button className="modal-close" onClick={() => setShowDeleteModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <p>¿Está seguro de que desea eliminar al usuario <strong>{userToDelete.nombre}</strong>?</p>
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
                onClick={handleDeleteUser}
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

export default GestionUsuarios;