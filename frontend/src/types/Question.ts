import { Node } from './Node';

export class Question {
    id: string;
    title: string;
    root: Node;
    correctOrder: Record<string, number>;
    answerStatus: boolean | null;

    constructor(id: string, title: string, root: Node, correctOrder: Record<string, number>) {
        this.id = id;
        this.title = title;
        this.root = root;
        this.correctOrder = correctOrder;
        this.answerStatus = null;
    }

    isCorrect(selectedOrder: Record<string, number>): boolean {
        const keys1 = Object.keys(this.correctOrder);
        const keys2 = Object.keys(selectedOrder);

        if (keys1.length !== keys2.length) { 
            this.answerStatus = false;
            return this.answerStatus; 
        }

        for (const key of keys1) {
            if (this.correctOrder[key] !== selectedOrder[key]) {
                this.answerStatus = false;
                return this.answerStatus; 
            }
        }
        this.answerStatus = true;
        return this.answerStatus; 
    }
}