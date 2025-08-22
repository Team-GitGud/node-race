# NodeRace – Backend API Specification

- **REST API:** `https://server/api/v1`
- **WebSocket:** `wss://server/ws/v1`

### Auth Model

Authentication is handled with short-lived tokens:

| Token Type    | Description                      |
| ------------- | -------------------------------- |
| `hostToken`   | Used by the lobby creator (host) |
| `playerToken` | Used by a joining player         |
|               |                                  |

All WebSocket connections must authenticate with their token immediately upon connection using an `AUTH` action.

---
## REST API

### 1. Create a New Lobby

- **Method:** `POST /api/v1/lobby/create`
- **Request Body:** _(Empty)_
- **Response:**
```json
{
  "lobbyCode": "ABCD1",
  "hostToken": "h_sess_a1b2c3d4e5f6"
}
```

- **Notes:**
  - No data is required to create a lobby.
  - `hostToken` is used for WebSocket authentication.
  - `lobbyCode` is shared with other players.

---

### 2. Join a Lobby

- **Method:** `POST /api/v1/lobby/join?name=<username>&lobbyID=<lobbyID>`
- **Request Body:** (Empty) - parameters are passed throught the url
- **Response:**
```json
{
  "playerId": "p_z9y8x7w6",
}
```

- **Errors:**
  - `404 Not Found`: Invalid or expired lobby code.


## WebSocket API

### Connection

- **URL Format:**  
  `wss://server/ws/v1/lobby/create`

- **Expected Workflow:**  
  1. Client opens WebSocket connection to the above URL.  
  2. Client **must** send an `AUTH` message as the **first** message.  
  3. Server validates token:
     - If valid: sends `AUTH_SUCCESS` event containing initial lobby state.
     - If invalid: sends `AUTH_FAILED` event and closes the connection.

---

### AUTH Action

**Client → Server**
```json
{
  "action": "AUTH",
  "token": "h_sess_a1b2c3d4e5f6" // or player token
}
```

**Server → Client (Success)**
```json
{
  "type": "AUTH_SUCCESS",
  "role": "host",
  "lobbyCode": "ABCD1",
  "playerId": "p_host_123",
  "settings": { "algorithm": "all", "treeCount": 5 },
  "players": [
    { "playerId": "p_z9y8x7w6", "username": "PlayerTwo" }
  ]
}
```

**Server → Client (Failure)**
```json
{
  "type": "AUTH_FAILED",
  "reason": "Invalid or expired token."
}
```

**Notes:**
- In Settings, algorithm has three modes in the beginning. [all, dfs, bfs]. It can be set to one of these.
- Clients that fail authentication will have their connection closed immediately after `AUTH_FAILED` is sent.
- Tokens are **single-use**: if the same token is reused in another connection, the server should invalidate both connections to prevent session hijacking.

---

## Client → Server Actions

### Update Settings (host only)

```json
{
  "action": "UPDATE_SETTINGS",
  "hostId": "afdkjd",
  "data": {
    "algorithm": "dfs",
    "treeCount": 5
  }
}
```

---

### Kick Player (host only)

```json
{
  "action": "KICK_PLAYER",
  "hostId": "afdkjd",
  "data": {
    "lobbyId": XADIE
    "playerId": "p_z9y8x7w6"
  }
}
```

---

### Start the game (host only)

```json
{
  "action": "START_GAME",
  "hostID": "afdkjd",
  "data": {
    "lobbyId": "aslksah"
  }
}
```
----
### Get all players (host only)

#### request
```json
{
  "action": "GET_ALL_PLAYERS",
  "hostID": "afdkjd",
  "data": {
    "lobbyId": "aslksah"
  }
}
```
#### response
```json
{
  "type": "ALL_PLAYERS",
  "players": [
        {"id": "adsfsafd", "name": "Donald", "score": "10"}
    ]
}
```

---

## Server → Client Events

### Lobby State (to host) (after AUTH)

```json
{
  "type": "LOBBY_STATE",
  "settings": {
    "algorithm": "all",
    "treeCount": 5
  },
  "players": [
    {
      "playerId": "p_z9y8x7w6",
      "username": "PlayerTwo"
    }
  ]
}
```

---

### Player Joined (to host)

```json
{
  "type": "PLAYER_JOINED",
  "player": {
    "playerId": "p_new_player",
    "username": "PlayerThree"
  }
}
```

---

### Player Left or Kicked (to host)

```json
{
  "type": "PLAYER_LEFT",
  "playerId": "p_z9y8x7w6"
}
```

---

### You Were Kicked (to kicked player)

```json
{
  "type": "PLAYER_KICKED",
  "reason": "Removed by host."
}
```

---

### Settings Updated (to host)

```json
{
  "type": "SETTINGS_UPDATED",
  "settings": {
    "algorithm": "dfs",
    "treeCount": 5
  }
}
```

---

### Game Started (to all players)

```json
{
  "type": "GAME_STARTED",
  "questions": [
    {
      "id": "q1",
      "tree": {
        // Tree data structure here
      },
	  "algorithm": "dfs",
      "traversalOrder": "inorder",
      "timeLimitSeconds": 60
    },
    {
      "id": "q2",
      "tree": {
        // Tree data structure here
      },
      "algorithm": "bfs",
      "traversalOrder": "preorder",
      "timeLimitSeconds": 60
    }
  ]
}
```

---

## Rationale Summary

- **Single-use Tokens:** WebSocket clients authenticate once; tokens aren't reused in each message.
- **No `hostId` or `playerId` in Headers:** Simplifies trust model—identity is derived from the WebSocket connection.
- **202 for Start Game:** Because actual gameplay starts asynchronously.
- **Lobby State Push:** WebSocket clients always get full lobby state on connect—avoids requiring additional HTTP calls.

---

## Notes for Implementation

- In Settings, algorithm has three modes in the beginning. [all, dfs, bfs]. It can be set to one of these.
- Always validate tokens on the backend during WebSocket `AUTH`.
- Maintain mapping from WebSocket connection → authenticated player/host.
- Disconnect clients who do not send `AUTH` within a short timeout (e.g., 3 seconds).
- All timestamps use **ISO 8601**, in **UTC**.

---
