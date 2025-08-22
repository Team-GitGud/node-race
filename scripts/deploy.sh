#!/bin/bash

# NodeRace Automated Deployment Script for TrueNAS Scale
# This script handles git updates, Docker builds, and container management

set -e  # Exit on any error

# Configuration
PROJECT_DIR="/mnt/GreenVault/NodeRace"
BACKEND_IMAGE="noderace-backend"
FRONTEND_IMAGE="noderace-frontend"
LOG_FILE="/var/log/noderace-deploy.log"

# Logging function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Function to check if container is running
is_container_running() {
    docker ps --format "table {{.Names}}" | grep -q "$1"
}

# Function to stop and remove container if exists
cleanup_container() {
    local container_name="$1"
    if docker ps -a --format "table {{.Names}}" | grep -q "$container_name"; then
        log "Stopping and removing existing container: $container_name"
        docker stop "$container_name" || true
        docker rm "$container_name" || true
    fi
}

# Main deployment function
deploy() {
    log "Starting NodeRace deployment..."
    
    # Navigate to project directory
    cd "$PROJECT_DIR"
    
    # 1. Git Update
    log "Updating code from git..."
    git fetch origin
    
    # Check if there are updates
    LOCAL=$(git rev-parse HEAD)
    REMOTE=$(git rev-parse origin/main)
    
    if [ "$LOCAL" = "$REMOTE" ]; then
        log "No updates available. Deployment skipped."
        return 0
    fi
    
    log "Updates found. Pulling latest changes..."
    git config pull.rebase false  # Use merge strategy
    git pull origin main
    
    # 2. Backend Deployment
    log "Building backend Docker image..."
    cd "$PROJECT_DIR/backend"
    
    # Build new backend image
    docker build -t "$BACKEND_IMAGE:latest" .
    
    # Stop existing backend container
    cleanup_container "noderace-backend"
    
    # Start new backend container
    log "Starting new backend container..."
    docker run -d \
        --name noderace-backend \
        --restart unless-stopped \
        -p 3000:3000 \
        "$BACKEND_IMAGE:latest"
    
    # 3. Frontend Deployment
    log "Building frontend Docker image..."
    cd "$PROJECT_DIR/frontend"
    
    # Build new frontend image
    docker build -t "$FRONTEND_IMAGE:latest" .
    
    # Stop existing frontend container
    cleanup_container "noderace-frontend"
    
    # Start new frontend container
    log "Starting new frontend container..."
    docker run -d \
        --name noderace-frontend \
        --restart unless-stopped \
        -p 8080:80 \
        "$FRONTEND_IMAGE:latest"
    
    # 4. Health Check
    log "Performing health checks..."
    sleep 10
    
    # Check backend health
    if is_container_running "noderace-backend"; then
        log "✅ Backend container is running"
    else
        log "❌ Backend container failed to start"
        docker logs noderace-backend
        exit 1
    fi
    
    # Check frontend health
    if is_container_running "noderace-frontend"; then
        log "✅ Frontend container is running"
    else
        log "❌ Frontend container failed to start"
        docker logs noderace-frontend
        exit 1
    fi
    
    # 5. Cleanup old images
    log "Cleaning up old Docker images..."
    docker image prune -f
    
    log "🎉 Deployment completed successfully!"
    log "Backend: http://localhost:3000"
    log "Frontend: http://localhost:8080"
    log "Live URLs: https://api.noderace.online and https://noderace.online"
}

# Run deployment
deploy
