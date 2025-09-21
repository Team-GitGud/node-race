import { Session } from "./Session";
import { Player } from "./Player";
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
    this.player = new Player(playerId, nickname);
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
      this.handleLeaderboard(data.leaderboard);
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

  public handleLeaderboard(
    leaderboard: Array<{
      rank: number;
      name: string;
      score: number;
    }>
  ) {
    console.log("Received leaderboard", leaderboard);
    this.leaderboard = leaderboard.map((player) => {
      return new Player(player.rank.toString(), player.name, player.score);
    });
    console.log("Leaderboard", this.leaderboard);
  }

  public getQuestions(): Array<Question> {
    return this.questions;
  }

  public getAnswers(): Array<boolean> {
    return this.answers;
  }

  public addAnswer(questionIndex: number, answer: boolean) {
    this.answers[questionIndex] = answer;
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
  public leaveSession(reason: string) {
    // TODO: Send a "LEAVE_LOBBY" message to the backend if needed
    // Example: this.ws.send(JSON.stringify({ type: "LEAVE_LOBBY" }));

    if (this.inactivityChecker) {
      this.inactivityChecker.stop();
      this.inactivityChecker = null;
    }

    // Disconnect the WebSocket
    this.disconnect();

    // Optionally, clean up session in APIManager
    APIManager.getInstance().clearSession();

    if (this.onLeaveCallback) {
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

  public setAnswerTimes(questionIndex: number, time: number) {
    if (this.answerTimes[questionIndex] !== undefined) return;

    this.answerTimes[questionIndex] = time;
  }
  public setAnswers(answers: Array<boolean>) {
    this.answers = answers;
  }

  public setAnswerTime(answerTimes: Array<number>) {
    this.answerTimes = answerTimes;
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
}
