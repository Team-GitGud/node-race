import { describe, it, expect } from "vitest";
import {Tree} from "../src/tree-management/tree";
import {Node} from "../src/tree-management/node";
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

        expect(generator.root.leftChild?.leftChild?.leftChild).toBeInstanceOf(Node);
        expect(generator.root.leftChild?.leftChild?.rightChild).toBeInstanceOf(Node);
        expect(generator.root.leftChild?.rightChild?.leftChild).toBeInstanceOf(Node);
        expect(generator.root.leftChild?.rightChild?.rightChild).toBeInstanceOf(Node);
        expect(generator.root.rightChild?.leftChild?.leftChild).toBeInstanceOf(Node);
        expect(generator.root.rightChild?.leftChild?.rightChild).toBeInstanceOf(Node);
        expect(generator.root.rightChild?.rightChild?.leftChild).toBeInstanceOf(Node);
        expect(generator.root.rightChild?.rightChild?.rightChild).toBe(Node);
    });

});