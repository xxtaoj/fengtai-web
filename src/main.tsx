import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import { LanguageProvider } from './i18n/LanguageContext';
import { CatalogProvider } from './context/CatalogContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <LanguageProvider><CatalogProvider><App /></CatalogProvider></LanguageProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
