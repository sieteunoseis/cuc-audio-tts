# Dockerfile for Express Backend
FROM node:latest

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 5001

RUN mkdir /db

# Command to run the application
CMD [ "node", "server.js" ]