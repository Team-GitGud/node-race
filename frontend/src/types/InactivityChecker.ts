import router from '@/router';
import APIManager from './APIManager';

export class InactivityChecker {
    private currentTime = 0;
    private inactivityThreshold = 3 * 60 * 1000; // 3 minutes in milliseconds
    private intervalId: ReturnType<typeof setInterval> | null = null;

    /** Call this to start checking for inactivity */
    public start() {
        this.resetTimer();
        if (this.intervalId) clearInterval(this.intervalId);
        this.intervalId = setInterval(() => this.incrementTimer(), 1000);
        // Listen for user activity
        window.addEventListener('mousemove', this.resetTimerBound);
        window.addEventListener('keydown', this.resetTimerBound);
        window.addEventListener('mousedown', this.resetTimerBound);
        window.addEventListener('touchstart', this.resetTimerBound);
    }

    /** Call this to stop checking for inactivity */
    public stop() {
        if (this.intervalId) clearInterval(this.intervalId);
        window.removeEventListener('mousemove', this.resetTimerBound);
        window.removeEventListener('keydown', this.resetTimerBound);
        window.removeEventListener('mousedown', this.resetTimerBound);
        window.removeEventListener('touchstart', this.resetTimerBound);
    }

    /** Resets the inactivity timer */
    public resetTimer() {
        this.currentTime = 0;
    }

    /** Increments the inactivity timer and checks for inactivity */
    private incrementTimer() {
        this.currentTime += 1000;
        if (this.currentTime >= this.inactivityThreshold) {
            this.handleInactivity();
        }
    }

    /** Handles inactivity (leave lobby, cleanup, etc.) */
    private handleInactivity() {
        this.stop();
        // Leave the session if present
        const session = APIManager.getInstance().getSession();
        if (session && typeof (session as any).leaveSession === 'function') {
            (session as any).leaveSession();
        }
        alert('You have been inactive for too long and will be removed from the lobby.');
        router.push('/');
    }

    // Bound version of resetTimer for event listeners
    private resetTimerBound = this.resetTimer.bind(this);
}