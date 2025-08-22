import { Question } from "./Question";
import { TreeAdapter } from "./tree/TreeAdapter";

/**
 * The format of the question from the backend is different from
 * the frontend. This is the backend format.
 */
interface BackendQuestion {
    solution: Map<string, number>;
    tree: any; // Will turn into a Tree object.
    questionType: "Post order Depth first search" | 
    "Pre order Depth first search" | 
    "In order Depth first search";
}

export class QuestionAdapter {
    static fromBackendQuestions(backendQuestion: BackendQuestion[]): Question[] {
        const questions: Question[] = [];
        for (let i = 0; i < backendQuestion.length; i++) {
            const tree = TreeAdapter.fromBackendTree(backendQuestion[i].tree);

            const solution = new Map<number, number>();
            for (const [key, value] of backendQuestion[i].solution) {
                solution.set(Number(key), value);
            }

            const question = new Question(
                i.toString(),
                backendQuestion[i].questionType,
                tree,
                solution
            );
            questions.push(question);
        }
        return questions;
    }
    
}

