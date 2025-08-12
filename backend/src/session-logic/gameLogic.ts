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
            let questionType: string;
            switch (Math.floor(Math.random() * 7 + 0)){
                case 0:
                    solver = new inorderBFS();
                    questionType = "In order Breadth first search";
                case 1:
                    solver = new inorderDFS();
                    questionType = "In order Depth first search";
                case 2:
                    solver = new postorderBFS();
                    questionType = "Post order Breadth first search";
                case 3:
                    solver = new postorderDFS();
                    questionType = "Post order Depth first search";
                case 4:
                    solver = new preorderBFS();
                    questionType = "Pre order Breadth first search";
                case 5:
                    solver = new preorderDFS();
                    questionType = "Pre order Depth first search";
                default:
                    console.log("I did my math wrong");
                    solver = new postorderDFS();
                    questionType = "Post order Depth first search";
            }
            this.questions.push(new Question(tree.root, solver.solveTree(tree.root), questionType)); 
        }



    }

    getQuestionJSON(): string{
        return JSON.stringify(this.questions);;
    }
}