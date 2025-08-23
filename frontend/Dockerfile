# build stage
FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage

# Minimal fix: Create cache directories and use port 8080
RUN mkdir -p /var/cache/nginx/client_temp && \
    chmod 777 /var/cache/nginx && \
    sed -i 's/listen       80;/listen       8080;/' /etc/nginx/conf.d/default.conf && \
    sed -i 's/listen  \[::]:80;/listen  [::]:8080;/' /etc/nginx/conf.d/default.conf

COPY --from=build-stage /app/dist /usr/share/nginx/html

# Add health check endpoint
RUN echo '{"status":"ok","service":"frontend"}' > /usr/share/nginx/html/health
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]