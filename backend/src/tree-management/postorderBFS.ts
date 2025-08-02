import { SolveTree } from "./solvetree.ts";
import {Node} from "./node.ts";


export class postorderBFS implements SolveTree{
    /**
     * This generates the order of explored nodes stored in a map with the node id being the key
     * And the order it was explored in being the value.
     * @param root The root of the tree to generate a solution from
     */
    solveTree(root: Node): Map<number, number>{
        let order: Map<number, number> = new Map();
        let cursor = 0;
        let layer = 0;
        let layers: Node[][] = [[root],[],[],[]];
        // Fill the 2dlist of layers
        while(layers[layer].length != 0){
            let current = layers[layer][cursor];
            if (layer + 1 > layers.length) layers.push([]); // Make a new layer if on final layer
            if(current.leftChild != null){
                layers[layer + 1].push(current.leftChild);
            }
            if(current.rightChild != null){
                layers[layer + 1].push(current.rightChild);
            }
            if (cursor < layers[layer].length-1){
                cursor++;
            } else {
                layer++;
                cursor = 0;
            }
        }

        // Explore the 2dlist of layers in post order BFS
        cursor = 0;
        layers.reverse();
        layers.forEach((level: Node[],) =>{
            level.forEach((node: Node) => {
                order.set(node.id, cursor);
                cursor++;
            });
        });
        return order;
    }

}