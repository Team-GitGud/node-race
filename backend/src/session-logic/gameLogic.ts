import { Question } from "./question";
export class GameLogic{
    questions: Question[] = [];

    generateQuestions(): void{

    }

    getQuestionString(): string{
        return JSON.stringify(this.questions);;
    }
}