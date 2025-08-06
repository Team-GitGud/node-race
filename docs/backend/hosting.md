# Hosting the Backend

To deploy and start the backend server, simply run the following command from your home directory or anywhere on your system:

```bash
curl -O https://raw.githubusercontent.com/Team-GitGud/node-race/main/backend/deploy.sh
bash deploy.sh
```

This will:

- Download the deploy script.
- Stop any existing backend processes.
- Install required dependencies.
- Clone or update the repository.
- Start the backend and ngrok as a background processes.

## Useful Commands

- **Stop the backend:**  
  ```bash
  pkill -f "src/app.ts"
  ```

- **Stop ngrok:**  
  ```bash
  pkill -f "ngrok http"
  ```

- **Check running backend processes:**  
  ```bash
  pgrep -af "src/app.ts"
  ```

- **View backend logs:**  
  ```bash
  cat /node-race/backend/backend.log
  ```

- **View ngrok logs:**  
  ```bash
  cat ~/node-race/backend/ngrok.log
  ```

> The backend will be accessible at:
> - `http://0.0.0.0:3000/health`.
> - `https://frank-overly-dane.ngrok-free.app/health`