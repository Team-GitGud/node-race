#!/bin/bash

set -e

REPO_URL="https://github.com/Team-GitGud/node-race.git"
REPO_DIR="node-race"
BACKEND_CMD="npx ts-node src/app.ts"
PROCESS_MATCH="src/app.ts"

# Stop any previous backend background processes
echo "Checking for existing backend processes..."
EXISTING_PID=$(pgrep -f "$PROCESS_MATCH" || true)
if [ -n "$EXISTING_PID" ]; then
    echo "Stopping previous backend process (PID: $EXISTING_PID)..."
    pkill -f "$PROCESS_MATCH"
    sleep 2
fi

# Ensure required tools are installed
for cmd in git node npm; do
    if ! command -v $cmd &> /dev/null; then
        echo "$cmd not found. Installing..."
        sudo apt-get update
        # For node, install nodejs and npm together
        if [ "$cmd" = "node" ]; then
            sudo apt-get install -y nodejs npm
        else
            sudo apt-get install -y $cmd
        fi
    fi
done

# Clone or update repo
if [ ! -d "$REPO_DIR" ]; then
    git clone "$REPO_URL"
else
    cd "$REPO_DIR"
    git pull
    cd ..
fi

cd "$REPO_DIR/backend"

npm install

# Start backend as a background process
nohup $BACKEND_CMD > backend.log 2>&1 &

echo "Backend started in background."
echo "To manually stop it, run: pkill -f '$PROCESS_MATCH'"
echo "To check running backend processes, run: pgrep -af '$PROCESS_MATCH'"
echo "To view logs: cat node-race/backend/backend.log"