export class GameTimer {
  private totalDuration: number; // Total duration in milliseconds
  private startTime: number;
  private endTime: number;
  private elapsedTime: number; // Time elapsed since start
  private isRunning: boolean;

  private timer: number | null = null;
  private saveRunnable: () => void = () => undefined;

  public constructor(startTime: number, endTime: number) {
    this.startTime = startTime;
    this.endTime = endTime;
    this.totalDuration = endTime - startTime;
    this.elapsedTime = 0;
    this.isRunning = false;
  }

  public start(): void {
    if (this.isRunning) {
      return;
    }
    console.log("Starting game timer");
    this.isRunning = true;
    this.elapsedTime = this.elapsedTime !== 0 ? this.elapsedTime : 0;
    this.timer = setInterval(() => {
      this.elapsedTime = new Date().getTime() - this.startTime;
      this.saveRunnable();
    }, 1000);
  }

  public stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  public setSaveRunnable(runnable: () => void): void {
    this.saveRunnable = runnable;
  }

  public getTimeLeft(): number {
    // Return remaining seconds, counting down from total duration
    const remainingMs = Math.max(0, this.totalDuration - this.elapsedTime);
    return Math.ceil(remainingMs / 1000);
  }

  public getTotalDuration(): number {
    // Return total duration in seconds
    return Math.ceil(this.totalDuration / 1000);
  }

  public getElapsedTime(): number {
    // Return elapsed time in seconds
    return Math.ceil(this.elapsedTime / 1000);
  }

  /** Serialize timer state for localStorage */
  public toJSON(): any {
    return {
      startTime: this.startTime,
      endTime: this.endTime,
      totalDuration: this.totalDuration,
      elapsedTime: this.elapsedTime,
      isRunning: this.isRunning
    };
  }

  /** Create GameTimer from serialized data */
  public static fromJSON(data: any): GameTimer {
    const timer = new GameTimer(data.startTime, data.endTime);
    timer.elapsedTime = data.elapsedTime;
    timer.isRunning = data.isRunning;
    
    // Restart timer if it was running
    if (timer.isRunning) {
      console.log("Restarting game timer");
      timer.isRunning = false;
      timer.start();
    }
    
    return timer;
  }
}
