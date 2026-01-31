import { isNode, isDocument } from '../../../src/utils/node';

describe('node utils', () => {
  describe('isNode', () => {
    it('should return false in jsdom environment (window is defined)', () => {
      expect(isNode()).toBe(false);
    });
  });

  describe('isDocument', () => {
    it('should return true in jsdom environment (document is defined)', () => {
      expect(isDocument()).toBe(true);
    });
  });
});

