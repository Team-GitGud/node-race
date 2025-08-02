import { SolveTree } from "./solvetree.ts";
import {Node} from "./node.ts";


export class postorderDFS implements SolveTree{
    cursor = 0;
    /**
     * This generates the order of explored nodes stored in a map with the node id being the key
     * And the order it was explored in being the value.
     * @param root The root of the tree to generate a solution from
     */
    solveTree(root: Node): Map<number, number>{
        let nodes: Node[] = [root]; // Using this array like a stack
        let order: Map<number, number> = new Map();
        this.cursor = 0;

        return order;
    }

    treeNavigator(root: Node, order: Map<number, number>){
        if (root.leftChild != null){
            this.treeNavigator(root.leftChild, order);
        }
        if (root.rightChild != null){
            this.treeNavigator(root.rightChild, order);
        }
        order.set(root.id, this.cursor);
        this.cursor++;
    }
}