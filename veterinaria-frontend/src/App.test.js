import { render, screen } from '@testing-library/react';
import App from './App';

// Mock react-router-dom para evitar errores de navegación en pruebas
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  BrowserRouter: ({ children }) => <div>{children}</div>,
  Routes: ({ children }) => <div>{children}</div>,
  Route: ({ children }) => <div>{children}</div>,
  Navigate: () => <div>Navigate</div>,
}));

test('renders app container', () => {
  render(<App />);
  const appContainer = document.querySelector('.App');
  expect(appContainer).toBeInTheDocument();
});
