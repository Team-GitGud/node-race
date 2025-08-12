import { Question } from "./question";
import { Tree } from "../tree-management/tree";
import { SolveTree } from "../tree-management/solvetree";
import { inorderBFS } from "../tree-management/inorderBFS";
import { inorderDFS } from "../tree-management/inorderDFS";
import { postorderBFS } from "../tree-management/postorderBFS";
import { postorderDFS } from "../tree-management/postorderDFS";
import { preorderBFS } from "../tree-management/preorderBFS";
import { preorderDFS } from "../tree-management/preorderDFS";
export class GameLogic{
    questions: Question[] = [];
    numberNormalQuestions = 4;
    numberDifficultQuestions = 1;
    difficultMaxDepth = 5;
    generateQuestions(): void{

        // Generate questions randomly
        for (let i = 0; i < this.numberNormalQuestions; i++) {
            let tree = new Tree();
            let solver: SolveTree;
            let questionType: string;
            switch (Math.floor(Math.random() * 6)){
                case 0:
                    solver = new inorderBFS();
                    questionType = "In order Breadth first search";
                    break;
                case 1:
                    solver = new inorderDFS();
                    questionType = "In order Depth first search";
                    break;
                case 2:
                    solver = new postorderBFS();
                    questionType = "Post order Breadth first search";
                    break;
                case 3:
                    solver = new postorderDFS();
                    questionType = "Post order Depth first search";
                    break;
                case 4:
                    solver = new preorderBFS();
                    questionType = "Pre order Breadth first search";
                    break;
                case 5:
                    solver = new preorderDFS();
                    questionType = "Pre order Depth first search";
                    break;
                default:

                    console.log("I did my math wrong");
                    solver = new postorderDFS();
                    questionType = "Post order Depth first search";
            }
            this.questions.push(new Question(tree.root, Object.fromEntries(solver.solveTree(tree.root)), questionType)); 
        }

        // Make difficult questions with a chance at larger trees
        for (let i = 0; i < this.numberDifficultQuestions; i++) {
            let tree = new Tree();
            tree.maxDepth = this.difficultMaxDepth;
            tree.root = tree.generateTree();
            let solver: SolveTree;
            let questionType: string;
            switch (Math.floor(Math.random() *6)){
                case 0:
                    solver = new inorderBFS();
                    questionType = "In order Breadth first search";
                    break;
                case 1:
                    solver = new inorderDFS();
                    questionType = "In order Depth first search";
                    break;
                case 2:
                    solver = new postorderBFS();
                    questionType = "Post order Breadth first search";
                    break;
                case 3:
                    solver = new postorderDFS();
                    questionType = "Post order Depth first search";
                    break;
                case 4:
                    solver = new preorderBFS();
                    questionType = "Pre order Breadth first search";
                    break;
                case 5:
                    solver = new preorderDFS();
                    questionType = "Pre order Depth first search";
                    break;
                default:
                    console.log("I did my math wrong");
                    solver = new postorderDFS();
                    questionType = "Post order Depth first search";
            }
            this.questions.push(new Question(tree.root, Object.fromEntries(solver.solveTree(tree.root)), questionType)); 
        }



    }

    getQuestionJSON(): string{
        return JSON.stringify(this.questions);;
    }
}