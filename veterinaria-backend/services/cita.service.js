const Cita = require('../models/cita');
const Paciente = require('../models/paciente');
const Cliente = require('../models/cliente');
const Usuario = require('../models/usuario');
const { CatalogoDetalle } = require('../models/catalogo');
const { Op } = require('sequelize');

const getAll = async () => {
  return await Cita.findAll({
    where: { estado: 'A' },
    include: [
      {
        model: Paciente,
        include: [{ model: Cliente }]
      },
      {
        model: Usuario,
        attributes: ['id_usuario', 'nombre', 'correo']
      },
      {
        model: CatalogoDetalle,
        as: 'estado_catalogo',
        attributes: ['id_catalogo_detalle', 'nombre_catalogo_cabecera']
      }
    ],
    order: [['fecha', 'DESC'], ['hora', 'DESC']]
  });
};

const getById = async (id) => {
  return await Cita.findByPk(id, {
    include: [
      {
        model: Paciente,
        include: [{ model: Cliente }]
      },
      {
        model: Usuario,
        attributes: ['id_usuario', 'nombre', 'correo']
      },
      {
        model: CatalogoDetalle,
        as: 'estado_catalogo',
        attributes: ['id_catalogo_detalle', 'nombre_catalogo_cabecera']
      }
    ]
  });
};

const create = async (data) => {
  // Validar conflictos de horarios antes de crear
  await validateScheduleConflicts(data);
  
  // Si no se proporciona un estado, usar 'AGENDADA' por defecto (ID 1)
  if (!data.id_estado_cita) {
    data.id_estado_cita = 1; // AGENDADA
  }
  
  data.creado_en = new Date();
  data.estado = 'A';
  
  const nuevaCita = await Cita.create(data);
  
  // Retornar la cita con todas las relaciones
  return await getById(nuevaCita.id_cita);
};

const update = async (id, data) => {
  const item = await Cita.findByPk(id);
  if (!item) return null;
  
  // Validar conflictos de horarios antes de actualizar (excluyendo la cita actual)
  await validateScheduleConflicts(data, id);
  
  data.actualizado_en = new Date();
  await item.update(data);
  
  // Retornar la cita actualizada con todas las relaciones
  return await getById(id);
};

// Función para validar conflictos de horarios
const validateScheduleConflicts = async (data, excludeCitaId = null) => {
  const { fecha, hora, id_paciente, id_veterinario } = data;
  
  if (!fecha || !hora) return; // Si no hay fecha u hora, no validar
  
  // Buscar citas existentes en la misma fecha y hora
  const conflictingCitas = await Cita.findAll({
    where: {
      fecha: fecha,
      hora: hora,
      estado: 'A', // Solo citas activas
      ...(excludeCitaId && { id_cita: { [Op.ne]: excludeCitaId } })
    },
    include: [
      {
        model: Paciente,
        attributes: ['nombre']
      },
      {
        model: Usuario,
        attributes: ['nombre']
      }
    ]
  });
  
  // Validar conflicto de paciente
  if (id_paciente) {
    const pacienteConflict = conflictingCitas.find(cita => 
      cita.id_paciente === parseInt(id_paciente)
    );
    
    if (pacienteConflict) {
      throw new Error(`Conflicto de horario: El paciente ${pacienteConflict.Paciente?.nombre || 'desconocido'} ya tiene una cita programada el ${fecha} a las ${hora} con Dr. ${pacienteConflict.Usuario?.nombre || 'desconocido'}`);
    }
  }
  
  // Validar conflicto de veterinario
  if (id_veterinario) {
    const veterinarioConflict = conflictingCitas.find(cita => 
      cita.id_veterinario === parseInt(id_veterinario)
    );
    
    if (veterinarioConflict) {
      throw new Error(`Conflicto de horario: El veterinario Dr. ${veterinarioConflict.Usuario?.nombre || 'desconocido'} ya tiene una cita programada el ${fecha} a las ${hora} con el paciente ${veterinarioConflict.Paciente?.nombre || 'desconocido'}`);
    }
  }
};

const deleteItem = async (id) => {
  const item = await Cita.findByPk(id);
  if (!item) return null;
  
  // Soft delete - cambiar estado a inactivo
  await item.update({ estado: 'I', actualizado_en: new Date() });
  return item;
};

// Función para detectar conflictos existentes en la base de datos
const detectExistingConflicts = async () => {
  const allCitas = await Cita.findAll({
    where: { estado: 'A' },
    include: [
      {
        model: Paciente,
        attributes: ['nombre']
      },
      {
        model: Usuario,
        attributes: ['nombre']
      }
    ],
    order: [['fecha', 'ASC'], ['hora', 'ASC']]
  });

  const conflicts = [];
  const processedCombinations = new Set();

  for (let i = 0; i < allCitas.length; i++) {
    for (let j = i + 1; j < allCitas.length; j++) {
      const cita1 = allCitas[i];
      const cita2 = allCitas[j];
      
      // Verificar si tienen la misma fecha y hora
      if (cita1.fecha === cita2.fecha && cita1.hora === cita2.hora) {
        const combination = `${cita1.fecha}-${cita1.hora}`;
        
        if (!processedCombinations.has(combination)) {
          processedCombinations.add(combination);
          
          // Buscar todas las citas en este horario
          const citasEnConflicto = allCitas.filter(c => 
            c.fecha === cita1.fecha && c.hora === cita1.hora
          );
          
          conflicts.push({
            fecha: cita1.fecha,
            hora: cita1.hora,
            citas: citasEnConflicto.map(c => ({
              id: c.id_cita,
              paciente: c.Paciente?.nombre || 'Desconocido',
              veterinario: c.Usuario?.nombre || 'Desconocido',
              id_paciente: c.id_paciente,
              id_veterinario: c.id_veterinario
            }))
          });
        }
      }
    }
  }

  return conflicts;
};

module.exports = { getAll, getById, create, update, deleteItem, detectExistingConflicts };
