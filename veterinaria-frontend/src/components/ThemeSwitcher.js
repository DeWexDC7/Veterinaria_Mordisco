import React from 'react';
import '../estilo/ThemeSwitcher.css';

const ThemeSwitcher = ({ darkMode, toggleDarkMode }) => {
  return (
    <div className="theme-switcher-container">
      <button 
        className={`theme-switcher ${darkMode ? 'dark' : 'light'}`}
        onClick={toggleDarkMode}
        aria-label={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      >
        <div className="switch-icon">
          {/* Sol con rayos animados */}
          <div className="sun-moon-container">
            <div className="sun">
              <div className="sun-core"></div>
              <div className="sun-ray ray1"></div>
              <div className="sun-ray ray2"></div>
              <div className="sun-ray ray3"></div>
              <div className="sun-ray ray4"></div>
              <div className="sun-ray ray5"></div>
              <div className="sun-ray ray6"></div>
              <div className="sun-ray ray7"></div>
              <div className="sun-ray ray8"></div>
            </div>
            {/* Luna con cráteres */}
            <div className="moon">
              <div className="moon-crater crater1"></div>
              <div className="moon-crater crater2"></div>
              <div className="moon-crater crater3"></div>
            </div>
          </div>
        </div>
        {/* Texto opcional que solo se mostrará en versión completa */}
        <span className="theme-text">{darkMode ? 'Modo Oscuro' : 'Modo Claro'}</span>
      </button>
    </div>
  );
};

export default ThemeSwitcher;