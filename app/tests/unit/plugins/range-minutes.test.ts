import { ClockRenderer } from '../../../src/managers/clock/renderer/ClockRenderer';
import type { DisabledTimeConfig, RenderConfig } from '../../../src/managers/clock/types';

function createRenderConfig(): RenderConfig {
  const tipsWrapper = document.createElement('div');
  const clockFace = document.createElement('div');
  const clockHand = document.createElement('div');
  const circle = document.createElement('div');

  tipsWrapper.getBoundingClientRect = () =>
    ({
      width: 240,
      height: 240,
      top: 0,
      left: 0,
      right: 240,
      bottom: 240,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    }) as DOMRect;

  return { clockFace, tipsWrapper, clockHand, circle };
}

const MINUTES = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'));
const TIP_CLASS = 'tp-ui-clock-minutes';
const DISABLED_CLASS = 'tp-ui-tips-disabled';

function getDisabledTips(wrapper: HTMLElement): string[] {
  const tips = wrapper.querySelectorAll(`.${DISABLED_CLASS}`);
  const values: string[] = [];
  tips.forEach((el) => {
    if (el.getAttribute('role') === 'option') {
      values.push(el.textContent || '');
    }
  });
  return values;
}

function getEnabledTips(wrapper: HTMLElement): string[] {
  const tips = wrapper.querySelectorAll('[role="option"]:not(.tp-ui-tips-disabled)');
  const values: string[] = [];
  tips.forEach((el) => values.push(el.textContent || ''));
  return values;
}

describe('Range minutes disabling on clock tips', () => {
  describe('24h mode', () => {
    it('blocks minutes only for the same hour as FROM', () => {
      const config = createRenderConfig();
      const renderer = new ClockRenderer(config);

      const disabled: DisabledTimeConfig = {
        hours: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13'],
        minutes: ['00', '05', '10'],
        rangeFromHour: 14,
      };

      renderer.renderTips(MINUTES, TIP_CLASS, 'minutes', disabled, '24h', true, undefined, '', '14');

      const disabledValues = getDisabledTips(config.tipsWrapper);
      expect(disabledValues).toContain('00');
      expect(disabledValues).toContain('05');
      expect(disabledValues).toContain('10');
      expect(disabledValues).not.toContain('15');
      expect(disabledValues).not.toContain('20');
    });

    it('does not block any minutes when TO hour differs from FROM hour', () => {
      const config = createRenderConfig();
      const renderer = new ClockRenderer(config);

      const disabled: DisabledTimeConfig = {
        hours: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13'],
        minutes: ['00', '05', '10'],
        rangeFromHour: 14,
      };

      renderer.renderTips(MINUTES, TIP_CLASS, 'minutes', disabled, '24h', true, undefined, '', '20');

      const disabledValues = getDisabledTips(config.tipsWrapper);
      expect(disabledValues).toHaveLength(0);

      const enabled = getEnabledTips(config.tipsWrapper);
      expect(enabled).toHaveLength(12);
    });

    it('does not block minutes for hour 15 when FROM is 14:15', () => {
      const config = createRenderConfig();
      const renderer = new ClockRenderer(config);

      const disabled: DisabledTimeConfig = {
        hours: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13'],
        minutes: ['00', '05', '10'],
        rangeFromHour: 14,
      };

      renderer.renderTips(MINUTES, TIP_CLASS, 'minutes', disabled, '24h', true, undefined, '', '15');

      const disabledValues = getDisabledTips(config.tipsWrapper);
      expect(disabledValues).toHaveLength(0);
    });

    it('does not block minutes for hour 23 when FROM is 14:35', () => {
      const config = createRenderConfig();
      const renderer = new ClockRenderer(config);

      const disabled: DisabledTimeConfig = {
        hours: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13'],
        minutes: ['00', '05', '10', '15', '20', '25', '30'],
        rangeFromHour: 14,
      };

      renderer.renderTips(MINUTES, TIP_CLASS, 'minutes', disabled, '24h', true, undefined, '', '23');

      const disabledValues = getDisabledTips(config.tipsWrapper);
      expect(disabledValues).toHaveLength(0);
    });

    it('blocks correct minutes for FROM hour only', () => {
      const config = createRenderConfig();
      const renderer = new ClockRenderer(config);

      const disabled: DisabledTimeConfig = {
        minutes: ['00', '05', '10', '15', '20', '25', '30'],
        rangeFromHour: 14,
      };

      renderer.renderTips(MINUTES, TIP_CLASS, 'minutes', disabled, '24h', true, undefined, '', '14');

      const disabledValues = getDisabledTips(config.tipsWrapper);
      expect(disabledValues).toEqual(['00', '05', '10', '15', '20', '25', '30']);

      const enabled = getEnabledTips(config.tipsWrapper);
      expect(enabled).toEqual(['35', '40', '45', '50', '55']);
    });
  });

  describe('12h mode', () => {
    it('blocks minutes only for same hour and same AM/PM', () => {
      const config = createRenderConfig();
      const renderer = new ClockRenderer(config);

      const disabled: DisabledTimeConfig = {
        minutes: ['00', '05', '10', '15', '20', '25'],
        rangeFromType: 'AM',
        rangeFromHour: 10,
      };

      renderer.renderTips(MINUTES, TIP_CLASS, 'minutes', disabled, '12h', true, undefined, 'AM', '10');

      const disabledValues = getDisabledTips(config.tipsWrapper);
      expect(disabledValues).toContain('00');
      expect(disabledValues).toContain('25');
      expect(disabledValues).not.toContain('30');
    });

    it('does not block minutes for a different hour same AM/PM', () => {
      const config = createRenderConfig();
      const renderer = new ClockRenderer(config);

      const disabled: DisabledTimeConfig = {
        minutes: ['00', '05', '10', '15', '20', '25'],
        rangeFromType: 'AM',
        rangeFromHour: 10,
      };

      renderer.renderTips(MINUTES, TIP_CLASS, 'minutes', disabled, '12h', true, undefined, 'AM', '11');

      const disabledValues = getDisabledTips(config.tipsWrapper);
      expect(disabledValues).toHaveLength(0);
    });

    it('does not block minutes when TO is PM and FROM is AM', () => {
      const config = createRenderConfig();
      const renderer = new ClockRenderer(config);

      const disabled: DisabledTimeConfig = {
        minutes: ['00', '05', '10', '15', '20', '25'],
        rangeFromType: 'AM',
        rangeFromHour: 10,
      };

      renderer.renderTips(MINUTES, TIP_CLASS, 'minutes', disabled, '12h', true, undefined, 'PM', '10');

      const disabledValues = getDisabledTips(config.tipsWrapper);
      expect(disabledValues).toHaveLength(0);
    });

    it('blocks all minutes when TO is AM and FROM is PM', () => {
      const config = createRenderConfig();
      const renderer = new ClockRenderer(config);

      const disabled: DisabledTimeConfig = {
        minutes: ['00', '05', '10'],
        rangeFromType: 'PM',
        rangeFromHour: 2,
      };

      renderer.renderTips(MINUTES, TIP_CLASS, 'minutes', disabled, '12h', true, undefined, 'AM', '02');

      const disabledValues = getDisabledTips(config.tipsWrapper);
      expect(disabledValues).toHaveLength(12);
    });

    it('does not block minutes after switching AM/PM to later period', () => {
      const config = createRenderConfig();
      const renderer = new ClockRenderer(config);

      const disabled: DisabledTimeConfig = {
        minutes: ['00', '05', '10', '15', '20'],
        rangeFromType: 'AM',
        rangeFromHour: 9,
      };

      renderer.renderTips(MINUTES, TIP_CLASS, 'minutes', disabled, '12h', true, undefined, 'PM', '09');

      const disabledValues = getDisabledTips(config.tipsWrapper);
      expect(disabledValues).toHaveLength(0);
    });
  });

  describe('tip class integrity', () => {
    it('applies tp-ui-tips-disabled to both wrapper and inner span', () => {
      const config = createRenderConfig();
      const renderer = new ClockRenderer(config);

      const disabled: DisabledTimeConfig = {
        minutes: ['00'],
        rangeFromHour: 14,
      };

      renderer.renderTips(MINUTES, TIP_CLASS, 'minutes', disabled, '24h', true, undefined, '', '14');

      const wrappers = config.tipsWrapper.querySelectorAll(`.${TIP_CLASS}`);
      const firstWrapper = wrappers[0];
      const innerTip = firstWrapper?.querySelector('[role="option"]');

      expect(firstWrapper?.classList.contains(DISABLED_CLASS)).toBe(true);
      expect(innerTip?.classList.contains(DISABLED_CLASS)).toBe(true);
      expect(innerTip?.getAttribute('aria-disabled')).toBe('true');
      expect(innerTip?.getAttribute('tabindex')).toBe('-1');
    });

    it('does not apply tp-ui-tips-disabled to enabled tips', () => {
      const config = createRenderConfig();
      const renderer = new ClockRenderer(config);

      const disabled: DisabledTimeConfig = {
        minutes: ['00'],
        rangeFromHour: 14,
      };

      renderer.renderTips(MINUTES, TIP_CLASS, 'minutes', disabled, '24h', true, undefined, '', '14');

      const wrappers = config.tipsWrapper.querySelectorAll(`.${TIP_CLASS}`);
      const fifthWrapper = wrappers[1];
      const innerTip = fifthWrapper?.querySelector('[role="option"]');

      expect(fifthWrapper?.classList.contains(DISABLED_CLASS)).toBe(false);
      expect(innerTip?.classList.contains(DISABLED_CLASS)).toBe(false);
      expect(innerTip?.getAttribute('aria-disabled')).toBeNull();
    });
  });
});

