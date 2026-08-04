import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css'; // Make sure your global styles are imported here!
import { I18nProvider } from './lib/i18n';
import { AuthProvider } from './context/AuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <I18nProvider> 
      <AuthProvider>
      <App />
      </AuthProvider>
    </I18nProvider>
  </React.StrictMode>
);