import { SolveTree } from "./solvetree.ts";
import {Node} from "./node.ts";


export class preorderBFS implements SolveTree{
    /**
     * This generates the order of explored nodes stored in a map with the node id being the key
     * And the order it was explored in being the value.
     * @param root The root of the tree to generate a solution from
     */
    solveTree(root: Node): Map<number, number>{
        let order: Map<number, number> = new Map();
        let cursor = 0;
        let nodes: Node[] = [root]; // Using this array like a queue
        while(cursor != nodes.length){
            let current = nodes[cursor];
            order.set(current.id, cursor);
            cursor++;
            if(current.leftChild != null){
                nodes.push(current.leftChild);
            }
            if(current.rightChild != null){
                nodes.push(current.rightChild);
            }
        }
        return order;
    }

}