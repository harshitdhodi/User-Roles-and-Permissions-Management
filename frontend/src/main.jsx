import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Provider } from 'react-redux';
import { store } from './store/store';
import App from './App.jsx'
import { ToastProvider } from '@radix-ui/react-toast';
import { ToastContainer } from 'react-toastify';

import React from 'react';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>
    <ToastContainer position="top-right" autoClose={1000} />
      <Provider store={store}>
        <App />
     
      </Provider>
    </ToastProvider>

  </StrictMode>,
)
