import { initMd3Ripple } from '../../../src/utils/ripple';

class MockPointerEvent extends MouseEvent {
  readonly pointerId: number;
  readonly pointerType: string;
  readonly pressure: number;
  readonly width: number;
  readonly height: number;

  constructor(type: string, eventInitDict?: PointerEventInit) {
    super(type, eventInitDict);
    this.pointerId = eventInitDict?.pointerId ?? 0;
    this.pointerType = eventInitDict?.pointerType ?? 'mouse';
    this.pressure = eventInitDict?.pressure ?? 0;
    this.width = eventInitDict?.width ?? 1;
    this.height = eventInitDict?.height ?? 1;
  }
}

(global as Record<string, unknown>).PointerEvent = MockPointerEvent;

describe('ripple', () => {
  let container: HTMLDivElement;
  let rippleElement: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    rippleElement = document.createElement('div');
    rippleElement.setAttribute('data-md3-ripple', '');
    container.appendChild(rippleElement);
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('initMd3Ripple', () => {
    it('should attach event listeners to document', () => {
      const addEventListenerSpy = jest.spyOn(document, 'addEventListener');

      initMd3Ripple();

      expect(addEventListenerSpy).toHaveBeenCalledWith('pointerdown', expect.any(Function));
      expect(addEventListenerSpy).toHaveBeenCalledWith('pointerup', expect.any(Function));
      expect(addEventListenerSpy).toHaveBeenCalledWith('pointercancel', expect.any(Function));

      addEventListenerSpy.mockRestore();
    });

    it('should attach event listeners to custom root', () => {
      const addEventListenerSpy = jest.spyOn(container, 'addEventListener');

      initMd3Ripple(container);

      expect(addEventListenerSpy).toHaveBeenCalledWith('pointerdown', expect.any(Function));
      expect(addEventListenerSpy).toHaveBeenCalledWith('pointerup', expect.any(Function));
      expect(addEventListenerSpy).toHaveBeenCalledWith('pointercancel', expect.any(Function));

      addEventListenerSpy.mockRestore();
    });

    it('should attach mouseleave listener to ripple elements', () => {
      const addEventListenerSpy = jest.spyOn(rippleElement, 'addEventListener');

      initMd3Ripple(container);

      expect(addEventListenerSpy).toHaveBeenCalledWith('mouseleave', expect.any(Function));

      addEventListenerSpy.mockRestore();
    });
  });

  describe('ripple interactions', () => {
    beforeEach(() => {
      initMd3Ripple(document);
    });

    it('should add ripple classes on pointerdown', () => {
      const rect = { left: 0, top: 0, width: 100, height: 100 };
      jest.spyOn(rippleElement, 'getBoundingClientRect').mockReturnValue(rect as DOMRect);

      const event = new PointerEvent('pointerdown', {
        clientX: 50,
        clientY: 50,
        button: 0,
        bubbles: true,
      });
      rippleElement.dispatchEvent(event);

      expect(rippleElement.classList.contains('is-rippling')).toBe(true);
      expect(rippleElement.classList.contains('ripple-hold')).toBe(true);
    });

    it('should set ripple CSS variables', () => {
      const rect = { left: 10, top: 20, width: 100, height: 100 };
      jest.spyOn(rippleElement, 'getBoundingClientRect').mockReturnValue(rect as DOMRect);

      const event = new PointerEvent('pointerdown', {
        clientX: 60,
        clientY: 70,
        button: 0,
        bubbles: true,
      });
      rippleElement.dispatchEvent(event);

      expect(rippleElement.style.getPropertyValue('--ripple-x')).toBe('50px');
      expect(rippleElement.style.getPropertyValue('--ripple-y')).toBe('50px');
      expect(rippleElement.style.getPropertyValue('--ripple-size')).toBe('200px');
    });

    it('should ignore non-left mouse button clicks', () => {
      const event = new PointerEvent('pointerdown', {
        clientX: 50,
        clientY: 50,
        button: 2,
        pointerType: 'mouse',
        bubbles: true,
      });
      rippleElement.dispatchEvent(event);

      expect(rippleElement.classList.contains('is-rippling')).toBe(false);
    });

    it('should remove hold class on pointerup', () => {
      jest.useFakeTimers();

      const rect = { left: 0, top: 0, width: 100, height: 100 };
      jest.spyOn(rippleElement, 'getBoundingClientRect').mockReturnValue(rect as DOMRect);

      const downEvent = new PointerEvent('pointerdown', {
        clientX: 50,
        clientY: 50,
        button: 0,
        bubbles: true,
      });
      rippleElement.dispatchEvent(downEvent);

      expect(rippleElement.classList.contains('ripple-hold')).toBe(true);

      const upEvent = new PointerEvent('pointerup', {
        bubbles: true,
      });
      rippleElement.dispatchEvent(upEvent);

      expect(rippleElement.classList.contains('ripple-hold')).toBe(false);

      jest.advanceTimersByTime(1000);
      expect(rippleElement.classList.contains('is-rippling')).toBe(false);

      jest.useRealTimers();
    });

    it('should handle pointercancel same as pointerup', () => {
      jest.useFakeTimers();

      const rect = { left: 0, top: 0, width: 100, height: 100 };
      jest.spyOn(rippleElement, 'getBoundingClientRect').mockReturnValue(rect as DOMRect);

      const downEvent = new PointerEvent('pointerdown', {
        clientX: 50,
        clientY: 50,
        button: 0,
        bubbles: true,
      });
      rippleElement.dispatchEvent(downEvent);

      const cancelEvent = new PointerEvent('pointercancel', {
        bubbles: true,
      });
      rippleElement.dispatchEvent(cancelEvent);

      expect(rippleElement.classList.contains('ripple-hold')).toBe(false);

      jest.advanceTimersByTime(1000);
      expect(rippleElement.classList.contains('is-rippling')).toBe(false);

      jest.useRealTimers();
    });

    it('should handle mouseleave during ripple', () => {
      jest.useFakeTimers();

      const rect = { left: 0, top: 0, width: 100, height: 100 };
      jest.spyOn(rippleElement, 'getBoundingClientRect').mockReturnValue(rect as DOMRect);

      initMd3Ripple(container);

      const downEvent = new PointerEvent('pointerdown', {
        clientX: 50,
        clientY: 50,
        button: 0,
        bubbles: true,
      });
      rippleElement.dispatchEvent(downEvent);

      const leaveEvent = new MouseEvent('mouseleave', {
        bubbles: true,
      });
      rippleElement.dispatchEvent(leaveEvent);

      expect(rippleElement.classList.contains('ripple-hold')).toBe(false);

      jest.advanceTimersByTime(1000);
      expect(rippleElement.classList.contains('is-rippling')).toBe(false);

      jest.useRealTimers();
    });

    it('should handle ripple on child element', () => {
      const childElement = document.createElement('span');
      rippleElement.appendChild(childElement);

      const rect = { left: 0, top: 0, width: 100, height: 100 };
      jest.spyOn(rippleElement, 'getBoundingClientRect').mockReturnValue(rect as DOMRect);

      const event = new PointerEvent('pointerdown', {
        clientX: 50,
        clientY: 50,
        button: 0,
        bubbles: true,
      });
      childElement.dispatchEvent(event);

      expect(rippleElement.classList.contains('is-rippling')).toBe(true);
    });

    it('should ignore elements without data-md3-ripple', () => {
      const nonRippleElement = document.createElement('div');
      container.appendChild(nonRippleElement);

      const event = new PointerEvent('pointerdown', {
        clientX: 50,
        clientY: 50,
        button: 0,
        bubbles: true,
      });
      nonRippleElement.dispatchEvent(event);

      expect(nonRippleElement.classList.contains('is-rippling')).toBe(false);
    });

    it('should use max dimension for ripple size', () => {
      const rect = { left: 0, top: 0, width: 200, height: 50 };
      jest.spyOn(rippleElement, 'getBoundingClientRect').mockReturnValue(rect as DOMRect);

      const event = new PointerEvent('pointerdown', {
        clientX: 100,
        clientY: 25,
        button: 0,
        bubbles: true,
      });
      rippleElement.dispatchEvent(event);

      expect(rippleElement.style.getPropertyValue('--ripple-size')).toBe('400px');
    });
  });
});

