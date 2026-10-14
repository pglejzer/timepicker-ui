import { ClockRenderer } from '../../../../../src/managers/clock/renderer/ClockRenderer';
import type { DisabledTimeConfig, RenderConfig } from '../../../../../src/managers/clock/types';
import { TIMINGS } from '../../../../../src/constants/timings';

describe('ClockRenderer', () => {
  let config: RenderConfig;
  let tipsWrapper: HTMLDivElement;
  let tipsWrapperFor24h: HTMLDivElement;
  let clockHand: HTMLDivElement;
  let circle: HTMLDivElement;
  let clockFace: HTMLDivElement;

  const ANIMATION_CLASS = 'tp-ui-tips-animation';
  const originalMatchMedia = window.matchMedia;

  const setReducedMotion = (reduce: boolean): void => {
    window.matchMedia = jest.fn((query: string) => ({
      matches: reduce && /prefers-reduced-motion:\s*reduce/.test(query),
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })) as unknown as typeof window.matchMedia;
  };

  beforeEach(() => {
    tipsWrapper = document.createElement('div');
    Object.defineProperty(tipsWrapper, 'offsetWidth', { value: 200, configurable: true });
    Object.defineProperty(tipsWrapper, 'offsetHeight', { value: 200, configurable: true });

    tipsWrapperFor24h = document.createElement('div');
    Object.defineProperty(tipsWrapperFor24h, 'offsetWidth', { value: 200, configurable: true });
    Object.defineProperty(tipsWrapperFor24h, 'offsetHeight', { value: 200, configurable: true });

    clockHand = document.createElement('div');
    circle = document.createElement('div');
    clockFace = document.createElement('div');

    config = {
      clockFace,
      tipsWrapper,
      tipsWrapperFor24h,
      clockHand,
      circle,
    };

    document.body.appendChild(tipsWrapper);
    document.body.appendChild(tipsWrapperFor24h);
    document.body.appendChild(clockHand);
    document.body.appendChild(circle);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('constructor', () => {
    it('should create renderer with config', () => {
      expect(() => new ClockRenderer(config)).not.toThrow();
    });

    it('should accept theme in config', () => {
      const themedConfig = { ...config, theme: 'm3-green' };
      expect(() => new ClockRenderer(themedConfig)).not.toThrow();
    });
  });

  describe('setHandAngle', () => {
    it('should set clock hand angle', () => {
      const renderer = new ClockRenderer(config);

      renderer.setHandAngle(90);

      expect(clockHand.style.transform).toContain('rotateZ');
      expect(clockHand.style.transform).toContain('90');
    });

    it('should not update if angle difference is minimal', () => {
      const renderer = new ClockRenderer(config);

      renderer.setHandAngle(90);
      const initialTransform = clockHand.style.transform;

      renderer.setHandAngle(90.005);

      expect(clockHand.style.transform).toBe(initialTransform);
    });

    it('should handle angle wrapping', () => {
      const renderer = new ClockRenderer(config);

      renderer.setHandAngle(350);
      renderer.setHandAngle(10);

      expect(clockHand.style.transform).toContain('rotateZ');
    });
  });

  describe('animateToAngle', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      setReducedMotion(false);
    });

    afterEach(() => {
      jest.useRealTimers();
      window.matchMedia = originalMatchMedia;
    });

    it('should put the animation class on the clock hand right after the call', () => {
      const renderer = new ClockRenderer(config);

      renderer.animateToAngle(90);

      expect(clockHand.classList.contains(ANIMATION_CLASS)).toBe(true);
    });

    it('should remove the class from the hand once TIMINGS.TIPS_ANIMATION has passed', () => {
      const renderer = new ClockRenderer(config);

      renderer.animateToAngle(90);
      jest.advanceTimersByTime(TIMINGS.TIPS_ANIMATION - 1);
      expect(clockHand.classList.contains(ANIMATION_CLASS)).toBe(true);

      jest.advanceTimersByTime(1);
      expect(clockHand.classList.contains(ANIMATION_CLASS)).toBe(false);
    });

    it('should restart the snap timer when called again before the previous one fires', () => {
      const renderer = new ClockRenderer(config);

      renderer.animateToAngle(90);
      jest.advanceTimersByTime(TIMINGS.TIPS_ANIMATION - 100);
      renderer.animateToAngle(120);
      expect(jest.getTimerCount()).toBe(1);

      jest.advanceTimersByTime(TIMINGS.TIPS_ANIMATION - 1);
      expect(clockHand.classList.contains(ANIMATION_CLASS)).toBe(true);

      jest.advanceTimersByTime(1);
      expect(clockHand.classList.contains(ANIMATION_CLASS)).toBe(false);
    });

    it('should never write to the tips wrapper', () => {
      const renderer = new ClockRenderer(config);
      const observer = new MutationObserver(() => {});
      observer.observe(tipsWrapper, { attributes: true, attributeOldValue: true });

      renderer.animateToAngle(90);
      const duringAnimation = tipsWrapper.classList.contains(ANIMATION_CLASS);
      jest.advanceTimersByTime(TIMINGS.TIPS_ANIMATION);

      const records = observer.takeRecords();
      observer.disconnect();
      expect(duringAnimation).toBe(false);
      expect(records).toHaveLength(0);
    });

    it('should set hand angle', () => {
      const renderer = new ClockRenderer(config);

      renderer.animateToAngle(180);

      expect(clockHand.style.transform).toContain('180');
    });

    it('should only set the transform and add no class when reduced motion is preferred', () => {
      setReducedMotion(true);
      const renderer = new ClockRenderer(config);
      const observer = new MutationObserver(() => {});
      observer.observe(clockHand, { attributes: true, attributeOldValue: true });

      renderer.animateToAngle(90);
      jest.advanceTimersByTime(TIMINGS.TIPS_ANIMATION);

      const records = observer.takeRecords();
      observer.disconnect();
      expect(records.map((record) => record.attributeName)).toEqual(['style']);
      expect(clockHand.style.transform).toBe('rotateZ(90deg)');
      expect(clockHand.hasAttribute('class')).toBe(false);
      expect(tipsWrapper.classList.contains(ANIMATION_CLASS)).toBe(false);
    });
  });

  describe('setActiveValue', () => {
    it('should set active class on matching tip', () => {
      const renderer = new ClockRenderer(config);

      const tip = document.createElement('span');
      tip.classList.add('tp-ui-value-tips');
      tip.textContent = '10';
      tipsWrapper.appendChild(tip);

      renderer.setActiveValue('10');

      expect(tip.classList.contains('active')).toBe(true);
    });

    it('should remove active class from non-matching tips', () => {
      const renderer = new ClockRenderer(config);

      const tip1 = document.createElement('span');
      tip1.classList.add('tp-ui-value-tips');
      tip1.classList.add('active');
      tip1.textContent = '10';

      const tip2 = document.createElement('span');
      tip2.classList.add('tp-ui-value-tips');
      tip2.textContent = '11';

      tipsWrapper.appendChild(tip1);
      tipsWrapper.appendChild(tip2);

      renderer.setActiveValue('11');

      expect(tip1.classList.contains('active')).toBe(false);
      expect(tip2.classList.contains('active')).toBe(true);
    });

    it('should handle 24h tips wrapper', () => {
      const renderer = new ClockRenderer(config);

      const tip = document.createElement('span');
      tip.classList.add('tp-ui-value-tips-24h');
      tip.textContent = '15';
      tipsWrapperFor24h.appendChild(tip);

      renderer.setActiveValue('15');

      expect(tip.classList.contains('active')).toBe(true);
    });

    it('should write nothing when called again with the same value', () => {
      const renderer = new ClockRenderer(config);
      const tips = ['00', '05', '10'].map((value) => {
        const tip = document.createElement('span');
        tip.classList.add('tp-ui-value-tips');
        tip.textContent = value;
        tipsWrapper.appendChild(tip);
        return tip;
      });
      renderer.setActiveValue('05');
      const observer = new MutationObserver(() => {});
      observer.observe(tipsWrapper, { attributes: true, subtree: true, attributeOldValue: true });

      renderer.setActiveValue('05');

      const records = observer.takeRecords();
      observer.disconnect();
      expect(records).toHaveLength(0);
      expect(tips.map((tip) => tip.classList.contains('active'))).toEqual([false, true, false]);
    });
  });

  describe('followHand', () => {
    const tipFor = (angle: number): string =>
      String(Math.round((((angle % 360) + 360) % 360) / 30)).padStart(2, '0');

    let frames: Map<number, FrameRequestCallback>;
    let request: jest.SpyInstance;
    let cancel: jest.SpyInstance;
    let tips: HTMLElement[];
    let valueAt: jest.Mock<string, [number]>;

    const activeTips = (): string[] =>
      tips.filter((tip) => tip.classList.contains('active')).map((tip) => tip.textContent ?? '');

    const nextFrame = (): void => {
      const queued = [...frames.values()];
      frames.clear();
      queued.forEach((callback) => callback(0));
    };

    const rotateHand = (degrees: number): void => {
      clockHand.style.transform = `rotateZ(${degrees}deg)`;
    };

    const startSweep = (renderer: ClockRenderer, finalValue: string): void => {
      clockHand.classList.add(ANIMATION_CLASS);
      renderer.followHand(valueAt, finalValue);
    };

    beforeEach(() => {
      jest.useFakeTimers({ doNotFake: ['requestAnimationFrame', 'cancelAnimationFrame'] });
      setReducedMotion(false);

      frames = new Map();
      let lastId = 0;
      request = jest.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
        lastId += 1;
        frames.set(lastId, callback);
        return lastId;
      });
      cancel = jest.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) => {
        frames.delete(id);
      });

      tips = ['00', '03', '06', '09'].map((value) => {
        const tip = document.createElement('span');
        tip.classList.add('tp-ui-value-tips');
        tip.textContent = value;
        tipsWrapper.appendChild(tip);
        return tip;
      });
      valueAt = jest.fn(tipFor);
      rotateHand(90);
    });

    afterEach(() => {
      request.mockRestore();
      cancel.mockRestore();
      jest.useRealTimers();
      window.matchMedia = originalMatchMedia;
    });

    it('moves the highlight to the tip under the hand on every frame while the hand turns', () => {
      const renderer = new ClockRenderer(config);

      startSweep(renderer, '09');

      expect(activeTips()).toEqual([]);

      nextFrame();
      expect(activeTips()).toEqual(['03']);

      rotateHand(180);
      nextFrame();
      expect(activeTips()).toEqual(['06']);

      rotateHand(270);
      nextFrame();
      expect(activeTips()).toEqual(['09']);
      expect(valueAt.mock.calls.map(([angle]) => Math.round(angle))).toEqual([90, 180, -90]);
    });

    it('settles on the final value once TIMINGS.TIPS_ANIMATION has passed and requests no further frame', () => {
      const renderer = new ClockRenderer(config);
      startSweep(renderer, '06');
      nextFrame();
      expect(activeTips()).toEqual(['03']);

      jest.advanceTimersByTime(TIMINGS.TIPS_ANIMATION - 1);
      expect(activeTips()).toEqual(['03']);

      jest.advanceTimersByTime(1);
      expect(activeTips()).toEqual(['06']);
      expect(frames.size).toBe(0);
      expect(jest.getTimerCount()).toBe(0);

      nextFrame();
      expect(valueAt).toHaveBeenCalledTimes(1);
    });

    it('activates the final value at once when the hand is not animating', () => {
      const renderer = new ClockRenderer(config);

      renderer.followHand(valueAt, '06');

      expect(activeTips()).toEqual(['06']);
      expect(request).not.toHaveBeenCalled();
      expect(jest.getTimerCount()).toBe(0);
      expect(valueAt).not.toHaveBeenCalled();
    });

    it('activates the final value at once when reduced motion is preferred', () => {
      setReducedMotion(true);
      const renderer = new ClockRenderer(config);

      startSweep(renderer, '06');

      expect(activeTips()).toEqual(['06']);
      expect(request).not.toHaveBeenCalled();
      expect(jest.getTimerCount()).toBe(0);
      expect(valueAt).not.toHaveBeenCalled();
    });

    it('stops the sweep when setHandAngle moves the hand directly', () => {
      const renderer = new ClockRenderer(config);
      startSweep(renderer, '06');
      nextFrame();

      renderer.setHandAngle(180);

      expect(frames.size).toBe(0);
      expect(jest.getTimerCount()).toBe(0);

      nextFrame();
      jest.advanceTimersByTime(TIMINGS.TIPS_ANIMATION);
      expect(valueAt).toHaveBeenCalledTimes(1);
      expect(activeTips()).toEqual(['03']);
    });

    it('stops the sweep on destroy', () => {
      const renderer = new ClockRenderer(config);
      startSweep(renderer, '06');
      nextFrame();

      renderer.destroy();

      expect(frames.size).toBe(0);
      expect(jest.getTimerCount()).toBe(0);

      nextFrame();
      jest.advanceTimersByTime(TIMINGS.TIPS_ANIMATION);
      expect(valueAt).toHaveBeenCalledTimes(1);
      expect(activeTips()).toEqual(['03']);
    });

    it('replaces a running sweep when followHand is called again', () => {
      const renderer = new ClockRenderer(config);
      const firstValueAt = valueAt;
      startSweep(renderer, '03');
      nextFrame();
      jest.advanceTimersByTime(100);

      const secondValueAt = jest.fn(tipFor);
      rotateHand(180);
      renderer.followHand(secondValueAt, '09');

      expect(frames.size).toBe(1);
      expect(jest.getTimerCount()).toBe(1);

      nextFrame();
      expect(firstValueAt).toHaveBeenCalledTimes(1);
      expect(secondValueAt).toHaveBeenCalledTimes(1);
      expect(activeTips()).toEqual(['06']);

      jest.advanceTimersByTime(TIMINGS.TIPS_ANIMATION - 100);
      expect(activeTips()).toEqual(['06']);

      jest.advanceTimersByTime(100);
      expect(activeTips()).toEqual(['09']);
      expect(frames.size).toBe(0);
    });
  });

  describe('renderTips', () => {
    it('should render hour tips for 12h mode', () => {
      const renderer = new ClockRenderer(config);
      const hours = ['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];

      renderer.renderTips(hours, 'tp-ui-hour-time-12', 'hours', null, '12h', true, undefined, 'AM');

      const tips = tipsWrapper.querySelectorAll('.tp-ui-hour-time-12');
      expect(tips.length).toBe(12);
    });

    it('should render minute tips', () => {
      const renderer = new ClockRenderer(config);
      const minutes = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];

      renderer.renderTips(minutes, 'tp-ui-minutes-time', 'minutes', null, '12h', true, undefined, 'AM', '10');

      const tips = tipsWrapper.querySelectorAll('.tp-ui-minutes-time');
      expect(tips.length).toBe(12);
    });

    it('should mark disabled hours', () => {
      const renderer = new ClockRenderer(config);
      const hours = ['12', '1', '2', '3'];
      const disabledTime = { hours: ['3'] };

      renderer.renderTips(hours, 'tp-ui-hour-time-12', 'hours', disabledTime, '12h', true, undefined, 'AM');

      const disabledTips = tipsWrapper.querySelectorAll('.tp-ui-tips-disabled');
      expect(disabledTips.length).toBeGreaterThan(0);
    });

    it('should render decorative tips without listbox option semantics', () => {
      const renderer = new ClockRenderer(config);
      const hours = ['12', '1', '2', '3'];

      renderer.renderTips(hours, 'tp-ui-hour-time-12', 'hours', null, '12h', true, undefined, 'AM');

      const innerTips = tipsWrapper.querySelectorAll('.tp-ui-value-tips');
      expect(innerTips.length).toBe(4);

      innerTips.forEach((tip) => {
        expect(tip.getAttribute('role')).toBeNull();
        expect(tip.getAttribute('aria-selected')).toBeNull();
        expect(tip.getAttribute('aria-disabled')).toBeNull();
        expect(tip.getAttribute('tabindex')).toBe('-1');
      });
    });

    it('should mark disabled hours via class without aria-disabled', () => {
      const renderer = new ClockRenderer(config);
      const hours = ['12', '1', '2', '3'];
      const disabledTime = { hours: ['3'] };

      renderer.renderTips(hours, 'tp-ui-hour-time-12', 'hours', disabledTime, '12h', true, undefined, 'AM');

      const disabledInner = tipsWrapper.querySelector('.tp-ui-value-tips.tp-ui-tips-disabled');
      expect(disabledInner).not.toBeNull();
      expect(disabledInner?.getAttribute('aria-disabled')).toBeNull();
    });

    it('should clear before rendering when clearBefore is true', () => {
      const renderer = new ClockRenderer(config);
      const existingSpan = document.createElement('span');
      tipsWrapper.appendChild(existingSpan);

      renderer.renderTips(['12'], 'tp-ui-hour-time-12', 'hours', null, '12h', true, undefined, 'AM');

      expect(tipsWrapper.contains(existingSpan)).toBe(false);
    });

    it('should use target wrapper when provided', () => {
      const renderer = new ClockRenderer(config);
      const customWrapper = document.createElement('div');
      Object.defineProperty(customWrapper, 'offsetWidth', { value: 200, configurable: true });
      Object.defineProperty(customWrapper, 'offsetHeight', { value: 200, configurable: true });
      document.body.appendChild(customWrapper);

      renderer.renderTips(
        ['00', '13', '14', '15'],
        'tp-ui-hour-time-24',
        'hours',
        null,
        '24h',
        true,
        customWrapper,
        '',
      );

      expect(customWrapper.children.length).toBe(4);
    });

    describe('on the cached path (clearBefore = false)', () => {
      const HOURS = ['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
      const THREE_DISABLED = { hours: ['3'] };

      const render = (renderer: ClockRenderer, disabledTime: DisabledTimeConfig | null): void => {
        renderer.renderTips(
          HOURS,
          'tp-ui-hour-time-12',
          'hours',
          disabledTime,
          '12h',
          false,
          undefined,
          'AM',
        );
      };

      const classAndTabindexRecords = (write: () => void): MutationRecord[] => {
        const observer = new MutationObserver(() => {});
        observer.observe(tipsWrapper, {
          subtree: true,
          attributes: true,
          attributeFilter: ['class', 'tabindex'],
        });

        write();

        const records = observer.takeRecords();
        observer.disconnect();
        return records;
      };

      const tipFor = (value: string): HTMLElement =>
        [...tipsWrapper.querySelectorAll<HTMLElement>('.tp-ui-value-tips')].find(
          (tip) => tip.textContent === value,
        ) as HTMLElement;

      it('should write no class or tabindex when the same disabled time renders again', () => {
        const renderer = new ClockRenderer(config);
        render(renderer, THREE_DISABLED);

        const records = classAndTabindexRecords(() => render(renderer, THREE_DISABLED));

        expect(records).toHaveLength(0);
        expect(tipsWrapper.querySelectorAll('.tp-ui-hour-time-12')).toHaveLength(12);
        const tip = tipFor('3');
        expect(tip).toHaveClass('tp-ui-tips-disabled');
        expect(tip.parentElement).toHaveClass('tp-ui-tips-disabled');
      });

      it('should flip only the disabled span and tip class when disabled time is cleared', () => {
        const renderer = new ClockRenderer(config);
        render(renderer, THREE_DISABLED);
        render(renderer, THREE_DISABLED);
        const tip = tipFor('3');
        const span = tip.parentElement as HTMLElement;

        const records = classAndTabindexRecords(() => render(renderer, null));

        expect(records).toHaveLength(2);
        expect(records.every((record) => record.attributeName === 'class')).toBe(true);
        expect(records.filter((record) => record.target === span)).toHaveLength(1);
        expect(records.filter((record) => record.target === tip)).toHaveLength(1);
        expect(tip).not.toHaveClass('tp-ui-tips-disabled');
        expect(span).not.toHaveClass('tp-ui-tips-disabled');
        expect(tipsWrapper.querySelectorAll('.tp-ui-tips-disabled')).toHaveLength(0);
      });
    });
  });

  describe('setCircle24hMode', () => {
    it('should add 24h classes when enabled', () => {
      const renderer = new ClockRenderer(config);

      renderer.setCircle24hMode(true);

      expect(circle.classList.contains('tp-ui-circle-hand-24h')).toBe(true);
      expect(clockHand.classList.contains('tp-ui-clock-hand-24h')).toBe(true);
    });

    it('should remove 24h classes when disabled', () => {
      const renderer = new ClockRenderer(config);
      circle.classList.add('tp-ui-circle-hand-24h');
      clockHand.classList.add('tp-ui-clock-hand-24h');

      renderer.setCircle24hMode(false);

      expect(circle.classList.contains('tp-ui-circle-hand-24h')).toBe(false);
      expect(clockHand.classList.contains('tp-ui-clock-hand-24h')).toBe(false);
    });

    it.each([true, false])('should write nothing when the mode stays %p', (is24h) => {
      const renderer = new ClockRenderer(config);
      renderer.setCircle24hMode(is24h);
      const observer = new MutationObserver(() => {});
      observer.observe(document.body, { attributes: true, subtree: true, attributeOldValue: true });

      renderer.setCircle24hMode(is24h);

      const records = observer.takeRecords();
      observer.disconnect();
      expect(records).toHaveLength(0);
      expect(circle.classList.contains('tp-ui-circle-hand-24h')).toBe(is24h);
      expect(clockHand.classList.contains('tp-ui-clock-hand-24h')).toBe(is24h);
    });
  });

  describe('destroy', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      setReducedMotion(false);
    });

    afterEach(() => {
      jest.useRealTimers();
      window.matchMedia = originalMatchMedia;
    });

    it('should leave the rendered tips in the tips wrapper', () => {
      const renderer = new ClockRenderer(config);
      const hours = ['12', '1', '2', '3'];
      renderer.renderTips(hours, 'tp-ui-hour-time-12', 'hours', null, '12h', true, undefined, 'AM');
      const tipsBefore = Array.from(tipsWrapper.childNodes);
      const observer = new MutationObserver(() => {});
      observer.observe(tipsWrapper, { childList: true, subtree: true });

      renderer.destroy();

      const records = observer.takeRecords();
      observer.disconnect();
      expect(records).toHaveLength(0);
      expect(tipsBefore).toHaveLength(4);
      expect(tipsWrapper.childNodes).toHaveLength(tipsBefore.length);
      tipsBefore.forEach((tip, index) => expect(tipsWrapper.childNodes[index]).toBe(tip));
    });

    it('should cancel a pending snap timer so it never runs', () => {
      const renderer = new ClockRenderer(config);
      renderer.animateToAngle(90);
      expect(jest.getTimerCount()).toBe(1);

      renderer.destroy();

      expect(jest.getTimerCount()).toBe(0);
      jest.advanceTimersByTime(TIMINGS.TIPS_ANIMATION);
      expect(clockHand.classList.contains(ANIMATION_CLASS)).toBe(true);
    });

    it('should not throw on multiple destroy calls', () => {
      const renderer = new ClockRenderer(config);

      expect(() => {
        renderer.destroy();
        renderer.destroy();
      }).not.toThrow();
    });
  });
});
