import { Question } from "./Question";
import { TreeAdapter } from "./tree/TreeAdapter";

/**
 * The format of the question from the backend is different from
 * the frontend. This is the backend format.
 */
interface BackendQuestion {
    solution: Record<string, number>;
    tree: any;
    questionType: "Post order Depth first search" | 
                 "Pre order Depth first search" | 
                 "In order Depth first search" |
                 "Pre order Breadth first search";
}

export class QuestionAdapter {
    static fromBackendQuestions(backendQuestion: BackendQuestion[]): Question[] {
        const questions: Question[] = [];
        for (let i = 0; i < backendQuestion.length; i++) {
            const tree = TreeAdapter.fromBackendTree(backendQuestion[i].tree);

            const solution = new Map<number, number>();
            for (const [key, value] of Object.entries(backendQuestion[i].solution)) {
                if (value !== undefined) {
                    solution.set(Number(key), value);
                }
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

