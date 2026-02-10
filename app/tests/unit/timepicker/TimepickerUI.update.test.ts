import TimepickerUI from '../../../src/timepicker/TimepickerUI';
import { CoreState } from '../../../src/timepicker/CoreState';

type CoreWithDisabledTime = {
  disabledTime: {
    value?: {
      isInterval?: boolean;
      intervals?: string[];
      clockType?: string;
      hours?: string[];
      minutes?: string[];
    };
  } | null;
};

function getPrivateCore(timepicker: TimepickerUI): CoreState {
  return (timepicker as unknown as { core: CoreState }).core;
}

describe('TimepickerUI.update() - functional tests', () => {
  let container: HTMLElement;
  let input: HTMLInputElement;

  beforeEach(() => {
    container = document.createElement('div');
    input = document.createElement('input');
    input.type = 'text';
    container.appendChild(input);
    document.body.appendChild(container);
  });

  afterEach(() => {
    TimepickerUI.destroyAll();
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  describe('clock options update', () => {
    it('should update clock.type from 12h to 24h', () => {
      const timepicker = new TimepickerUI(input, { clock: { type: '12h' } });
      timepicker.create();

      timepicker.update({ options: { clock: { type: '24h' } }, create: true });

      expect(timepicker.options.clock.type).toBe('24h');

      timepicker.destroy();
    });

    it('should update clock.type from 24h to 12h', () => {
      const timepicker = new TimepickerUI(input, { clock: { type: '24h' } });
      timepicker.create();

      timepicker.update({ options: { clock: { type: '12h' } }, create: true });

      expect(timepicker.options.clock.type).toBe('12h');

      timepicker.destroy();
    });

    it('should update clock.incrementHours', () => {
      const timepicker = new TimepickerUI(input, { clock: { incrementHours: 1 } });
      timepicker.create();

      timepicker.update({ options: { clock: { incrementHours: 2 } }, create: true });

      expect(timepicker.options.clock.incrementHours).toBe(2);

      timepicker.destroy();
    });

    it('should update clock.incrementMinutes', () => {
      const timepicker = new TimepickerUI(input, { clock: { incrementMinutes: 1 } });
      timepicker.create();

      timepicker.update({ options: { clock: { incrementMinutes: 5 } }, create: true });

      expect(timepicker.options.clock.incrementMinutes).toBe(5);

      timepicker.destroy();
    });

    it('should update clock.autoSwitchToMinutes', () => {
      const timepicker = new TimepickerUI(input, { clock: { autoSwitchToMinutes: true } });
      timepicker.create();

      timepicker.update({ options: { clock: { autoSwitchToMinutes: false } }, create: true });

      expect(timepicker.options.clock.autoSwitchToMinutes).toBe(false);

      timepicker.destroy();
    });

    it('should update clock.smoothHourSnap', () => {
      const timepicker = new TimepickerUI(input, { clock: { smoothHourSnap: true } });
      timepicker.create();

      timepicker.update({ options: { clock: { smoothHourSnap: false } }, create: true });

      expect(timepicker.options.clock.smoothHourSnap).toBe(false);

      timepicker.destroy();
    });

    it('should update clock.disabledTime.hours - options level', () => {
      const timepicker = new TimepickerUI(input, {
        clock: { type: '24h', disabledTime: { hours: [1, 2, 3] } },
      });
      timepicker.create();

      timepicker.update({
        options: { clock: { disabledTime: { hours: [10, 11, 12] } } },
        create: true,
      });

      expect(timepicker.options.clock.disabledTime?.hours).toEqual([10, 11, 12]);

      timepicker.destroy();
    });

    it('should update clock.disabledTime.hours - state level (processed)', () => {
      const timepicker = new TimepickerUI(input, {
        clock: { type: '24h', disabledTime: { hours: [1, 2, 3] } },
      });
      timepicker.create();

      const coreBefore = getPrivateCore(timepicker) as unknown as CoreWithDisabledTime;
      const disabledBefore = coreBefore.disabledTime?.value?.hours;
      expect(disabledBefore).toBeDefined();
      expect(disabledBefore).toContain('1');
      expect(disabledBefore).toContain('2');
      expect(disabledBefore).toContain('3');

      timepicker.update({
        options: { clock: { disabledTime: { hours: [10, 11, 12] } } },
        create: true,
      });

      const coreAfter = getPrivateCore(timepicker) as unknown as CoreWithDisabledTime;
      const disabledAfter = coreAfter.disabledTime?.value?.hours;
      expect(disabledAfter).toBeDefined();
      expect(disabledAfter).toContain('10');
      expect(disabledAfter).toContain('11');
      expect(disabledAfter).toContain('12');
      expect(disabledAfter).not.toContain('1');
      expect(disabledAfter).not.toContain('2');
      expect(disabledAfter).not.toContain('3');

      timepicker.destroy();
    });

    it('should update clock.disabledTime.minutes', () => {
      const timepicker = new TimepickerUI(input, {
        clock: { type: '24h', disabledTime: { minutes: [0, 15, 30, 45] } },
      });
      timepicker.create();

      const coreBefore = getPrivateCore(timepicker) as unknown as CoreWithDisabledTime;
      const disabledMinutesBefore = coreBefore.disabledTime?.value?.minutes;
      expect(disabledMinutesBefore).toBeDefined();
      expect(disabledMinutesBefore).toContain('00');
      expect(disabledMinutesBefore).toContain('15');

      timepicker.update({
        options: { clock: { disabledTime: { minutes: [5, 10, 20] } } },
        create: true,
      });

      const coreAfter = getPrivateCore(timepicker) as unknown as CoreWithDisabledTime;
      const disabledMinutesAfter = coreAfter.disabledTime?.value?.minutes;
      expect(disabledMinutesAfter).toBeDefined();
      expect(disabledMinutesAfter).toContain('05');
      expect(disabledMinutesAfter).toContain('10');
      expect(disabledMinutesAfter).toContain('20');
      expect(disabledMinutesAfter).not.toContain('00');
      expect(disabledMinutesAfter).not.toContain('15');

      timepicker.destroy();
    });

    it('should clear clock.disabledTime when set to empty', () => {
      const timepicker = new TimepickerUI(input, {
        clock: { type: '24h', disabledTime: { hours: [1, 2, 3] } },
      });
      timepicker.create();

      timepicker.update({
        options: { clock: { disabledTime: {} } },
        create: true,
      });

      const core = getPrivateCore(timepicker) as unknown as CoreWithDisabledTime;
      expect(core.disabledTime).toBeNull();

      timepicker.destroy();
    });

    it('should update clock.disabledTime.interval - single interval', () => {
      const timepicker = new TimepickerUI(input, {
        clock: { type: '24h', disabledTime: { interval: '09:00 - 12:00' } },
      });
      timepicker.create();

      const coreBefore = getPrivateCore(timepicker) as unknown as CoreWithDisabledTime;
      expect(coreBefore.disabledTime?.value?.isInterval).toBe(true);
      expect(coreBefore.disabledTime?.value?.intervals).toContain('09:00 - 12:00');

      timepicker.update({
        options: { clock: { disabledTime: { interval: '14:00 - 18:00' } } },
        create: true,
      });

      const coreAfter = getPrivateCore(timepicker) as unknown as CoreWithDisabledTime;
      expect(coreAfter.disabledTime?.value?.isInterval).toBe(true);
      expect(coreAfter.disabledTime?.value?.intervals).toContain('14:00 - 18:00');
      expect(coreAfter.disabledTime?.value?.intervals).not.toContain('09:00 - 12:00');

      timepicker.destroy();
    });

    it('should update clock.disabledTime.interval - multiple intervals', () => {
      const timepicker = new TimepickerUI(input, {
        clock: { type: '24h', disabledTime: { interval: ['09:00 - 12:00', '14:00 - 16:00'] } },
      });
      timepicker.create();

      const coreBefore = getPrivateCore(timepicker) as unknown as CoreWithDisabledTime;
      expect(coreBefore.disabledTime?.value?.intervals?.length).toBe(2);

      timepicker.update({
        options: {
          clock: { disabledTime: { interval: ['06:00 - 08:00', '18:00 - 22:00', '23:00 - 00:00'] } },
        },
        create: true,
      });

      const coreAfter = getPrivateCore(timepicker) as unknown as CoreWithDisabledTime;
      expect(coreAfter.disabledTime?.value?.intervals?.length).toBe(3);
      expect(coreAfter.disabledTime?.value?.intervals).toContain('06:00 - 08:00');
      expect(coreAfter.disabledTime?.value?.intervals).toContain('18:00 - 22:00');
      expect(coreAfter.disabledTime?.value?.intervals).not.toContain('09:00 - 12:00');

      timepicker.destroy();
    });

    it('should update from hours to interval', () => {
      const timepicker = new TimepickerUI(input, {
        clock: { type: '24h', disabledTime: { hours: [1, 2, 3] } },
      });
      timepicker.create();

      const coreBefore = getPrivateCore(timepicker) as unknown as CoreWithDisabledTime;
      expect(coreBefore.disabledTime?.value?.hours).toBeDefined();
      expect(coreBefore.disabledTime?.value?.isInterval).toBeFalsy();

      timepicker.update({
        options: { clock: { disabledTime: { interval: '10:00 - 14:00' } } },
        create: true,
      });

      const coreAfter = getPrivateCore(timepicker) as unknown as CoreWithDisabledTime;
      expect(coreAfter.disabledTime?.value?.isInterval).toBe(true);
      expect(coreAfter.disabledTime?.value?.intervals).toContain('10:00 - 14:00');

      timepicker.destroy();
    });

    it('should update from interval to hours', () => {
      const timepicker = new TimepickerUI(input, {
        clock: { type: '24h', disabledTime: { interval: '10:00 - 14:00' } },
      });
      timepicker.create();

      const coreBefore = getPrivateCore(timepicker) as unknown as CoreWithDisabledTime;
      expect(coreBefore.disabledTime?.value?.isInterval).toBe(true);

      timepicker.update({
        options: { clock: { disabledTime: { hours: [20, 21, 22] } } },
        create: true,
      });

      const coreAfter = getPrivateCore(timepicker) as unknown as CoreWithDisabledTime;
      expect(coreAfter.disabledTime?.value?.hours).toContain('20');
      expect(coreAfter.disabledTime?.value?.hours).toContain('21');
      expect(coreAfter.disabledTime?.value?.hours).toContain('22');
      expect(coreAfter.disabledTime?.value?.isInterval).toBeFalsy();

      timepicker.destroy();
    });

    it('should update interval in 12h clock format', () => {
      const timepicker = new TimepickerUI(input, {
        clock: { type: '12h', disabledTime: { interval: '09:00 AM - 11:00 AM' } },
      });
      timepicker.create();

      const coreBefore = getPrivateCore(timepicker) as unknown as CoreWithDisabledTime;
      expect(coreBefore.disabledTime?.value?.isInterval).toBe(true);
      expect(coreBefore.disabledTime?.value?.clockType).toBe('12h');

      timepicker.update({
        options: { clock: { disabledTime: { interval: '02:00 PM - 06:00 PM' } } },
        create: true,
      });

      const coreAfter = getPrivateCore(timepicker) as unknown as CoreWithDisabledTime;
      expect(coreAfter.disabledTime?.value?.isInterval).toBe(true);
      expect(coreAfter.disabledTime?.value?.intervals).toContain('02:00 PM - 06:00 PM');
      expect(coreAfter.disabledTime?.value?.intervals).not.toContain('09:00 AM - 11:00 AM');

      timepicker.destroy();
    });

    it('should clear interval disabledTime when set to empty', () => {
      const timepicker = new TimepickerUI(input, {
        clock: { type: '24h', disabledTime: { interval: '09:00 - 12:00' } },
      });
      timepicker.create();

      timepicker.update({
        options: { clock: { disabledTime: {} } },
        create: true,
      });

      const core = getPrivateCore(timepicker) as unknown as CoreWithDisabledTime;
      expect(core.disabledTime).toBeNull();

      timepicker.destroy();
    });
  });

  describe('ui options update', () => {
    it('should update ui.theme', () => {
      const timepicker = new TimepickerUI(input, { ui: { theme: 'basic' } });
      timepicker.create();

      timepicker.update({ options: { ui: { theme: 'dark' } }, create: true });

      expect(timepicker.options.ui.theme).toBe('dark');

      timepicker.destroy();
    });

    it('should update ui.animation', () => {
      const timepicker = new TimepickerUI(input, { ui: { animation: true } });
      timepicker.create();

      timepicker.update({ options: { ui: { animation: false } }, create: true });

      expect(timepicker.options.ui.animation).toBe(false);

      timepicker.destroy();
    });

    it('should update ui.backdrop', () => {
      const timepicker = new TimepickerUI(input, { ui: { backdrop: true } });
      timepicker.create();

      timepicker.update({ options: { ui: { backdrop: false } }, create: true });

      expect(timepicker.options.ui.backdrop).toBe(false);

      timepicker.destroy();
    });

    it('should update ui.mobile', () => {
      const timepicker = new TimepickerUI(input, { ui: { mobile: false } });
      timepicker.create();

      timepicker.update({ options: { ui: { mobile: true } }, create: true });

      expect(timepicker.options.ui.mobile).toBe(true);

      timepicker.destroy();
    });

    it('should update ui.editable', () => {
      const timepicker = new TimepickerUI(input, { ui: { editable: false } });
      timepicker.create();

      timepicker.update({ options: { ui: { editable: true } }, create: true });

      expect(timepicker.options.ui.editable).toBe(true);

      timepicker.destroy();
    });

    it('should update ui.enableSwitchIcon', () => {
      const timepicker = new TimepickerUI(input, { ui: { enableSwitchIcon: false } });
      timepicker.create();

      timepicker.update({ options: { ui: { enableSwitchIcon: true } }, create: true });

      expect(timepicker.options.ui.enableSwitchIcon).toBe(true);

      timepicker.destroy();
    });
  });

  describe('labels options update', () => {
    it('should update labels.am', () => {
      const timepicker = new TimepickerUI(input, { labels: { am: 'AM' } });
      timepicker.create();

      timepicker.update({ options: { labels: { am: 'A.M.' } }, create: true });

      expect(timepicker.options.labels.am).toBe('A.M.');

      timepicker.destroy();
    });

    it('should update labels.pm', () => {
      const timepicker = new TimepickerUI(input, { labels: { pm: 'PM' } });
      timepicker.create();

      timepicker.update({ options: { labels: { pm: 'P.M.' } }, create: true });

      expect(timepicker.options.labels.pm).toBe('P.M.');

      timepicker.destroy();
    });

    it('should update labels.ok', () => {
      const timepicker = new TimepickerUI(input, { labels: { ok: 'OK' } });
      timepicker.create();

      timepicker.update({ options: { labels: { ok: 'Confirm' } }, create: true });

      expect(timepicker.options.labels.ok).toBe('Confirm');

      timepicker.destroy();
    });

    it('should update labels.cancel', () => {
      const timepicker = new TimepickerUI(input, { labels: { cancel: 'Cancel' } });
      timepicker.create();

      timepicker.update({ options: { labels: { cancel: 'Abort' } }, create: true });

      expect(timepicker.options.labels.cancel).toBe('Abort');

      timepicker.destroy();
    });
  });

  describe('behavior options update', () => {
    it('should update behavior.focusTrap', () => {
      const timepicker = new TimepickerUI(input, { behavior: { focusTrap: true } });
      timepicker.create();

      timepicker.update({ options: { behavior: { focusTrap: false } }, create: true });

      expect(timepicker.options.behavior.focusTrap).toBe(false);

      timepicker.destroy();
    });

    it('should update behavior.focusInputAfterClose', () => {
      const timepicker = new TimepickerUI(input, { behavior: { focusInputAfterClose: false } });
      timepicker.create();

      timepicker.update({ options: { behavior: { focusInputAfterClose: true } }, create: true });

      expect(timepicker.options.behavior.focusInputAfterClose).toBe(true);

      timepicker.destroy();
    });

    it('should update behavior.delayHandler', () => {
      const timepicker = new TimepickerUI(input, { behavior: { delayHandler: 300 } });
      timepicker.create();

      timepicker.update({ options: { behavior: { delayHandler: 500 } }, create: true });

      expect(timepicker.options.behavior.delayHandler).toBe(500);

      timepicker.destroy();
    });
  });

  describe('callbacks options update', () => {
    it('should update callbacks.onOpen', () => {
      const initialCallback = jest.fn();
      const newCallback = jest.fn();

      const timepicker = new TimepickerUI(input, { callbacks: { onOpen: initialCallback } });
      timepicker.create();

      timepicker.update({ options: { callbacks: { onOpen: newCallback } }, create: true });

      expect(timepicker.options.callbacks.onOpen).toBe(newCallback);

      timepicker.destroy();
    });

    it('should update callbacks.onConfirm', () => {
      const initialCallback = jest.fn();
      const newCallback = jest.fn();

      const timepicker = new TimepickerUI(input, { callbacks: { onConfirm: initialCallback } });
      timepicker.create();

      timepicker.update({ options: { callbacks: { onConfirm: newCallback } }, create: true });

      expect(timepicker.options.callbacks.onConfirm).toBe(newCallback);

      timepicker.destroy();
    });
  });

  describe('multiple options update at once', () => {
    it('should update clock and ui options together', () => {
      const timepicker = new TimepickerUI(input, {
        clock: { type: '12h' },
        ui: { theme: 'basic' },
      });
      timepicker.create();

      timepicker.update({
        options: {
          clock: { type: '24h' },
          ui: { theme: 'dark' },
        },
        create: true,
      });

      expect(timepicker.options.clock.type).toBe('24h');
      expect(timepicker.options.ui.theme).toBe('dark');

      timepicker.destroy();
    });

    it('should update all option groups together', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();

      const onConfirm = jest.fn();

      timepicker.update({
        options: {
          clock: { type: '24h', incrementMinutes: 5 },
          ui: { theme: 'dark', animation: false },
          labels: { ok: 'Apply', cancel: 'Discard' },
          behavior: { focusTrap: false },
          callbacks: { onConfirm },
        },
        create: true,
      });

      expect(timepicker.options.clock.type).toBe('24h');
      expect(timepicker.options.clock.incrementMinutes).toBe(5);
      expect(timepicker.options.ui.theme).toBe('dark');
      expect(timepicker.options.ui.animation).toBe(false);
      expect(timepicker.options.labels.ok).toBe('Apply');
      expect(timepicker.options.labels.cancel).toBe('Discard');
      expect(timepicker.options.behavior.focusTrap).toBe(false);
      expect(timepicker.options.callbacks.onConfirm).toBe(onConfirm);

      timepicker.destroy();
    });
  });

  describe('update without create flag', () => {
    it('should update options but not reinitialize when create is false', () => {
      const timepicker = new TimepickerUI(input, { clock: { type: '12h' } });
      timepicker.create();

      timepicker.update({ options: { clock: { type: '24h' } } });

      expect(timepicker.options.clock.type).toBe('24h');

      timepicker.destroy();
    });
  });

  describe('edge cases', () => {
    it('should preserve unspecified options when updating', () => {
      const timepicker = new TimepickerUI(input, {
        clock: { type: '24h', incrementMinutes: 5 },
      });
      timepicker.create();

      timepicker.update({ options: { clock: { type: '12h' } }, create: true });

      expect(timepicker.options.clock.type).toBe('12h');
      expect(timepicker.options.clock.incrementMinutes).toBe(5);

      timepicker.destroy();
    });

    it('should handle empty options object', () => {
      const timepicker = new TimepickerUI(input, { clock: { type: '24h' } });
      timepicker.create();

      expect(() => timepicker.update({ options: {} })).not.toThrow();
      expect(timepicker.options.clock.type).toBe('24h');

      timepicker.destroy();
    });

    it('should call callback after update completes', () => {
      const timepicker = new TimepickerUI(input);
      timepicker.create();
      const callback = jest.fn();

      timepicker.update({ options: { clock: { type: '24h' } }, create: true }, callback);

      expect(callback).toHaveBeenCalledTimes(1);

      timepicker.destroy();
    });
  });

  describe('disabledTime DOM verification', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    function getHourTipsWithDisabledClass(): string[] {
      const tips = document.querySelectorAll(
        '.tp-ui-hour-time-24.tp-ui-tips-disabled .tp-ui-value-tips-24h, .tp-ui-hour-time-12.tp-ui-tips-disabled .tp-ui-value-tips',
      );
      return Array.from(tips).map((el) => el.textContent?.trim() ?? '');
    }

    function getAllHourTipsDisabledMap(): Record<string, boolean> {
      const map: Record<string, boolean> = {};
      const tips24 = document.querySelectorAll('.tp-ui-hour-time-24');
      const tips12 = document.querySelectorAll('.tp-ui-hour-time-12');
      tips24.forEach((tip) => {
        const value = tip.querySelector('.tp-ui-value-tips-24h')?.textContent?.trim() ?? '';
        if (value) {
          map[value] = tip.classList.contains('tp-ui-tips-disabled');
        }
      });
      tips12.forEach((tip) => {
        const value = tip.querySelector('.tp-ui-value-tips')?.textContent?.trim() ?? '';
        if (value) {
          map[value] = tip.classList.contains('tp-ui-tips-disabled');
        }
      });
      return map;
    }

    it('should render disabled class on hour tips after create and open (24h mode)', () => {
      const timepicker = new TimepickerUI(input, {
        clock: { type: '24h', disabledTime: { hours: [9, 10, 11, 12] } },
      });
      timepicker.create();
      timepicker.open();

      const disabledHours = getHourTipsWithDisabledClass();
      expect(disabledHours).toContain('9');
      expect(disabledHours).toContain('10');
      expect(disabledHours).toContain('11');
      expect(disabledHours).toContain('12');
      expect(disabledHours).not.toContain('00');
      expect(disabledHours).not.toContain('1');
      expect(disabledHours).not.toContain('8');

      timepicker.destroy();
    });

    it('should update disabled class on hour tips after update() (24h mode)', () => {
      const timepicker = new TimepickerUI(input, {
        clock: { type: '24h', disabledTime: { hours: [9, 10, 11, 12] } },
      });
      timepicker.create();
      timepicker.open();

      const tips12Before = document.querySelectorAll('.tp-ui-hour-time-12');
      const tips24Before = document.querySelectorAll('.tp-ui-hour-time-24');

      expect(tips12Before.length).toBe(12);
      expect(tips24Before.length).toBe(12);

      const values24Before = Array.from(tips24Before).map(
        (t) => t.querySelector('.tp-ui-value-tips-24h')?.textContent,
      );
      expect(values24Before).toContain('00');

      const disabledBefore = getHourTipsWithDisabledClass();
      expect(disabledBefore).toContain('9');
      expect(disabledBefore).not.toContain('00');

      const coreDisabled1 = (
        timepicker as unknown as { core: { disabledTime: { value: { hours: string[] } } } }
      ).core.disabledTime.value.hours;
      expect(coreDisabled1).toContain('9');
      expect(coreDisabled1).toContain('10');

      timepicker.update({
        options: { clock: { disabledTime: { hours: [0, 1, 2, 3, 4, 5, 6, 7, 8] } } },
        create: true,
      });

      const coreDisabled2 = (
        timepicker as unknown as { core: { disabledTime: { value: { hours: string[] } } } }
      ).core.disabledTime.value.hours;
      expect(coreDisabled2).toContain('00');
      expect(coreDisabled2).toContain('1');
      expect(coreDisabled2).not.toContain('9');

      timepicker.close();
      jest.runAllTimers();

      timepicker.open();
      jest.runAllTimers();

      const tips12After = document.querySelectorAll('.tp-ui-hour-time-12');
      const tips24After = document.querySelectorAll('.tp-ui-hour-time-24');

      expect(tips12After.length).toBe(12);
      expect(tips24After.length).toBe(12);

      const values24After = Array.from(tips24After).map(
        (t) => t.querySelector('.tp-ui-value-tips-24h')?.textContent,
      );
      expect(values24After).toContain('00');

      const disabled24After = Array.from(tips24After)
        .filter((t) => t.classList.contains('tp-ui-tips-disabled'))
        .map((t) => t.querySelector('.tp-ui-value-tips-24h')?.textContent);
      expect(disabled24After).toContain('00');

      const disabledAfter = getHourTipsWithDisabledClass();
      expect(disabledAfter).toContain('00');
      expect(disabledAfter).toContain('1');
      expect(disabledAfter).toContain('2');
      expect(disabledAfter).toContain('3');
      expect(disabledAfter).toContain('8');
      expect(disabledAfter).not.toContain('9');
      expect(disabledAfter).not.toContain('10');
      expect(disabledAfter).not.toContain('11');
      expect(disabledAfter).not.toContain('12');

      timepicker.destroy();
    });

    it('should verify disabled map before and after update (24h mode)', () => {
      const timepicker = new TimepickerUI(input, {
        clock: { type: '24h', disabledTime: { hours: [9, 10, 11, 12] } },
      });
      timepicker.create();
      timepicker.open();

      const mapBefore = getAllHourTipsDisabledMap();
      expect(mapBefore['9']).toBe(true);
      expect(mapBefore['10']).toBe(true);
      expect(mapBefore['11']).toBe(true);
      expect(mapBefore['12']).toBe(true);
      expect(mapBefore['00']).toBe(false);
      expect(mapBefore['1']).toBe(false);

      timepicker.close();
      timepicker.update({
        options: { clock: { disabledTime: { hours: [0, 1, 2, 3, 4, 5, 6, 7, 8] } } },
        create: true,
      });
      timepicker.open();

      const mapAfter = getAllHourTipsDisabledMap();
      expect(mapAfter['00']).toBe(true);
      expect(mapAfter['1']).toBe(true);
      expect(mapAfter['8']).toBe(true);
      expect(mapAfter['9']).toBe(false);
      expect(mapAfter['10']).toBe(false);
      expect(mapAfter['12']).toBe(false);

      timepicker.destroy();
    });

    it('should clear all disabled classes when disabledTime is set to empty', () => {
      const timepicker = new TimepickerUI(input, {
        clock: { type: '24h', disabledTime: { hours: [9, 10, 11, 12] } },
      });
      timepicker.create();
      timepicker.open();

      const disabledBefore = getHourTipsWithDisabledClass();
      expect(disabledBefore.length).toBeGreaterThan(0);

      timepicker.close();
      timepicker.update({
        options: { clock: { disabledTime: {} } },
        create: true,
      });
      timepicker.open();

      const disabledAfter = getHourTipsWithDisabledClass();
      expect(disabledAfter.length).toBe(0);

      timepicker.destroy();
    });
  });
});

