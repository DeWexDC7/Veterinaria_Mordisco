import React from 'react';
import './NotFound.css';

const NotFound = () => (
  <div className="not-found">
    <h1>404 - Página no encontrada</h1>
    <p>La página que estás buscando no existe o ha sido movida.</p>
    <a href="/" className="back-home-button">
      Volver al inicio
    </a>
  </div>
);

export default NotFound;