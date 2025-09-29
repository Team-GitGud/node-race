import { Player } from "./Player";
import { Question } from "./Question";
import { AlertService } from "./AlertService";
import { useRouter } from "vue-router";
import APIManager from "./APIManager";

export class Session {
  ws: WebSocket;
  lobbyCode: string;
  gameOver: boolean;
  protected globalLeaderboard: Array<Player> = [];
  protected lobbyLeaderboard: Array<Player> = [];

  constructor(ws: WebSocket, lobbyCode: string) {
    this.ws = ws;
    this.lobbyCode = lobbyCode;
    this.gameOver = false;
  }

  disconnect(): void {
    if (
      this.ws.readyState === WebSocket.OPEN ||
      this.ws.readyState === WebSocket.CONNECTING
    ) {
      this.ws.close();
    }
  }

  // In Java, this would look like: Map<String, List<Runnable>>
  // Each event such as "KICK_PLAYER" will have multiple listeners, maybe one from the View and from the Session.
  private eventListeners: Map<string, ((data: any) => void)[]> = new Map();

  /**
   *
   * @param event Add the runnable event to the list.
   * @param runnable
   */
  public addEventListener(event: string, runnable: (data: any) => void) {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, []);
    }
    this.eventListeners.get(event)!.push(runnable);
  }

  /**
   * Remove a runnable event from the event list.
   * @param event Remove the runnable event from the list.
   */
  public removeEventListener(event: string, runnable: (data: any) => void) {
    const listener = this.eventListeners.get(event);
    if (listener) {
      // We need to check if the runnable exists first, otherwise it will produce an error.
      const index = listener.indexOf(runnable);
      if (index !== -1) {
        // Exists :)
        listener.splice(index, 1);
      }
    }
  }

  /**
   * This will call all the runnables for the event with the data it was given.
   *
   * For example, if the event is "KICK_PLAYER", and the data is "You were kicked by the host.",
   * all of the runnables for the event will be called with this message.
   *
   * There could be one runnable in the View which will display the message to the user
   * and route them to another page.
   * @param event Event. For example, "KICK_PLAYER", "GAME_STARTED".
   * @param data Data. For example, "You were kicked by the host.", [Question1, Question2, Question3].
   */
  public emitEvent(event: string, data: any) {
    const runnables = this.eventListeners.get(event);
    if (runnables) {
      runnables.forEach((runnable) => {
        runnable(data);
      });
    }
  }

  public getGlobalLeaderboard(): Array<Player> {
    return this.globalLeaderboard.sort((a, b) => b.getScore() - a.getScore());
  }

  public getLobbyLeaderboard(): Array<Player> {
    return this.lobbyLeaderboard.sort((a, b) => b.getScore() - a.getScore());
  }

  public async fetchLeaderboard(): Promise<void> {
    return new Promise((resolve) => {
      const message = JSON.stringify({
        action: "GET_LEADERBOARD",
        data: {
          lobbyId: this.lobbyCode
        },
      });
      console.debug("Sending leaderboard request", message);
      this.ws.send(message);

      // Listen for the leaderboard response event
      const handleLeaderboardResponse = () => {
        this.removeEventListener("LEADERBOARD", handleLeaderboardResponse);
        resolve();
      };

      this.addEventListener("LEADERBOARD", handleLeaderboardResponse);
    });
  }


  public getLobbyCode(): string {
    return this.lobbyCode;
  }

  public getGameOver(): boolean {
    return this.gameOver;
  }

  public setGameOver(gameOver: boolean) {
    this.gameOver = gameOver;
    // Save game over state to localStorage for reconnection logic
    if (gameOver) {
      const apiManager = APIManager.getInstance();
      apiManager.saveGameOverState(true);
    }
  }
}
