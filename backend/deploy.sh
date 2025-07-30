#!/bin/bash

set -e

REPO_URL="https://github.com/Team-GitGud/node-race.git"
REPO_DIR="node-race"
BACKEND_CMD="npx ts-node src/app.ts"
PROCESS_MATCH="src/app.ts"
NGROK_DOMAIN="frank-overly-dane.ngrok-free.app"
NGROK_PORT=3000

# Stop any previous backend background processes
echo "Checking for existing backend processes..."
EXISTING_PID=$(pgrep -f "$PROCESS_MATCH" || true)
if [ -n "$EXISTING_PID" ]; then
    echo "Stopping previous backend process (PID: $EXISTING_PID)..."
    pkill -f "$PROCESS_MATCH"
    sleep 2
fi

# Stop any previous ngrok background processes
echo "Checking for existing ngrok processes..."
NGROK_PID=$(pgrep -f "ngrok http" || true)
if [ -n "$NGROK_PID" ]; then
    echo "Stopping previous ngrok process (PID: $NGROK_PID)..."
    pkill -f "ngrok http"
    sleep 2
fi

# Ensure required tools are installed
for cmd in git node npm ngrok; do
    if ! command -v $cmd &> /dev/null; then
        echo "$cmd not found. Installing..."
        sudo apt-get update
        # For node, install nodejs and npm together
        if [ "$cmd" = "node" ]; then
            sudo apt-get install -y nodejs npm
        elif [ "$cmd" = "ngrok" ]; then
            wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz
            tar -xvf ngrok-v3-stable-linux-amd64.tgz
            sudo mv ngrok /usr/local/bin/
            rm ngrok-v3-stable-linux-amd64.tgz
        else
            sudo apt-get install -y $cmd
        fi
    fi
done

# Ensure ngrok is authenticated
if ! grep -q "authtoken" ~/.config/ngrok/ngrok.yml 2>/dev/null; then
    echo "ngrok is not authenticated. Please enter your ngrok authtoken:"
    read -r NGROK_TOKEN
    ngrok config add-authtoken "$NGROK_TOKEN"
fi

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

# Start ngrok as a background process
nohup ngrok http --url=$NGROK_DOMAIN 3000 > ngrok.log 2>&1 &

echo "Backend started in background."
echo "ngrok tunnel started at https://$NGROK_DOMAIN"
echo "To manually stop backend: pkill -f '$PROCESS_MATCH'"
echo "To manually stop ngrok: pkill -f 'ngrok http'"
echo "To check running backend processes: pgrep -af '$PROCESS_MATCH'"
echo "To check ngrok processes: pgrep -af 'ngrok http'"
echo "To view backend logs: cat node-race/backend/backend.log"
echo "To view ngrok logs: cat node-race/backend/ngrok.log"