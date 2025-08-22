import { Session } from './Session';
import { Player } from './Player';
import { Question } from './Question';

export class PlayerSession extends Session {
    private player: Player;
    private questions: Array<Question>;

    // In Java, this would look like: Map<String, List<Runnable>>
    // Each event such as "KICK_PLAYER" will have multiple listeners, maybe one from the View and from the Session.
    private eventListeners: Map<string, ((data: any) => void)[]> = new Map();

    public constructor(ws: WebSocket, lobbyCode: string, playerId: string, nickname: string, questions: Array<Question>) {
        super(ws, lobbyCode);
        this.player = new Player(playerId, nickname);
        this.setMessageListener();
        this.questions = questions;
    }

    public getPlayer(): Player {
        return this.player;
    }

    public setMessageListener() {
        try{
            this.ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                switch (data.type) {
                    case "GAME_STARTED":
                        this.handleGameStarted(data.questions);
                        break;
                    case "PLAYER_KICKED":
                        this.handlePlayerKicked(data.reason);
                        break;
                }
            };
        } catch (error) {
            console.error("Error parsing message:", error);
        }
    }

    public handleGameStarted(questions: Question[]) {
        // TODO: Handle game started for Player Session.
        console.log("Game started with questions:", questions);
        this.emitEvent("GAME_STARTED", questions);
    }

    public handlePlayerKicked(reason: string) {
        // TODO: Handle player kicked for Player Session.
        console.log("Player kicked with reason:", reason);
        this.emitEvent("PLAYER_KICKED", reason);
    }

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
            if (index !== -1) { // Exists :)
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
    private emitEvent(event: string, data: any) {
        const runnables = this.eventListeners.get(event);
        if (runnables) {
            runnables.forEach((runnable) => {
                runnable(data);
            });
        }
    public getQuestions(): Array<Question> {
        return this.questions;
    }
}