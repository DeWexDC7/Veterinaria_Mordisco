import pacienteAPI from '../consumo-api/paciente.api';

/**
 * Servicio para gestionar los pacientes (mascotas) en la aplicación
 * Esta clase proporciona una interfaz limpia para los componentes
 */
class PacienteService {
  /**
   * Obtiene todos los pacientes
   * @returns {Promise} Lista de pacientes
   */
  getAll() {
    return pacienteAPI.getAll();
  }

  /**
   * Obtiene un paciente por su ID
   * @param {number} id - ID del paciente
   * @returns {Promise} Datos del paciente
   */
  getById(id) {
    return pacienteAPI.getById(id);
  }

  /**
   * Obtiene el último paciente registrado
   * @returns {Promise} Datos del último paciente registrado
   */
  getLatest() {
    return pacienteAPI.getLatest();
  }

  /**
   * Obtiene los pacientes de un cliente específico
   * @param {number} clienteId - ID del cliente dueño de las mascotas
   * @returns {Promise} Lista de pacientes del cliente
   */
  getByClienteId(clienteId) {
    return pacienteAPI.getByClienteId(clienteId);
  }

  /**
   * Crea un nuevo paciente
   * @param {Object} paciente - Datos del paciente a crear
   * @returns {Promise} Paciente creado
   */
  create(paciente) {
    return pacienteAPI.create(paciente);
  }

  /**
   * Actualiza un paciente existente
   * @param {number} id - ID del paciente
   * @param {Object} paciente - Datos actualizados
   * @returns {Promise} Paciente actualizado
   */
  update(id, paciente) {
    return pacienteAPI.update(id, paciente);
  }

  /**
   * Elimina un paciente
   * @param {number} id - ID del paciente a eliminar
   * @returns {Promise} Resultado de la eliminación
   */
  delete(id) {
    return pacienteAPI.delete(id);
  }
}

export default new PacienteService();