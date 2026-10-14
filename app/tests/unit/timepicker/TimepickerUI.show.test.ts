import TimepickerUI from '@/timepicker/TimepickerUI';
import type { TimepickerOptions } from '@/types/options';

type Opened = { picker: TimepickerUI; trigger: () => void };
type OpenerParts = { wrapper: HTMLDivElement; input: HTMLInputElement; opener: HTMLButtonElement };

interface OpenPath {
  path: string;
  mount: (options: TimepickerOptions) => Opened;
}

const OPTIONS: TimepickerOptions = { ui: { animation: false } };
const INLINE_CONTAINER_ID = 'tp-show-inline-container';

const modal = (): Element | null => document.querySelector('.tp-ui-modal');

const keydown = (target: HTMLElement, key: string): void => {
  target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
};

const createInput = (): HTMLInputElement => {
  const input = document.createElement('input');
  input.type = 'text';
  document.body.appendChild(input);
  return input;
};

const createWrapperWithOpener = (): OpenerParts => {
  const wrapper = document.createElement('div');
  wrapper.className = 'tp-ui';
  const input = document.createElement('input');
  input.type = 'text';
  const opener = document.createElement('button');
  opener.type = 'button';
  opener.setAttribute('data-open', 'picker');
  wrapper.append(input, opener);
  document.body.appendChild(wrapper);
  return { wrapper, input, opener };
};

const onInput =
  (trigger: (input: HTMLInputElement) => void) =>
  (options: TimepickerOptions): Opened => {
    const input = createInput();
    return { picker: new TimepickerUI(input, options), trigger: () => trigger(input) };
  };

const withOpener =
  (trigger: (parts: Omit<OpenerParts, 'wrapper'>) => void) =>
  (options: TimepickerOptions): Opened => {
    const { wrapper, input, opener } = createWrapperWithOpener();
    return { picker: new TimepickerUI(wrapper, options), trigger: () => trigger({ input, opener }) };
  };

const OPEN_PATHS: OpenPath[] = [
  { path: 'clicking the input', mount: onInput((input) => input.click()) },
  { path: 'pressing Enter on the input', mount: onInput((input) => keydown(input, 'Enter')) },
  { path: 'pressing Space on the input', mount: onInput((input) => keydown(input, ' ')) },
  {
    path: 'pressing Enter in the input next to a separate [data-open] button',
    mount: withOpener(({ input }) => keydown(input, 'Enter')),
  },
  { path: 'clicking a separate [data-open] button', mount: withOpener(({ opener }) => opener.click()) },
];

describe('the show event runs before the picker renders', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    TimepickerUI.destroyAll();
    jest.useRealTimers();
    document.body.innerHTML = '';
  });

  describe.each(OPEN_PATHS)('when the user opens the picker by $path', ({ mount }) => {
    it('should run an on("show") listener while no modal exists, then render the modal', () => {
      const { picker, trigger } = mount(OPTIONS);
      const showListener = jest.fn(() => modal());
      picker.on('show', showListener);
      picker.create();

      trigger();

      expect(showListener).toHaveBeenCalledTimes(1);
      expect(showListener.mock.results[0].value).toBeNull();
      expect(modal()).not.toBeNull();
    });

    it('should call callbacks.onShow while no modal exists, then render the modal', () => {
      const onShow = jest.fn(() => modal());
      const { picker, trigger } = mount({ ...OPTIONS, callbacks: { onShow } });
      picker.create();

      trigger();

      expect(onShow).toHaveBeenCalledTimes(1);
      expect(onShow.mock.results[0].value).toBeNull();
      expect(modal()).not.toBeNull();
    });

    it('should emit show exactly once, before open', () => {
      const { picker, trigger } = mount(OPTIONS);
      const order: string[] = [];
      picker.on('show', () => order.push('show'));
      picker.on('open', () => order.push('open'));
      picker.create();

      trigger();

      expect(order).toEqual(['show', 'open']);
    });
  });

  it('should emit open once and never show or open:request when opened with open()', () => {
    const { picker } = onInput(() => undefined)(OPTIONS);
    const show = jest.fn();
    const openRequest = jest.fn();
    const open = jest.fn();
    picker.on('show', show);
    picker.on('open:request', openRequest);
    picker.on('open', open);
    picker.create();

    picker.open();

    expect(open).toHaveBeenCalledTimes(1);
    expect(show).not.toHaveBeenCalled();
    expect(openRequest).not.toHaveBeenCalled();
    expect(modal()).not.toBeNull();
  });

  it('should render no modal and emit no open when a show listener destroys the picker', () => {
    const { picker, trigger } = onInput((input) => input.click())(OPTIONS);
    const open = jest.fn();
    picker.on('open', open);
    picker.on('show', () => picker.destroy());
    picker.create();

    trigger();

    expect(picker.isDestroyed).toBe(true);
    expect(modal()).toBeNull();
    expect(open).not.toHaveBeenCalled();
  });

  it('should mount an inline picker on create() without emitting show or open:request', () => {
    const container = document.createElement('div');
    container.id = INLINE_CONTAINER_ID;
    document.body.appendChild(container);
    const picker = new TimepickerUI(createInput(), {
      ui: { animation: false, inline: { enabled: true, containerId: INLINE_CONTAINER_ID } },
    });
    const show = jest.fn();
    const openRequest = jest.fn();
    picker.on('show', show);
    picker.on('open:request', openRequest);

    picker.create();

    expect(container.querySelector('.tp-ui-modal')).not.toBeNull();
    expect(show).not.toHaveBeenCalled();
    expect(openRequest).not.toHaveBeenCalled();
  });
});
