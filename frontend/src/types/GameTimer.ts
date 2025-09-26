export class GameTimer {
  private totalDuration: number; // Total duration in milliseconds
  private startTime: number;
  private endTime: number;
  private elapsedTime: number; // Time elapsed since start
  private lastAnswerTime: number; // Time since last answer in milliseconds.
  private isRunning: boolean;

  private timer: number | null = null;
  private saveRunnable: () => void = () => undefined;

  public constructor(startTime: number, endTime: number) {
    this.startTime = startTime;
    this.lastAnswerTime = startTime;
    this.endTime = endTime;
    this.totalDuration = endTime - startTime;
    this.elapsedTime = 0;
    this.isRunning = false;
  }

  public start(): void {
    if (this.isRunning) {
      return;
    }
    this.isRunning = true;
    // Immediately update elapsedTime to current time before starting interval
    this.elapsedTime = new Date().getTime() - this.startTime;
    this.timer = setInterval(() => {
      this.elapsedTime = new Date().getTime() - this.startTime;
      this.saveRunnable(); // We save the current time it takes to cache.
    }, 1000);
  }

  public stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    this.isRunning = false;
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

  /** We log the new time, and then calculate the time spent on the last answer. */
  public getLastAnswerTimeAndLogNewTime(): number {
    const timeSinceLastAnswer = new Date().getTime() - this.lastAnswerTime;
    this.lastAnswerTime = new Date().getTime();
    return Math.ceil(timeSinceLastAnswer / 1000);
  }

  /** Serialize timer state for localStorage */
  public toJSON(): any {
    return {
      startTime: this.startTime,
      endTime: this.endTime,
      totalDuration: this.totalDuration,
      elapsedTime: this.elapsedTime,
      isRunning: this.isRunning,
      lastAnswerTime: this.lastAnswerTime
    };
  }

  /** Create GameTimer from serialized data */
  public static fromJSON(data: any): GameTimer {
    const timer = new GameTimer(data.startTime, data.endTime);
    timer.elapsedTime = data.elapsedTime;
    timer.isRunning = data.isRunning;
    timer.lastAnswerTime = data.lastAnswerTime;

    // Restart timer if it was running
    if (timer.isRunning) {
      console.debug("Restarting game timer");
      timer.isRunning = false;
      timer.start();
    }
    
    return timer;
  }
}
