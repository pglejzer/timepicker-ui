import TimepickerUI from '@/timepicker/TimepickerUI';
import { PluginRegistry } from '@/core/PluginRegistry';
import { RangePlugin } from '@/plugins/range';
import { WheelPlugin } from '@/plugins/wheel';
import { TIMINGS } from '@/constants/timings';
import type { TimepickerOptions } from '@/types/options';
import { mockWheelItemHeight, selectedWheelValue } from '../managers/plugins/wheel/wheel-test-helpers';

const CONTAINER_ID = 'inline-confirm-cancel-host';
const CLOSE_CYCLE_MS = TIMINGS.MODAL_EXIT;

type Internals = { emitter: { emit: (event: string, data: unknown) => void } };

interface MountedInline {
  readonly picker: TimepickerUI;
  readonly input: HTMLInputElement;
  readonly container: HTMLElement;
  readonly events: Readonly<Record<'open' | 'confirm' | 'cancel', jest.Mock>>;
  readonly callbacks: Readonly<Record<'onOpen' | 'onConfirm' | 'onCancel', jest.Mock>>;
}

const CLOCKS = [
  { type: '24h', value: '10:30', raised: '11:30' },
  { type: '12h', value: '10:30 AM', raised: '11:30 AM' },
] as const;

const settle = (): void => {
  jest.advanceTimersByTime(CLOSE_CYCLE_MS);
};

const press = (element: Element, key: string): void => {
  element.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
};

const modalsIn = (root: ParentNode): NodeListOf<HTMLElement> =>
  root.querySelectorAll<HTMLElement>('.tp-ui-modal');

const part = <T extends HTMLElement = HTMLElement>(root: ParentNode, selector: string): T => {
  const element = root.querySelector<T>(`.tp-ui-modal ${selector}`);
  if (!element) throw new Error(`${selector} is not rendered in the modal`);
  return element;
};

const field = (root: ParentNode, name: 'hour' | 'minutes'): HTMLInputElement =>
  part<HTMLInputElement>(root, `.tp-ui-${name}`);

const raiseHour = (root: ParentNode): void => press(field(root, 'hour'), 'ArrowUp');
const clickOk = (root: ParentNode): void => part(root, '.tp-ui-ok-btn').click();
const clickCancel = (root: ParentNode): void => part(root, '.tp-ui-cancel-btn').click();

const useFakeTimersAndCleanUp = (): void => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    TimepickerUI.destroyAll();
    jest.restoreAllMocks();
    jest.useRealTimers();
    document.body.innerHTML = '';
  });
};

const mountInline = (value: string, options: TimepickerOptions = {}): MountedInline => {
  const input = document.createElement('input');
  input.value = value;
  const container = document.createElement('div');
  container.id = CONTAINER_ID;
  document.body.append(input, container);

  const callbacks = { onOpen: jest.fn(), onConfirm: jest.fn(), onCancel: jest.fn() };
  const picker = new TimepickerUI(input, {
    ...options,
    clock: { type: '24h', ...options.clock },
    ui: {
      ...options.ui,
      animation: false,
      inline: { enabled: true, containerId: CONTAINER_ID, showButtons: true },
    },
    callbacks,
  });
  const events = { open: jest.fn(), confirm: jest.fn(), cancel: jest.fn() };
  picker.on('open', events.open);
  picker.on('confirm', events.confirm);
  picker.on('cancel', events.cancel);

  picker.create();
  settle();

  expect(modalsIn(container)).toHaveLength(1);
  return { picker, input, container, events, callbacks };
};

describe('an inline picker stays on screen after OK and Cancel', () => {
  useFakeTimersAndCleanUp();

  describe('OK', () => {
    it.each(CLOCKS)(
      'should write the shown time to the input and fire confirm and onConfirm once ($type)',
      ({ type, value, raised }) => {
        const { container, input, events, callbacks } = mountInline(value, { clock: { type } });

        raiseHour(container);
        clickOk(container);
        settle();

        expect(input.value).toBe(raised);
        expect(events.confirm).toHaveBeenCalledTimes(1);
        expect(events.confirm).toHaveBeenCalledWith(expect.objectContaining({ hour: '11', minutes: '30' }));
        expect(callbacks.onConfirm).toHaveBeenCalledTimes(1);
        expect(callbacks.onConfirm).toHaveBeenCalledWith(events.confirm.mock.calls[0][0]);
      },
    );

    it('should keep the modal in the container once the close timers have run', () => {
      const { container } = mountInline('10:30');

      clickOk(container);
      settle();

      expect(modalsIn(container)).toHaveLength(1);
      expect(modalsIn(container)[0]).toHaveClass('tp-ui--inline');
    });

    it('should write the input again on a second OK after the time changes', () => {
      const { container, input, events } = mountInline('10:30');
      raiseHour(container);
      clickOk(container);
      settle();

      raiseHour(container);
      clickOk(container);
      settle();

      expect(input.value).toBe('12:30');
      expect(events.confirm).toHaveBeenCalledTimes(2);
      expect(events.confirm).toHaveBeenLastCalledWith(expect.objectContaining({ hour: '12', minutes: '30' }));
    });
  });

  describe('Cancel', () => {
    it('should fire cancel and onCancel once and keep the modal in the container', () => {
      const { container, events, callbacks } = mountInline('10:30');

      clickCancel(container);
      settle();

      expect(events.cancel).toHaveBeenCalledTimes(1);
      expect(callbacks.onCancel).toHaveBeenCalledTimes(1);
      expect(modalsIn(container)).toHaveLength(1);
    });

    it('should show the input time again after the hour and minutes changed without OK', () => {
      const { picker, container, input, events } = mountInline('10:30');
      raiseHour(container);
      press(field(container, 'minutes'), 'ArrowUp');
      expect(picker.getValue().time).toBe('11:31');

      clickCancel(container);
      settle();

      expect(field(container, 'hour').value).toBe('10');
      expect(field(container, 'minutes').value).toBe('30');
      expect(picker.getValue().time).toBe('10:30');
      expect(input.value).toBe('10:30');
      expect(events.confirm).not.toHaveBeenCalled();
    });

    it('should show the input period again after PM was picked without OK (12h)', () => {
      const { picker, container, input } = mountInline('10:30 AM', { clock: { type: '12h' } });
      part(container, '.tp-ui-pm').click();
      expect(picker.getValue().type).toBe('PM');

      clickCancel(container);
      settle();

      expect(picker.getValue()).toEqual(expect.objectContaining({ time: '10:30 AM', type: 'AM' }));
      expect(part(container, '.tp-ui-am')).toHaveAttribute('aria-pressed', 'true');
      expect(input.value).toBe('10:30 AM');
    });

    it('should leave focus on the Cancel button of the current modal', () => {
      const { container, events } = mountInline('10:30');
      const cancel = part(container, '.tp-ui-cancel-btn');
      cancel.focus();
      expect(document.activeElement).toBe(cancel);

      press(cancel, 'Enter');
      settle();

      expect(events.cancel).toHaveBeenCalledTimes(1);
      expect(document.activeElement).toBe(part(container, '.tp-ui-cancel-btn'));
    });

    it('should not emit open again', () => {
      const { container, events, callbacks } = mountInline('10:30');
      expect(events.open).toHaveBeenCalledTimes(1);

      clickCancel(container);
      settle();

      expect(modalsIn(container)).toHaveLength(1);
      expect(events.open).toHaveBeenCalledTimes(1);
      expect(callbacks.onOpen).toHaveBeenCalledTimes(1);
    });
  });

  describe('close() and open()', () => {
    it('should remove the modal on close() and bring it back on open()', () => {
      const { picker, container } = mountInline('10:30');

      picker.close();
      settle();
      expect(modalsIn(container)).toHaveLength(0);

      picker.open();
      settle();
      expect(modalsIn(container)).toHaveLength(1);
      expect(field(container, 'hour').value).toBe('10');
    });
  });

  describe('in wheel mode', () => {
    beforeAll(() => PluginRegistry.register(WheelPlugin));

    beforeEach(() => {
      mockWheelItemHeight();
    });

    const mountWheel = (): MountedInline => {
      const mounted = mountInline('10:30', { ui: { mode: 'wheel' } });
      expect(selectedWheelValue('hours')).toBe('10');
      return mounted;
    };

    const scrollHourDown = (container: HTMLElement): void => {
      press(part(container, '.tp-ui-wheel-hours'), 'ArrowDown');
      expect(selectedWheelValue('hours')).toBe('11');
    };

    it('should write the wheel selection to the input on OK and keep the modal in the container', () => {
      const { container, input, events } = mountWheel();
      scrollHourDown(container);

      clickOk(container);
      settle();

      expect(input.value).toBe('11:30');
      expect(events.confirm).toHaveBeenCalledTimes(1);
      expect(modalsIn(container)).toHaveLength(1);
      expect(modalsIn(container)[0]).toHaveClass('tp-ui-wheel-mode');
    });

    it('should move the wheel back to the input time on Cancel', () => {
      const { container, input } = mountWheel();
      scrollHourDown(container);

      clickCancel(container);
      settle();

      expect(selectedWheelValue('hours')).toBe('10');
      expect(selectedWheelValue('minutes')).toBe('30');
      expect(field(container, 'hour').value).toBe('10');
      expect(input.value).toBe('10:30');
      expect(modalsIn(container)).toHaveLength(1);
    });
  });

  describe('in range mode', () => {
    beforeAll(() => PluginRegistry.register(RangePlugin));

    const commitRangePart = (picker: TimepickerUI, time: string): void => {
      const [hour, minutes] = time.split(':');
      (picker as unknown as Internals).emitter.emit('range:minute:commit', { hour, minutes });
    };

    it('should write the range to the input and keep the modal in the container after range:confirm', () => {
      const { picker, container, input } = mountInline('', { range: { enabled: true } });
      const onRangeConfirm = jest.fn();
      picker.on('range:confirm', onRangeConfirm);
      commitRangePart(picker, '09:00');
      commitRangePart(picker, '09:45');
      const ok = part(container, '.tp-ui-ok-btn');
      expect(ok).toHaveAttribute('aria-disabled', 'false');

      ok.click();
      settle();

      expect(onRangeConfirm).toHaveBeenCalledTimes(1);
      expect(onRangeConfirm).toHaveBeenCalledWith({ from: '09:00', to: '09:45', duration: 45 });
      expect(input.value).toBe('09:00 - 09:45');
      expect(modalsIn(container)).toHaveLength(1);
    });
  });
});

describe('a modal picker still closes on OK and Cancel', () => {
  useFakeTimersAndCleanUp();

  const openModalAndRaiseHour = (): HTMLInputElement => {
    const input = document.createElement('input');
    input.value = '10:30';
    document.body.appendChild(input);
    const picker = new TimepickerUI(input, { clock: { type: '24h' }, ui: { animation: false } });
    picker.create();
    picker.open();
    settle();
    raiseHour(document);
    return input;
  };

  it('should write the input and remove the modal on OK', () => {
    const input = openModalAndRaiseHour();

    clickOk(document);
    settle();

    expect(input.value).toBe('11:30');
    expect(modalsIn(document)).toHaveLength(0);
  });

  it('should leave the input unchanged and remove the modal on Cancel', () => {
    const input = openModalAndRaiseHour();

    clickCancel(document);
    settle();

    expect(input.value).toBe('10:30');
    expect(modalsIn(document)).toHaveLength(0);
  });
});
