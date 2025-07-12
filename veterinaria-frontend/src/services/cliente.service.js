import clienteAPI from '../consumo-api/cliente.api';

/**
 * Servicio para la gestión de clientes en la aplicación
 * Este servicio proporciona una interfaz limpia para las funcionalidades
 * de clientes utilizando el API correspondiente
 */
class ClienteService {
  /**
   * Obtiene todos los clientes
   * @returns {Promise} - Lista de clientes
   */
  getAll() {
    return clienteAPI.getAll();
  }

  /**
   * Obtiene un cliente por su ID
   * @param {number} id - ID del cliente
   * @returns {Promise} - Datos del cliente
   */
  getById(id) {
    return clienteAPI.getById(id);
  }

  /**
   * Crea un nuevo cliente
   * @param {Object} clienteData - Datos del nuevo cliente
   * @returns {Promise} - Cliente creado
   */
  create(clienteData) {
    // Agregar fechas si no están presentes
    if (!clienteData.creado_en) {
      clienteData.creado_en = new Date();
    }
    if (!clienteData.actualizado_en) {
      clienteData.actualizado_en = new Date();
    }
    return clienteAPI.create(clienteData);
  }

  /**
   * Actualiza un cliente existente
   * @param {number} id - ID del cliente a actualizar
   * @param {Object} clienteData - Datos actualizados del cliente
   * @returns {Promise} - Cliente actualizado
   */
  update(id, clienteData) {
    // Actualizar fecha de actualización
    clienteData.actualizado_en = new Date();
    return clienteAPI.update(id, clienteData);
  }

  /**
   * Elimina un cliente
   * @param {number} id - ID del cliente a eliminar
   * @returns {Promise} - Respuesta de confirmación
   */
  delete(id) {
    return clienteAPI.delete(id);
  }
}

export default new ClienteService();