import { QuestionAdapter } from '@/types/QuestionAdapter';
import { Question } from '@/types/Question';

describe('QuestionAdapter', () => {
  const mockBackendQuestions: Array<{
    solution: Record<string, number>;
    tree: any;
    questionType: "Post order Depth first search" | "Pre order Depth first search" | "In order Depth first search" | "Pre order Breadth first search";
  }> = [
    {
      solution: {
        "0": 4,
        "1": 0,
        "2": 3,
        "3": 1,
        "4": 2
      },
      tree: {
        leftChild: {
          leftChild: null,
          rightChild: null,
          id: 1
        },
        rightChild: {
          leftChild: {
            leftChild: null,
            rightChild: null,
            id: 3
          },
          rightChild: {
            leftChild: null,
            rightChild: null,
            id: 4
          },
          id: 2
        },
        id: 0
      },
      questionType: "Post order Depth first search"
    },
    {
      solution: {
        "0": 2,
        "1": 1,
        "2": 3,
        "3": 0,
        "4": 4
      },
      tree: {
        leftChild: {
          leftChild: {
            leftChild: null,
            rightChild: null,
            id: 3
          },
          rightChild: null,
          id: 1
        },
        rightChild: {
          leftChild: null,
          rightChild: {
            leftChild: null,
            rightChild: null,
            id: 4
          },
          id: 2
        },
        id: 0
      },
      questionType: "In order Depth first search"
    },
    {
      solution: {
        "0": 0,
        "1": 1,
        "2": 2,
        "3": 3,
        "4": 4,
        "5": 5
      },
      tree: {
        leftChild: {
          leftChild: {
            leftChild: null,
            rightChild: null,
            id: 3
          },
          rightChild: {
            leftChild: null,
            rightChild: null,
            id: 4
          },
          id: 1
        },
        rightChild: {
          leftChild: {
            leftChild: null,
            rightChild: null,
            id: 5
          },
          rightChild: null,
          id: 2
        },
        id: 0
      },
      questionType: "Pre order Breadth first search"
    }
  ];

  describe('fromBackendQuestions', () => {
    it('should convert backend questions to Question objects', () => {
      const questions = QuestionAdapter.fromBackendQuestions(mockBackendQuestions);
      
      expect(questions).toHaveLength(3);
      questions.forEach(question => {
        expect(question).toBeInstanceOf(Question);
      });
    });

    it('should correctly set question properties', () => {
      const questions = QuestionAdapter.fromBackendQuestions(mockBackendQuestions);
      const firstQuestion = questions[0];
      
      expect(firstQuestion.id).toBe(0);
      expect(firstQuestion.title).toBe('Post order Depth first search');
      expect(firstQuestion.root).toBeDefined();
      expect(firstQuestion.correctOrder).toBeInstanceOf(Map);
    });

    it('should correctly convert solution to Map', () => {
      const questions = QuestionAdapter.fromBackendQuestions(mockBackendQuestions);
      const firstQuestion = questions[0];
      
      expect(firstQuestion.correctOrder.get(0)).toBe(4);
      expect(firstQuestion.correctOrder.get(1)).toBe(0);
      expect(firstQuestion.correctOrder.get(2)).toBe(3);
      expect(firstQuestion.correctOrder.get(3)).toBe(1);
      expect(firstQuestion.correctOrder.get(4)).toBe(2);
    });

    it('should handle multiple questions with different structures', () => {
      const questions = QuestionAdapter.fromBackendQuestions(mockBackendQuestions);
      
      // First question has 5 nodes
      expect(questions[0].root.getAllNodes()).toHaveLength(5);
      
      // Second question has 5 nodes
      expect(questions[1].root.getAllNodes()).toHaveLength(5);
      
      // Third question has 6 nodes
      expect(questions[2].root.getAllNodes()).toHaveLength(6);
    });

    it('should generate sequential IDs for questions', () => {
      const questions = QuestionAdapter.fromBackendQuestions(mockBackendQuestions);
      
      expect(questions[0].id).toBe(0);
      expect(questions[1].id).toBe(1);
      expect(questions[2].id).toBe(2);
    });

    it('should handle empty array', () => {
      const questions = QuestionAdapter.fromBackendQuestions([]);
      expect(questions).toHaveLength(0);
    });

    it('should handle single question', () => {
      const singleQuestion = [mockBackendQuestions[0]];
      const questions = QuestionAdapter.fromBackendQuestions(singleQuestion);
      
      expect(questions).toHaveLength(1);
      expect(questions[0].id).toBe(0);
    });
  });

  describe('tree structure validation', () => {
    it('should correctly build tree structure for first question', () => {
      const questions = QuestionAdapter.fromBackendQuestions([mockBackendQuestions[0]]);
      const root = questions[0].root;
      
      // Tree structure:    0
      //                    / \
      //                   1   2
      //                      / \
      //                     3   4
      expect(root.id).toBe(0);
      expect(root.leftChild!.id).toBe(1);
      expect(root.rightChild!.id).toBe(2);
      expect(root.rightChild!.leftChild!.id).toBe(3);
      expect(root.rightChild!.rightChild!.id).toBe(4);
    });

    it('should correctly build tree structure for second question', () => {
      const questions = QuestionAdapter.fromBackendQuestions([mockBackendQuestions[1]]);
      const root = questions[0].root;
      
      // Tree structure:    0
      //                    / \
      //                   1   2
      //                  /     \
      //                 3       4
      expect(root.id).toBe(0);
      expect(root.leftChild!.id).toBe(1);
      expect(root.rightChild!.id).toBe(2);
      expect(root.leftChild!.leftChild!.id).toBe(3);
      expect(root.rightChild!.rightChild!.id).toBe(4);
    });

    it('should correctly build tree structure for third question', () => {
      const questions = QuestionAdapter.fromBackendQuestions([mockBackendQuestions[2]]);
      const root = questions[0].root;
      
      // Tree structure:    0
      //                    / \
      //                   1   2
      //                  / \   \
      //                 3   4   5
      expect(root.id).toBe(0);
      expect(root.leftChild!.id).toBe(1);
      expect(root.rightChild!.id).toBe(2);
      expect(root.leftChild!.leftChild!.id).toBe(3);
      expect(root.leftChild!.rightChild!.id).toBe(4);
      expect(root.rightChild!.leftChild!.id).toBe(5);
    });
  });

  describe('solution mapping validation', () => {
    it('should correctly map string keys to numbers', () => {
      const questions = QuestionAdapter.fromBackendQuestions([mockBackendQuestions[0]]);
      const correctOrder = questions[0].correctOrder;
      
      // Verify that string keys from backend are converted to number keys
      expect(correctOrder.has(0)).toBe(true);
      expect(correctOrder.has(1)).toBe(true);
      expect(correctOrder.has(2)).toBe(true);
      expect(correctOrder.has(3)).toBe(true);
      expect(correctOrder.has(4)).toBe(true);
    });

    it('should maintain correct values after conversion', () => {
      const questions = QuestionAdapter.fromBackendQuestions([mockBackendQuestions[0]]);
      const correctOrder = questions[0].correctOrder;
      
      // Verify values are preserved
      expect(correctOrder.get(0)).toBe(4);
      expect(correctOrder.get(1)).toBe(0);
      expect(correctOrder.get(2)).toBe(3);
      expect(correctOrder.get(3)).toBe(1);
      expect(correctOrder.get(4)).toBe(2);
    });

    it('should handle different solution sizes', () => {
      const questions = QuestionAdapter.fromBackendQuestions(mockBackendQuestions);
      
      // First question: 5 nodes
      expect(questions[0].correctOrder.size).toBe(5);
      
      // Second question: 5 nodes
      expect(questions[1].correctOrder.size).toBe(5);
      
      // Third question: 6 nodes
      expect(questions[2].correctOrder.size).toBe(6);
    });
  });

  describe('question type handling', () => {
    it('should handle Post order Depth first search', () => {
      const questions = QuestionAdapter.fromBackendQuestions([mockBackendQuestions[0]]);
      expect(questions[0].title).toBe('Post order Depth first search');
    });

    it('should handle In order Depth first search', () => {
      const questions = QuestionAdapter.fromBackendQuestions([mockBackendQuestions[1]]);
      expect(questions[0].title).toBe('In order Depth first search');
    });

    it('should handle Pre order Breadth first search', () => {
      const questions = QuestionAdapter.fromBackendQuestions([mockBackendQuestions[2]]);
      expect(questions[0].title).toBe('Pre order Breadth first search');
    });
  });

  describe('solution validation', () => {
    it('should validate that all tree node IDs exist in solution', () => {
      const questions = QuestionAdapter.fromBackendQuestions([mockBackendQuestions[0]]);
      const question = questions[0];
      
      // Get all node IDs from the tree
      const treeNodeIds = question.root.getAllNodes().map(node => node.id);
      
      // Verify all tree node IDs exist as keys in the solution
      treeNodeIds.forEach(nodeId => {
        expect(question.correctOrder.has(nodeId)).toBe(true);
      });
    });

    it('should validate that all solution keys correspond to tree nodes', () => {
      const questions = QuestionAdapter.fromBackendQuestions([mockBackendQuestions[0]]);
      const question = questions[0];
      
      // Get all node IDs from the tree
      const treeNodeIds = question.root.getAllNodes().map(node => node.id);
      
      // Verify all solution keys correspond to tree nodes
      for (const solutionKey of question.correctOrder.keys()) {
        expect(treeNodeIds).toContain(solutionKey);
      }
    });

    it('should handle questions with different node counts', () => {
      const questions = QuestionAdapter.fromBackendQuestions(mockBackendQuestions);
      
      // Verify each question has matching tree nodes and solution keys
      questions.forEach(question => {
        const treeNodeIds = question.root.getAllNodes().map(node => node.id);
        const solutionKeys = Array.from(question.correctOrder.keys());
        
        expect(treeNodeIds).toHaveLength(solutionKeys.length);
        expect(treeNodeIds.sort()).toEqual(solutionKeys.sort());
      });
    });
  });
});