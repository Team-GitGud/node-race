# Build stage
FROM node:18-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage - serve with simple HTTP server
FROM node:18-alpine as production-stage

# Create non-root user for security
RUN addgroup -g 1001 -S noderace && \
    adduser -S noderace -G noderace -u 1001

# Install a simple HTTP server
RUN npm install -g http-server

# Copy built application
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Change ownership
RUN chown -R noderace:noderace /usr/share/nginx/html

# Switch to non-root user
USER noderace

# Expose port 80
EXPOSE 80

# Serve the built Vue.js app
CMD ["http-server", "/usr/share/nginx/html", "-p", "80", "--cors"]