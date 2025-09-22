import { Question } from "./Question";
import { TreeAdapter } from "./tree/TreeAdapter";

/**
 * The format of the question from the backend is different from
 * the frontend. This is the backend format.
 */
export interface BackendQuestion {
  solution: Record<string, number>;
  tree: any;
  questionType:
    | "Post order Depth first search"
    | "Pre order Depth first search"
    | "In order Depth first search"
    | "Pre order Breadth first search";
}

export class QuestionAdapter {
  static fromBackendQuestions(backendQuestion: BackendQuestion[]): Question[] {
    const questions: Question[] = [];
    for (let i = 0; i < backendQuestion.length; i++) {
      const tree = TreeAdapter.fromBackendTree(backendQuestion[i].tree);

      const solution = new Map<number, number>();
      Object.entries(backendQuestion[i].solution).forEach(([key, value]) => {
        solution.set(Number(key), value);
      });
      const question = new Question(
        i,
        backendQuestion[i].questionType,
        tree,
        solution
      );
      questions.push(question);
    }
    return questions;
  }
  static toBackendAnswer(answer: Map<number, number>): {
    [key: string]: number;
  } {
    console.debug("To Backend", answer);
    const result: { [key: string]: number } = {};

    // Convert Map where key=nodeId, value=order to object where key=order, value=nodeId
    answer.forEach((order, nodeId) => {
      result[nodeId.toString()] = order;
    });

    return result;
  }
}
