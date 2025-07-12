import React from 'react';
import './AdminPanel.css';

const AdminPanel = () => (
  <div className="admin-panel">
    <h1>Panel de Administración</h1>
    <p>Esta sección es solo para administradores de la Veterinaria Mordisco</p>
    <div className="admin-notification">
      <h3>Acceso administrativo</h3>
      <p>Has iniciado sesión como administrador y tienes acceso a funcionalidades privilegiadas.</p>
    </div>
  </div>
);

export default AdminPanel;