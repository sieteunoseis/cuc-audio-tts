# Step 1: Build the Frontend
FROM node:latest AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Vite app
RUN npm run build

# Set runtime environment variables
ENV VITE_BACKEND_PORT=${VITE_BACKEND_PORT}
ENV VITE_ELEVENLABS_API_KEY=${VITE_ELEVENLABS_API_KEY}
ENV VITE_BRANDING_URL=${VITE_BRANDING_URL}
ENV VITE_BRANDING_NAME=${VITE_BRANDING_NAME}

# Step 2: Serve the application using Nginx
FROM nginx:alpine

# Copy the built files from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# # Copy the custom Nginx config file (you can create a `nginx.conf` file in the same directory)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose the port on which the app will run
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]