const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Usuario } = require('../models');
const jwtConfig = require('../config/jwt/jwt.config');

/**
 * Controlador para la autenticación de usuarios
 * Maneja el login y generación de tokens JWT
 */
const login = async (req, res) => {
  try {
    const { correo, contrasenia } = req.body;

    // Validación básica
    if (!correo || !contrasenia) {
      return res.status(400).json({
        success: false,
        message: 'El correo y contraseña son requeridos'
      });
    }

    // Buscar usuario por correo
    const usuario = await Usuario.findOne({ 
      where: { 
        correo,
        estado: 'A' 
      } 
    });

    // Si no se encuentra el usuario
    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar la contraseña
    const passwordValido = await bcrypt.compare(contrasenia, usuario.contrasenia);

    if (!passwordValido) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Crear el payload del token
    const payload = {
      usuario: {
        id: usuario.id_usuario,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol
      }
    };

    // Generar el token
    jwt.sign(
      payload,
      jwtConfig.jwtSecret,
      { expiresIn: jwtConfig.jwtExpiration },
      (err, token) => {
        if (err) throw err;
        
        // Responder con el token y la información del usuario
        res.json({
          success: true,
          message: 'Login exitoso',
          token,
          usuario: {
            id: usuario.id_usuario,
            nombre: usuario.nombre,
            correo: usuario.correo,
            rol: usuario.rol
          }
        });
      }
    );
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
};

/**
 * Obtiene el perfil del usuario autenticado
 */
const getPerfil = async (req, res) => {
  try {
    // El middleware ya verificó y decodificó el token
    // req.usuario tiene la información del usuario
    const usuario = await Usuario.findByPk(req.usuario.id, {
      attributes: { exclude: ['contrasenia'] }
    });

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      usuario
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error en el servidor'
    });
  }
};

module.exports = {
  login,
  getPerfil
};