import { SolveTree } from "./solveTree";
import { Node } from "./node";


export class inorderBFS implements SolveTree{
    /**
     * This generates the order of explored nodes stored in a map with the node id being the key
     * And the order it was explored in being the value.
     * @param root The root of the tree to generate a solution from
     */
    solveTree(root: Node): Map<number, number>{
        let order: Map<number, number> = new Map();
        let cursor = 0;
        let layer = 0;
        let marker = new Node();
        let layers: Node[][] = [[root],[],[],[],[],[]]; // Cursed but making it dynamically grow wasn't working
        // Fill the 2dlist of layers
        while(layers[layer].length != 0){
            let current = layers[layer][cursor];
            if (layer + 1 > layers.length) layers.push([]); // Make a new layer if on final layer
            if(current.leftChild != null){
                layers[layer + 1].push(current.leftChild);
            }
            layers[layer + 1].push(marker);
            if(current.rightChild != null){
                layers[layer + 1].push(current.rightChild);
            }
            if (cursor < layers[layer].length-1){
                cursor++;
            } else {
                layer++;
                cursor = 0;
            }

            // empty the layer if its only markers
            let nonMarkerFound = false;
            layers[layer].forEach((node: Node)=>{
                if (node.id != -1) nonMarkerFound = true;
            });
            if (!nonMarkerFound){
                while(layers[layer].length != 0) layers[layer].pop();
            }
        }
        layer--;
        // Explore the 2dlist of layers and flatten it into a 1d list
        let nodes: Node[] = [];
        cursor = 0;
        // I swear there is a method to my madness
        layers.forEach((level: Node[])=>{
            level.reverse();
        });
        while(layers[layer].length != 0){
            let currentLayer = layer;
            let current = layers[layer].pop();
            if (current != undefined){
                let a = new Node();
                a.id = current.id;
                nodes.push(a);
                while (current.id == -1){
                    currentLayer--; // move upwards
                    current = layers[currentLayer].pop();
                    if (current == undefined){
                        current = marker;
                        break;
                    }
                }
                
                order.set(current.id, cursor);
                cursor++;
            } else{
            } 
        }
    

        return order;
    }

}