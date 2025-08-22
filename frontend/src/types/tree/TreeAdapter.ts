import { Node } from "./Node"
import { Tree } from "./Tree"

interface BackendTree {
    id: number;
    leftChild: BackendTree | null;
    rightChild: BackendTree | null;
}

export class TreeAdapter {

    /**
     * Convert backend tree format to frontend Node class
     * This creates a Node tree structure that Question.ts can use
     * @param backendTree - The backend tree to convert
     * @returns The Node object
     */
    static fromBackendTree(backendTree: BackendTree ): Node{
        return this.buildNodeFromBackend(backendTree);
    }

    /**
     * Recursively build Node objects from backend tree data
     * @param backendNode - The backend tree node to build a Node from
     * @returns The Node object
     */
        private static buildNodeFromBackend(backendNode: BackendTree): Node {
            const leftChild = backendNode.leftChild ? this.buildNodeFromBackend(backendNode.leftChild) : null ;
            const rightChild = backendNode.rightChild ? this.buildNodeFromBackend(backendNode.rightChild) : null ;
            return new Node(backendNode.id, leftChild, rightChild);
        }
}