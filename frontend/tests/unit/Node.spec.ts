import { Node } from '@/types/tree/Node';

describe('Node', () => {
  describe('constructor', () => {
    it('should create a node with id and optional children', () => {
      const node = new Node(1, null, null);
      expect(node.id).toBe(1);
      expect(node.leftChild).toBeNull();
      expect(node.rightChild).toBeNull();
    });

    it('should create a node with children', () => {
      const leftChild = new Node(2, null, null);
      const rightChild = new Node(3, null, null);
      const node = new Node(1, leftChild, rightChild);
      
      expect(node.id).toBe(1);
      expect(node.leftChild).toBe(leftChild);
      expect(node.rightChild).toBe(rightChild);
    });
  });

  describe('getAllNodes', () => {
    it('should return single node for leaf', () => {
      const node = new Node(1, null, null);
      const allNodes = node.getAllNodes();
      
      expect(allNodes).toHaveLength(1);
      expect(allNodes[0].id).toBe(1);
    });

    it('should return all nodes in tree', () => {
      const leftChild = new Node(2, null, null);
      const rightChild = new Node(3, null, null);
      const node = new Node(1, leftChild, rightChild);
      
      const allNodes = node.getAllNodes();
      
      expect(allNodes).toHaveLength(3);
      expect(allNodes.map(n => n.id)).toEqual([1, 2, 3]);
    });

    it('should handle complex tree structure', () => {
      // Create tree:    1
      //                / \
      //               2   3
      //              /     \
      //             4       5
      const node4 = new Node(4, null, null);
      const node5 = new Node(5, null, null);
      const node2 = new Node(2, node4, null);
      const node3 = new Node(3, null, node5);
      const root = new Node(1, node2, node3);
      
      const allNodes = root.getAllNodes();
      
      expect(allNodes).toHaveLength(5);
      expect(allNodes.map(n => n.id)).toEqual([1, 2, 4, 3, 5]);
    });

    it('should handle unbalanced tree', () => {
      // Create tree:    1
      //                /
      //               2
      //              /
      //             3
      const node3 = new Node(3, null, null);
      const node2 = new Node(2, node3, null);
      const root = new Node(1, node2, null);
      
      const allNodes = root.getAllNodes();
      
      expect(allNodes).toHaveLength(3);
      expect(allNodes.map(n => n.id)).toEqual([1, 2, 3]);
    });
  });
});