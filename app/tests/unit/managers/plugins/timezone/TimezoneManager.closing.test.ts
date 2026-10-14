import TimepickerUI from '@/timepicker/TimepickerUI';
import { PluginRegistry } from '@/core/PluginRegistry';
import { TimezonePlugin } from '@/plugins/timezone';
import TimezoneManager from '@/managers/plugins/timezone/TimezoneManager';
import { EventEmitter, type TimepickerEventMap } from '@/utils/EventEmitter';
import { TIMINGS } from '@/constants/timings';

const INPUT_VALUE = '10:30 AM';
const INLINE_CONTAINER_ID = 'timezone-closing-inline-host';
const SETTLE_MS = 1000;
const CLOSE_MS = TIMINGS.MODAL_EXIT;
const WHITELIST = ['Europe/Warsaw', 'Europe/London'];

const INLINE_ACTIONS: Array<[string, string, 'confirm' | 'cancel']> = [
  ['OK', '.tp-ui-ok-btn', 'confirm'],
  ['Cancel', '.tp-ui-cancel-btn', 'cancel'],
];

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

const pickFirstOptionByKeyboard = (dropdown: HTMLElement): void => {
  press(dropdown, 'Enter');
  press(dropdown, 'ArrowDown');
  press(dropdown, 'Enter');
};

const selectedOptions = (root: ParentNode): Element[] =>
  Array.from(root.querySelectorAll('.tp-ui-timezone-option[aria-selected="true"]'));

const useTimezonePickerLifecycle = (): void => {
  beforeAll(() => PluginRegistry.register(TimezonePlugin));

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    TimepickerUI.destroyAll();
    jest.useRealTimers();
    document.body.innerHTML = '';
  });
};

describe('timezone plugin while a modal picker is closing', () => {
  useTimezonePickerLifecycle();

  const openTimezone = (): { picker: TimepickerUI; onChange: jest.Mock } => {
    const input = document.createElement('input');
    input.value = INPUT_VALUE;
    document.body.appendChild(input);
    const picker = new TimepickerUI(input, { timezone: { enabled: true } });
    picker.create();
    picker.open();
    jest.advanceTimersByTime(SETTLE_MS);

    const onChange = jest.fn();
    picker.on('timezone:change', onChange);
    return { picker, onChange };
  };

  it('should emit timezone:change for an option click while the picker is open', () => {
    const { onChange } = openTimezone();
    const option = inModal(document, '.tp-ui-timezone-option');

    option.click();

    expect(onChange).toHaveBeenCalledWith({ timezone: option.getAttribute('data-value') });
  });

  it('should ignore an option click and a keyboard pick after Escape, and reopen on the placeholder', () => {
    const { picker, onChange } = openTimezone();

    pressEscape();
    inModal(document, '.tp-ui-timezone-option').click();
    pickFirstOptionByKeyboard(inModal(document, '.tp-ui-timezone-dropdown'));

    expect(onChange).not.toHaveBeenCalled();

    jest.advanceTimersByTime(CLOSE_MS);
    expect(document.querySelector('.tp-ui-modal')).toBeNull();

    picker.open();
    jest.advanceTimersByTime(SETTLE_MS);

    const trigger = inModal(document, '.tp-ui-timezone-selected');
    expect(trigger).toHaveAttribute('data-placeholder');
    expect(trigger.textContent).toBe(trigger.getAttribute('data-placeholder'));
    expect(selectedOptions(document)).toEqual([]);
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe('timezone plugin in an inline picker after OK and Cancel', () => {
  useTimezonePickerLifecycle();

  const mountInlineTimezone = (): { picker: TimepickerUI; container: HTMLElement } => {
    const input = document.createElement('input');
    input.value = INPUT_VALUE;
    const container = document.createElement('div');
    container.id = INLINE_CONTAINER_ID;
    document.body.append(input, container);
    const picker = new TimepickerUI(input, {
      ui: { inline: { enabled: true, containerId: INLINE_CONTAINER_ID, showButtons: true } },
      timezone: { enabled: true },
    });
    picker.create();
    jest.advanceTimersByTime(SETTLE_MS);
    return { picker, container };
  };

  it.each(INLINE_ACTIONS)(
    'should still emit timezone:change for an option click after %s',
    (_name, button, buttonEvent) => {
      const { picker, container } = mountInlineTimezone();
      const onButton = jest.fn();
      picker.on(buttonEvent, onButton);

      inModal(container, button).click();
      jest.advanceTimersByTime(SETTLE_MS);

      expect(onButton).toHaveBeenCalledTimes(1);

      const onChange = jest.fn();
      picker.on('timezone:change', onChange);
      const option = inModal(container, '.tp-ui-timezone-option');
      option.click();

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange).toHaveBeenCalledWith({ timezone: option.getAttribute('data-value') });
    },
  );
});

interface ClosedTimezoneHarness {
  readonly core: { isOpen: boolean };
  readonly manager: TimezoneManager;
  readonly onChange: jest.Mock;
  readonly dropdown: HTMLElement;
  readonly firstOption: HTMLElement;
}

describe('TimezoneManager on a core that is not open', () => {
  let harness: ClosedTimezoneHarness | null = null;

  const mount = (): ClosedTimezoneHarness => {
    const modal = document.createElement('div');
    modal.innerHTML =
      '<div class="tp-ui-timezone-dropdown" role="combobox" aria-expanded="false" tabindex="0" ' +
      'data-tz-id="closed">' +
      '<div class="tp-ui-timezone-selected" data-placeholder="Timezone...">Timezone...</div>' +
      '<div class="tp-ui-timezone-menu" role="listbox"></div>' +
      '</div>';
    document.body.appendChild(modal);

    const core = {
      isOpen: false,
      getModalElement: () => modal,
      options: { timezone: { enabled: true, whitelist: WHITELIST } },
    };
    const emitter = new EventEmitter<TimepickerEventMap>();
    const manager = new TimezoneManager(core as never, emitter);
    manager.init();

    const onChange = jest.fn();
    emitter.on('timezone:change', onChange);

    return {
      core,
      manager,
      onChange,
      dropdown: required(modal, '.tp-ui-timezone-dropdown'),
      firstOption: required(modal, '.tp-ui-timezone-option'),
    };
  };

  afterEach(() => {
    harness?.manager.destroy();
    harness = null;
    document.body.innerHTML = '';
  });

  it('should ignore an option click and a keyboard pick, and select once the core is open', () => {
    harness = mount();
    const { core, manager, onChange, dropdown, firstOption } = harness;
    expect(firstOption).toHaveAttribute('data-value', WHITELIST[0]);

    firstOption.click();
    pickFirstOptionByKeyboard(dropdown);

    expect(onChange).not.toHaveBeenCalled();
    expect(manager.getSelectedTimezone()).toBeNull();

    core.isOpen = true;
    firstOption.click();

    expect(onChange).toHaveBeenCalledWith({ timezone: WHITELIST[0] });
    expect(manager.getSelectedTimezone()).toBe(WHITELIST[0]);
  });

  it('should still apply setTimezone() on a closed core', () => {
    harness = mount();

    harness.manager.setTimezone(WHITELIST[1]);

    expect(harness.onChange).toHaveBeenCalledWith({ timezone: WHITELIST[1] });
    expect(harness.manager.getSelectedTimezone()).toBe(WHITELIST[1]);
  });
});
