export class GameTimer {
    private totalDuration: number; // Total duration in milliseconds
    private startTime: number;
    private endTime: number;
    private elapsedTime: number; // Time elapsed since start

    private timer: number | null = null;
    

    public constructor(startTime: number, endTime: number) {
        this.startTime = startTime;
        this.endTime = endTime;
        this.totalDuration = endTime - startTime;
        this.elapsedTime = 0;
    }

    public start(): void {
        this.elapsedTime = 0;
        this.timer = setInterval(() => {
            this.elapsedTime = new Date().getTime() - this.startTime;
        }, 1000);
    }

    public stop(): void {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
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
}