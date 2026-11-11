import { TimezoneKeyboard } from '../../../../../src/managers/plugins/timezone/TimezoneKeyboard';
import { TIMINGS } from '../../../../../src/constants/timings';

const OPTIONS_COUNT = 10;

const keyboardFocusedAt = (index: number, optionsCount: number = OPTIONS_COUNT): TimezoneKeyboard => {
  const keyboard = new TimezoneKeyboard();
  for (let step = 0; step <= index; step++) {
    keyboard.moveDown(optionsCount);
  }
  return keyboard;
};

describe('TimezoneKeyboard', () => {
  describe('constructor', () => {
    it('should create with initial index -1', () => {
      const keyboard = new TimezoneKeyboard();

      expect(keyboard.getFocusedIndex()).toBe(-1);
    });
  });

  describe('getFocusedIndex', () => {
    it('should return current focused index', () => {
      const keyboard = keyboardFocusedAt(5);

      expect(keyboard.getFocusedIndex()).toBe(5);
    });
  });

  describe('moveDown', () => {
    it('should increment focused index', () => {
      const keyboard = keyboardFocusedAt(2);

      const result = keyboard.moveDown(OPTIONS_COUNT);

      expect(result).toBe(3);
      expect(keyboard.getFocusedIndex()).toBe(3);
    });

    it('should not exceed options count', () => {
      const keyboard = keyboardFocusedAt(9);

      const result = keyboard.moveDown(OPTIONS_COUNT);

      expect(result).toBe(9);
    });

    it('should move from -1 to 0', () => {
      const keyboard = new TimezoneKeyboard();

      const result = keyboard.moveDown(OPTIONS_COUNT);

      expect(result).toBe(0);
    });
  });

  describe('moveUp', () => {
    it('should decrement focused index', () => {
      const keyboard = keyboardFocusedAt(5);

      const result = keyboard.moveUp();

      expect(result).toBe(4);
      expect(keyboard.getFocusedIndex()).toBe(4);
    });

    it('should not go below 0', () => {
      const keyboard = keyboardFocusedAt(0);

      const result = keyboard.moveUp();

      expect(result).toBe(0);
    });
  });

  describe('moveToFirst', () => {
    it('should set focused index to 0', () => {
      const keyboard = keyboardFocusedAt(5);

      const result = keyboard.moveToFirst();

      expect(result).toBe(0);
      expect(keyboard.getFocusedIndex()).toBe(0);
    });
  });

  describe('moveToLast', () => {
    it('should set focused index to last item', () => {
      const keyboard = new TimezoneKeyboard();

      const result = keyboard.moveToLast(OPTIONS_COUNT);

      expect(result).toBe(9);
      expect(keyboard.getFocusedIndex()).toBe(9);
    });
  });

  describe('reset', () => {
    it('should reset focused index to -1', () => {
      const keyboard = keyboardFocusedAt(5);

      keyboard.reset();

      expect(keyboard.getFocusedIndex()).toBe(-1);
    });
  });

  describe('updateVisualFocus', () => {
    it('should set data-focused on correct option', () => {
      const options = [
        document.createElement('div'),
        document.createElement('div'),
        document.createElement('div'),
      ];
      const keyboard = keyboardFocusedAt(1, options.length);

      options.forEach((opt) => {
        opt.scrollIntoView = jest.fn();
      });

      keyboard.updateVisualFocus(options);

      expect(options[0].getAttribute('data-focused')).toBe('false');
      expect(options[1].getAttribute('data-focused')).toBe('true');
      expect(options[2].getAttribute('data-focused')).toBe('false');
    });

    it('should scroll focused option into view', () => {
      const options = [document.createElement('div'), document.createElement('div')];
      const keyboard = keyboardFocusedAt(1, options.length);

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

    it('should set aria-activedescendant on the combobox to the focused option id', () => {
      const options = [document.createElement('div'), document.createElement('div')];
      const keyboard = keyboardFocusedAt(1, options.length);
      options[0].id = 'tp-tz-opt-0';
      options[1].id = 'tp-tz-opt-1';
      options.forEach((opt) => {
        opt.scrollIntoView = jest.fn();
      });

      const combobox = document.createElement('div');

      keyboard.updateVisualFocus(options, combobox);

      expect(combobox.getAttribute('aria-activedescendant')).toBe('tp-tz-opt-1');
    });

    it('should remove aria-activedescendant when no option is focused', () => {
      const keyboard = new TimezoneKeyboard();

      const combobox = document.createElement('div');
      combobox.setAttribute('aria-activedescendant', 'tp-tz-opt-0');

      keyboard.updateVisualFocus([], combobox);

      expect(combobox.hasAttribute('aria-activedescendant')).toBe(false);
    });
  });

  describe('setFocusedIndex', () => {
    it('should set and return the index', () => {
      const keyboard = new TimezoneKeyboard();

      expect(keyboard.setFocusedIndex(4)).toBe(4);
      expect(keyboard.getFocusedIndex()).toBe(4);
    });
  });

  describe('type-ahead', () => {
    const LABELS = ['Athens', 'Belgrade', 'Berlin', 'Brussels', 'Cairo'];

    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('moves to the first label starting with the typed character', () => {
      const keyboard = new TimezoneKeyboard();

      expect(keyboard.matchTypedCharacter('b', LABELS)).toBe(1);
      expect(keyboard.getFocusedIndex()).toBe(1);
      expect(keyboard.isTyping()).toBe(true);
    });

    it('matches case-insensitively', () => {
      const keyboard = new TimezoneKeyboard();

      expect(keyboard.matchTypedCharacter('C', LABELS)).toBe(4);
    });

    it('cycles to the next label with the same first letter when the character repeats within the window', () => {
      const keyboard = new TimezoneKeyboard();

      keyboard.matchTypedCharacter('b', LABELS);
      jest.advanceTimersByTime(TIMINGS.TYPEAHEAD_RESET - 1);
      expect(keyboard.matchTypedCharacter('b', LABELS)).toBe(2);
      jest.advanceTimersByTime(TIMINGS.TYPEAHEAD_RESET - 1);
      expect(keyboard.matchTypedCharacter('b', LABELS)).toBe(3);
    });

    it('builds a prefix: "b", "e", "r" lands on Berlin when Belgrade is active', () => {
      const keyboard = new TimezoneKeyboard();
      keyboard.setFocusedIndex(1);

      keyboard.matchTypedCharacter('b', LABELS);
      expect(keyboard.getFocusedIndex()).toBe(2);
      keyboard.matchTypedCharacter('e', LABELS);
      expect(keyboard.getFocusedIndex()).toBe(2);
      keyboard.matchTypedCharacter('r', LABELS);
      expect(keyboard.getFocusedIndex()).toBe(2);
    });

    it('keeps Berlin for "b", "e", "r" when Berlin is already active', () => {
      const keyboard = new TimezoneKeyboard();
      keyboard.setFocusedIndex(2);

      keyboard.matchTypedCharacter('b', LABELS);
      keyboard.matchTypedCharacter('e', LABELS);
      expect(keyboard.matchTypedCharacter('r', LABELS)).toBe(2);
      expect(keyboard.getFocusedIndex()).toBe(2);
    });

    it('returns -1 and keeps the index when nothing matches', () => {
      const keyboard = new TimezoneKeyboard();
      keyboard.setFocusedIndex(3);

      expect(keyboard.matchTypedCharacter('z', LABELS)).toBe(-1);
      expect(keyboard.getFocusedIndex()).toBe(3);
    });

    it('empties the buffer after TIMINGS.TYPEAHEAD_RESET', () => {
      const keyboard = new TimezoneKeyboard();
      keyboard.matchTypedCharacter('b', LABELS);
      expect(keyboard.isTyping()).toBe(true);

      jest.advanceTimersByTime(TIMINGS.TYPEAHEAD_RESET);

      expect(keyboard.isTyping()).toBe(false);
    });

    it('restarts the window on every character', () => {
      const keyboard = new TimezoneKeyboard();
      keyboard.matchTypedCharacter('b', LABELS);
      jest.advanceTimersByTime(TIMINGS.TYPEAHEAD_RESET - 100);
      keyboard.matchTypedCharacter('e', LABELS);
      jest.advanceTimersByTime(TIMINGS.TYPEAHEAD_RESET - 100);

      expect(keyboard.isTyping()).toBe(true);
    });

    it('reset() clears the buffer and its timer', () => {
      const keyboard = new TimezoneKeyboard();
      keyboard.matchTypedCharacter('b', LABELS);

      keyboard.reset();

      expect(keyboard.isTyping()).toBe(false);
      expect(keyboard.getFocusedIndex()).toBe(-1);
      expect(jest.getTimerCount()).toBe(0);
    });
  });
});
