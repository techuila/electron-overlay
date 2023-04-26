import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

// Pass through transparent background
// @Reference https://github.com/electron/electron/issues/1335#issuecomment-571066967

let t: any;
window.addEventListener('mousemove', (event) => {
  console.log(
    event.target === document.documentElement ||
      [...document.querySelectorAll('[data-interactive-overlay]')].some((el) => event.target !== el)
  );
  if (
    event.target === document.documentElement ||
    [...document.querySelectorAll('[data-interactive-overlay]')].some((el) => event.target !== el.parentElement)
  ) {
    window.ipcRenderer.setIgnoreMouseEvents(true, { forward: true });
    if (t) clearTimeout(t);
    t = setTimeout(function () {
      window.ipcRenderer.setIgnoreMouseEvents(false);
    }, 150);
  } else window.ipcRenderer.setIgnoreMouseEvents(false);
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
