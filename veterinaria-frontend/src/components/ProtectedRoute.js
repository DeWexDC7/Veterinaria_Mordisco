import React from 'react';
import { Navigate } from 'react-router-dom';
import authService from '../services/auth.service';

/**
 * Componente para proteger rutas que requieren autenticación
 * Redirige al login si el usuario no está autenticado o no tiene el rol requerido
 * Compatible con react-router-dom v6
 * 
 * @param {Object} props - Propiedades del componente
 * @param {React.Component} props.children - Componente hijo a renderizar si el usuario está autorizado
 * @param {string} [props.requiredRole] - Rol requerido para acceder a la ruta
 * @returns {React.Component}
 */
const ProtectedRoute = ({ children, requiredRole }) => {
  // Verificar si el usuario está autenticado
  const isAuthenticated = authService.isAuthenticated();
  console.log('¿Está autenticado?', isAuthenticated);
  
  // Si se especificó un rol requerido, verificar si el usuario tiene ese rol
  const hasRequiredRole = requiredRole 
    ? authService.hasRole(requiredRole)
    : true;
  console.log('¿Tiene rol requerido?', hasRequiredRole, 'Rol requerido:', requiredRole);

  // Si el usuario no está autenticado o no tiene el rol requerido, redirigir al login
  if (!isAuthenticated || !hasRequiredRole) {
    console.log('Redirigiendo al login');
    return <Navigate to="/login" replace />;
  }

  // Si el usuario está autenticado y tiene el rol requerido, mostrar el contenido
  console.log('Renderizando ruta protegida');
  return children;
};

export default ProtectedRoute;