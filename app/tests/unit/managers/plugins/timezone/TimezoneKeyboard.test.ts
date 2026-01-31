import { TimezoneKeyboard } from '../../../../../src/managers/plugins/timezone/TimezoneKeyboard';

describe('TimezoneKeyboard', () => {
  describe('constructor', () => {
    it('should create with initial index -1', () => {
      const keyboard = new TimezoneKeyboard();

      expect(keyboard.getFocusedIndex()).toBe(-1);
    });
  });

  describe('getFocusedIndex', () => {
    it('should return current focused index', () => {
      const keyboard = new TimezoneKeyboard();
      keyboard.setFocusedIndex(5);

      expect(keyboard.getFocusedIndex()).toBe(5);
    });
  });

  describe('setFocusedIndex', () => {
    it('should set focused index', () => {
      const keyboard = new TimezoneKeyboard();

      keyboard.setFocusedIndex(3);

      expect(keyboard.getFocusedIndex()).toBe(3);
    });
  });

  describe('moveDown', () => {
    it('should increment focused index', () => {
      const keyboard = new TimezoneKeyboard();
      keyboard.setFocusedIndex(2);

      const result = keyboard.moveDown(10);

      expect(result).toBe(3);
      expect(keyboard.getFocusedIndex()).toBe(3);
    });

    it('should not exceed options count', () => {
      const keyboard = new TimezoneKeyboard();
      keyboard.setFocusedIndex(9);

      const result = keyboard.moveDown(10);

      expect(result).toBe(9);
    });

    it('should move from -1 to 0', () => {
      const keyboard = new TimezoneKeyboard();

      const result = keyboard.moveDown(10);

      expect(result).toBe(0);
    });
  });

  describe('moveUp', () => {
    it('should decrement focused index', () => {
      const keyboard = new TimezoneKeyboard();
      keyboard.setFocusedIndex(5);

      const result = keyboard.moveUp();

      expect(result).toBe(4);
      expect(keyboard.getFocusedIndex()).toBe(4);
    });

    it('should not go below 0', () => {
      const keyboard = new TimezoneKeyboard();
      keyboard.setFocusedIndex(0);

      const result = keyboard.moveUp();

      expect(result).toBe(0);
    });
  });

  describe('moveToFirst', () => {
    it('should set focused index to 0', () => {
      const keyboard = new TimezoneKeyboard();
      keyboard.setFocusedIndex(5);

      const result = keyboard.moveToFirst();

      expect(result).toBe(0);
      expect(keyboard.getFocusedIndex()).toBe(0);
    });
  });

  describe('moveToLast', () => {
    it('should set focused index to last item', () => {
      const keyboard = new TimezoneKeyboard();

      const result = keyboard.moveToLast(10);

      expect(result).toBe(9);
      expect(keyboard.getFocusedIndex()).toBe(9);
    });
  });

  describe('reset', () => {
    it('should reset focused index to -1', () => {
      const keyboard = new TimezoneKeyboard();
      keyboard.setFocusedIndex(5);

      keyboard.reset();

      expect(keyboard.getFocusedIndex()).toBe(-1);
    });
  });

  describe('updateVisualFocus', () => {
    it('should set data-focused on correct option', () => {
      const keyboard = new TimezoneKeyboard();
      keyboard.setFocusedIndex(1);

      const options = [
        document.createElement('div'),
        document.createElement('div'),
        document.createElement('div'),
      ];

      options.forEach((opt) => {
        opt.scrollIntoView = jest.fn();
      });

      keyboard.updateVisualFocus(options);

      expect(options[0].getAttribute('data-focused')).toBe('false');
      expect(options[1].getAttribute('data-focused')).toBe('true');
      expect(options[2].getAttribute('data-focused')).toBe('false');
    });

    it('should scroll focused option into view', () => {
      const keyboard = new TimezoneKeyboard();
      keyboard.setFocusedIndex(1);

      const options = [document.createElement('div'), document.createElement('div')];

      options.forEach((opt) => {
        opt.scrollIntoView = jest.fn();
      });

      keyboard.updateVisualFocus(options);

      expect(options[1].scrollIntoView).toHaveBeenCalledWith({
        block: 'nearest',
        behavior: 'smooth',
      });
    });

    it('should handle empty options array', () => {
      const keyboard = new TimezoneKeyboard();

      expect(() => keyboard.updateVisualFocus([])).not.toThrow();
    });

    it('should not scroll when focused index is -1', () => {
      const keyboard = new TimezoneKeyboard();

      const options = [document.createElement('div')];
      options[0].scrollIntoView = jest.fn();

      keyboard.updateVisualFocus(options);

      expect(options[0].scrollIntoView).not.toHaveBeenCalled();
    });
  });
});

