import {Node} from "../tree-management/node";


/** Simplie class containing a tree and a solution
 *  Could later be expanded to have a score weighting depending on how scoring works
 */
export class Question{
    solution: Map<number, number>;
    tree: Node;

    constructor(root: Node, solution: Map<number, number>){
        this.solution = solution;
        this.tree = root;
    }
}