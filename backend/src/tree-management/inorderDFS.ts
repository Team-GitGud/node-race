import { SolveTree } from "./solveTree.ts";
import { Node } from "./node.ts";


export class inorderDFS implements SolveTree {
    cursor = 0;
    /**
     * This generates the order of explored nodes stored in a map with the node id being the key
     * And the order it was explored in being the value.
     * @param root The root of the tree to generate a solution from
     */
    solveTree(root: Node): Map<number, number> {
        let order: Map<number, number> = new Map();
        this.cursor = 0;
        this.treeNavigator(root, order);
        return order;
    }

    /** Explores the tree recursively from the root node, only fully exploring
     * each node when half of their childern have been explored.
     * @param root The root of the tree to explore recursively
     * @param order The map of node ids to order explored 
     */
    private treeNavigator(root: Node, order: Map<number, number>) {
        if (root.leftChild != null) {
            this.treeNavigator(root.leftChild, order);
        }
        order.set(root.id, this.cursor);
        this.cursor++;
        if (root.rightChild != null) {
            this.treeNavigator(root.rightChild, order);
        }

    }
}
