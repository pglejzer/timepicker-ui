import TimepickerUI from '@/timepicker/TimepickerUI';
import { PluginRegistry } from '@/core/PluginRegistry';
import { RangePlugin } from '@/plugins/range';
import { WheelPlugin } from '@/plugins/wheel';
import type { TimepickerEventMap } from '@/utils/EventEmitter';
import type { TimepickerOptions } from '@/types/options';
import { mockWheelItemHeight } from '../managers/plugins/wheel/wheel-test-helpers';

type KnownEvent = keyof { [K in keyof TimepickerEventMap as string extends K ? never : K]: unknown };

const EVENT_NAMES = [
  'open',
  'cancel',
  'confirm',
  'clear',
  'show',
  'open:request',
  'hide',
  'update',
  'select:hour',
  'select:minute',
  'select:second',
  'select:am',
  'select:pm',
  'select:period',
  'switch:view',
  'switch:face',
  'timezone:change',
  'range:confirm',
  'range:switch',
  'range:validation',
  'range:minute:commit',
  'range:get-disabled-time',
  'range:update-disabled',
  'wheel:scroll:start',
  'wheel:scroll:end',
  'animation:clock',
  'animation:start',
  'animation:end',
  'error',
] as const satisfies readonly KnownEvent[];

type MissingEventNames = Exclude<KnownEvent, (typeof EVENT_NAMES)[number]>;
const allEventsListed: [MissingEventNames] extends [never] ? true : false = true;

const INSTANCE_ID = 'tp-baseline';
const FROZEN_NOW = new Date(2024, 0, 15, 10, 15, 0);
const SETTLE_MS = 2000;
const UUID_PATTERN = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g;

interface RecordedEvent {
  readonly event: string;
  readonly payload: unknown;
}

interface Mounted {
  readonly picker: TimepickerUI;
  readonly input: HTMLInputElement;
  readonly container: HTMLElement;
  readonly events: RecordedEvent[];
}

interface Fixture {
  readonly name: string;
  readonly value: string;
  readonly options: TimepickerOptions;
  readonly inline?: boolean;
  readonly open: (mounted: Mounted) => void;
  readonly interact: (mounted: Mounted) => void;
  readonly confirm: (mounted: Mounted) => void;
}

type Internals = { emitter: { emit: (event: string, data: unknown) => void } };

const settle = (): void => {
  jest.advanceTimersByTime(SETTLE_MS);
};

const press = (element: Element, key: string): void => {
  element.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
};

const part = <T extends HTMLElement = HTMLElement>(selector: string): T => {
  const element = document.querySelector<T>(`.tp-ui-modal ${selector}`);
  if (!element) throw new Error(`${selector} is not rendered in the modal`);
  return element;
};

const pressRepeatedly = (selector: string, key: string, times: number): void => {
  for (let i = 0; i < times; i++) press(part(selector), key);
};

const clickOk = (): void => part('.tp-ui-ok-btn').click();

const normalize = (text: string): string => text.replace(UUID_PATTERN, '<uuid>');

const modalMarkup = (): string => {
  const root = document.querySelector('.tp-ui-modal');
  if (!root) throw new Error('no modal or inline root is rendered');
  return normalize(root.outerHTML);
};

const copyPayload = (payload: unknown): unknown =>
  typeof payload === 'object' && payload !== null ? { ...payload } : payload;

const mount = (fixture: Fixture): Mounted => {
  const input = document.createElement('input');
  input.value = fixture.value;
  const container = document.createElement('div');
  container.id = 'baseline-host';
  document.body.append(input, container);

  const options: TimepickerOptions = {
    ...fixture.options,
    behavior: { ...fixture.options.behavior, id: INSTANCE_ID },
    ui: {
      ...fixture.options.ui,
      animation: false,
      ...(fixture.inline
        ? {
            inline: {
              enabled: true,
              container,
              ...fixture.options.ui?.inline,
            },
          }
        : {}),
    },
  };

  const picker = new TimepickerUI(input, options);
  const events: RecordedEvent[] = [];
  EVENT_NAMES.forEach((event) => {
    picker.on(event, (payload: unknown) => {
      events.push({ event, payload: copyPayload(payload) });
    });
  });

  return { picker, input, container, events };
};

const openModal = ({ picker }: Mounted): void => {
  picker.create();
  picker.open();
  settle();
};

const createInline = ({ picker }: Mounted): void => {
  picker.create();
  settle();
};

const recordFixture = (fixture: Fixture): void => {
  it(fixture.name, () => {
    const mounted = mount(fixture);

    fixture.open(mounted);
    fixture.interact(mounted);
    settle();
    expect(modalMarkup()).toMatchSnapshot(`${fixture.name} - markup`);

    fixture.confirm(mounted);
    settle();
    expect(mounted.events).toMatchSnapshot(`${fixture.name} - events`);
    expect({ value: mounted.picker.getValue(), input: mounted.input.value }).toMatchSnapshot(
      `${fixture.name} - values`,
    );
  });
};

const useFrozenClockAndCleanUp = (): void => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(FROZEN_NOW);
  });

  afterEach(() => {
    TimepickerUI.destroyAll();
    jest.restoreAllMocks();
    jest.useRealTimers();
    document.body.innerHTML = '';
  });
};

describe('companion baseline - options unset', () => {
  useFrozenClockAndCleanUp();

  it('lists every event of the event map', () => {
    expect(allEventsListed).toBe(true);
  });

  describe('modal', () => {
    recordFixture({
      name: 'modal 12h defaults',
      value: '10:15 AM',
      options: {},
      open: openModal,
      interact: () => {
        press(part('.tp-ui-hour'), 'ArrowUp');
        part('.tp-ui-pm').click();
      },
      confirm: clickOk,
    });

    recordFixture({
      name: 'modal 24h seconds disabled hours and minutes',
      value: '10:20:30',
      options: {
        clock: { type: '24h', showSeconds: true, disabledTime: { hours: [1, 3], minutes: [15] } },
      },
      open: openModal,
      interact: () => {
        press(part('.tp-ui-hour'), 'ArrowUp');
        pressRepeatedly('.tp-ui-minutes', 'ArrowDown', 5);
      },
      confirm: clickOk,
    });

    recordFixture({
      name: 'modal 12h disabled ranges',
      value: '09:30 AM',
      options: { clock: { disabledTime: { ranges: ['10:00 AM - 12:00 PM'] } } },
      open: openModal,
      interact: () => {
        press(part('.tp-ui-hour'), 'ArrowUp');
      },
      confirm: clickOk,
    });
  });

  describe('inline', () => {
    recordFixture({
      name: 'inline without buttons',
      value: '10:15 AM',
      inline: true,
      options: {},
      open: createInline,
      interact: () => {
        press(part('.tp-ui-hour'), 'ArrowUp');
      },
      confirm: ({ picker }) => picker.close(true),
    });

    recordFixture({
      name: 'inline with buttons',
      value: '10:15 AM',
      inline: true,
      options: { ui: { inline: { enabled: true, showButtons: true } } },
      open: createInline,
      interact: () => {
        press(part('.tp-ui-hour'), 'ArrowUp');
        part('.tp-ui-pm').click();
      },
      confirm: clickOk,
    });
  });
});

describe('companion baseline - wheel plugin', () => {
  useFrozenClockAndCleanUp();

  beforeAll(() => {
    PluginRegistry.register(WheelPlugin);
  });

  beforeEach(() => {
    mockWheelItemHeight();
  });

  recordFixture({
    name: 'inline compact-wheel',
    value: '10:15 AM',
    inline: true,
    options: { ui: { mode: 'compact-wheel' } },
    open: createInline,
    interact: ({ picker }) => {
      picker.setValue('2:45 PM', false);
    },
    confirm: ({ picker }) => picker.close(true),
  });

  const wheelMarks = (): Record<string, string[]> => {
    const marks: Record<string, string[]> = {};
    ['hours', 'minutes', 'ampm'].forEach((column) => {
      const items = document.querySelectorAll<HTMLElement>(
        `.tp-ui-modal .tp-ui-wheel-${column} .tp-ui-wheel-item`,
      );
      marks[column] = Array.from(items)
        .filter((item) => item.getAttribute('aria-disabled') === 'true' || item.classList.contains('disabled'))
        .map((item) => `${item.getAttribute('data-value')} [${item.className}]`);
    });
    return marks;
  };

  it('wheel mode with disabled time - disabled marks', () => {
    const fixture: Fixture = {
      name: 'wheel mode disabled time',
      value: '10:20 AM',
      options: {
        ui: { mode: 'wheel' },
        clock: { disabledTime: { hours: [1, 3, 11], minutes: [15] } },
      },
      open: openModal,
      interact: () => {
        press(part('.tp-ui-wheel-hours'), 'ArrowDown');
        pressRepeatedly('.tp-ui-wheel-minutes', 'ArrowUp', 4);
      },
      confirm: clickOk,
    };
    const mounted = mount(fixture);

    fixture.open(mounted);
    expect(wheelMarks()).toMatchSnapshot('wheel mode disabled time - marks after open');

    fixture.interact(mounted);
    settle();
    expect(wheelMarks()).toMatchSnapshot('wheel mode disabled time - marks after interaction');
    expect(modalMarkup()).toMatchSnapshot('wheel mode disabled time - markup');

    fixture.confirm(mounted);
    settle();
    expect(mounted.events).toMatchSnapshot('wheel mode disabled time - events');
    expect({ value: mounted.picker.getValue(), input: mounted.input.value }).toMatchSnapshot(
      'wheel mode disabled time - values',
    );
  });
});

describe('companion baseline - range plugin', () => {
  useFrozenClockAndCleanUp();

  beforeAll(() => {
    PluginRegistry.register(RangePlugin);
  });

  const commitRangePart = ({ picker }: Mounted, hour: string, minutes: string): void => {
    (picker as unknown as Internals).emitter.emit('range:minute:commit', { hour, minutes, type: 'AM' });
  };

  const tabState = (): Record<string, Record<string, string | null>> => {
    const state: Record<string, Record<string, string | null>> = {};
    ['from', 'to'].forEach((name) => {
      const tab = part(`.tp-ui-range-tab.tp-ui-range-${name}`);
      state[name] = {
        className: tab.className,
        ariaDisabled: tab.getAttribute('aria-disabled'),
        ariaSelected: tab.getAttribute('aria-selected'),
        tabindex: tab.getAttribute('tabindex'),
        disabled: tab.getAttribute('disabled'),
      };
    });
    return state;
  };

  it('range minDuration 30 - from, switch to, to, confirm', () => {
    const fixture: Fixture = {
      name: 'range minDuration 30',
      value: '',
      options: { range: { enabled: true, minDuration: 30 } },
      open: openModal,
      interact: () => undefined,
      confirm: clickOk,
    };
    const mounted = mount(fixture);

    fixture.open(mounted);
    expect(tabState()).toMatchSnapshot('range minDuration 30 - tabs before From is complete');

    commitRangePart(mounted, '09', '00');
    settle();
    expect(tabState()).toMatchSnapshot('range minDuration 30 - tabs after From');

    commitRangePart(mounted, '09', '45');
    settle();
    expect(modalMarkup()).toMatchSnapshot('range minDuration 30 - markup');

    fixture.confirm(mounted);
    settle();
    expect(mounted.events).toMatchSnapshot('range minDuration 30 - events');
    expect({ value: mounted.picker.getValue(), input: mounted.input.value }).toMatchSnapshot(
      'range minDuration 30 - values',
    );
  });
});
