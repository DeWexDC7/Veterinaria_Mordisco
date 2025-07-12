const jwt = require('jsonwebtoken');
const jwtConfig = require('../config/jwt/jwt.config');

/**
 * Middleware para verificar token JWT
 * Este middleware protege rutas que requieren autenticación
 */
const verifyToken = (req, res, next) => {
  // Obtener el token del encabezado
  const token = req.headers['x-access-token'] || req.headers['authorization'];
  
  if (!token) {
    return res.status(403).json({ 
      success: false, 
      message: "Se requiere un token para la autenticación" 
    });
  }

  try {
    // Eliminar el prefijo "Bearer " si existe
    const tokenValue = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;
    
    // Verificar el token
    const decoded = jwt.verify(tokenValue, jwtConfig.jwtSecret);
    
    // Agregar el usuario decodificado al request
    req.usuario = decoded.usuario;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token no válido o expirado"
    });
  }
};

// Middleware para verificar roles
const verifyRole = (roles) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(403).json({
        success: false,
        message: "Se requiere autenticación"
      });
    }

    if (roles.includes(req.usuario.rol)) {
      next();
    } else {
      res.status(403).json({
        success: false,
        message: "No tiene permisos para realizar esta acción"
      });
    }
  };
};

module.exports = {
  verifyToken,
  verifyRole
};