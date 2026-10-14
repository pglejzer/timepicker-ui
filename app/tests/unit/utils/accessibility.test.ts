import {
  announceToScreenReader,
  updateAriaPressed,
  bindActivate,
  isActivationKey,
  prefersReducedMotion,
  setActivePeriod,
  setClass,
  setOrRemoveAttribute,
  setSpinbuttonValue,
  setElementDisabled,
  syncClockSlider,
  trackPointerModality,
} from '../../../src/utils/accessibility';

const SLIDER_ATTRIBUTES = ['aria-label', 'aria-valuemin', 'aria-valuemax', 'aria-valuenow', 'aria-valuetext'];

const recordMutations = (root: Node, act: () => void): MutationRecord[] => {
  const observer = new MutationObserver(() => {});
  observer.observe(root, { attributes: true, subtree: true, attributeOldValue: true });
  act();
  const records = observer.takeRecords();
  observer.disconnect();
  return records;
};

const recordsOn = (records: MutationRecord[], target: Node): MutationRecord[] =>
  records.filter((record) => record.target === target);

const sliderState = (dial: Element): Record<string, string | null> =>
  Object.fromEntries(SLIDER_ATTRIBUTES.map((name) => [name, dial.getAttribute(name)]));

interface ClockModal {
  modal: HTMLDivElement;
  dial: HTMLDivElement;
  hour: HTMLInputElement;
  minutes: HTMLInputElement;
}

const mountClockModal = (): ClockModal => {
  const modal = document.createElement('div');
  modal.className = 'tp-ui-modal';
  modal.innerHTML = `
    <input class="tp-ui-hour" role="spinbutton" aria-label="Hour" aria-valuemin="1" aria-valuemax="12" aria-valuenow="9" aria-valuetext="09" value="09" />
    <input class="tp-ui-minutes" role="spinbutton" aria-label="Minute" aria-valuemin="0" aria-valuemax="59" aria-valuenow="5" aria-valuetext="05" value="05" />
    <div class="tp-ui-clock-face" role="slider" tabindex="0"></div>
  `;
  document.body.appendChild(modal);
  return {
    modal,
    dial: modal.querySelector('.tp-ui-clock-face') as HTMLDivElement,
    hour: modal.querySelector('.tp-ui-hour') as HTMLInputElement,
    minutes: modal.querySelector('.tp-ui-minutes') as HTMLInputElement,
  };
};

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

    it('should do nothing when button is undefined', () => {
      expect(() => {
        updateAriaPressed(undefined, true);
      }).not.toThrow();
    });

    it('should toggle aria-pressed state', () => {
      updateAriaPressed(button, true);
      expect(button.getAttribute('aria-pressed')).toBe('true');

      updateAriaPressed(button, false);
      expect(button.getAttribute('aria-pressed')).toBe('false');
    });
  });

  describe('setActivePeriod', () => {
    const periodButton = (type: 'AM' | 'PM', pressed: boolean): HTMLDivElement => {
      const button = document.createElement('div');
      button.setAttribute('role', 'button');
      button.dataset.type = type;
      button.classList.toggle('active', pressed);
      button.setAttribute('aria-pressed', String(pressed));
      return button;
    };

    const stateOf = (button: HTMLElement): { active: boolean; pressed: string | null } => ({
      active: button.classList.contains('active'),
      pressed: button.getAttribute('aria-pressed'),
    });

    it.each([
      { type: 'AM', am: true, pm: false },
      { type: 'PM', am: false, pm: true },
      { type: undefined, am: false, pm: false },
    ])(
      'should set active and aria-pressed to $am on AM and $pm on PM for type $type',
      ({ type, am, pm }) => {
        const amButton = periodButton('AM', !am);
        const pmButton = periodButton('PM', !pm);

        setActivePeriod(amButton, pmButton, type);

        expect(stateOf(amButton)).toEqual({ active: am, pressed: String(am) });
        expect(stateOf(pmButton)).toEqual({ active: pm, pressed: String(pm) });
      },
    );

    it.each([null, undefined])('should not throw when both buttons are %p', (missing) => {
      expect(() => setActivePeriod(missing, missing, 'AM')).not.toThrow();
    });

    it('should still update the present button when the other one is missing', () => {
      const pmButton = periodButton('PM', false);

      setActivePeriod(null, pmButton, 'PM');

      expect(stateOf(pmButton)).toEqual({ active: true, pressed: 'true' });
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

  describe('trackPointerModality', () => {
    const POINTER = 'tp-ui-pointer';

    let modal: HTMLDivElement;
    let child: HTMLButtonElement;
    let outside: HTMLDivElement;
    let cleanup: () => void;

    const pointerDown = (target: EventTarget): void => {
      target.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    };

    const keyDown = (target: EventTarget, key: string, init: KeyboardEventInit = {}): void => {
      target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, ...init }));
    };

    const hasPointerClass = (el: HTMLElement = modal): boolean => el.classList.contains(POINTER);

    beforeEach(() => {
      modal = document.createElement('div');
      child = document.createElement('button');
      modal.appendChild(child);
      outside = document.createElement('div');
      document.body.append(modal, outside);
      cleanup = trackPointerModality(modal);
    });

    afterEach(() => {
      cleanup();
      document.body.innerHTML = '';
    });

    it.each<[string, () => HTMLElement]>([
      ['the modal', () => modal],
      ['a child of the modal', () => child],
    ])('should add the pointer class on pointerdown on %s', (_, target) => {
      pointerDown(target());

      expect(hasPointerClass()).toBe(true);
    });

    it('should not add the pointer class on pointerdown outside the modal', () => {
      pointerDown(outside);

      expect(hasPointerClass()).toBe(false);
    });

    it.each(['Tab', 'ArrowUp', 'Enter'])(
      'should remove the pointer class on a %s keydown inside the modal',
      (key) => {
        pointerDown(child);

        keyDown(child, key);

        expect(hasPointerClass()).toBe(false);
      },
    );

    it('should remove the pointer class on Shift+Tab', () => {
      pointerDown(child);

      keyDown(child, 'Tab', { shiftKey: true });

      expect(hasPointerClass()).toBe(false);
    });

    it('should remove the pointer class on keydown outside the modal', () => {
      pointerDown(child);

      keyDown(document.body, 'Tab');

      expect(hasPointerClass()).toBe(false);
    });

    it.each(['Shift', 'Control', 'Alt', 'Meta'])(
      'should keep the pointer class on a lone %s keydown',
      (key) => {
        pointerDown(child);

        keyDown(child, key);

        expect(hasPointerClass()).toBe(true);
      },
    );

    it('should add the pointer class even when a child stops pointerdown propagation', () => {
      child.addEventListener('pointerdown', (e) => e.stopPropagation());

      pointerDown(child);

      expect(hasPointerClass()).toBe(true);
    });

    it('should remove the pointer class even when a child stops keydown propagation', () => {
      child.addEventListener('keydown', (e) => e.stopPropagation());
      modal.classList.add(POINTER);

      keyDown(child, 'Tab');

      expect(hasPointerClass()).toBe(false);
    });

    it('should listen for keydown on the document that owns the modal', () => {
      const frameDocument = document.implementation.createHTMLDocument('frame');
      const frameModal = frameDocument.createElement('div');
      frameDocument.body.appendChild(frameModal);
      const release = trackPointerModality(frameModal);
      frameModal.classList.add(POINTER);

      keyDown(document.body, 'Tab');
      expect(hasPointerClass(frameModal)).toBe(true);

      keyDown(frameDocument.body, 'Tab');
      expect(hasPointerClass(frameModal)).toBe(false);

      release();
    });

    it('should stop toggling the pointer class after cleanup', () => {
      cleanup();

      pointerDown(child);
      expect(hasPointerClass()).toBe(false);

      modal.classList.add(POINTER);
      keyDown(child, 'Tab');
      expect(hasPointerClass()).toBe(true);
    });

    it('should leave a present pointer class in place on cleanup', () => {
      pointerDown(child);

      cleanup();

      expect(hasPointerClass()).toBe(true);
    });

    describe('DOM writes', () => {
      it('should write nothing on a document keydown while the pointer class is absent', () => {
        const records = recordMutations(document, () => keyDown(document.body, 'Tab'));

        expect(records).toHaveLength(0);
        expect(modal.hasAttribute('class')).toBe(false);
      });

      it('should write nothing on a second pointerdown', () => {
        pointerDown(child);

        const records = recordMutations(document, () => pointerDown(child));

        expect(records).toHaveLength(0);
        expect(hasPointerClass()).toBe(true);
      });

      it('should write nothing on a lone Shift keydown while the pointer class is present', () => {
        pointerDown(child);

        const records = recordMutations(document, () => keyDown(child, 'Shift'));

        expect(records).toHaveLength(0);
        expect(hasPointerClass()).toBe(true);
      });

      it('should write the class once on the first pointerdown and once on the next real key', () => {
        const added = recordMutations(document, () => pointerDown(child));
        expect(added).toHaveLength(1);
        expect(added[0].target).toBe(modal);
        expect(added[0].attributeName).toBe('class');
        expect(hasPointerClass()).toBe(true);

        const removed = recordMutations(document, () => keyDown(child, 'Tab'));
        expect(removed).toHaveLength(1);
        expect(removed[0].target).toBe(modal);
        expect(removed[0].oldValue).toBe(POINTER);
        expect(hasPointerClass()).toBe(false);
      });
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

  describe('setSpinbuttonValue', () => {
    const spinbutton = (): HTMLInputElement => {
      const input = document.createElement('input');
      input.setAttribute('role', 'spinbutton');
      return input;
    };

    const ariaOf = (input: HTMLInputElement): Record<string, string | null> => ({
      value: input.value,
      now: input.getAttribute('aria-valuenow'),
      text: input.getAttribute('aria-valuetext'),
    });

    it('should set the value, a numeric aria-valuenow and the displayed aria-valuetext', () => {
      const input = spinbutton();

      setSpinbuttonValue(input, '05');

      expect(ariaOf(input)).toEqual({ value: '05', now: '5', text: '05' });
    });

    it('should remove aria-valuenow and aria-valuetext for an empty value', () => {
      const input = spinbutton();
      setSpinbuttonValue(input, '05');

      setSpinbuttonValue(input, '');

      expect(ariaOf(input)).toEqual({ value: '', now: null, text: null });
    });

    it('should do nothing without an input', () => {
      expect(() => setSpinbuttonValue(null, '05')).not.toThrow();
    });

    describe('inside a picker modal', () => {
      afterEach(() => {
        document.body.innerHTML = '';
      });

      it('should mirror the new value of the active field onto the clock dial', () => {
        const { dial, minutes } = mountClockModal();
        minutes.classList.add('active');

        setSpinbuttonValue(minutes, '45');

        expect(sliderState(dial)).toEqual({
          'aria-label': 'Minute',
          'aria-valuemin': '0',
          'aria-valuemax': '59',
          'aria-valuenow': '45',
          'aria-valuetext': '45',
        });
      });

      it('should drop the dial value too when the active field is emptied', () => {
        const { dial, hour } = mountClockModal();
        hour.classList.add('active');
        setSpinbuttonValue(hour, '09');

        setSpinbuttonValue(hour, '');

        expect(sliderState(dial)).toEqual({
          'aria-label': 'Hour',
          'aria-valuemin': '1',
          'aria-valuemax': '12',
          'aria-valuenow': null,
          'aria-valuetext': null,
        });
      });

      it('should keep the dial on the active field when another field changes', () => {
        const { dial, hour, minutes } = mountClockModal();
        hour.classList.add('active');

        setSpinbuttonValue(minutes, '30');

        expect(dial.getAttribute('aria-label')).toBe('Hour');
        expect(dial.getAttribute('aria-valuenow')).toBe('9');
      });
    });
  });

  describe('syncClockSlider', () => {
    afterEach(() => {
      document.body.innerHTML = '';
    });

    it.each([null, undefined])('should do nothing for a %p modal', (modal) => {
      expect(() => syncClockSlider(modal)).not.toThrow();
    });

    it('should do nothing when the modal has no dial', () => {
      const { modal, dial, hour } = mountClockModal();
      dial.remove();
      hour.classList.add('active');
      const markupBefore = modal.innerHTML;

      expect(() => syncClockSlider(modal)).not.toThrow();
      expect(modal.innerHTML).toBe(markupBefore);
    });

    it('should copy the name and all four value attributes of the active field onto the dial', () => {
      const { modal, dial, minutes } = mountClockModal();
      minutes.classList.add('active');

      syncClockSlider(modal);

      expect(sliderState(dial)).toEqual({
        'aria-label': 'Minute',
        'aria-valuemin': '0',
        'aria-valuemax': '59',
        'aria-valuenow': '5',
        'aria-valuetext': '05',
      });
    });

    it('should fall back to the hour field when no field is active', () => {
      const { modal, dial } = mountClockModal();

      syncClockSlider(modal);

      expect(sliderState(dial)).toEqual({
        'aria-label': 'Hour',
        'aria-valuemin': '1',
        'aria-valuemax': '12',
        'aria-valuenow': '9',
        'aria-valuetext': '09',
      });
    });

    it('should remove dial attributes the active field does not have', () => {
      const { modal, dial, minutes } = mountClockModal();
      syncClockSlider(modal);
      minutes.classList.add('active');
      minutes.removeAttribute('aria-valuenow');
      minutes.removeAttribute('aria-valuetext');

      syncClockSlider(modal);

      expect(sliderState(dial)).toEqual({
        'aria-label': 'Minute',
        'aria-valuemin': '0',
        'aria-valuemax': '59',
        'aria-valuenow': null,
        'aria-valuetext': null,
      });
    });

    it('should clear every dial attribute when the modal has no time field', () => {
      const { modal, dial, hour, minutes } = mountClockModal();
      syncClockSlider(modal);
      hour.remove();
      minutes.remove();

      syncClockSlider(modal);

      expect(sliderState(dial)).toEqual(Object.fromEntries(SLIDER_ATTRIBUTES.map((name) => [name, null])));
    });

    it('should leave the role and tabindex of the dial alone', () => {
      const { modal, dial } = mountClockModal();

      syncClockSlider(modal);

      expect(dial.getAttribute('role')).toBe('slider');
      expect(dial.getAttribute('tabindex')).toBe('0');
    });
  });

  describe('setOrRemoveAttribute', () => {
    it('should set the attribute for a non-empty string', () => {
      const el = document.createElement('div');

      setOrRemoveAttribute(el, 'aria-valuenow', '7');

      expect(el.getAttribute('aria-valuenow')).toBe('7');
    });

    it.each([false, null, undefined, ''] as const)('should remove the attribute for %p', (value) => {
      const el = document.createElement('div');
      el.setAttribute('aria-valuenow', '7');

      setOrRemoveAttribute(el, 'aria-valuenow', value);

      expect(el.hasAttribute('aria-valuenow')).toBe(false);
    });

    it('should not throw when removing an attribute that is not there', () => {
      const el = document.createElement('div');

      expect(() => setOrRemoveAttribute(el, 'aria-hidden', false)).not.toThrow();
      expect(el.hasAttribute('aria-hidden')).toBe(false);
    });

    it('should write nothing when the value is already set', () => {
      const el = document.createElement('div');
      el.setAttribute('aria-valuenow', '7');

      const records = recordMutations(el, () => setOrRemoveAttribute(el, 'aria-valuenow', '7'));

      expect(records).toHaveLength(0);
      expect(el.getAttribute('aria-valuenow')).toBe('7');
    });

    it.each([false, null, undefined, ''] as const)(
      'should write nothing for %p when the attribute is absent',
      (value) => {
        const el = document.createElement('div');

        const records = recordMutations(el, () => setOrRemoveAttribute(el, 'aria-valuenow', value));

        expect(records).toHaveLength(0);
      },
    );

    it('should write exactly once when the value changes', () => {
      const el = document.createElement('div');
      el.setAttribute('aria-valuenow', '7');

      const records = recordMutations(el, () => setOrRemoveAttribute(el, 'aria-valuenow', '8'));

      expect(records).toHaveLength(1);
      expect(records[0].attributeName).toBe('aria-valuenow');
      expect(records[0].oldValue).toBe('7');
      expect(el.getAttribute('aria-valuenow')).toBe('8');
    });
  });

  describe('setClass', () => {
    it('should write nothing when the class is already on and asked on', () => {
      const el = document.createElement('div');
      el.className = 'tp-ui-hour active';

      const records = recordMutations(el, () => setClass(el, 'active', true));

      expect(records).toHaveLength(0);
      expect(el.className).toBe('tp-ui-hour active');
    });

    it.each([
      ['without a class attribute', null],
      ['with other classes', 'tp-ui-hour'],
    ])('should write nothing when the class is absent and asked off (%s)', (_, className) => {
      const el = document.createElement('div');
      if (className) el.className = className;

      const records = recordMutations(el, () => setClass(el, 'active', false));

      expect(records).toHaveLength(0);
      expect(el.getAttribute('class')).toBe(className);
    });

    it.each([
      { from: 'tp-ui-hour', on: true, to: 'tp-ui-hour active' },
      { from: 'tp-ui-hour active', on: false, to: 'tp-ui-hour' },
    ])('should write exactly once when switching from "$from" with on=$on', ({ from, on, to }) => {
      const el = document.createElement('div');
      el.className = from;

      const records = recordMutations(el, () => setClass(el, 'active', on));

      expect(records).toHaveLength(1);
      expect(records[0].attributeName).toBe('class');
      expect(records[0].oldValue).toBe(from);
      expect(el.className).toBe(to);
    });

    it.each([null, undefined])('should not throw for a %p element', (el) => {
      expect(() => setClass(el, 'active', true)).not.toThrow();
      expect(() => setClass(el, 'active', false)).not.toThrow();
    });
  });

  describe('a repeated call with the same arguments writes nothing', () => {
    afterEach(() => {
      document.body.innerHTML = '';
    });

    it('setElementDisabled(el, true)', () => {
      const el = document.createElement('div');
      el.className = 'tp-ui-ok-btn';

      const first = recordMutations(el, () => setElementDisabled(el, true));
      const second = recordMutations(el, () => setElementDisabled(el, true));

      expect(first.length).toBeGreaterThan(0);
      expect(second).toHaveLength(0);
      expect(el.className).toBe('tp-ui-ok-btn disabled');
      expect(el.getAttribute('aria-disabled')).toBe('true');
    });

    it('setActivePeriod(am, pm, "AM")', () => {
      const group = document.createElement('div');
      const am = document.createElement('div');
      const pm = document.createElement('div');
      pm.className = 'active';
      group.append(am, pm);

      const first = recordMutations(group, () => setActivePeriod(am, pm, 'AM'));
      const second = recordMutations(group, () => setActivePeriod(am, pm, 'AM'));

      expect(first.length).toBeGreaterThan(0);
      expect(second).toHaveLength(0);
      expect(am.getAttribute('aria-pressed')).toBe('true');
      expect(pm.getAttribute('aria-pressed')).toBe('false');
    });

    it('updateAriaPressed(button, true)', () => {
      const button = document.createElement('button');

      const first = recordMutations(button, () => updateAriaPressed(button, true));
      const second = recordMutations(button, () => updateAriaPressed(button, true));

      expect(first).toHaveLength(1);
      expect(second).toHaveLength(0);
    });

    it('syncClockSlider(modal)', () => {
      const { modal, dial, minutes } = mountClockModal();
      minutes.classList.add('active');

      const first = recordMutations(modal, () => syncClockSlider(modal));
      const second = recordMutations(modal, () => syncClockSlider(modal));

      expect(recordsOn(first, dial).length).toBeGreaterThan(0);
      expect(second).toHaveLength(0);
      expect(dial.getAttribute('aria-label')).toBe('Minute');
    });

    it('setSpinbuttonValue(input, "05") on the input and on the dial of the same modal', () => {
      const { modal, dial, hour } = mountClockModal();
      hour.classList.add('active');

      const first = recordMutations(modal, () => setSpinbuttonValue(hour, '05'));
      const second = recordMutations(modal, () => setSpinbuttonValue(hour, '05'));

      expect(recordsOn(first, hour).length).toBeGreaterThan(0);
      expect(recordsOn(first, dial).length).toBeGreaterThan(0);
      expect(recordsOn(second, hour)).toHaveLength(0);
      expect(recordsOn(second, dial)).toHaveLength(0);
      expect(second).toHaveLength(0);
      expect(dial.getAttribute('aria-valuenow')).toBe('5');
      expect(dial.getAttribute('aria-valuetext')).toBe('05');
    });
  });

  describe('isActivationKey', () => {
    it.each(['Enter', ' '])('should treat %p as an activation key', (key) => {
      expect(isActivationKey(key)).toBe(true);
    });

    it.each(['Spacebar', 'Space', 'Tab', 'Escape', 'ArrowUp', 'a', ''])(
      'should not treat %p as an activation key',
      (key) => {
        expect(isActivationKey(key)).toBe(false);
      },
    );
  });

  describe('setElementDisabled', () => {
    const stateOf = (el: HTMLElement): { className: string; ariaDisabled: string | null } => ({
      className: el.className,
      ariaDisabled: el.getAttribute('aria-disabled'),
    });

    it('should do nothing without an element', () => {
      expect(() => setElementDisabled(null, true)).not.toThrow();
    });

    it('should toggle the disabled class and aria-disabled together, keeping other classes', () => {
      const button = document.createElement('div');
      button.className = 'tp-ui-ok-btn';

      setElementDisabled(button, true);
      expect(stateOf(button)).toEqual({ className: 'tp-ui-ok-btn disabled', ariaDisabled: 'true' });

      setElementDisabled(button, false);
      expect(stateOf(button)).toEqual({ className: 'tp-ui-ok-btn', ariaDisabled: 'false' });
    });

    it('should not duplicate the disabled class when disabled twice', () => {
      const button = document.createElement('div');

      setElementDisabled(button, true);
      setElementDisabled(button, true);

      expect(stateOf(button)).toEqual({ className: 'disabled', ariaDisabled: 'true' });
    });
  });
});

