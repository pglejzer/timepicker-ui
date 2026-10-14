import type { TimepickerOptions } from '@/types/options';
import {
  createPopoverFixture,
  GlobalStubs,
  placeBox,
  POPOVER_TOKENS,
  setMetrics,
  stubAnimationFrames,
  stubCssSupports,
  stubLayoutViewport,
  stubPopoverTokens,
  stubResizeObserver,
  stubVisualViewport,
  type AnimationFrames,
  type Box,
  type FakeResizeObserver,
  type PopoverFixture,
} from './popover-test-helpers';

const WHEEL_12H_WITH_SECONDS = 312;
const WRAPPER_BORDER = 2;
const PICKER_HEIGHT = 300;
const INPUT_HEIGHT = 40;
const GAP_AND_EDGE_MARGIN = 8;

interface PickerSize {
  contentWidth?: number;
  border?: number;
  height?: number;
}

describe('PopoverManager - JS fallback positioning', () => {
  let stubs: GlobalStubs;
  let frames: AnimationFrames;
  let observers: FakeResizeObserver[];
  let mounted: PopoverFixture[];

  const mount = (
    options: TimepickerOptions = {},
    inputBox: Box = { top: 100, left: 50, width: 200, height: 40 },
  ) => {
    const fixture = createPopoverFixture({ options });
    mounted.push(fixture);
    const inputRect = placeBox(fixture.input, inputBox);
    return { ...fixture, inputBox, inputRect };
  };

  const sizePicker = (
    { wheel, wrapper, modal }: PopoverFixture,
    { contentWidth = 240, border = 0, height = PICKER_HEIGHT }: PickerSize = {},
  ): void => {
    setMetrics(wheel, { scrollWidth: contentWidth });
    setMetrics(wrapper, { offsetWidth: 300 + border, clientWidth: 300 });
    setMetrics(modal, { offsetHeight: height });
  };

  const mountWithRoom = (options: TimepickerOptions, above: number, below: number) => {
    const inputBox = { top: above + GAP_AND_EDGE_MARGIN, left: 50, width: 200, height: INPUT_HEIGHT };
    stubLayoutViewport(stubs, 1024, inputBox.top + INPUT_HEIGHT + GAP_AND_EDGE_MARGIN + below);
    return mount(options, inputBox);
  };

  const addWheelItem = ({ wheel }: PopoverFixture, offsetHeight: number): void => {
    const item = document.createElement('div');
    item.className = 'tp-ui-wheel-item';
    wheel.appendChild(item);
    setMetrics(item, { offsetHeight });
  };

  beforeEach(() => {
    mounted = [];
    stubs = new GlobalStubs();
    stubCssSupports(stubs, []);
    stubLayoutViewport(stubs, 1024, 768);
    stubs.set(window, 'visualViewport', undefined);
    stubs.set(window, 'devicePixelRatio', 1);
    frames = stubAnimationFrames(stubs);
    observers = stubResizeObserver(stubs);
  });

  afterEach(() => {
    mounted.forEach(({ manager }) => manager.destroy());
    jest.restoreAllMocks();
    stubs.restore();
    document.body.innerHTML = '';
  });

  describe('on attach', () => {
    it('positions the picker synchronously with inline pixel geometry', () => {
      const fixture = mount({ wheel: { placement: 'bottom' } });
      const { modal, manager } = fixture;
      sizePicker(fixture);

      manager.attach();

      expect(modal).toHaveClass('tp-ui-popover');
      expect(modal).not.toHaveClass('tp-ui-popover-anchored');
      expect(modal).not.toHaveAttribute('popover');
      expect(modal).toHaveAttribute('data-popover-request', 'bottom');
      expect(modal).toHaveAttribute('data-popover-placement', 'bottom');
      expect(modal.style.top).toBe('144px');
      expect(modal.style.left).toBe('50px');
      expect(modal.style.width).toBe('260px');
      expect(frames.request).not.toHaveBeenCalled();
    });

    it('writes the resolved side, not the request, to data-popover-placement', () => {
      const fixture = mount({ wheel: { placement: 'auto' } }, { top: 600, left: 50, width: 200, height: 40 });
      sizePicker(fixture);

      fixture.manager.attach();

      expect(fixture.modal).toHaveAttribute('data-popover-request', 'auto');
      expect(fixture.modal).toHaveAttribute('data-popover-placement', 'top');
      expect(fixture.modal.style.top).toBe('296px');
    });

    it('sizes the picker to the wheel content plus the wrapper border', () => {
      const fixture = mount();
      sizePicker(fixture, { contentWidth: WHEEL_12H_WITH_SECONDS, border: WRAPPER_BORDER });

      fixture.manager.attach();

      expect(fixture.modal.style.width).toBe('314px');
    });

    it('caps the width at the layout viewport width minus both edge margins', () => {
      stubLayoutViewport(stubs, 300, 768);
      const fixture = mount();
      sizePicker(fixture, { contentWidth: WHEEL_12H_WITH_SECONDS, border: WRAPPER_BORDER });

      fixture.manager.attach();

      expect(fixture.modal.style.width).toBe('292px');
      expect(fixture.modal.style.left).toBe('4px');
    });

    it('clamps the width with documentElement.clientWidth while the visual viewport is pinch-zoomed', () => {
      stubLayoutViewport(stubs, 400, 800);
      stubVisualViewport(stubs, { width: 200, height: 400, offsetLeft: 100, offsetTop: 0 });
      const fixture = mount({}, { top: 50, left: 150, width: 120, height: 40 });
      sizePicker(fixture, { contentWidth: WHEEL_12H_WITH_SECONDS, border: WRAPPER_BORDER });

      fixture.manager.attach();

      expect(fixture.modal.style.width).toBe('314px');
      expect(fixture.modal.style.left).toBe('104px');
      expect(fixture.modal.style.top).toBe('94px');
    });

    it("uses the gap, max width and edge margin the modal's custom properties resolve to", () => {
      stubPopoverTokens({
        '--tp-popover-gap': '10px',
        '--tp-popover-max-width': '300px',
        '--tp-popover-edge-margin': '0px',
      });
      const fixture = mount({}, { top: 100, left: 0, width: 200, height: 40 });
      sizePicker(fixture, { contentWidth: WHEEL_12H_WITH_SECONDS, border: WRAPPER_BORDER });

      fixture.manager.attach();

      expect(fixture.modal.style.width).toBe('300px');
      expect(fixture.modal.style.top).toBe('150px');
      expect(fixture.modal.style.left).toBe('0px');
    });

    it('uses the pixel value a 1rem gap resolves to', () => {
      stubPopoverTokens({ '--tp-popover-gap': '16px' });
      const fixture = mount({ wheel: { placement: 'bottom' } });
      sizePicker(fixture);

      fixture.manager.attach();

      expect(fixture.modal.style.top).toBe('156px');
      expect(fixture.modal.style.left).toBe('50px');
      expect(fixture.modal.style.width).toBe('260px');
    });

    it.each([
      ['none', 'none'],
      ['a percentage', '50%'],
      ['a negative length', '-2px'],
    ])('keeps the default tokens when the custom properties resolve to %s', (_case, value) => {
      stubPopoverTokens(Object.fromEntries(POPOVER_TOKENS.map((token) => [token, value])));
      const fixture = mount({}, { top: 100, left: 0, width: 200, height: 40 });
      sizePicker(fixture, { contentWidth: 0 });

      fixture.manager.attach();

      expect(fixture.modal.style.width).toBe('260px');
      expect(fixture.modal.style.top).toBe('144px');
      expect(fixture.modal.style.left).toBe('4px');
    });

    it('resolves each token once through a hidden probe inside the modal and removes the probe', () => {
      const tokens = stubPopoverTokens();
      const fixture = mount();
      sizePicker(fixture);

      fixture.manager.attach();

      const probes = [...new Set(tokens.reads.map(({ probe }) => probe))];
      expect(tokens.reads.map(({ token }) => token).sort()).toEqual([...POPOVER_TOKENS].sort());
      expect(tokens.reads.every(({ scope }) => scope === fixture.modal)).toBe(true);
      expect(probes).toHaveLength(1);
      expect(probes[0].style.visibility).toBe('hidden');
      expect(probes[0].style.position).toBe('absolute');
      expect(probes[0].isConnected).toBe(false);
      expect(fixture.modal.childElementCount).toBe(1);
      expect(fixture.modal.firstElementChild).toBe(fixture.wrapper);
    });

    it("aligns the picker's right edge with the input in right-to-left layouts", () => {
      const fixture = mount({}, { top: 100, left: 500, width: 200, height: 40 });
      sizePicker(fixture, { contentWidth: WHEEL_12H_WITH_SECONDS, border: WRAPPER_BORDER });
      fixture.input.style.direction = 'rtl';

      fixture.manager.attach();

      expect(fixture.modal.style.left).toBe('386px');
      expect(fixture.modal).not.toHaveAttribute('data-popover-dir');
    });

    it.each([
      ['the wheel mode', { ui: { mode: 'wheel' }, wheel: { placement: 'bottom' } }],
      ['compact-wheel without a placement', { wheel: { placement: undefined } }],
    ] as Array<[string, TimepickerOptions]>)('does nothing in %s', (_case, options) => {
      const fixture = mount(options);
      sizePicker(fixture);

      fixture.manager.attach();

      expect(fixture.modal).not.toHaveClass('tp-ui-popover');
      expect(fixture.modal).not.toHaveAttribute('data-popover-request');
      expect(fixture.modal.style.top).toBe('');
      expect(observers).toHaveLength(0);
    });
  });

  describe('constrained height', () => {
    it('adds the constrained class and available height when neither side fits and removes them once it fits', () => {
      stubLayoutViewport(stubs, 1024, 300);
      const fixture = mount({}, { top: 130, left: 50, width: 200, height: 40 });
      sizePicker(fixture);
      fixture.manager.attach();

      expect(fixture.modal).toHaveClass('tp-ui-popover-constrained');
      expect(fixture.modal.style.getPropertyValue('--tp-popover-available-height')).toBe('122px');
      expect(fixture.modal).toHaveAttribute('data-popover-placement', 'bottom');
      expect(fixture.modal.style.top).toBe('174px');

      stubLayoutViewport(stubs, 1024, 768);
      window.dispatchEvent(new Event('resize'));
      frames.flush();

      expect(fixture.modal).not.toHaveClass('tp-ui-popover-constrained');
      expect(fixture.modal.style.getPropertyValue('--tp-popover-available-height')).toBe('');
      expect(fixture.modal.style.top).toBe('174px');
    });

    it('keeps measuring the natural height from the wrapper while the modal is constrained', () => {
      stubLayoutViewport(stubs, 1024, 300);
      const fixture = mount({}, { top: 130, left: 50, width: 200, height: 40 });
      sizePicker(fixture, { height: 122 });
      setMetrics(fixture.wrapper, { scrollHeight: 298, offsetHeight: 124, clientHeight: 122 });

      fixture.manager.attach();

      expect(fixture.modal).toHaveClass('tp-ui-popover-constrained');
      expect(fixture.modal.style.getPropertyValue('--tp-popover-available-height')).toBe('122px');
    });
  });

  describe('forced placement with too little room', () => {
    it('opens below when the room above is under three measured wheel items', () => {
      const fixture = mountWithRoom({ wheel: { placement: 'top' } }, 100, 400);
      sizePicker(fixture);
      addWheelItem(fixture, 40);

      fixture.manager.attach();

      expect(fixture.modal).toHaveAttribute('data-popover-request', 'top');
      expect(fixture.modal).toHaveAttribute('data-popover-placement', 'bottom');
      expect(fixture.modal.style.top).toBe('152px');
      expect(fixture.modal).not.toHaveClass('tp-ui-popover-constrained');
    });

    it('stays above and constrained when the room above holds three measured wheel items', () => {
      const fixture = mountWithRoom({ wheel: { placement: 'top' } }, 130, 400);
      sizePicker(fixture);
      addWheelItem(fixture, 40);

      fixture.manager.attach();

      expect(fixture.modal).toHaveAttribute('data-popover-placement', 'top');
      expect(fixture.modal).toHaveClass('tp-ui-popover-constrained');
      expect(fixture.modal.style.getPropertyValue('--tp-popover-available-height')).toBe('130px');
      expect(fixture.modal.style.top).toBe('4px');
    });

    it('uses --tp-wheel-item-height when the wheel item measures 0', () => {
      stubPopoverTokens({ '--tp-wheel-item-height': '50px' });
      const fixture = mountWithRoom({ wheel: { placement: 'top' } }, 140, 400);
      sizePicker(fixture);
      addWheelItem(fixture, 0);

      fixture.manager.attach();

      expect(fixture.modal).toHaveAttribute('data-popover-placement', 'bottom');
      expect(fixture.modal.style.top).toBe('192px');
    });

    it.each([['none'], ['50%']])(
      'keeps the 44px wheel item when --tp-wheel-item-height resolves to %s',
      (value) => {
        stubPopoverTokens({ '--tp-wheel-item-height': value });
        const fixture = mountWithRoom({ wheel: { placement: 'top' } }, 140, 400);
        sizePicker(fixture);
        addWheelItem(fixture, 0);

        fixture.manager.attach();

        expect(fixture.modal).toHaveAttribute('data-popover-placement', 'top');
        expect(fixture.modal).toHaveClass('tp-ui-popover-constrained');
        expect(fixture.modal.style.top).toBe('4px');
      },
    );

    it('uses a 44px wheel item when the modal has neither a wheel item nor the custom property', () => {
      stubPopoverTokens();
      const fixture = mountWithRoom({ wheel: { placement: 'top' } }, 130, 400);
      sizePicker(fixture);

      fixture.manager.attach();

      expect(fixture.modal).toHaveAttribute('data-popover-placement', 'bottom');
      expect(fixture.modal.style.top).toBe('182px');
    });
  });

  describe('repositioning', () => {
    it('repositions on the next animation frame after a window resize', () => {
      const fixture = mount();
      sizePicker(fixture);
      fixture.manager.attach();
      expect(fixture.modal.style.top).toBe('144px');

      fixture.inputBox.top = 300;
      window.dispatchEvent(new Event('resize'));

      expect(fixture.modal.style.top).toBe('144px');
      expect(frames.pending()).toBe(1);

      frames.flush();

      expect(fixture.modal.style.top).toBe('344px');
    });

    it('keeps the attach-time tokens and direction on a repositioning frame without reading styles again', () => {
      const resolved: Record<string, string> = { '--tp-popover-gap': '16px' };
      const tokens = stubPopoverTokens(resolved);
      const fixture = mount({ wheel: { placement: 'bottom' } }, { top: 100, left: 500, width: 200, height: 40 });
      sizePicker(fixture);
      fixture.input.style.direction = 'rtl';
      fixture.manager.attach();
      const styleReadsAtAttach = tokens.computedStyle.mock.calls.length;
      const inputReads = tokens.computedStyle.mock.calls.filter(([element]) => element === fixture.input);

      expect(tokens.reads).toHaveLength(POPOVER_TOKENS.length);
      expect(inputReads).toHaveLength(1);
      expect(fixture.modal.style.top).toBe('156px');
      expect(fixture.modal.style.left).toBe('440px');

      resolved['--tp-popover-gap'] = '30px';
      fixture.input.style.direction = 'ltr';
      fixture.inputBox.top = 300;
      window.dispatchEvent(new Event('resize'));
      frames.flush();

      expect(fixture.modal.style.top).toBe('356px');
      expect(fixture.modal.style.left).toBe('440px');
      expect(tokens.computedStyle).toHaveBeenCalledTimes(styleReadsAtAttach);
    });

    it('coalesces several triggers within one frame into a single reposition', () => {
      const viewport = stubVisualViewport(stubs);
      const fixture = mount();
      sizePicker(fixture);
      fixture.manager.attach();
      expect(fixture.inputRect).toHaveBeenCalledTimes(1);

      window.dispatchEvent(new Event('resize'));
      document.dispatchEvent(new Event('scroll'));
      viewport.dispatchEvent(new Event('resize'));
      viewport.dispatchEvent(new Event('scroll'));
      observers[0].trigger();

      expect(frames.request).toHaveBeenCalledTimes(1);

      frames.flush();

      expect(fixture.inputRect).toHaveBeenCalledTimes(2);

      window.dispatchEvent(new Event('resize'));

      expect(frames.request).toHaveBeenCalledTimes(2);
    });

    it('ignores scroll events that come from inside the picker', () => {
      const fixture = mount();
      sizePicker(fixture);
      fixture.manager.attach();
      const outsideScroller = document.createElement('div');
      document.body.appendChild(outsideScroller);

      fixture.wheel.dispatchEvent(new Event('scroll'));

      expect(frames.request).not.toHaveBeenCalled();

      outsideScroller.dispatchEvent(new Event('scroll'));

      expect(frames.request).toHaveBeenCalledTimes(1);
    });

    it('takes the vertical space from the visual viewport and repositions when it resizes', () => {
      const viewport = stubVisualViewport(stubs, { width: 1024, height: 768 });
      const fixture = mount({}, { top: 400, left: 50, width: 200, height: 40 });
      sizePicker(fixture);
      fixture.manager.attach();
      expect(fixture.modal).toHaveAttribute('data-popover-placement', 'bottom');
      expect(fixture.modal.style.top).toBe('444px');

      viewport.height = 600;
      viewport.dispatchEvent(new Event('resize'));
      expect(fixture.modal).toHaveAttribute('data-popover-placement', 'bottom');
      frames.flush();

      expect(fixture.modal).toHaveAttribute('data-popover-placement', 'top');
      expect(fixture.modal.style.top).toBe('96px');
    });

    it('observes the input and the modal with a single ResizeObserver', () => {
      const fixture = mount();
      sizePicker(fixture);
      fixture.manager.attach();

      expect(observers).toHaveLength(1);
      expect(observers[0].observe.mock.calls).toEqual([[fixture.input], [fixture.modal]]);

      observers[0].trigger();

      expect(frames.request).toHaveBeenCalledTimes(1);
    });
  });

  describe('cleanup', () => {
    it('removes every listener with the capture flag it was added with', () => {
      const viewport = stubVisualViewport(stubs);
      const targets = ([document, window, viewport] as EventTarget[]).map((target) => ({
        add: jest.spyOn(target, 'addEventListener'),
        remove: jest.spyOn(target, 'removeEventListener'),
      }));
      const [documentSpies, windowSpies, viewportSpies] = targets;
      const fixture = mount();
      sizePicker(fixture);

      fixture.manager.attach();

      const registered = (spy: jest.SpyInstance) =>
        spy.mock.calls.map(([type, , capture]) => [type, capture]);
      expect(registered(documentSpies.add)).toEqual([['pointerdown', true]]);
      expect(registered(windowSpies.add)).toEqual([
        ['resize', undefined],
        ['scroll', true],
      ]);
      expect(registered(viewportSpies.add)).toEqual([
        ['resize', undefined],
        ['scroll', undefined],
      ]);
      targets.forEach(({ remove }) => expect(remove).not.toHaveBeenCalled());

      fixture.manager.detach();

      targets.forEach(({ add, remove }) => expect(remove.mock.calls).toEqual(add.mock.calls));
      expect(observers[0].disconnect).toHaveBeenCalledTimes(1);
    });

    it('cancels a pending frame on detach and stops repositioning', () => {
      const fixture = mount();
      sizePicker(fixture);
      fixture.manager.attach();
      window.dispatchEvent(new Event('resize'));
      const pendingFrame = frames.request.mock.results[0].value;

      fixture.manager.detach();
      fixture.inputBox.top = 300;
      frames.flush();
      window.dispatchEvent(new Event('resize'));

      expect(frames.cancel).toHaveBeenCalledWith(pendingFrame);
      expect(fixture.modal.style.top).toBe('144px');
      expect(frames.request).toHaveBeenCalledTimes(1);
    });

    it('tolerates repeated attach and detach calls without duplicating listeners', () => {
      const addSpy = jest.spyOn(document, 'addEventListener');
      const removeSpy = jest.spyOn(document, 'removeEventListener');
      const fixture = mount();
      sizePicker(fixture);

      fixture.manager.attach();
      fixture.manager.attach();

      expect(addSpy).toHaveBeenCalledTimes(1);
      expect(observers).toHaveLength(1);

      fixture.manager.detach();
      fixture.manager.detach();

      expect(removeSpy).toHaveBeenCalledTimes(1);
      expect(observers[0].disconnect).toHaveBeenCalledTimes(1);

      fixture.manager.attach();
      window.dispatchEvent(new Event('resize'));

      expect(addSpy).toHaveBeenCalledTimes(2);
      expect(frames.request).toHaveBeenCalledTimes(1);

      fixture.manager.destroy();
      fixture.manager.destroy();

      expect(removeSpy).toHaveBeenCalledTimes(2);
    });
  });
});
