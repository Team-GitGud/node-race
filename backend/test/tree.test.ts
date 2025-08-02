import { describe, it, expect } from "vitest";
import {Tree} from "../src/tree-management/tree";
import {Node} from "../src/tree-management/node";
import {preorderDFS} from "../src/tree-management/preorderDFS";
import {postorderDFS} from "../src/tree-management/postorderDFS";
import {inorderDFS} from "../src/tree-management/inorderDFS";
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
        generator.random = () => {return 0;};
        generator.root = generator.generateTree();
        expect(generator.root.id).toBe(0);
        expect(generator.root.leftChild?.id).toBe(1);
        expect(generator.root.rightChild?.id).toBe(2);
        expect(generator.root.leftChild?.leftChild?.id).toBe(3);
        expect(generator.root.leftChild?.rightChild?.id).toBe(4);
        expect(generator.root.rightChild?.leftChild?.id).toBe(5);
        expect(generator.root.rightChild?.rightChild?.id).toBe(6);
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
        let generatedOrderLength = 0;
        generatedOrder.forEach((id, order) => {
            generatedOrderLength++;
        })
        expect(generatedOrderLength).toBe(7); // Make sure the tree is explored fully

        // Make sure the order is correct
        expect(generatedOrder.get(0)).toBe(0);
        expect(generatedOrder.get(1)).toBe(1);
        expect(generatedOrder.get(2)).toBe(4);
        expect(generatedOrder.get(3)).toBe(2);
        expect(generatedOrder.get(4)).toBe(3);
        expect(generatedOrder.get(5)).toBe(5);
        expect(generatedOrder.get(6)).toBe(6);

    })
});


describe("postorderDFS tests", ()=>{
    it("Maximum tree is navigated fully and in the correct order", ()=>{
        let tree = new Tree;
        tree.random = () => {return 0;};
        tree.root = tree.generateTree();


        let generatedOrder = new postorderDFS().solveTree(tree.root)
        let generatedOrderLength = 0;
        generatedOrder.forEach((id, order) => {
            generatedOrderLength++;
        })
        expect(generatedOrderLength).toBe(7); // Make sure the tree is explored fully

        // Make sure the order is correct
        expect(generatedOrder.get(0)).toBe(6);
        expect(generatedOrder.get(1)).toBe(2);
        expect(generatedOrder.get(2)).toBe(5);
        expect(generatedOrder.get(3)).toBe(0);
        expect(generatedOrder.get(4)).toBe(1);
        expect(generatedOrder.get(5)).toBe(3);
        expect(generatedOrder.get(6)).toBe(4);

    })

});

describe("inorderDFS tests", ()=>{
    it("Maximum tree is navigated fully and in the correct order", ()=>{
        let tree = new Tree;
        tree.random = () => {return 0;};
        tree.root = tree.generateTree();


        let generatedOrder = new inorderDFS().solveTree(tree.root)
        let generatedOrderLength = 0;
        generatedOrder.forEach((id, order) => {
            generatedOrderLength++;
        })
        expect(generatedOrderLength).toBe(7); // Make sure the tree is explored fully

        // Make sure the order is correct
        expect(generatedOrder.get(0)).toBe(3);
        expect(generatedOrder.get(1)).toBe(1);
        expect(generatedOrder.get(2)).toBe(5);
        expect(generatedOrder.get(3)).toBe(0);
        expect(generatedOrder.get(4)).toBe(2);
        expect(generatedOrder.get(5)).toBe(4);
        expect(generatedOrder.get(6)).toBe(6);

    })

}
)