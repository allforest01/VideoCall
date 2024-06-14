# Use the official Node.js image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Clean npm cache and install dependencies
RUN npm cache clean --force && npm install

# Copy the rest of the application code
COPY . .

# Copy SSL certificates
COPY ./certs /app/certs

# Expose the port the app runs on
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
