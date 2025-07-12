import citaAPI from '../consumo-api/cita.api';

/**
 * Servicio para gestionar las citas en la aplicación
 * Esta clase proporciona una interfaz limpia para los componentes
 */
class CitaService {
  /**
   * Obtiene todas las citas
   * @returns {Promise} Lista de citas
   */
  getAll() {
    return citaAPI.getAll();
  }

  /**
   * Obtiene una cita por su ID
   * @param {number} id - ID de la cita
   * @returns {Promise} Datos de la cita
   */
  getById(id) {
    return citaAPI.getById(id);
  }

  /**
   * Obtiene las citas por paciente
   * @param {number} pacienteId - ID del paciente
   * @returns {Promise} Lista de citas del paciente
   */
  getByPacienteId(pacienteId) {
    return citaAPI.getByPacienteId(pacienteId);
  }

  /**
   * Obtiene las citas por cliente
   * @param {number} clienteId - ID del cliente
   * @returns {Promise} Lista de citas del cliente
   */
  getByClienteId(clienteId) {
    return citaAPI.getByClienteId(clienteId);
  }

  /**
   * Crea una nueva cita
   * @param {Object} cita - Datos de la cita a crear
   * @returns {Promise} Cita creada
   */
  create(cita) {
    return citaAPI.create(cita);
  }

  /**
   * Actualiza una cita existente
   * @param {number} id - ID de la cita
   * @param {Object} cita - Datos actualizados
   * @returns {Promise} Cita actualizada
   */
  update(id, cita) {
    return citaAPI.update(id, cita);
  }

  /**
   * Elimina una cita
   * @param {number} id - ID de la cita a eliminar
   * @returns {Promise} Resultado de la eliminación
   */
  delete(id) {
    return citaAPI.delete(id);
  }

  /**
   * Cambia el estado de una cita
   * @param {number} id - ID de la cita
   * @param {string} estado - Nuevo estado de la cita
   * @returns {Promise} Cita con estado actualizado
   */
  cambiarEstado(id, estado) {
    return citaAPI.cambiarEstado(id, estado);
  }
}

export default new CitaService();