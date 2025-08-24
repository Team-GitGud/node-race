import { Node } from './tree/Node';

export class Question {
    id: number;
    title: string;
    root: Node;
    correctOrder: Map<number, number>;
    answerStatus: boolean | null;

    constructor(id: number, title: string, root: Node, correctOrder: Map<number, number>) {
        this.id = id;
        this.title = title;
        this.root = root;
        this.correctOrder = correctOrder;
        this.answerStatus = null;
    }

    public isCorrect(selectedOrder: Map<number, number>): boolean {
        // Check if both maps have the same size and all key-value pairs match
        if (this.correctOrder.size !== selectedOrder.size) {
            this.answerStatus = false;
            return this.answerStatus;
        }
    
        for (const [key, value] of this.correctOrder) {
            if (selectedOrder.get(key) !== value) {
                this.answerStatus = false;
                return this.answerStatus;
            }
        }
    
        this.answerStatus = true;
        return this.answerStatus;
    }
}