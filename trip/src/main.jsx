import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import ReactDOM from 'react-dom/client';
import Modal from 'react-modal';

Modal.setAppElement('#root');

createRoot(document.getElementById('root')).render(
  //<StrictMode>
  <div>
    <App />
  </div>
  //</StrictMode>,
);