import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// #region agent log
fetch('http://127.0.0.1:7657/ingest/fd01d022-d456-47e7-9ee3-eabbb6756821',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'adbd37'},body:JSON.stringify({sessionId:'adbd37',runId:'initial',hypothesisId:'H4',location:'src/index.tsx:7',message:'Bootstrapping React root',data:{rootExists:Boolean(document.getElementById('root')),pathname:window.location.pathname},timestamp:Date.now()})}).catch(()=>{});
// #endregion

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
// #region agent log
fetch('http://127.0.0.1:7657/ingest/fd01d022-d456-47e7-9ee3-eabbb6756821',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'adbd37'},body:JSON.stringify({sessionId:'adbd37',runId:'initial',hypothesisId:'H4',location:'src/index.tsx:18',message:'React root render invoked',data:{strictMode:true},timestamp:Date.now()})}).catch(()=>{});
// #endregion

// To measure performance, pass a callback to reportWebVitals or send to analytics.
// Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
