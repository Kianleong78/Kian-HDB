import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Guard against third-party cross-origin script errors (e.g., Disqus, tracking scripts) in iframe environments
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    if (event.message === 'Script error.' || event.filename?.includes('disqus') || event.filename?.includes('clarity')) {
      // Suppress unhandled cross-origin script error noise from breaking the app
      event.preventDefault();
      return true;
    }
  });

  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason?.message?.includes('disqus') || event.reason?.message?.includes('Script error')) {
      event.preventDefault();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

