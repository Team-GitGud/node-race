export class Node {
    id: number;
    leftChild: Node | null;
    rightChild: Node | null;

    constructor(id: number, leftChild: Node | null, rightChild: Node | null) {
        this.id = id;
        this.leftChild = leftChild;
        this.rightChild = rightChild;
    }

    getAllNodes(): Node[] {
        const nodes: Node[] = [this];
        if (this.leftChild) {
            nodes.push(...this.leftChild.getAllNodes());
        }
        if (this.rightChild) {
            nodes.push(...this.rightChild.getAllNodes());
        }
        return nodes;
    }
}