import TimepickerUI from '@/timepicker/TimepickerUI';

const modal = (): Element | null => document.querySelector('.tp-ui-modal');

const createContainer = (className = ''): { container: HTMLDivElement; input: HTMLInputElement } => {
  const container = document.createElement('div');
  container.className = className;
  const input = document.createElement('input');
  input.type = 'text';
  container.appendChild(input);
  document.body.appendChild(container);
  return { container, input };
};

describe('the root element a picker is mounted on', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    TimepickerUI.destroyAll();
    jest.useRealTimers();
    document.body.innerHTML = '';
  });

  describe('a container that holds an input', () => {
    type WithOpener = { container: HTMLDivElement; input: HTMLInputElement; opener: HTMLElement };

    const createWithOpener = (): WithOpener => {
      const { container, input } = createContainer();
      container.id = 'root-with-opener';
      const opener = document.createElement('button');
      opener.type = 'button';
      opener.setAttribute('data-open', 'picker');
      container.appendChild(opener);
      return { container, input, opener };
    };

    it.each<[string, (container: HTMLElement) => string | HTMLElement]>([
      ['the element', (container) => container],
      ['a selector', (container) => `#${container.id}`],
    ])('should become the tp-ui root when passed as %s, without wrapping the input', (_name, target) => {
      const { container, input } = createWithOpener();

      const picker = new TimepickerUI(target(container));

      expect(picker.getElement()).toBe(container);
      expect(container).toHaveClass('tp-ui');
      expect(input.parentElement).toBe(container);
      expect(document.querySelectorAll('.tp-ui')).toHaveLength(1);
    });

    it('should open from its [data-open] button and not from an input click', () => {
      const { container, input, opener } = createWithOpener();
      const picker = new TimepickerUI(container, { ui: { animation: false } });
      picker.create();

      input.click();

      expect(modal()).toBeNull();
      expect(input).not.toHaveAttribute('data-open');

      opener.click();

      expect(modal()).not.toBeNull();
    });
  });

  describe('an input', () => {
    it('should be wrapped in a new div.tp-ui in its place when its parent is not a tp-ui root', () => {
      const { container, input } = createContainer();
      const sibling = document.createElement('span');
      container.appendChild(sibling);

      const picker = new TimepickerUI(input);

      const root = picker.getElement();
      expect(root).not.toBe(container);
      expect(root.tagName).toBe('DIV');
      expect(root).toHaveClass('tp-ui');
      expect(input.parentElement).toBe(root);
      expect(root.parentElement).toBe(container);
      expect(root.nextElementSibling).toBe(sibling);
      expect(container).not.toHaveClass('tp-ui');
    });

    it('should reuse an existing .tp-ui parent instead of wrapping again', () => {
      const { container, input } = createContainer('tp-ui');

      const picker = new TimepickerUI(input);

      expect(picker.getElement()).toBe(container);
      expect(input.parentElement).toBe(container);
      expect(document.querySelectorAll('.tp-ui')).toHaveLength(1);
    });

    it('should open from an input click when it is its own opener', () => {
      const { input } = createContainer();
      const picker = new TimepickerUI(input, { ui: { animation: false } });
      picker.create();

      input.click();

      expect(modal()).not.toBeNull();
    });
  });

  describe('a target without an input', () => {
    it.each<[string, (container: HTMLElement) => string | HTMLElement]>([
      ['an element', (container) => container],
      ['a selector', (container) => `#${container.id}`],
    ])('should throw for %s and leave it without the tp-ui class', (_name, target) => {
      const container = document.createElement('div');
      container.id = 'root-without-input';
      container.appendChild(document.createElement('button'));
      document.body.appendChild(container);

      expect(() => new TimepickerUI(target(container))).toThrow('Input element not found');
      expect(container).not.toHaveClass('tp-ui');
      expect(TimepickerUI.getAllInstances()).toHaveLength(0);
    });

    it('should throw for a selector that matches nothing', () => {
      expect(() => new TimepickerUI('#missing-root')).toThrow('Input element not found');
    });
  });
});
