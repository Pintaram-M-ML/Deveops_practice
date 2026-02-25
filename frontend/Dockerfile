FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application files
COPY index.html ./
COPY styles.css ./
COPY script.js ./
COPY server.js ./

# Expose port
EXPOSE 8080

# Start the server
CMD ["npm", "start"]

