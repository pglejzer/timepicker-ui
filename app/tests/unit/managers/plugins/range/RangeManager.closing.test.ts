import TimepickerUI from '@/timepicker/TimepickerUI';
import { PluginRegistry } from '@/core/PluginRegistry';
import { RangePlugin } from '@/plugins/range';
import RangeManager from '@/managers/plugins/range/RangeManager';
import { EventEmitter, type TimepickerEventMap } from '@/utils/EventEmitter';
import { TIMINGS } from '@/constants/timings';

type WatchedEvent = 'range:switch' | 'select:am' | 'select:pm';
type EventLog = Record<WatchedEvent, jest.Mock>;
type Subscribe = (event: WatchedEvent, handler: jest.Mock) => void;

const WATCHED: readonly WatchedEvent[] = ['range:switch', 'select:am', 'select:pm'];

const RANGE_VALUE = '09:00 AM - 05:00 PM';
const INLINE_CONTAINER_ID = 'range-closing-inline-host';
const SETTLE_MS = 1000;
const CLOSE_MS = TIMINGS.MODAL_EXIT;
const TO_TAB = '.tp-ui-range-tab.tp-ui-range-to';

const INLINE_ACTIONS: Array<[string, string, 'range:confirm' | 'cancel']> = [
  ['OK', '.tp-ui-ok-btn', 'range:confirm'],
  ['Cancel', '.tp-ui-cancel-btn', 'cancel'],
];

const watchEvents = (subscribe: Subscribe): EventLog => {
  const log = {} as EventLog;
  WATCHED.forEach((event) => {
    log[event] = jest.fn();
    subscribe(event, log[event]);
  });
  return log;
};

const firedEvents = (log: EventLog): WatchedEvent[] =>
  WATCHED.filter((event) => log[event].mock.calls.length > 0);

const press = (target: Element, key: string): void => {
  target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
};

const pressEscape = (): void => {
  document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
};

const required = (root: ParentNode, selector: string): HTMLElement => {
  const element = root.querySelector<HTMLElement>(selector);
  if (!element) throw new Error(`${selector} is not rendered`);
  return element;
};

const inModal = (root: ParentNode, selector: string): HTMLElement =>
  required(root, `.tp-ui-modal ${selector}`);

const activateByClickEnterAndSpace = (tab: HTMLElement): void => {
  tab.click();
  press(tab, 'Enter');
  press(tab, ' ');
};

const useRangePickerLifecycle = (): void => {
  beforeAll(() => PluginRegistry.register(RangePlugin));

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    TimepickerUI.destroyAll();
    jest.useRealTimers();
    document.body.innerHTML = '';
  });
};

describe('range plugin while a modal picker is closing', () => {
  useRangePickerLifecycle();

  const openRange = (): EventLog => {
    const input = document.createElement('input');
    input.value = RANGE_VALUE;
    document.body.appendChild(input);
    const picker = new TimepickerUI(input, { range: { enabled: true } });
    picker.create();
    picker.open();
    jest.advanceTimersByTime(SETTLE_MS);
    expect(inModal(document, TO_TAB)).toHaveAttribute('aria-disabled', 'false');

    return watchEvents((event, handler) => picker.on(event, handler));
  };

  it('should switch to the To part on a To tab click while the picker is open', () => {
    const log = openRange();

    inModal(document, TO_TAB).click();

    expect(log['range:switch']).toHaveBeenCalledWith(expect.objectContaining({ active: 'to' }));
    expect(log['select:pm']).toHaveBeenCalled();
    expect(inModal(document, TO_TAB)).toHaveAttribute('aria-selected', 'true');
  });

  it('should ignore a click, Enter and Space on the To tab after Escape while the modal fades out', () => {
    const log = openRange();

    pressEscape();
    const toTab = inModal(document, TO_TAB);
    activateByClickEnterAndSpace(toTab);

    expect(firedEvents(log)).toEqual([]);
    expect(toTab).toHaveAttribute('aria-selected', 'false');

    jest.advanceTimersByTime(CLOSE_MS);

    expect(document.querySelector('.tp-ui-modal')).toBeNull();
    expect(firedEvents(log)).toEqual([]);
  });
});

describe('range plugin in an inline picker after OK and Cancel', () => {
  useRangePickerLifecycle();

  const mountInlineRange = (): { picker: TimepickerUI; container: HTMLElement } => {
    const input = document.createElement('input');
    input.value = RANGE_VALUE;
    const container = document.createElement('div');
    container.id = INLINE_CONTAINER_ID;
    document.body.append(input, container);
    const picker = new TimepickerUI(input, {
      ui: { inline: { enabled: true, containerId: INLINE_CONTAINER_ID, showButtons: true } },
      range: { enabled: true },
    });
    picker.create();
    jest.advanceTimersByTime(SETTLE_MS);
    return { picker, container };
  };

  it.each(INLINE_ACTIONS)(
    'should still switch to the To part on a To tab click after %s',
    (_name, button, buttonEvent) => {
      const { picker, container } = mountInlineRange();
      const onButton = jest.fn();
      picker.on(buttonEvent, onButton);

      inModal(container, button).click();
      jest.advanceTimersByTime(SETTLE_MS);

      expect(onButton).toHaveBeenCalledTimes(1);

      const log = watchEvents((event, handler) => picker.on(event, handler));
      const toTab = inModal(container, TO_TAB);
      toTab.click();

      expect(log['range:switch']).toHaveBeenCalledWith(expect.objectContaining({ active: 'to' }));
      expect(toTab).toHaveAttribute('aria-selected', 'true');
    },
  );
});

interface ClosedRangeHarness {
  readonly core: { isOpen: boolean };
  readonly emitter: EventEmitter<TimepickerEventMap>;
  readonly toTab: HTMLElement;
}

describe('RangeManager on a core that is not open', () => {
  let manager: RangeManager | null = null;

  const mount = (): ClosedRangeHarness => {
    const modal = document.createElement('div');
    modal.innerHTML =
      '<button type="button" class="tp-ui-range-tab tp-ui-range-from"></button>' +
      '<button type="button" class="tp-ui-range-tab tp-ui-range-to"></button>' +
      '<span class="tp-ui-range-from-time"></span><span class="tp-ui-range-to-time"></span>' +
      '<input class="tp-ui-hour" value="12"><input class="tp-ui-minutes" value="00">' +
      '<div class="tp-ui-type-mode tp-ui-am"></div><div class="tp-ui-type-mode tp-ui-pm"></div>' +
      '<div class="tp-ui-ok-btn" role="button" tabindex="0">OK</div>';
    document.body.appendChild(modal);

    const core = {
      isOpen: false,
      getModalElement: () => modal,
      getInput: () => ({ value: RANGE_VALUE }),
      getHour: () => required(modal, '.tp-ui-hour'),
      getMinutes: () => required(modal, '.tp-ui-minutes'),
      getSeconds: () => null,
      getAM: () => required(modal, '.tp-ui-am'),
      getPM: () => required(modal, '.tp-ui-pm'),
      getActiveType: () => 'AM',
      getOkButton: () => required(modal, '.tp-ui-ok-btn'),
      options: {
        range: { enabled: true, minDuration: undefined, maxDuration: undefined },
        clock: { type: '12h' },
      },
    };

    const emitter = new EventEmitter<TimepickerEventMap>();
    const created = new RangeManager(core as never, emitter);
    created.init();
    manager = created;

    return { core, emitter, toTab: required(modal, TO_TAB) };
  };

  afterEach(() => {
    manager?.destroy();
    manager = null;
    document.body.innerHTML = '';
  });

  it('should ignore a click, Enter and Space on the To tab, and switch once the core is open', () => {
    const { core, emitter, toTab } = mount();
    const log = watchEvents((event, handler) => emitter.on(event, handler));
    expect(toTab).toHaveAttribute('aria-disabled', 'false');

    activateByClickEnterAndSpace(toTab);

    expect(firedEvents(log)).toEqual([]);
    expect(manager?.getActivePart()).toBe('from');
    expect(toTab).toHaveAttribute('aria-selected', 'false');

    core.isOpen = true;
    toTab.click();

    expect(log['range:switch']).toHaveBeenCalledWith(expect.objectContaining({ active: 'to' }));
    expect(manager?.getActivePart()).toBe('to');
  });
});
