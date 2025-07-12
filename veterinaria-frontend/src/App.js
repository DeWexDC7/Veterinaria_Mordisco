import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './components/Dashboard/Dashboard';
import DashboardLayout from './components/Dashboard/DashboardLayout';
import AdminPanel from './components/AdminPanel/AdminPanel';
import NotFound from './components/NotFound/NotFound';
import GestionUsuarios from './components/AdminPanel/GestionUsuarios';
import GestionClientes from './components/AdminPanel/GestionClientes';
import GestionPacientes from './components/AdminPanel/GestionPacientes';
import GestionCitas from './components/AdminPanel/GestionCitas';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Ruta pública - Login */}
          <Route path="/login" element={<Login />} />
          
          {/* Ruta predeterminada - Redirigir al login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Rutas del Dashboard con Layout compartido */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route 
              path="usuarios" 
              element={
                <ProtectedRoute requiredRole="administrador">
                  <GestionUsuarios />
                </ProtectedRoute>
              } 
            />
            <Route path="clientes" element={<GestionClientes />} />
            <Route path="pacientes" element={<GestionPacientes />} />
            <Route path="citas" element={<GestionCitas />} />
          </Route>
          
          {/* Rutas protegidas con rol específico - Requieren ser administrador */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requiredRole="admin">
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminPanel />} />
          </Route>
          
          {/* Ruta 404 - Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
