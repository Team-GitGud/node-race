import { Node } from "./Node";

export class Tree {
    root: Node;

    constructor(root: Node) {
        this.root = root;
    }

    public getRoot(): Node {
        return this.root;
    }

    public setRoot(root: Node) {
        this.root = root;
    }
}