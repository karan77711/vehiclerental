// ✅ Import Bootstrap CSS first
import 'bootstrap/dist/css/bootstrap.min.css';

// ✅ Import Bootstrap JS bundle for interactive components
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from "./App.jsx";
import './index.css'; // must be in src/

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
