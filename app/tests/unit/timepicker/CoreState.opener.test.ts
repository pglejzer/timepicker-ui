import TimepickerUI from '@/timepicker/TimepickerUI';
import { CoreState } from '@/timepicker/CoreState';
import { mergeOptions } from '@/utils/options';

const OPENER_VALUES = ["a'b", 'a"b', 'a]b', 'a\\b'];

const createWrapper = (openValue: string): { wrapper: HTMLDivElement; opener: HTMLButtonElement } => {
  const wrapper = document.createElement('div');
  wrapper.className = 'tp-ui';
  const input = document.createElement('input');
  input.type = 'text';
  const opener = document.createElement('button');
  opener.type = 'button';
  opener.setAttribute('data-open', openValue);
  wrapper.append(input, opener);
  document.body.appendChild(wrapper);
  return { wrapper, opener };
};

describe('opener elements are found whatever their data-open value contains', () => {
  afterEach(() => {
    TimepickerUI.destroyAll();
    document.body.innerHTML = '';
  });

  it.each(OPENER_VALUES)('should return the opener with data-open=%p from getOpenElement()', (openValue) => {
    const { wrapper, opener } = createWrapper(openValue);
    const core = new CoreState(wrapper, mergeOptions({}), 'tp-opener-test');

    let openers: ArrayLike<Element> = [];
    expect(() => {
      openers = core.getOpenElement();
    }).not.toThrow();

    expect(Array.from(openers)).toEqual([opener]);
  });

  it.each(OPENER_VALUES)('should create the picker and open it from the opener with data-open=%p', (openValue) => {
    const { wrapper, opener } = createWrapper(openValue);
    const picker = new TimepickerUI(wrapper, { ui: { animation: false } });

    expect(() => picker.create()).not.toThrow();
    opener.click();

    expect(document.querySelector('.tp-ui-modal')).not.toBeNull();
  });
});
