import {Node} from "../tree-management/node";


/** Simplie class containing a tree and a solution
 *  Could later be expanded to have a score weighting depending on how scoring works
 */
export class Question{
    solution: { [k: string]: number; }; // Maps dont convert to JSON nicely
    tree: Node;
    questionType: string;

    constructor(root: Node, solution: { [k: string]: number; }, questionType: string){
        this.solution = solution;
        this.tree = root;
        this.questionType = questionType;
    }
}