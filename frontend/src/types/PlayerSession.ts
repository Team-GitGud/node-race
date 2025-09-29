import { Session } from "./Session";
import { Player, createReactivePlayer } from "./Player";
import { Question } from "./Question";
import { QuestionAdapter, BackendQuestion } from "./QuestionAdapter";
import { InactivityChecker } from "./InactivityChecker";
import APIManager from "./APIManager";
import { GameTimer } from "./GameTimer";

export class PlayerSession extends Session {
  private player: Player;
  private questions: Array<Question>;
  private answers: Array<boolean>;
  private answerTimes: Array<number>;
  private gameTimer: GameTimer | null = null;
  private inactivityChecker: InactivityChecker | null = null;

  public constructor(
    ws: WebSocket,
    lobbyCode: string,
    playerId: string,
    nickname: string,
    questions: Array<BackendQuestion>
  ) {
    super(ws, lobbyCode);
    this.player = createReactivePlayer(playerId, nickname);
    this.questions = QuestionAdapter.fromBackendQuestions(questions);
    this.answers = new Array(questions.length).fill(undefined); // All questions are incorrect by default.
    this.answerTimes = new Array(questions.length).fill(0);

    // Set up event listeners for incoming messages
    this.addEventListener("GAME_STARTED", (data) => {
      this.handleGameStarted(data.questions);
    });

    this.addEventListener("PLAYER_KICKED", (data) => {
      this.handlePlayerKicked(data.reason);
    });

    this.addEventListener("LEADERBOARD", (data) => {
      this.handleLeaderboard(data.leaderboard, data.lobbyLeaderboard);
    });

    this.addEventListener("SCORE", (data) => {
      this.handleScore(data.data.score, data.data.rank);
    });

    this.addEventListener("RANK", (data) => {
      this.handleRank(data.data.rank, data.data.lobbyRank);
    });

    this.addEventListener("GAME_END", (data) => {
      this.handleGameEnd(data);
    });
  }

  public getPlayer(): Player {
    return this.player;
  }

  public handleGameStarted(questions: BackendQuestion[]) {
    this.questions = QuestionAdapter.fromBackendQuestions(questions);

    // Start inactivity checker when game starts
    if (this.inactivityChecker) {
      this.inactivityChecker.stop();
    }
    if (this.gameTimer) {
      this.gameTimer.stop();
    }
    this.gameTimer = new GameTimer(Date.now(), Date.now() + 5 * 60 * 1000);
    this.gameTimer.start();
    this.inactivityChecker = new InactivityChecker();
    this.inactivityChecker.start();
  }

  public handlePlayerKicked(reason: string) {
    console.log("Player kicked with reason:", reason);

    if (this.inactivityChecker) {
      this.inactivityChecker.stop();
      this.inactivityChecker = null;
    }
    this.leaveSession(reason);
  }

  public handleSessionEnded(reason: string) {
    console.log("Session ended with reason:", reason);

    if (this.inactivityChecker) {
      this.inactivityChecker.stop();
      this.inactivityChecker = null;
    }

    // Stop the game timer if it's running
    if (this.gameTimer) {
      this.gameTimer.stop();
    }

    this.leaveSession(reason || "Session closed by host");
  }

  public handleGameEnd(data: any) {
    console.log("Game ended with data:", data);

    // Set game over state
    this.setGameOver(true);

    // Stop the game timer if it's running
    if (this.gameTimer) {
      this.gameTimer.stop();
    }

    // Stop inactivity checker
    if (this.inactivityChecker) {
      this.inactivityChecker.stop();
      this.inactivityChecker = null;
    }

    // Update player's final rank and score
    if (data.rank !== undefined) {
      this.player.setGlobalRank(data.rank);
    }
    if (data.lobbyRank !== undefined) {
      this.player.setLobbyRank(data.lobbyRank);
    }

    // Update answers if provided
    if (data.answer && Array.isArray(data.answer)) {
      this.answers = data.answer;
    }

    // Update leaderboards with final data
    if (data.sessLeaderboard && Array.isArray(data.sessLeaderboard)) {
      this.lobbyLeaderboard = data.sessLeaderboard.map((player: any) => 
        createReactivePlayer(player.rank.toString(), player.name, parseFloat(player.score))
      );
    }

    if (data.globalLeaderoard && Array.isArray(data.globalLeaderoard)) {
      this.globalLeaderboard = data.globalLeaderoard.map((player: any) => 
        createReactivePlayer(player.rank.toString(), player.name, parseFloat(player.score))
      );
    }

    // Emit custom event for game end with all the data
    this.emitEvent("GAME_ENDED", {
      time: data.time,
      numCorrect: data.numCorrect,
      answers: data.answer,
      sessionLeaderboard: data.sessLeaderboard,
      globalLeaderboard: data.globalLeaderoard,
      rank: data.rank,
      lobbyRank: data.lobbyRank
    });
  }

  public handleLeaderboard(
    leaderboard: Array<{
      rank: number;
      name: string;
      score: number;
    }>, 
    lobbyLeaderboard?: Array<{
      rank: number;
      name: string;
      score: number;
    }>
  ) {
    this.globalLeaderboard = leaderboard?.map((player) => {
      console.debug("Global leaderboard", player.name);
      console.debug("Global leaderboard player", player.rank.toString());
      if (player.name === this.player.getNickname()) {
        this.player.setGlobalRank(player.rank);
        this.emitEvent("GLOBAL_RANK_UPDATED", player.rank);
      }

      return createReactivePlayer(player.rank.toString(), player.name, player.score);
    }) ?? [];
    this.lobbyLeaderboard = lobbyLeaderboard?.map((player) => {
      if (player.name === this.player.getNickname()) {
        this.player.setLobbyRank(player.rank);
        this.emitEvent("LOBBY_RANK_UPDATED", player.rank);
      }
      return createReactivePlayer(player.rank.toString(), player.name, player.score);
    }) ?? [];
  }

  public getQuestions(): Array<Question> {
    return this.questions;
  }

  public getAnswers(): Array<boolean> {
    return this.answers;
  }

  public addAnswer(questionIndex: number, answer: boolean) {
    this.answers[questionIndex] = answer;
    console.log("Answers changed", this.answers);
    this.saveState(); // Save to localStorage when answers change
  }

  private onLeaveCallback?: (reason: string) => void;

  public setOnLeaveCallback(callback: () => void) {
    this.onLeaveCallback = callback;
  }
  /**
   * Leaves the session: disconnects the WebSocket and cleans up.
   * TODO: Send a message to the backend to notify leaving the lobby.
   */
  public leaveSession(reason?: string) {
    // TODO: Send a "LEAVE_LOBBY" message to the backend if needed
    // Example: this.ws.send(JSON.stringify({ type: "LEAVE_LOBBY" }));

    if (this.inactivityChecker) {
      this.inactivityChecker.stop();
      this.inactivityChecker = null;
    }

    this.ws.send(JSON.stringify({
      action: "PLAYER_LEAVE",
      data: { 
        playerId: this.player.getId(),
        lobbyId: this.lobbyCode,
      }
    }));

    // Disconnect the WebSocket
    this.disconnect();

    // Optionally, clean up session in APIManager
    APIManager.getInstance().clearSession();

    if (this.onLeaveCallback && reason) {
      this.onLeaveCallback(reason);
    }
  }

  public setGameTimer(gameTimer: GameTimer) {
    this.gameTimer = gameTimer;
    this.saveState(); // Save to localStorage when timer is set
    this.gameTimer.setSaveRunnable(() => this.saveState());
  }

  public getGameTimer(): GameTimer | null {
    return this.gameTimer;
  }

  public sendAnswer(
    questionIndex: number,
    answer: { [key: string]: number }
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const message = JSON.stringify({
        action: "SUBMIT_ANSWER",
        playerId: this.player.getId(),
        data: {
          lobbyId: this.lobbyCode,
          answer: answer,
          questionNumber: questionIndex,
        },
      });
      console.log(answer);
      this.ws.send(message);
      resolve(true);
    });
  }

  public setAnswers(answers: Array<boolean>) {
    this.answers = answers;
  }

  public setAnswerTime(answerTimes: Array<number>) {
    this.answerTimes = answerTimes;
  }

  public setAnswerTimes(questionIndex: number, time: number) {
    if (this.answerTimes[questionIndex] !== undefined && this.answerTimes[questionIndex] !== 0 && this.answerTimes[questionIndex] !== null) return;
    this.answerTimes[questionIndex] = time;
  }

  public getAnswerTimes(questionIndex: number): number {
    return this.answerTimes[questionIndex];
  }

  public getPlayerId(): string {
    return this.player.getId();
  }

  public getPlayerName(): string {
    return this.player.getNickname();
  }

  /** Save session state to localStorage (call this when gameTimer or answers change) */
  public saveState() {
    const sessionData = {
      lobbyCode: this.lobbyCode,
      playerId: this.player.getId(),
      playerName: this.player.getNickname(),
      gameTimer: this.gameTimer ? this.gameTimer.toJSON() : null,
      answers: [...this.answers],
      answerTimes: [...this.answerTimes]
    };
    
    APIManager.getInstance().updatePlayerSessionData(sessionData);
  }

  public async fetchScore(): Promise<void> {
    return new Promise((resolve) => {
      const message = JSON.stringify({
        action: "GET_SCORE",
        playerId: this.player.getId(),
        data: {
          lobbyId: this.lobbyCode
          },
        });
        console.debug("Sending score request", message);
        this.ws.send(message);
        resolve();
      });
  }

  public async fetchRank(): Promise<void> {
    return new Promise((resolve) => {
      const message = JSON.stringify({
        action: "GET_RANK",
        playerId: this.player.getId(),
        data: {
          lobbyId: this.lobbyCode,
          },
        });
        console.debug("Sending rank request", message);
        this.ws.send(message);
        resolve();
      });
  }

  public handleRank(rank: number, lobbyRank: number) {
    this.player.setLobbyRank(lobbyRank);
    this.player.setGlobalRank(rank);
    // Emit a custom event for rank updates
    this.emitEvent("RANK_UPDATED", { rank, lobbyRank });
  }

  public handleScore(score: number, rank: number) {
    this.player.setScore(score);
    this.player.setLobbyRank(rank);
    // Emit a custom event for score updates
    this.emitEvent("SCORE_UPDATED", { score, rank });
  }

  public getGlobalLeaderboard(): Array<Player> {
    return this.globalLeaderboard;
  }

  public getLobbyLeaderboard(): Array<Player> {
    return this.lobbyLeaderboard;
  }
}
