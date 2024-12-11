import { createContext, useContext, useEffect, useState } from 'react';

const ConfigContext = createContext(null);

const getConfigValues = () => {
  // Development environment
  if (import.meta.env.DEV) {
    return {
      backendUrl: import.meta.env.VITE_BACKEND_URL || 'http://backend:5001',
      elevenLabsApiKey: import.meta.env.VITE_ELEVENLABS_API_KEY || '',
      brandingUrl: import.meta.env.VITE_BRANDING_URL || 'https://automate.builders',
      brandingName: import.meta.env.VITE_BRANDING_NAME || 'Automate Builders',
      tableColumns: import.meta.env.VITE_TABLE_COLUMNS || 'name,hostname,username,password',
    };
  }

  // Production environment
  return {
    backendUrl: window.APP_CONFIG?.BACKEND_PORT || 'http://backend:5001',
    elevenLabsApiKey: window.APP_CONFIG?.ELEVENLABS_API_KEY || '',
    brandingUrl: window.APP_CONFIG?.BRANDING_URL || 'https://automate.builders',
    brandingName: window.APP_CONFIG?.BRANDING_NAME || 'Automate Builders',
    tableColumns: window.APP_CONFIG?.TABLE_COLUMNS || 'name,hostname,username,password',
  };
};

export function ConfigProvider({ children }) {
  const [config, setConfig] = useState(null);

  useEffect(() => {
    // Wait for config to be available
    const checkConfig = () => {
      if (import.meta.env.DEV || window.APP_CONFIG) {
        setConfig(getConfigValues());
      } else {
        setTimeout(checkConfig, 100);
      }
    };

    checkConfig();
  }, []);

  if (!config) {
    return <div>Loading configuration...</div>; // Or your loading component
  }

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