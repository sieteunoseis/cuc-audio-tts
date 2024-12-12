# Use specific version and lighter base image
FROM node:20-alpine

# Add non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Install ffmpeg using Alpine package manager
RUN apk add --no-cache ffmpeg

# Create app directory and set ownership
WORKDIR /usr/src/app

# Create db directory and set permissions explicitly
RUN mkdir -p /usr/src/app/db && \
    mkdir -p /usr/src/app/data && \
    chmod 755 /usr/src/app/db && \
    chmod 755 /usr/src/app/data

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy application code
COPY . .

# Set correct permissions for all directories and files
RUN chown -R appuser:appgroup /usr/src/app && \
    chmod -R 755 /usr/src/app/db && \
    chmod -R 755 /usr/src/app/data

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 5000

# Command to run the application
CMD [ "node", "server.js" ]