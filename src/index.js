import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import "./styles/styles.css";
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import Modal from 'react-modal';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

Modal.setAppElement('#root');
serviceWorkerRegistration.register();
