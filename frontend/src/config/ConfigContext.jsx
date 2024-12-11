// src/config/ConfigContext.jsx
import { createContext, useContext } from 'react';

const ConfigContext = createContext(null);

const getConfigValues = () => {
  // If running in development (npm run dev)
  if (import.meta.env.DEV) {
    console.log('Running in development mode');
    return {
      backendPort: import.meta.env.VITE_BACKEND_PORT,
      elevenLabsApiKey: import.meta.env.VITE_ELEVENLABS_API_KEY,
      brandingUrl: import.meta.env.VITE_BRANDING_URL,
      brandingName: import.meta.env.VITE_BRANDING_NAME,
    };
  }

  // If running in production (Docker)
  if (window.APP_CONFIG) {
    return {
      backendPort: window.APP_CONFIG.BACKEND_PORT,
      elevenLabsApiKey: window.APP_CONFIG.ELEVENLABS_API_KEY,
      brandingUrl: window.APP_CONFIG.BRANDING_URL,
      brandingName: window.APP_CONFIG.BRANDING_NAME,
    };
  }

  throw new Error('No configuration found');
};

export function ConfigProvider({ children }) {
  const config = getConfigValues();

  return (
    <ConfigContext.Provider value={config}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
}