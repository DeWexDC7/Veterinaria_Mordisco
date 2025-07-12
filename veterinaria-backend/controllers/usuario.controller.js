const service = require('../services/usuario.service');

const getAll = async (req, res) => {
  const data = await service.getAll();
  res.json(data);
};

const getById = async (req, res) => {
  const item = await service.getById(req.params.id);
  if (!item) return res.status(404).json({ mensaje: 'usuario no encontrado' });
  res.json(item);
};

const create = async (req, res) => {
  try {
    console.log('Headers recibidos:', req.headers);
    console.log('Datos recibidos (raw):', req.body);
    console.log('Tipo de datos recibidos:', typeof req.body);
    console.log('Datos recibidos en la petición:', req.body);
    
    // Verificar si los datos están llegando como un string (puede ocurrir si el Content-Type no es correcto)
    if (typeof req.body === 'string') {
      try {
        req.body = JSON.parse(req.body);
        console.log('Datos convertidos de string a objeto:', req.body);
      } catch (parseError) {
        console.error('Error al parsear datos de string a JSON:', parseError);
      }
    }
    
    // Verificar si los campos requeridos están presentes
    if (!req.body.nombre || !req.body.correo || !req.body.contrasenia) {
      return res.status(400).json({ 
        success: false, 
        mensaje: 'Los campos nombre, correo y contraseña son obligatorios',
        datosRecibidos: req.body
      });
    }
    
    const nuevo = await service.create(req.body);
    console.log('Usuario creado:', nuevo);
    res.status(201).json(nuevo);
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ 
      success: false, 
      mensaje: 'Error al crear usuario', 
      error: error.message 
    });
  }
};

const update = async (req, res) => {
  const actualizado = await service.update(req.params.id, req.body);
  if (!actualizado) return res.status(404).json({ mensaje: 'usuario no encontrado' });
  res.json(actualizado);
};

const eliminar = async (req, res) => {
  const eliminado = await service.deleteItem(req.params.id);
  if (!eliminado) return res.status(404).json({ mensaje: 'usuario no encontrado' });
  res.json({ mensaje: 'usuario eliminado' });
};

module.exports = { getAll, getById, create, update, eliminar };
