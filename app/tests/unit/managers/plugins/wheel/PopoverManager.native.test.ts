import {
  createPopoverFixture,
  GlobalStubs,
  placeBox,
  setMetrics,
  stubAnimationFrames,
  stubCssSupports,
  stubLayoutViewport,
  stubPopoverApi,
  stubResizeObserver,
  stubVisualViewport,
  type AnimationFrames,
  type FakeResizeObserver,
  type FakeVisualViewport,
  type PopoverApiStub,
  type PopoverFixture,
  type PopoverFixtureOptions,
} from './popover-test-helpers';

const ANCHOR_NAME = '--tp-ui-anchor-popover-test';

describe('PopoverManager - native anchored popover', () => {
  let stubs: GlobalStubs;
  let supports: jest.Mock<boolean, [string, string]>;
  let popover: PopoverApiStub;
  let viewport: FakeVisualViewport;
  let frames: AnimationFrames;
  let observers: FakeResizeObserver[];
  let mounted: PopoverFixture[];

  const mount = (fixtureOptions: PopoverFixtureOptions = {}) => {
    const fixture = createPopoverFixture(fixtureOptions);
    mounted.push(fixture);
    const inputBox = { top: 360, left: 50, width: 200, height: 40 };
    const modalBox = { top: 404, left: 50, width: 260, height: 300 };
    placeBox(fixture.input, inputBox);
    placeBox(fixture.modal, modalBox);
    setMetrics(fixture.modal, { offsetHeight: modalBox.height });
    return { ...fixture, inputBox, modalBox };
  };

  beforeEach(() => {
    mounted = [];
    stubs = new GlobalStubs();
    supports = stubCssSupports(stubs, ['anchor-name', 'position-try-fallbacks']);
    popover = stubPopoverApi(stubs);
    stubLayoutViewport(stubs, 1024, 768);
    viewport = stubVisualViewport(stubs);
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

  describe('when anchor positioning and the Popover API are supported', () => {
    it('shows the modal as a manual popover anchored to the input', () => {
      const popoverAttributeOnShow: Array<string | null> = [];
      popover.showPopover.mockImplementation(function (this: HTMLElement) {
        popoverAttributeOnShow.push(this.getAttribute('popover'));
      });
      const { modal, input, manager } = mount();

      manager.attach();

      expect(supports).toHaveBeenCalledWith('anchor-name', expect.any(String));
      expect(supports).toHaveBeenCalledWith('position-try-fallbacks', 'flip-block');
      expect(popover.showPopover).toHaveBeenCalledTimes(1);
      expect(popover.showPopover.mock.contexts[0]).toBe(modal);
      expect(popoverAttributeOnShow).toEqual(['manual']);
      expect(modal).toHaveAttribute('popover', 'manual');
      expect(modal).toHaveClass('tp-ui-popover');
      expect(modal).toHaveClass('tp-ui-popover-anchored');
      expect(modal).toHaveAttribute('data-popover-request', 'auto');
      expect(input.style.getPropertyValue('anchor-name')).toBe(ANCHOR_NAME);
      expect(modal.style.getPropertyValue('--tp-popover-anchor')).toBe(ANCHOR_NAME);
    });

    it('derives a dashed-ident anchor name from an instance id with unsafe characters', () => {
      const { modal, input, manager } = mount({ instanceId: 'picker#1 (a.b)' });

      manager.attach();

      expect(input.style.getPropertyValue('anchor-name')).toBe('--tp-ui-anchor-picker-1--a-b-');
      expect(modal.style.getPropertyValue('--tp-popover-anchor')).toBe('--tp-ui-anchor-picker-1--a-b-');
    });

    it('leaves the geometry to CSS anchor positioning', () => {
      const { modal, manager } = mount();

      manager.attach();
      frames.flush();

      expect(modal.style.top).toBe('');
      expect(modal.style.left).toBe('');
      expect(modal.style.width).toBe('');
      expect(modal).not.toHaveClass('tp-ui-popover-constrained');
      expect(modal.style.getPropertyValue('--tp-popover-available-height')).toBe('');
    });

    it('resolves the placement on the next frame and again after a window resize', () => {
      const { modal, modalBox, manager } = mount();
      modalBox.top = 50;

      manager.attach();

      expect(modal).not.toHaveAttribute('data-popover-placement');
      expect(frames.request).toHaveBeenCalledTimes(1);

      frames.flush();

      expect(modal).toHaveAttribute('data-popover-placement', 'top');

      modalBox.top = 404;
      window.dispatchEvent(new Event('resize'));
      frames.flush();

      expect(modal).toHaveAttribute('data-popover-placement', 'bottom');
    });

    it('tracks only window resizes: no scroll listener, visual viewport listener or ResizeObserver', () => {
      const windowAdd = jest.spyOn(window, 'addEventListener');
      const viewportAdd = jest.spyOn(viewport, 'addEventListener');
      const { manager } = mount();

      manager.attach();
      frames.flush();
      document.dispatchEvent(new Event('scroll'));
      viewport.dispatchEvent(new Event('resize'));

      expect(windowAdd.mock.calls.map(([type]) => type)).toEqual(['resize']);
      expect(viewportAdd).not.toHaveBeenCalled();
      expect(observers).toHaveLength(0);
      expect(frames.request).toHaveBeenCalledTimes(1);
    });

    it('never calls hidePopover across attach, detach and destroy', () => {
      const { manager } = mount();

      manager.attach();
      frames.flush();
      manager.detach();
      manager.attach();
      manager.destroy();

      expect(popover.showPopover).toHaveBeenCalledTimes(2);
      expect(popover.hidePopover).not.toHaveBeenCalled();
    });

    it.each([
      ['its previous inline anchor-name', '--app-anchor'],
      ['no anchor-name when none was set', ''],
    ])('leaves the input with %s after destroy', (_case, previousAnchorName) => {
      const { input, manager } = mount();
      input.style.setProperty('anchor-name', previousAnchorName);

      manager.attach();
      expect(input.style.getPropertyValue('anchor-name')).toBe(ANCHOR_NAME);
      manager.detach();
      manager.attach();
      expect(input.style.getPropertyValue('anchor-name')).toBe(ANCHOR_NAME);
      manager.destroy();

      expect(input.style.getPropertyValue('anchor-name')).toBe(previousAnchorName);
    });

    it('cancels the pending placement frame on detach', () => {
      const { modal, manager } = mount();
      manager.attach();
      const pendingFrame = frames.request.mock.results[0].value;

      manager.detach();
      frames.flush();
      window.dispatchEvent(new Event('resize'));

      expect(frames.cancel).toHaveBeenCalledWith(pendingFrame);
      expect(modal).not.toHaveAttribute('data-popover-placement');
      expect(frames.request).toHaveBeenCalledTimes(1);
    });

    describe('writing direction', () => {
      it('marks the popover rtl when the input is laid out right to left', () => {
        const { modal, input, manager } = mount();
        input.style.direction = 'rtl';

        manager.attach();

        expect(modal).toHaveAttribute('data-popover-dir', 'rtl');
      });

      it.each([
        ['an explicit ltr direction', 'ltr'],
        ['no direction set', ''],
      ])('marks the popover ltr for %s', (_case, direction) => {
        const { modal, input, manager } = mount();
        input.style.direction = direction;

        manager.attach();

        expect(modal).toHaveAttribute('data-popover-dir', 'ltr');
      });

      it('keeps the direction through detach, like the input anchor-name, and rewrites it on the next attach', () => {
        const { modal, input, manager } = mount();
        manager.attach();

        manager.detach();

        expect(modal).toHaveAttribute('data-popover-dir', 'ltr');
        expect(input.style.getPropertyValue('anchor-name')).toBe(ANCHOR_NAME);

        input.style.direction = 'rtl';
        manager.attach();

        expect(modal).toHaveAttribute('data-popover-dir', 'rtl');
      });

      it('removes the direction together with the input anchor-name restore on destroy', () => {
        const { modal, input, manager } = mount();
        input.style.setProperty('anchor-name', '--app-anchor');
        input.style.direction = 'rtl';
        manager.attach();

        manager.destroy();

        expect(modal).not.toHaveAttribute('data-popover-dir');
        expect(input.style.getPropertyValue('anchor-name')).toBe('--app-anchor');
      });

      it('drops the previous direction when the next attach falls back to JS positioning', () => {
        const { modal, input, manager } = mount();
        input.style.direction = 'rtl';
        manager.attach();
        manager.detach();
        popover.showPopover.mockImplementation(() => {
          throw new DOMException('The element is not connected', 'InvalidStateError');
        });

        manager.attach();

        expect(modal).not.toHaveAttribute('data-popover-dir');
        expect(input.style.getPropertyValue('anchor-name')).toBe('');
        expect(modal.style.top).toBe('404px');
      });

      it("reads only the input's computed style, once per attach and never on a placement frame", () => {
        const computedStyle = jest.spyOn(window, 'getComputedStyle');
        const { input, manager } = mount();
        const inputReads = (): number =>
          computedStyle.mock.calls.filter(([element]) => element === input).length;

        manager.attach();
        manager.attach();
        frames.flush();
        window.dispatchEvent(new Event('resize'));
        frames.flush();

        expect(inputReads()).toBe(1);
        expect(computedStyle).toHaveBeenCalledTimes(1);

        manager.detach();
        manager.attach();

        expect(inputReads()).toBe(2);
        expect(computedStyle).toHaveBeenCalledTimes(2);
      });
    });

    it('emits cancel only for a pointerdown outside the picker and the input', () => {
      const { modal, input, emitter, manager } = mount();
      const onCancel = jest.fn();
      emitter.on('cancel', onCancel);
      const outside = document.createElement('button');
      document.body.appendChild(outside);
      manager.attach();

      [modal.firstElementChild as Element, input].forEach((target) =>
        target.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, composed: true })),
      );

      expect(onCancel).not.toHaveBeenCalled();

      outside.dispatchEvent(new MouseEvent('pointerdown', { bubbles: true, composed: true }));

      expect(onCancel).toHaveBeenCalledTimes(1);
    });
  });

  describe('falling back to JS positioning', () => {
    it('leaves no native traces and keeps the app anchor-name when showPopover throws', () => {
      popover.showPopover.mockImplementation(() => {
        throw new DOMException('Popover is not supported here', 'NotSupportedError');
      });
      const { modal, input, manager } = mount();
      input.style.setProperty('anchor-name', '--app-anchor');

      manager.attach();

      expect(popover.showPopover).toHaveBeenCalledTimes(1);
      expect(modal).not.toHaveAttribute('popover');
      expect(modal).not.toHaveClass('tp-ui-popover-anchored');
      expect(modal).not.toHaveAttribute('data-popover-dir');
      expect(modal.style.getPropertyValue('--tp-popover-anchor')).toBe('');
      expect(input.style.getPropertyValue('anchor-name')).toBe('--app-anchor');
      expect(modal.style.top).toBe('404px');
      expect(modal.style.width).toBe('260px');
      expect(observers).toHaveLength(1);

      manager.destroy();

      expect(input.style.getPropertyValue('anchor-name')).toBe('--app-anchor');
      expect(popover.hidePopover).not.toHaveBeenCalled();
    });

    it('falls back when the input is rendered inside a shadow root', () => {
      const host = document.createElement('div');
      document.body.appendChild(host);
      const { modal, input, manager } = mount({ host: host.attachShadow({ mode: 'open' }) });

      manager.attach();

      expect(popover.showPopover).not.toHaveBeenCalled();
      expect(modal).not.toHaveAttribute('popover');
      expect(modal).not.toHaveAttribute('data-popover-dir');
      expect(input.style.getPropertyValue('anchor-name')).toBe('');
      expect(modal.style.width).toBe('260px');
      expect(observers).toHaveLength(1);
    });

    it.each([
      ['CSS.supports is unavailable', () => stubs.set(globalThis, 'CSS', undefined)],
      ['anchor-name is unsupported', () => stubCssSupports(stubs, ['position-try-fallbacks'])],
      ['position-try-fallbacks is unsupported', () => stubCssSupports(stubs, ['anchor-name'])],
      ['the Popover API is missing', () => stubs.set(HTMLElement.prototype, 'showPopover', undefined)],
    ] as Array<[string, () => void]>)('uses JS positioning when %s', (_case, removeSupport) => {
      removeSupport();
      const { modal, input, manager } = mount();

      manager.attach();

      expect(popover.showPopover).not.toHaveBeenCalled();
      expect(modal).not.toHaveAttribute('popover');
      expect(modal).not.toHaveClass('tp-ui-popover-anchored');
      expect(modal).not.toHaveAttribute('data-popover-dir');
      expect(input.style.getPropertyValue('anchor-name')).toBe('');
      expect(modal.style.width).toBe('260px');
      expect(observers).toHaveLength(1);
    });
  });
});
