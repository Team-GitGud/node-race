import { Question } from '@/types/Question';
import { Node } from '@/types/tree/Node';

describe('Question', () => {
  let rootNode: Node;
  let correctOrder: Map<number, number>;
  let question: Question;

  beforeEach(() => {
    rootNode = new Node(1, null, null);
    correctOrder = new Map([
      [1, 0],
      [2, 1],
      [3, 2]
    ]);
    question = new Question('q1', 'Test Question', rootNode, correctOrder);
  });

  describe('constructor', () => {
    it('should create question with all properties', () => {
      expect(question.id).toBe('q1');
      expect(question.title).toBe('Test Question');
      expect(question.root).toBe(rootNode);
      expect(question.correctOrder).toBe(correctOrder);
      expect(question.answerStatus).toBeNull();
    });
  });

  describe('isCorrect', () => {
    it('should return true for correct answer', () => {
      const selectedOrder = new Map([
        [1, 0],
        [2, 1],
        [3, 2]
      ]);
      
      expect(question.isCorrect(selectedOrder)).toBe(true);
      expect(question.answerStatus).toBe(true);
    });

    it('should return false for incorrect answer', () => {
      const selectedOrder = new Map([
        [1, 0],
        [2, 1],
        [3, 3] // Wrong value
      ]);
      
      expect(question.isCorrect(selectedOrder)).toBe(false);
      expect(question.answerStatus).toBe(false);
    });

    it('should return false when maps have different sizes', () => {
      const selectedOrder = new Map([
        [1, 0],
        [2, 1]
        // Missing key 3
      ]);
      
      expect(question.isCorrect(selectedOrder)).toBe(false);
      expect(question.answerStatus).toBe(false);
    });

    it('should return false when maps have extra keys', () => {
      const selectedOrder = new Map([
        [1, 0],
        [2, 1],
        [3, 2],
        [4, 3] // Extra key
      ]);
      
      expect(question.isCorrect(selectedOrder)).toBe(false);
      expect(question.answerStatus).toBe(false);
    });

    it('should return false when maps have missing keys', () => {
      const selectedOrder = new Map([
        [1, 0],
        [2, 1]
        // Missing key 3
      ]);
      
      expect(question.isCorrect(selectedOrder)).toBe(false);
      expect(question.answerStatus).toBe(false);
    });

    it('should handle empty maps', () => {
      const emptyQuestion = new Question('q2', 'Empty', rootNode, new Map());
      const emptySelected = new Map();
      
      expect(emptyQuestion.isCorrect(emptySelected)).toBe(true);
      expect(emptyQuestion.answerStatus).toBe(true);
    });

    it('should handle single key-value pair', () => {
      const singleQuestion = new Question('q3', 'Single', rootNode, new Map([[1, 0]]));
      const correctAnswer = new Map([[1, 0]]);
      const wrongAnswer = new Map([[1, 1]]);
      
      expect(singleQuestion.isCorrect(correctAnswer)).toBe(true);
      expect(singleQuestion.isCorrect(wrongAnswer)).toBe(false);
    });
  });

  describe('answerStatus persistence', () => {
    it('should maintain answerStatus between calls', () => {
      const selectedOrder = new Map([
        [1, 0],
        [2, 1],
        [3, 2]
      ]);
      
      question.isCorrect(selectedOrder);
      expect(question.answerStatus).toBe(true);
      
      // Call again with same answer
      question.isCorrect(selectedOrder);
      expect(question.answerStatus).toBe(true);
    });

    it('should update answerStatus when answer changes', () => {
      const correctAnswer = new Map([
        [1, 0],
        [2, 1],
        [3, 2]
      ]);
      
      const wrongAnswer = new Map([
        [1, 0],
        [2, 1],
        [3, 3]
      ]);
      
      question.isCorrect(correctAnswer);
      expect(question.answerStatus).toBe(true);
      
      question.isCorrect(wrongAnswer);
      expect(question.answerStatus).toBe(false);
    });
  });
});