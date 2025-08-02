import { SolveTree } from "./solvetree.ts";
import {Node} from "./node.ts";


export class preorderDFS implements SolveTree{
    
    /**
     * This generates the order of explored nodes stored in a map with the node id being the key
     * And the order it was explored in being the value.
     * @param root The root of the tree to generate a solution from
     */
    solveTree(root: Node): Map<number, number>{
        let nodes: Node[] = [root]; // Using this array like a stack
        let order: Map<number, number> = new Map();
        let cursor = 0;
        while (nodes.length != 0){
            let current = nodes.pop();
            if (current != undefined){
            order.set(current.id, cursor);
            cursor++;
            if (current.rightChild != null){
                nodes.push(current.rightChild)
            }
            if (current.leftChild != null){
                nodes.push(current.leftChild)
            }
            } else {
                throw new Error("Root node should not be null.");
            }

        }
        return order;
    }
}