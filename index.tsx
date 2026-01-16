
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Não foi possível encontrar o elemento root para montar a aplicação.");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Notifica o sistema que o React carregou
const loader = document.getElementById('initial-loader');
if (loader) {
  loader.style.opacity = '0';
  setTimeout(() => loader.remove(), 600);
}
