import {Node} from "./node.ts";

/**
 * Class used to generate a tree and store the root node. 
 * This uses a random number generator function stored the random property
 * with the signature @type {() => number}. 
 */
export class Tree{
    root: Node;
    maxDepth: number;
    maxWidth: number;
    random: () => number; // Allows overwriting for deterministic testing

    constructor(){
        this.maxDepth = 2; // For now this is not based on constructor args.
        this.maxWidth = 2; 
        this.root = this.generateTree();
        this.random =  () =>{return Math.random();}
    }

    /**
     * Generates a tree using the values from the random function property.
     * Each layer has a lower chance of generating a node
     * @returns The root node of the generated tree.
     */
    generateTree(): Node{
        let depth = 0;
        let activeNodes: Node[] = [];
        let queuedNodes: Node[] = [new Node];
        let root = queuedNodes[0];
        let id: number = 0;
        for (let i = 0; i< this.maxDepth; i++){
            let popped: Node | undefined; // I miss java this could of been 3 lines
            do {
                popped = queuedNodes.pop();
                if (popped != undefined){
                    activeNodes.push(popped);
                }
                
            } while (popped != undefined);

            // Generating children nodes for the current nodes in the active layer
            activeNodes.forEach((node: Node) =>{
                node.id = id;
                id++;
                if (this.random() < (1.0/(i+1))) {
                    node.leftChild = new Node;
                    queuedNodes.push(node.leftChild);
                }
                if (this.random() < (1.0/(i+1))) {
                    node.rightChild = new Node;
                    queuedNodes.push(node.rightChild);
                }

            })
            
            // empty active nodes
            while (activeNodes.length > 0){
                activeNodes.pop();
            }

        }
        return root;
    }

}