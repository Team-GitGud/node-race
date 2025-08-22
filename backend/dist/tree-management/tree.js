"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tree = void 0;
const node_1 = require("./node");
/**
 * Class used to generate a tree and store the root node.
 * This uses a random number generator function stored the random property
 * with the signature @type {() => number}.
 */
class Tree {
    constructor() {
        this.maxDepth = 2; // For now this is not based on constructor args.
        this.maxWidth = 2;
        this.random = () => Math.random();
        this.root = this.generateTree();
    }
    /**
     * Generates a tree using the values from the random function property.
     * Each layer has a lower chance of generating a node
     * @returns The root node of the generated tree.
     */
    generateTree() {
        let depth = 0;
        let activeNodes = [];
        let queuedNodes = [new node_1.Node];
        let root = queuedNodes[0];
        let id = 0;
        for (let i = 0; i <= this.maxDepth; i++) {
            let popped; // I miss java this could of been 3 lines
            do {
                popped = queuedNodes.pop();
                if (popped != undefined) {
                    activeNodes.push(popped);
                }
            } while (popped != undefined);
            activeNodes.reverse();
            // Generating children nodes for the current nodes in the active layer
            activeNodes.forEach((node) => {
                node.id = id;
                id++;
                if (i != this.maxDepth && this.random() < (1.0 / (i + 1))) {
                    node.leftChild = new node_1.Node;
                    queuedNodes.push(node.leftChild);
                }
                if (i != this.maxDepth && this.random() < (1.0 / (i + 1))) {
                    node.rightChild = new node_1.Node;
                    queuedNodes.push(node.rightChild);
                }
            });
            // empty active nodes
            while (activeNodes.length > 0) {
                activeNodes.pop();
            }
        }
        return root;
    }
}
exports.Tree = Tree;
