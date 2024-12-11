export const getConfig = () => {
    if (!window.APP_CONFIG) {
      throw new Error('Configuration not loaded');
    }
    return {
      backendPort: window.APP_CONFIG.BACKEND_PORT,
      elevenLabsApiKey: window.APP_CONFIG.ELEVENLABS_API_KEY,
      brandingUrl: window.APP_CONFIG.BRANDING_URL,
      brandingName: window.APP_CONFIG.BRANDING_NAME,
    };
  };