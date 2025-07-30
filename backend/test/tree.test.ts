import { describe, it, expect } from "vitest";
import {Tree} from "../src/tree-management/tree";
import {Node} from "../src/tree-management/node";
describe("Tree generation", () => {
    it("Tree should generate on instantiation of type", () => {
        let generator = new Tree;
        expect(typeof generator.root).toBe(Node);
    });
    it("Tree should generate with minimum of two nodes and two layers", () => {
        let generator = new Tree;
        generator.random = () => {return 1;};
        generator.root = generator.generateTree();

        expect(typeof generator.root).toBe(Node);
        expect(typeof generator.root.leftChild).toBe(Node);
        expect(typeof generator.root.rightChild).toBe(Node);
        // Rest of these should not exist.
        expect(generator.root.leftChild?.leftChild).toBeNull();
        expect(generator.root.leftChild?.rightChild).toBeNull();
        expect(generator.root.rightChild?.leftChild).toBeNull();
        expect(generator.root.rightChild?.rightChild).toBeNull();
    });
    it("Each node in the tree should have an id number", () => {
        let generator = new Tree;
        expect(generator.root.id).toBe(0);
        expect(generator.root.leftChild).toBe(1);
        expect(generator.root.rightChild).toBe(2);
    });
    it("Tree should fully generate when random returns 0", () => {
        let generator = new Tree;
        generator.random = () => {return 0;};
        generator.root = generator.generateTree();
        expect(typeof generator.root).toBe(Node);
        expect(typeof generator.root.leftChild).toBe(Node);
        expect(typeof generator.root.rightChild).toBe(Node);
        // there is almost certainly a more effcient way to do this however copy and paste is faster
        expect(typeof generator.root.leftChild?.leftChild).toBe(Node);
        expect(typeof generator.root.leftChild?.rightChild).toBe(Node);
        expect(typeof generator.root.rightChild?.leftChild).toBe(Node);
        expect(typeof generator.root.rightChild?.rightChild).toBe(Node);

        expect(typeof generator.root.leftChild?.leftChild?.leftChild).toBe(Node);
        expect(typeof generator.root.leftChild?.leftChild?.rightChild).toBe(Node);
        expect(typeof generator.root.leftChild?.rightChild?.leftChild).toBe(Node);
        expect(typeof generator.root.leftChild?.rightChild?.rightChild).toBe(Node);
        expect(typeof generator.root.rightChild?.leftChild?.leftChild).toBe(Node);
        expect(typeof generator.root.rightChild?.leftChild?.rightChild).toBe(Node);
        expect(typeof generator.root.rightChild?.rightChild?.leftChild).toBe(Node);
        expect(typeof generator.root.rightChild?.rightChild?.rightChild).toBe(Node);
    });

});