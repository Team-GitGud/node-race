import { setTimeout } from "node:timers";
import { Lobby } from "./lobby";

export class Timer {
    private startTimeStamp: number | null = null;
    private endTimeStamp: number | null = null;
    fiveMin: number = 300000;

    /**
     * @returns The time in seconds since the timer started.
     */
    getTime(): number {
        if (this.startTimeStamp === null) { return 0; }
        if (this.endTimeStamp !== null) {
            return (this.endTimeStamp - this.startTimeStamp) / 1000;
        }
        return (Date.now() - this.startTimeStamp) / 1000;
    }

    /** Starts the timer. */
    start(callback: () => void, lobby: Lobby): void {
        this.startTimeStamp = Date.now();
        this.endTimeStamp = null;

        setTimeout(() => {
            console.log("timer triggered");
            callback.call(lobby);
        }, this.fiveMin);
    }

    /** Stops the timer. */
    stop(): void {
        if (this.startTimeStamp === null) {
            throw new Error("Timer has not been started.");
        }
        this.endTimeStamp = Date.now();
    }
}
