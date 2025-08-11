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
    generateQuestions(): void{

        // Generate questions randomly
        for (let i = 0; i < this.numberNormalQuestions; i++) {
            let tree = new Tree();
            let solver: SolveTree;
            switch (Math.floor(Math.random() * 7 + 0)){
                case 0:
                    solver = new inorderBFS();
                case 1:
                    solver = new inorderDFS();
                case 2:
                    solver = new postorderBFS();
                case 3:
                    solver = new postorderDFS();
                case 4:
                    solver = new preorderBFS();
                case 5:
                    solver = new preorderDFS();
                default:
                    console.log("I did my math wrong");
                    solver = new postorderDFS();
            }
            this.questions.push(new Question(tree.root, solver.solveTree(tree.root))); 
        }


    }

    getQuestionJSON(): string{
        return JSON.stringify(this.questions);;
    }
}