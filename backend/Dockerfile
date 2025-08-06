# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Set working directory inside container
WORKDIR /usr/app

# Copy package files for dependency installation
COPY package*.json ./

# Install dependencies (will create proper Linux symlinks)
RUN npm install

# Copy source code
COPY . .

# Create non-root user for security
RUN addgroup -g 1001 -S noderace && \
    adduser -S noderace -G noderace -u 1001

# Change ownership of app directory
RUN chown -R noderace:noderace /usr/app

# Switch to non-root user
USER noderace

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application in development mode
CMD ["npx", "ts-node", "src/app.ts"]