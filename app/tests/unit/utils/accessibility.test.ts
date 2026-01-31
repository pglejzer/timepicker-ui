import { announceToScreenReader, updateAriaPressed } from '../../../src/utils/accessibility';

describe('accessibility', () => {
  describe('announceToScreenReader', () => {
    let modal: HTMLDivElement;
    let announcer: HTMLDivElement;

    beforeEach(() => {
      jest.useFakeTimers();
      modal = document.createElement('div');
      announcer = document.createElement('div');
      announcer.classList.add('timepicker-announcer');
      modal.appendChild(announcer);
      document.body.appendChild(modal);
    });

    afterEach(() => {
      jest.useRealTimers();
      document.body.innerHTML = '';
    });

    it('should clear and set announcer text after delay', () => {
      announceToScreenReader(modal, 'Test message');

      expect(announcer.textContent).toBe('');

      jest.advanceTimersByTime(100);

      expect(announcer.textContent).toBe('Test message');
    });

    it('should do nothing when modal is null', () => {
      expect(() => {
        announceToScreenReader(null, 'Test message');
      }).not.toThrow();
    });

    it('should do nothing when announcer is not found', () => {
      const emptyModal = document.createElement('div');

      expect(() => {
        announceToScreenReader(emptyModal, 'Test message');
      }).not.toThrow();
    });

    it('should handle multiple announcements', () => {
      announceToScreenReader(modal, 'First message');
      jest.advanceTimersByTime(100);
      expect(announcer.textContent).toBe('First message');

      announceToScreenReader(modal, 'Second message');
      expect(announcer.textContent).toBe('');

      jest.advanceTimersByTime(100);
      expect(announcer.textContent).toBe('Second message');
    });
  });

  describe('updateAriaPressed', () => {
    let button: HTMLButtonElement;

    beforeEach(() => {
      button = document.createElement('button');
      document.body.appendChild(button);
    });

    afterEach(() => {
      document.body.innerHTML = '';
    });

    it('should set aria-pressed to true', () => {
      updateAriaPressed(button, true);
      expect(button.getAttribute('aria-pressed')).toBe('true');
    });

    it('should set aria-pressed to false', () => {
      updateAriaPressed(button, false);
      expect(button.getAttribute('aria-pressed')).toBe('false');
    });

    it('should do nothing when button is null', () => {
      expect(() => {
        updateAriaPressed(null, true);
      }).not.toThrow();
    });

    it('should toggle aria-pressed state', () => {
      updateAriaPressed(button, true);
      expect(button.getAttribute('aria-pressed')).toBe('true');

      updateAriaPressed(button, false);
      expect(button.getAttribute('aria-pressed')).toBe('false');
    });
  });
});

