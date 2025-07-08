#!/bin/sh

# Debug: Print environment variables (safely)
echo "Debug: VITE_BACKEND_URL = ${VITE_BACKEND_URL:-not set}"
echo "Debug: PORT = ${PORT:-not set}"

# Generate nginx.conf from template with PORT substitution
BACKEND_PORT=${PORT:-3000}
envsubst '${BACKEND_PORT}' < /nginx.conf.template > /etc/nginx/conf.d/default.conf

echo "Generated nginx config with backend port: $BACKEND_PORT"

# Create the runtime config file
cat <<EOF > /usr/share/nginx/html/config.js
window.APP_CONFIG = {
  BACKEND_URL: "${VITE_BACKEND_URL:-http://unity-tts-backend:5001}",
  ELEVENLABS_API_KEY: "${VITE_ELEVENLABS_API_KEY:-}",
  BRANDING_URL: "${VITE_BRANDING_URL:-https://automate.builders}",
  BRANDING_NAME: "${VITE_BRANDING_NAME:-Automate Builders}",
  TABLE_COLUMNS: "${VITE_TABLE_COLUMNS:-name,hostname,username,password}",
};
EOF

echo "Generated config.js contents:"
cat /usr/share/nginx/html/config.js

echo "File permissions:"
ls -l /usr/share/nginx/html/config.js