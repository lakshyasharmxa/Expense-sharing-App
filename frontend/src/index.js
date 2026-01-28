import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ErrorBoundary from './ErrorBoundary';

// Function to initialize the app
function initializeApp() {
  const rootElement = document.getElementById('root');
  
  if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </React.StrictMode>
    );
  } else {
    // Fallback: try again after a short delay
    setTimeout(() => {
      const rootElement = document.getElementById('root');
      if (rootElement) {
        const root = ReactDOM.createRoot(rootElement);
        root.render(
          <React.StrictMode>
            <ErrorBoundary>
              <App />
            </ErrorBoundary>
          </React.StrictMode>
        );
      } else {
        console.error('Root element still not found after delay');
        document.body.innerHTML = '<div style="padding: 20px;"><h1>Error: Root element not found</h1><p>Please check that index.html contains &lt;div id="root"&gt;&lt;/div&gt;</p></div>';
      }
    }, 100);
  }
}

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  // DOM is already ready
  initializeApp();
}