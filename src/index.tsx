import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Adjust the path based on your folder structure
import './index.css'; // Ensure you have a global CSS file for styling

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
