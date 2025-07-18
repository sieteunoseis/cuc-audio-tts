# Step 1: Build the Frontend
FROM node:latest AS build

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Step 2: Serve the application using Nginx
FROM nginx:alpine

# Copy the built files from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx template (will be processed by generate-config.sh)
COPY nginx.conf.template /nginx.conf.template

# Copy our runtime configuration script
COPY generate-config.sh /docker-entrypoint.d/90-generate-config.sh
RUN chmod +x /docker-entrypoint.d/90-generate-config.sh

# Expose the port on which the app will run
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]