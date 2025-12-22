/**
 * @vitest-environment jsdom
 */
import { describe, it, expect } from 'vitest';
const rt = require('../../src/features/random-toolkit/script.js');

describe('Random Toolkit Logic', () => {
  describe('Random Numbers', () => {
    it('should generate requested number of random integers within range', () => {
      const res = rt.generateRandomNumbersLogic(10, 20, 5);
      expect(res).toHaveLength(5);
      res.forEach(n => {
        expect(n).toBeGreaterThanOrEqual(10);
        expect(n).toBeLessThanOrEqual(20);
      });
    });
  });

  describe('Pick from List', () => {
    it('should pick an item from the list', () => {
      const input = 'Apple\nBanana\nCherry';
      const res = rt.pickFromListLogic(input);
      expect(['Apple', 'Banana', 'Cherry']).toContain(res);
    });

    it('should return null for empty input', () => {
      expect(rt.pickFromListLogic('')).toBeNull();
    });
  });

  describe('Roll Dice', () => {
    it('should return a number between 1 and 6', () => {
      const res = rt.rollDiceLogic();
      expect(res).toBeGreaterThanOrEqual(1);
      expect(res).toBeLessThanOrEqual(6);
    });
  });
});
