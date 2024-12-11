# Use specific version and lighter base image
FROM node:20-alpine

# Add non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Create app directory and set ownership
WORKDIR /usr/src/app

# Create db directory
RUN mkdir db

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy application code
COPY . .

# Set correct permissions for all directories including db
RUN chown -R appuser:appgroup /usr/src/app

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 5001

# Command to run the application
CMD [ "node", "server.js" ]