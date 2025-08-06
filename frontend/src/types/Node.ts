export class Node {
    id: string;
    leftChild?: Node;
    rightChild?: Node;

    constructor(id: string, leftChild?: Node, rightChild?: Node) {
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