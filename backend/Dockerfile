# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Run
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/package*.json ./
RUN npm install --only=production
COPY --from=builder /app/dist ./dist

RUN mkdir -p ./src/data-access
COPY --from=builder /app/src/data-access/data.json ./src/data-access/data.json
EXPOSE 3000
CMD ["node", "dist/app.js"]