import {
  announceToScreenReader,
  updateAriaPressed,
  bindActivate,
  prefersReducedMotion,
} from '../../../src/utils/accessibility';

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

  describe('bindActivate', () => {
    let el: HTMLDivElement;
    let handler: jest.Mock;

    beforeEach(() => {
      el = document.createElement('div');
      el.setAttribute('role', 'button');
      document.body.appendChild(el);
      handler = jest.fn();
    });

    afterEach(() => {
      document.body.innerHTML = '';
    });

    it('should fire handler on click', () => {
      bindActivate(el, handler);
      el.click();
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('should fire handler on Enter keydown', () => {
      bindActivate(el, handler);
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('should fire handler on Space keydown and preventDefault', () => {
      bindActivate(el, handler);
      const event = new KeyboardEvent('keydown', { key: ' ', cancelable: true });
      el.dispatchEvent(event);
      expect(handler).toHaveBeenCalledTimes(1);
      expect(event.defaultPrevented).toBe(true);
    });

    it('should ignore other keys', () => {
      bindActivate(el, handler);
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
      expect(handler).not.toHaveBeenCalled();
    });

    it('should be a no-op when aria-disabled is true', () => {
      el.setAttribute('aria-disabled', 'true');
      bindActivate(el, handler);

      el.click();
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      expect(handler).not.toHaveBeenCalled();
    });

    it('should be a no-op when element has disabled class', () => {
      el.classList.add('disabled');
      bindActivate(el, handler);

      el.click();
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      expect(handler).not.toHaveBeenCalled();
    });

    it('should return a no-op cleanup when element is null', () => {
      const cleanup = bindActivate(null, handler);
      expect(() => cleanup()).not.toThrow();
    });

    it('should remove both listeners on cleanup', () => {
      const cleanup = bindActivate(el, handler);
      cleanup();

      el.click();
      el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('prefersReducedMotion', () => {
    const originalMatchMedia = window.matchMedia;

    afterEach(() => {
      window.matchMedia = originalMatchMedia;
    });

    it('should return false when matchMedia is not available', () => {
      delete (window as unknown as { matchMedia?: unknown }).matchMedia;
      expect(prefersReducedMotion()).toBe(false);
    });

    it('should reflect matches when matchMedia reports reduce', () => {
      window.matchMedia = jest.fn().mockReturnValue({ matches: true }) as unknown as typeof window.matchMedia;
      expect(prefersReducedMotion()).toBe(true);
    });

    it('should return false when matchMedia reports no preference', () => {
      window.matchMedia = jest.fn().mockReturnValue({ matches: false }) as unknown as typeof window.matchMedia;
      expect(prefersReducedMotion()).toBe(false);
    });
  });
});

