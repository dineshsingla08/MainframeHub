import React from 'react';
import ReactDOM from 'react-dom/client';
window.API_BASE = import.meta.env.VITE_API_URL || '';

import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
