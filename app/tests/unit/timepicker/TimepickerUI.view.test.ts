import type TimepickerUIClass from '@/timepicker/TimepickerUI';
import type { TimepickerOptions } from '@/types/options';
import { mockWheelItemHeight } from '../managers/plugins/wheel/wheel-test-helpers';

type TimepickerUIConstructor = typeof TimepickerUIClass;

const SETTLE_MS = 2000;
const INSTANCE_ID = 'tp-view';

const loadTimepicker = (registerWheel: boolean): TimepickerUIConstructor => {
  let ctor: TimepickerUIConstructor | undefined;
  jest.isolateModules(() => {
    ctor = require('@/timepicker/TimepickerUI').default;
    if (registerWheel) {
      const { PluginRegistry } = require('@/core/PluginRegistry');
      const { WheelPlugin } = require('@/plugins/wheel');
      PluginRegistry.register(WheelPlugin);
    }
  });
  if (!ctor) throw new Error('TimepickerUI failed to load');
  return ctor;
};

const settle = (): void => {
  jest.advanceTimersByTime(SETTLE_MS);
};

const wrapper = (): HTMLElement => document.querySelector('.tp-ui-wrapper') as HTMLElement;
const isClockView = (): boolean => wrapper().classList.contains('expanded');
const isKeyboardView = (): boolean =>
  wrapper().classList.contains('mobile') && !wrapper().classList.contains('expanded');
const modal = (): HTMLElement => document.querySelector('.tp-ui-modal') as HTMLElement;

describe('TimepickerUI views', () => {
  let Ctor: TimepickerUIConstructor;

  const mount = (
    options: TimepickerOptions = {},
    { open = true, plugins = false }: { open?: boolean; plugins?: boolean } = {},
  ): { picker: TimepickerUIClass; input: HTMLInputElement; onError: jest.Mock } => {
    Ctor = loadTimepicker(plugins);
    const input = document.createElement('input');
    document.body.appendChild(input);
    const picker = new Ctor(input, {
      ...options,
      behavior: { ...options.behavior, id: INSTANCE_ID },
      ui: { animation: false, ...options.ui },
    });
    picker.create();
    const onError = jest.fn();
    picker.on('error', onError);
    if (open) {
      picker.open();
      settle();
    }
    return { picker, input, onError };
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    Ctor?.destroyAll();
    jest.restoreAllMocks();
    jest.useRealTimers();
    document.body.innerHTML = '';
  });

  it('switches an open picker to the keyboard view once and reports it', () => {
    const { picker } = mount();
    const onSwitch = jest.fn();
    picker.on('switch:view', onSwitch);
    expect(isClockView()).toBe(true);

    expect(picker.setView('keyboard')).toBe(true);
    settle();

    expect(isKeyboardView()).toBe(true);
    expect(onSwitch).toHaveBeenCalledTimes(1);
    expect(onSwitch).toHaveBeenCalledWith({ view: 'keyboard' });
    expect(picker.getView()).toBe('keyboard');

    expect(picker.setView('keyboard')).toBe(true);
    settle();

    expect(onSwitch).toHaveBeenCalledTimes(1);
  });

  it('keeps the typed hour and minutes across a round trip', () => {
    const { picker } = mount({ clock: { type: '12h' } });
    picker.setValue('10:15 AM');

    picker.setView('keyboard');
    settle();
    picker.setView('clock');
    settle();

    expect(isClockView()).toBe(true);
    expect((modal().querySelector('.tp-ui-hour') as HTMLInputElement).value).toBe('10');
    expect((modal().querySelector('.tp-ui-minutes') as HTMLInputElement).value).toBe('15');
  });

  describe('while closed', () => {
    it('starts the next open in the pending view, then falls back to ui.initialView', () => {
      const { picker } = mount({}, { open: false });
      expect(picker.getView()).toBe('clock');

      expect(picker.setView('keyboard')).toBe(true);
      expect(picker.getView()).toBe('keyboard');

      picker.open();
      settle();
      expect(isKeyboardView()).toBe(true);
      expect(picker.getView()).toBe('keyboard');

      picker.close();
      settle();
      expect(picker.getView()).toBe('clock');

      picker.open();
      settle();
      expect(isClockView()).toBe(true);
      expect(picker.getView()).toBe('clock');
    });
  });

  describe('setOptions', () => {
    it('keeps the keyboard view for an unrelated change', () => {
      const { picker } = mount({ ui: { initialView: 'keyboard' } });
      expect(isKeyboardView()).toBe(true);

      picker.setOptions({ labels: { ok: 'Done' } });
      settle();

      expect(isKeyboardView()).toBe(true);
      expect((modal().querySelector('.tp-ui-ok-btn') as HTMLElement).textContent).toBe('Done');
      expect(picker.getView()).toBe('keyboard');
    });

    it('switches to the new initial view when ui.initialView changes', () => {
      const { picker } = mount({ ui: { initialView: 'keyboard' } });
      expect(isKeyboardView()).toBe(true);

      picker.setOptions({ ui: { initialView: 'clock' } });
      settle();

      expect(isClockView()).toBe(true);
      expect(picker.getView()).toBe('clock');
    });

    it('emits one switch:view and calls onSwitchView once when ui.initialView changes', () => {
      const onSwitchView = jest.fn();
      const { picker } = mount({ ui: { initialView: 'keyboard' }, callbacks: { onSwitchView } });
      const onSwitch = jest.fn();
      picker.on('switch:view', onSwitch);
      onSwitchView.mockClear();

      picker.setOptions({ ui: { initialView: 'clock' } });
      settle();

      expect(onSwitch).toHaveBeenCalledTimes(1);
      expect(onSwitch).toHaveBeenCalledWith({ view: 'clock' });
      expect(onSwitchView).toHaveBeenCalledTimes(1);
      expect(onSwitchView).toHaveBeenCalledWith({ view: 'clock' });
      expect(isClockView()).toBe(true);
    });

    it('emits no switch:view when ui.initialView is unchanged or set to the current value', () => {
      const { picker } = mount({ ui: { initialView: 'keyboard' } });
      const onSwitch = jest.fn();
      picker.on('switch:view', onSwitch);

      picker.setOptions({ labels: { ok: 'Done' } });
      settle();
      picker.setOptions({ ui: { initialView: 'keyboard' } });
      settle();

      expect(onSwitch).not.toHaveBeenCalled();
      expect(isKeyboardView()).toBe(true);
    });

    it('emits no switch:view while closed and starts the next open in the new view', () => {
      const { picker } = mount({}, { open: false });
      const onSwitch = jest.fn();
      picker.on('switch:view', onSwitch);

      picker.setOptions({ ui: { initialView: 'keyboard' } });
      settle();

      expect(onSwitch).not.toHaveBeenCalled();

      picker.open();
      settle();

      expect(isKeyboardView()).toBe(true);
      expect(picker.getView()).toBe('keyboard');
    });

    it('keeps a view chosen with setView across an unrelated change, without switch:view', () => {
      const { picker } = mount();
      picker.setView('keyboard');
      settle();
      const onSwitch = jest.fn();
      picker.on('switch:view', onSwitch);

      picker.setOptions({ labels: { ok: 'Done' } });
      settle();

      expect(onSwitch).not.toHaveBeenCalled();
      expect(isKeyboardView()).toBe(true);
      expect(picker.getView()).toBe('keyboard');
    });

    it.each(['wheel', 'compact-wheel'] as const)('emits no switch:view in ui.mode %s', (mode) => {
      mockWheelItemHeight();
      const { picker } = mount({ ui: { mode } }, { plugins: true });
      const onSwitch = jest.fn();
      picker.on('switch:view', onSwitch);

      picker.setOptions({ ui: { initialView: 'keyboard' } });
      settle();

      expect(onSwitch).not.toHaveBeenCalled();
      expect(picker.getView()).toBeNull();
    });
  });

  it('inline: Cancel returns to ui.initialView', () => {
    const container = document.createElement('div');
    document.body.appendChild(container);
    const { picker } = mount(
      { ui: { inline: { enabled: true, container, showButtons: true } } },
      { open: false },
    );
    settle();

    picker.setView('keyboard');
    settle();
    expect(isKeyboardView()).toBe(true);

    (modal().querySelector('.tp-ui-cancel-btn') as HTMLElement).click();
    settle();

    expect(isClockView()).toBe(true);
    expect(picker.getView()).toBe('clock');
  });

  it('applies the last of two calls made during the animation', () => {
    const { picker } = mount({ ui: { animation: true } });

    picker.setView('keyboard');
    picker.setView('clock');
    settle();
    settle();

    expect(isClockView()).toBe(true);
    expect(picker.getView()).toBe('clock');
  });

  describe('focus', () => {
    it('moves from the dial to the active time input on a keyboard switch', () => {
      const { picker } = mount();
      const clockFace = modal().querySelector('.tp-ui-clock-face') as HTMLElement;
      clockFace.focus();
      expect(document.activeElement).toBe(clockFace);

      picker.setView('keyboard');
      settle();

      const active = modal().querySelector('input.active') ?? modal().querySelector('.tp-ui-hour');
      expect(document.activeElement).toBe(active);
    });

    it('leaves focus on the OK button', () => {
      const { picker } = mount();
      const ok = modal().querySelector('.tp-ui-ok-btn') as HTMLElement;
      ok.focus();
      expect(document.activeElement).toBe(ok);

      picker.setView('keyboard');
      settle();

      expect(document.activeElement).toBe(ok);
    });
  });

  describe.each(['wheel', 'compact-wheel'] as const)('ui.mode %s', (mode) => {
    it('has no keyboard view: false, null, no error and no switch icon', () => {
      mockWheelItemHeight();
      const { picker, onError } = mount({ ui: { mode, enableSwitchIcon: true } }, { plugins: true });

      expect(picker.setView('keyboard')).toBe(false);
      expect(picker.getView()).toBeNull();
      expect(onError).not.toHaveBeenCalled();
      expect(modal().querySelector('.tp-ui-keyboard-icon-wrapper')).toBeNull();
    });
  });

  it('rejects a value other than clock or keyboard with one error', () => {
    const { picker, onError } = mount();

    expect(picker.setView('dial' as never)).toBe(false);

    expect(onError).toHaveBeenCalledTimes(1);
    expect(isClockView()).toBe(true);
  });

  describe('the library switch button', () => {
    it('emits the target view and passes the same payload to callbacks.onSwitchView', () => {
      const onSwitchView = jest.fn();
      const { picker } = mount({ ui: { enableSwitchIcon: true }, callbacks: { onSwitchView } });
      const onSwitch = jest.fn();
      picker.on('switch:view', onSwitch);
      const icon = (): HTMLElement => modal().querySelector('.tp-ui-keyboard-icon') as HTMLElement;

      icon().click();
      settle();

      expect(onSwitch).toHaveBeenLastCalledWith({ view: 'keyboard' });
      expect(onSwitchView).toHaveBeenLastCalledWith({ view: 'keyboard' });
      expect(isKeyboardView()).toBe(true);

      icon().click();
      settle();

      expect(onSwitch).toHaveBeenLastCalledWith({ view: 'clock' });
      expect(onSwitchView).toHaveBeenLastCalledWith({ view: 'clock' });
      expect(onSwitch).toHaveBeenCalledTimes(2);
      expect(isClockView()).toBe(true);
    });
  });

  it('after destroy: setView is false and getView is null', () => {
    const { picker } = mount();

    picker.destroy();

    expect(picker.setView('keyboard')).toBe(false);
    expect(picker.getView()).toBeNull();
  });
});
