import { Tree } from '@/types/tree/Tree';
import { Node } from '@/types/tree/Node';

describe('Tree', () => {
  let rootNode: Node;
  let tree: Tree;

  beforeEach(() => {
    rootNode = new Node(1, null, null);
    tree = new Tree(rootNode);
  });

  describe('constructor', () => {
    it('should create tree with root node', () => {
      expect(tree.getRoot()).toBe(rootNode);
    });
  });

  describe('getRoot', () => {
    it('should return the root node', () => {
      expect(tree.getRoot()).toBe(rootNode);
    });
  });

  describe('setRoot', () => {
    it('should update the root node', () => {
      const newRoot = new Node(2, null, null);
      tree.setRoot(newRoot);
      
      expect(tree.getRoot()).toBe(newRoot);
    });

    it('should maintain tree structure after root change', () => {
      const newRoot = new Node(2, new Node(3, null, null), new Node(4, null, null));
      tree.setRoot(newRoot);
      
      const root = tree.getRoot();
      expect(root.id).toBe(2);
      expect(root.leftChild!.id).toBe(3);
      expect(root.rightChild!.id).toBe(4);
    });
  });
});