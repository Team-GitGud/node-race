import { describe, it, expect } from "vitest";
import {Tree} from "../src/tree-management/tree";
import {Node} from "../src/tree-management/node";
import {preorderDFS} from "../src/tree-management/preorderDFS";
describe("Tree generation", () => {
    it("Tree should generate on instantiation of type", () => {
        let generator = new Tree;
        expect(generator.root).toBeInstanceOf(Node);
    });
    it("Tree should generate with minimum of two nodes and two layers", () => {
        let generator = new Tree;
        generator.random = () => {return 0.9;};
        generator.root = generator.generateTree();

        expect(generator.root).toBeInstanceOf(Node);
        expect(generator.root.leftChild).toBeInstanceOf(Node);
        expect(generator.root.rightChild).toBeInstanceOf(Node);
        // Rest of these should not exist.
        expect(generator.root.leftChild?.leftChild).toBeNull();
        expect(generator.root.leftChild?.rightChild).toBeNull();
        expect(generator.root.rightChild?.leftChild).toBeNull();
        expect(generator.root.rightChild?.rightChild).toBeNull();
    });
    it("Each node in the tree should have an id number", () => {
        let generator = new Tree;
        expect(generator.root.id).toBe(0);
        expect(generator.root.leftChild?.id).toBe(1);
        expect(generator.root.rightChild?.id).toBe(2);
    });
    it("Tree should fully generate when random returns 0", () => {
        let generator = new Tree;
        generator.random = () => {return 0;};
        generator.root = generator.generateTree();
        expect(generator.root).toBeInstanceOf(Node);
        expect(generator.root.leftChild).toBeInstanceOf(Node);
        expect(generator.root.rightChild).toBeInstanceOf(Node);
        // there is almost certainly a more effcient way to do this however copy and paste is faster
        expect(generator.root.leftChild?.leftChild).toBeInstanceOf(Node);
        expect(generator.root.leftChild?.rightChild).toBeInstanceOf(Node);
        expect(generator.root.rightChild?.leftChild).toBeInstanceOf(Node);
        expect(generator.root.rightChild?.rightChild).toBeInstanceOf(Node);

        expect(generator.root.leftChild?.leftChild?.leftChild).toBeNull();
        expect(generator.root.leftChild?.leftChild?.rightChild).toBeNull();
        expect(generator.root.leftChild?.rightChild?.leftChild).toBeNull();
        expect(generator.root.leftChild?.rightChild?.rightChild).toBeNull();
        expect(generator.root.rightChild?.leftChild?.leftChild).toBeNull();
        expect(generator.root.rightChild?.leftChild?.rightChild).toBeNull();
        expect(generator.root.rightChild?.rightChild?.leftChild).toBeNull();
        expect(generator.root.rightChild?.rightChild?.rightChild).toBeNull();
    });
});

describe("preorderDFS tests", ()=>{
    it("Maximum tree is navigated fully and in the correct order", ()=>{
        let tree = new Tree;
        tree.random = () => {return 0;};
        tree.root = tree.generateTree();


        let generatedOrder = new preorderDFS().solveTree(tree.root)
        expect(generatedOrder.values.length).toBe(7); // Make sure the tree is explored fully
        let expectedOrder = new Map<number, number>();
        expectedOrder.set(0, 0);
        expectedOrder.set(1, 1);
        expectedOrder.set(3, 2);
        expectedOrder.set(4, 3);
        expectedOrder.set(2, 4);
        expectedOrder.set(5, 5);
        expectedOrder.set(6, 6);

        expectedOrder.forEach((id, order)=>{
            expect(generatedOrder.get(id)).toBe(order);
        })

    })
}

)