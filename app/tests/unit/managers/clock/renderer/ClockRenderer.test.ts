import { ClockRenderer } from '../../../../../src/managers/clock/renderer/ClockRenderer';
import type { RenderConfig } from '../../../../../src/managers/clock/types';

describe('ClockRenderer', () => {
  let config: RenderConfig;
  let tipsWrapper: HTMLDivElement;
  let tipsWrapperFor24h: HTMLDivElement;
  let clockHand: HTMLDivElement;
  let circle: HTMLDivElement;
  let clockFace: HTMLDivElement;

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
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should add animation class', () => {
      const renderer = new ClockRenderer(config);

      renderer.animateToAngle(90);

      expect(tipsWrapper.classList.contains('tp-ui-tips-animation')).toBe(true);
    });

    it('should remove animation class after timeout', () => {
      const renderer = new ClockRenderer(config);

      renderer.animateToAngle(90);
      jest.advanceTimersByTime(450);

      expect(tipsWrapper.classList.contains('tp-ui-tips-animation')).toBe(false);
    });

    it('should set hand angle', () => {
      const renderer = new ClockRenderer(config);

      renderer.animateToAngle(180);

      expect(clockHand.style.transform).toContain('180');
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
      expect(tip.getAttribute('aria-selected')).toBe('true');
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
  });

  describe('setCircleSize', () => {
    it('should remove small-circle class when large', () => {
      const renderer = new ClockRenderer(config);
      circle.classList.add('small-circle');

      renderer.setCircleSize(true);

      expect(circle.classList.contains('small-circle')).toBe(false);
    });

    it('should add small-circle class when small', () => {
      const renderer = new ClockRenderer(config);

      renderer.setCircleSize(false);

      expect(circle.classList.contains('small-circle')).toBe(true);
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
  });

  describe('destroy', () => {
    it('should clear tips wrapper', () => {
      const renderer = new ClockRenderer(config);
      const tip = document.createElement('span');
      tipsWrapper.appendChild(tip);

      renderer.destroy();

      expect(tipsWrapper.innerHTML).toBe('');
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
