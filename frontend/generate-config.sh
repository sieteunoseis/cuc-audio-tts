#!/bin/sh

# Create the runtime config file
cat <<EOF > /usr/share/nginx/html/config.js
window.APP_CONFIG = {
  BACKEND_URL: "${VITE_BACKEND_URL}",
  ELEVENLABS_API_KEY: "${VITE_ELEVENLABS_API_KEY}",
  BRANDING_URL: "${VITE_BRANDING_URL}",
  BRANDING_NAME: "${VITE_BRANDING_NAME}",
  TABLE_COLUMNS: "${VITE_TABLE_COLUMNS}",
};
EOF

echo "Generated runtime config.js with current environment variables"