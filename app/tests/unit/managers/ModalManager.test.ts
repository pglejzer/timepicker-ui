import ModalManager from '../../../src/managers/ModalManager';
import { CoreState } from '../../../src/timepicker/CoreState';
import { EventEmitter, type TimepickerEventMap } from '../../../src/utils/EventEmitter';
import { DEFAULT_OPTIONS, mergeOptionGroups } from '../../../src/utils/options/defaults';
import type { TimepickerOptions } from '../../../src/types/options';

const SCROLLBAR_GAP_PROPERTY = '--tp-scrollbar-gap';
const CLIENT_WIDTH_WITH_SCROLLBAR = 1000;
const LOCKING_OPTIONS: TimepickerOptions = { ui: { enableScrollbar: false } };

const scrollbarGap = (): string => document.documentElement.style.getPropertyValue(SCROLLBAR_GAP_PROPERTY);

const stubScrollbarGap = (element: HTMLElement, gap: number) =>
  jest.spyOn(element, 'clientWidth', 'get').mockImplementation(() => {
    const scrollbarHidden = element.style.overflowY === 'hidden';
    return scrollbarHidden ? CLIENT_WIDTH_WITH_SCROLLBAR + gap : CLIENT_WIDTH_WITH_SCROLLBAR;
  });

const expectPageUntouched = (): void => {
  expect(document.documentElement.getAttribute('style')).toBeNull();
  expect(document.body.getAttribute('style')).toBeNull();
};

describe('ModalManager', () => {
  let coreState: CoreState;
  let emitter: EventEmitter<TimepickerEventMap>;
  let modalManager: ModalManager;
  let mockElement: HTMLElement;
  let trackedManagers: ModalManager[];
  let injectedStyles: HTMLStyleElement[];

  const createManagerWithCore = (
    updates: TimepickerOptions,
    id: string,
  ): { core: CoreState; manager: ModalManager } => {
    const core = new CoreState(mockElement, mergeOptionGroups(DEFAULT_OPTIONS, updates), id);
    const manager = new ModalManager(core, emitter);
    trackedManagers.push(manager);
    return { core, manager };
  };

  const createManager = (updates: TimepickerOptions, id: string): ModalManager =>
    createManagerWithCore(updates, id).manager;

  const addStylesheet = (css: string): void => {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
    injectedStyles.push(style);
  };

  beforeEach(() => {
    mockElement = document.createElement('div');
    mockElement.innerHTML = '<input type="text" />';
    document.body.appendChild(mockElement);

    coreState = new CoreState(mockElement, DEFAULT_OPTIONS, 'test-instance-id');
    emitter = new EventEmitter();
    modalManager = new ModalManager(coreState, emitter);
    trackedManagers = [];
    injectedStyles = [];
  });

  afterEach(() => {
    trackedManagers.forEach((manager) => manager.destroy());
    modalManager.destroy();
    document.documentElement.removeAttribute('style');
    document.body.removeAttribute('style');
    injectedStyles.forEach((style) => style.remove());
    document.body.innerHTML = '';
    jest.restoreAllMocks();
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create instance with CoreState and EventEmitter', () => {
      expect(modalManager).toBeInstanceOf(ModalManager);
    });
  });

  describe('setModalTemplate', () => {
    it('should create modal in document body', () => {
      modalManager.setModalTemplate();

      const modal = document.querySelector('.tp-ui-modal');
      expect(modal).not.toBeNull();
    });

    it('should clear existing modal before creating new one', () => {
      modalManager.setModalTemplate();
      modalManager.setModalTemplate();

      const modals = document.querySelectorAll('.tp-ui-modal');
      expect(modals.length).toBe(1);
    });

    it('should create modal in custom container when appendTo is set', () => {
      const container = document.createElement('div');
      container.id = 'custom-container';
      document.body.appendChild(container);

      const customOptions = {
        ...DEFAULT_OPTIONS,
        ui: {
          ...DEFAULT_OPTIONS.ui,
          appendTo: '#custom-container',
        },
      };

      const customCore = new CoreState(mockElement, customOptions, 'test-custom-id');
      const customModalManager = new ModalManager(customCore, emitter);

      customModalManager.setModalTemplate();

      const modalInContainer = container.querySelector('.tp-ui-modal');
      expect(modalInContainer).not.toBeNull();

      customModalManager.destroy();
    });

    it.each<{ name: string; ui: (container: HTMLElement) => TimepickerOptions['ui'] }>([
      { name: 'an element in ui.appendTo', ui: (container) => ({ appendTo: container }) },
      {
        name: 'a selector in ui.appendModalSelector',
        ui: () => ({ appendModalSelector: '#custom-container' }),
      },
    ])('should create modal in the custom container given as $name', ({ ui }) => {
      const container = document.createElement('div');
      container.id = 'custom-container';
      document.body.appendChild(container);

      createManager({ ui: ui(container) }, 'test-custom-target').setModalTemplate();

      expect(document.querySelectorAll('.tp-ui-modal')).toHaveLength(1);
      expect(container.querySelector('.tp-ui-modal')).not.toBeNull();
    });

    it('should create inline modal in specified container', () => {
      const inlineContainer = document.createElement('div');
      inlineContainer.id = 'inline-timepicker';
      document.body.appendChild(inlineContainer);

      const inlineOptions = {
        ...DEFAULT_OPTIONS,
        ui: {
          ...DEFAULT_OPTIONS.ui,
          inline: {
            enabled: true,
            containerId: 'inline-timepicker',
          },
        },
      };

      const inlineCore = new CoreState(mockElement, inlineOptions, 'test-inline-id');
      const inlineModalManager = new ModalManager(inlineCore, emitter);

      inlineModalManager.setModalTemplate();

      const modal = inlineContainer.querySelector('.tp-ui-modal');
      expect(modal).not.toBeNull();
      expect(modal?.classList.contains('tp-ui--inline')).toBe(true);

      inlineModalManager.destroy();
    });
  });

  describe('setScrollbarOrNot', () => {
    it('should hide scrollbar when enableScrollbar is false', () => {
      const manager = createManager(LOCKING_OPTIONS, 'test-scrollbar-id');

      manager.setScrollbarOrNot();

      expect(document.documentElement.style.overflowY).toBe('hidden');
      expect(document.body.style.overflowY).toBe('');
    });

    it('should not modify scrollbar for inline mode', () => {
      document.documentElement.style.overflowY = 'scroll';

      const manager = createManager(
        { ui: { enableScrollbar: false, inline: { enabled: true, containerId: 'test' } } },
        'test-inline-scroll-id',
      );

      manager.setScrollbarOrNot();

      expect(document.documentElement.style.overflowY).toBe('scroll');
      expect(scrollbarGap()).toBe('');
    });
  });

  describe('removeBackdrop', () => {
    it('should add removed class to modal when backdrop is disabled', () => {
      const noBackdropOptions = {
        ...DEFAULT_OPTIONS,
        ui: {
          ...DEFAULT_OPTIONS.ui,
          backdrop: false,
        },
      };

      const noBackdropCore = new CoreState(mockElement, noBackdropOptions, 'test-no-backdrop-id');
      const noBackdropModalManager = new ModalManager(noBackdropCore, emitter);

      noBackdropModalManager.setModalTemplate();

      const modal = document.querySelector('.tp-ui-modal');
      const emptyNodeList = document.querySelectorAll('.non-existent');
      jest.spyOn(noBackdropCore, 'getModalElement').mockReturnValue(modal as HTMLDivElement);
      jest.spyOn(noBackdropCore, 'getOpenElement').mockReturnValue(emptyNodeList);

      noBackdropModalManager.removeBackdrop();

      expect(modal?.classList.contains('removed')).toBe(true);

      noBackdropModalManager.destroy();
    });

    it('should not remove backdrop when inline mode is enabled', () => {
      const inlineContainer = document.createElement('div');
      inlineContainer.id = 'test-inline-container';
      document.body.appendChild(inlineContainer);

      const inlineOptions = {
        ...DEFAULT_OPTIONS,
        ui: {
          ...DEFAULT_OPTIONS.ui,
          backdrop: false,
          inline: {
            enabled: true,
            containerId: 'test-inline-container',
          },
        },
      };

      const inlineCore = new CoreState(mockElement, inlineOptions, 'test-inline-backdrop-id');
      const inlineModalManager = new ModalManager(inlineCore, emitter);

      inlineModalManager.setModalTemplate();

      const modal = inlineContainer.querySelector('.tp-ui-modal');

      inlineModalManager.removeBackdrop();

      expect(modal?.classList.contains('removed')).toBeFalsy();

      inlineModalManager.destroy();
    });
  });

  describe('setNormalizeClass', () => {
    it('should add normalize class to modal', () => {
      modalManager.setModalTemplate();

      const modal = document.querySelector('.tp-ui-modal') as HTMLDivElement;
      jest.spyOn(coreState, 'getModalElement').mockReturnValue(modal);

      modalManager.setNormalizeClass();

      expect(modal.classList.contains('tp-ui-normalize')).toBe(true);
    });

    it('should do nothing when modal is null', () => {
      jest.spyOn(coreState, 'getModalElement').mockReturnValue(null);

      expect(() => modalManager.setNormalizeClass()).not.toThrow();
    });
  });

  describe('show class ownership', () => {
    it('should render the modal and set up the page without adding show', () => {
      jest.useFakeTimers();
      const manager = createManager(LOCKING_OPTIONS, 'test-no-show');

      manager.setScrollbarOrNot();
      manager.setModalTemplate();
      manager.setNormalizeClass();
      manager.removeBackdrop();
      manager.setInitialFocus();
      jest.runOnlyPendingTimers();

      expect(document.querySelector('.tp-ui-modal')).not.toHaveClass('show');
    });
  });

  describe('setFlexEndToFooterIfNoKeyboardIcon', () => {
    it('should set flex-end when enableSwitchIcon is false', () => {
      const noIconOptions = {
        ...DEFAULT_OPTIONS,
        ui: {
          ...DEFAULT_OPTIONS.ui,
          enableSwitchIcon: false,
        },
      };

      const noIconCore = new CoreState(mockElement, noIconOptions, 'test-no-icon-id');
      const noIconModalManager = new ModalManager(noIconCore, emitter);

      noIconModalManager.setModalTemplate();

      const footer = document.querySelector('.tp-ui-wrapper-btn') as HTMLDivElement;
      jest.spyOn(noIconCore, 'getFooter').mockReturnValue(footer);

      noIconModalManager.setFlexEndToFooterIfNoKeyboardIcon();

      expect(footer?.style.justifyContent).toBe('flex-end');

      noIconModalManager.destroy();
    });

    it('should do nothing when footer is null', () => {
      jest.spyOn(coreState, 'getFooter').mockReturnValue(null);

      expect(() => modalManager.setFlexEndToFooterIfNoKeyboardIcon()).not.toThrow();
    });
  });

  describe('destroy', () => {
    it('should remove modal from DOM', () => {
      modalManager.setModalTemplate();

      expect(document.querySelector('.tp-ui-modal')).not.toBeNull();

      modalManager.destroy();

      expect(document.querySelector('.tp-ui-modal')).toBeNull();
    });

    it('should restore the page scroll styles', () => {
      const html = document.documentElement;
      html.style.overflowY = 'scroll';
      html.style.paddingRight = '0px';
      stubScrollbarGap(html, 15);

      const manager = createManager(LOCKING_OPTIONS, 'test-destroy-id');

      manager.setScrollbarOrNot();

      expect(html.style.overflowY).toBe('hidden');
      expect(html.style.paddingRight).toBe('15px');

      manager.destroy();

      expect(html.style.overflowY).toBe('scroll');
      expect(html.style.paddingRight).toBe('0px');
      expect(scrollbarGap()).toBe('');
    });
  });

  describe('scroll-lock reference counting', () => {
    it('leaves the page scrollable after rapid open/close cycles on one instance', () => {
      const html = document.documentElement;
      html.style.overflowY = 'scroll';

      const manager = createManager(LOCKING_OPTIONS, 'test-refcount-single');

      for (let i = 0; i < 5; i += 1) {
        manager.lockScroll();
        expect(html.style.overflowY).toBe('hidden');
        manager.unlockScroll();
        expect(html.style.overflowY).toBe('scroll');
      }

      expect(html.style.overflowY).not.toBe('hidden');
    });

    it('keeps the lock while a second picker is still open and only releases on the last close', () => {
      const html = document.documentElement;
      html.style.overflowY = 'scroll';

      const managerA = createManager(LOCKING_OPTIONS, 'test-refcount-a');
      const managerB = createManager(LOCKING_OPTIONS, 'test-refcount-b');

      managerA.lockScroll();
      managerB.lockScroll();
      expect(html.style.overflowY).toBe('hidden');

      managerA.unlockScroll();
      expect(html.style.overflowY).toBe('hidden');

      managerB.unlockScroll();
      expect(html.style.overflowY).toBe('scroll');

      expect(html.style.overflowY).not.toBe('hidden');
    });

    it('does not double-release when unlockScroll is called more than the matching lock', () => {
      const html = document.documentElement;
      html.style.overflowY = 'scroll';

      const managerA = createManager(LOCKING_OPTIONS, 'test-refcount-extra-a');
      const managerB = createManager(LOCKING_OPTIONS, 'test-refcount-extra-b');

      managerA.lockScroll();
      managerB.lockScroll();

      managerA.unlockScroll();
      managerA.unlockScroll();
      expect(html.style.overflowY).toBe('hidden');

      managerB.unlockScroll();
      expect(html.style.overflowY).toBe('scroll');
    });
  });

  describe('setScrollbarOrNot with enableScrollbar true', () => {
    it('does not touch the page and schedules no timer', () => {
      jest.useFakeTimers();

      const manager = createManager({ ui: { enableScrollbar: true } }, 'test-scrollbar-enable');

      manager.setScrollbarOrNot();

      expectPageUntouched();
      expect(jest.getTimerCount()).toBe(0);
    });

    it('does not release the lock another open picker holds', () => {
      const locking = createManager(LOCKING_OPTIONS, 'test-scrollbar-locking');
      const scrolling = createManager({ ui: { enableScrollbar: true } }, 'test-scrollbar-scrolling');

      locking.lockScroll();
      scrolling.setScrollbarOrNot();

      expect(document.documentElement.style.overflowY).toBe('hidden');
      expect(scrollbarGap()).toBe('0px');
    });

    it('releases its own lock at once when enableScrollbar is turned on while locked', () => {
      jest.useFakeTimers();
      const html = document.documentElement;
      html.style.overflowY = 'scroll';
      const { core, manager } = createManagerWithCore(LOCKING_OPTIONS, 'test-toggle');

      manager.setScrollbarOrNot();
      expect(html.style.overflowY).toBe('hidden');

      core.updateOptions({ ui: { enableScrollbar: true } });
      manager.setScrollbarOrNot();

      expect(html.style.overflowY).toBe('scroll');
      expect(scrollbarGap()).toBe('');
      expect(jest.getTimerCount()).toBe(0);
    });

    it('locks again when enableScrollbar is turned back off', () => {
      const { core, manager } = createManagerWithCore({ ui: { enableScrollbar: true } }, 'test-toggle-back');

      manager.setScrollbarOrNot();
      expectPageUntouched();

      core.updateOptions(LOCKING_OPTIONS);
      manager.setScrollbarOrNot();

      expect(document.documentElement.style.overflowY).toBe('hidden');
    });
  });

  describe('page scroll lock', () => {
    let html: HTMLElement;
    let body: HTMLElement;

    beforeEach(() => {
      html = document.documentElement;
      body = document.body;
    });

    it('locks only <html> when <body> is not a scroll container', () => {
      stubScrollbarGap(html, 15);
      const bodyWidth = stubScrollbarGap(body, 12);
      const manager = createManager(LOCKING_OPTIONS, 'scroll-lock-html-only');

      manager.lockScroll();

      expect(html.style.overflowY).toBe('hidden');
      expect(html.style.paddingRight).toBe('15px');
      expect(scrollbarGap()).toBe('15px');
      expect(body.style.overflowY).toBe('');
      expect(body.style.paddingRight).toBe('');
      expect(bodyWidth).not.toHaveBeenCalled();

      manager.unlockScroll();

      expect(html.style.overflowY).toBe('');
      expect(html.style.paddingRight).toBe('');
      expect(scrollbarGap()).toBe('');
    });

    it.each<{ source: string; makeBodyScroll: () => void; restoredOverflow: string }>([
      {
        source: 'a stylesheet rule',
        makeBodyScroll: () => addStylesheet('body { overflow-y: auto; }'),
        restoredOverflow: '',
      },
      {
        source: 'an inline style',
        makeBodyScroll: () => {
          document.body.style.overflowY = 'auto';
        },
        restoredOverflow: 'auto',
      },
    ])(
      'locks <body> too when $source makes it the scroll container',
      ({ makeBodyScroll, restoredOverflow }) => {
        makeBodyScroll();
        stubScrollbarGap(body, 12);
        const manager = createManager(LOCKING_OPTIONS, 'scroll-lock-body-scroller');

        manager.lockScroll();

        expect(body.style.overflowY).toBe('hidden');
        expect(body.style.paddingRight).toBe('12px');
        expect(html.style.overflowY).toBe('hidden');
        expect(scrollbarGap()).toBe('12px');

        manager.unlockScroll();

        expect(body.style.overflowY).toBe(restoredOverflow);
        expect(body.style.paddingRight).toBe('');
        expect(html.style.overflowY).toBe('');
        expect(scrollbarGap()).toBe('');
      },
    );

    it('measures the <body> gap before <html> is hidden', () => {
      body.style.overflowY = 'auto';
      const htmlOverflowAtBodyReads: string[] = [];
      jest.spyOn(body, 'clientWidth', 'get').mockImplementation(() => {
        htmlOverflowAtBodyReads.push(html.style.overflowY);
        const scrollbarHidden = body.style.overflowY === 'hidden';
        return scrollbarHidden ? CLIENT_WIDTH_WITH_SCROLLBAR + 12 : CLIENT_WIDTH_WITH_SCROLLBAR;
      });

      createManager(LOCKING_OPTIONS, 'scroll-lock-body-first').lockScroll();

      expect(htmlOverflowAtBodyReads).toEqual(['', '']);
      expect(body.style.paddingRight).toBe('12px');
    });

    it('restores the exact previous inline overflow and padding of both elements', () => {
      html.style.overflowY = 'auto';
      html.style.paddingRight = '3px';
      body.style.overflowY = 'scroll';
      body.style.paddingRight = '5px';
      stubScrollbarGap(html, 15);
      stubScrollbarGap(body, 12);
      const manager = createManager(LOCKING_OPTIONS, 'scroll-lock-restore-both');

      manager.lockScroll();

      expect(html.style.overflowY).toBe('hidden');
      expect(html.style.paddingRight).toBe('18px');
      expect(body.style.overflowY).toBe('hidden');
      expect(body.style.paddingRight).toBe('17px');

      manager.unlockScroll();

      expect(html.style.overflowY).toBe('auto');
      expect(html.style.paddingRight).toBe('3px');
      expect(body.style.overflowY).toBe('scroll');
      expect(body.style.paddingRight).toBe('5px');
    });

    it.each([
      { htmlGap: 15, bodyGap: 12, gap: '15px', htmlPadding: '15px', bodyPadding: '12px' },
      { htmlGap: 0, bodyGap: 17, gap: '17px', htmlPadding: '', bodyPadding: '17px' },
    ])(
      'exposes the larger gap ($gap) and pads each element by its own gap (html $htmlGap, body $bodyGap)',
      ({ htmlGap, bodyGap, gap, htmlPadding, bodyPadding }) => {
        body.style.overflowY = 'auto';
        stubScrollbarGap(html, htmlGap);
        stubScrollbarGap(body, bodyGap);

        createManager(LOCKING_OPTIONS, 'scroll-lock-larger-gap').lockScroll();

        expect(scrollbarGap()).toBe(gap);
        expect(html.style.paddingRight).toBe(htmlPadding);
        expect(body.style.paddingRight).toBe(bodyPadding);
      },
    );

    it('exposes a 0px gap and writes no padding when nothing shows a scrollbar', () => {
      body.style.overflowY = 'auto';

      createManager(LOCKING_OPTIONS, 'scroll-lock-no-gap').lockScroll();

      expect(html.style.overflowY).toBe('hidden');
      expect(body.style.overflowY).toBe('hidden');
      expect(scrollbarGap()).toBe('0px');
      expect(html.style.paddingRight).toBe('');
      expect(body.style.paddingRight).toBe('');
    });

    it('puts back a previous inline gap property on release', () => {
      html.style.setProperty(SCROLLBAR_GAP_PROPERTY, '4px');
      stubScrollbarGap(html, 15);
      const manager = createManager(LOCKING_OPTIONS, 'scroll-lock-previous-gap');

      manager.lockScroll();

      expect(scrollbarGap()).toBe('15px');

      manager.unlockScroll();

      expect(scrollbarGap()).toBe('4px');
    });

    it('overrides a stylesheet overflow-y: scroll on <html> while locked', () => {
      addStylesheet('html { overflow-y: scroll; }');
      const manager = createManager(LOCKING_OPTIONS, 'scroll-lock-html-stylesheet');

      manager.lockScroll();

      expect(window.getComputedStyle(html).overflowY).toBe('hidden');

      manager.unlockScroll();

      expect(window.getComputedStyle(html).overflowY).toBe('scroll');
      expect(html.style.overflowY).toBe('');
    });

    it.each<{ name: string; css: string; target: () => HTMLElement; gap: number; locked: string }>([
      {
        name: '<html>',
        css: 'html { padding-right: 8px; }',
        target: () => document.documentElement,
        gap: 15,
        locked: '23px',
      },
      {
        name: 'a scrolling <body>',
        css: 'body { overflow-y: auto; padding-right: 6px; }',
        target: () => document.body,
        gap: 12,
        locked: '18px',
      },
    ])('adds the gap to the existing computed padding of $name', ({ css, target, gap, locked }) => {
      addStylesheet(css);
      const element = target();
      stubScrollbarGap(element, gap);
      const manager = createManager(LOCKING_OPTIONS, 'scroll-lock-existing-padding');

      manager.lockScroll();

      expect(element.style.paddingRight).toBe(locked);

      manager.unlockScroll();

      expect(element.style.paddingRight).toBe('');
    });

    it('measures once on the first lock and restores only on the last release', () => {
      body.style.overflowY = 'auto';
      const htmlWidth = stubScrollbarGap(html, 15);
      const bodyWidth = stubScrollbarGap(body, 12);
      const first = createManager(LOCKING_OPTIONS, 'scroll-lock-measure-first');
      const second = createManager(LOCKING_OPTIONS, 'scroll-lock-measure-second');

      first.lockScroll();
      second.lockScroll();

      expect(htmlWidth).toHaveBeenCalledTimes(2);
      expect(bodyWidth).toHaveBeenCalledTimes(2);
      expect(html.style.paddingRight).toBe('15px');
      expect(body.style.paddingRight).toBe('12px');
      expect(scrollbarGap()).toBe('15px');

      first.unlockScroll();

      expect(html.style.overflowY).toBe('hidden');
      expect(body.style.overflowY).toBe('hidden');
      expect(html.style.paddingRight).toBe('15px');
      expect(body.style.paddingRight).toBe('12px');
      expect(scrollbarGap()).toBe('15px');

      second.unlockScroll();

      expect(html.style.overflowY).toBe('');
      expect(html.style.paddingRight).toBe('');
      expect(body.style.overflowY).toBe('auto');
      expect(body.style.paddingRight).toBe('');
      expect(scrollbarGap()).toBe('');

      second.unlockScroll();
      first.unlockScroll();

      expect(html.style.overflowY).toBe('');
      expect(body.style.overflowY).toBe('auto');
      expect(scrollbarGap()).toBe('');

      first.lockScroll();

      expect(html.style.overflowY).toBe('hidden');
      expect(htmlWidth).toHaveBeenCalledTimes(4);
    });

    it.each<{ name: string; updates: TimepickerOptions }>([
      {
        name: 'in inline mode',
        updates: { ui: { enableScrollbar: false, inline: { enabled: true, containerId: 'inline-host' } } },
      },
      {
        name: 'in the compact-wheel popover',
        updates: { ui: { enableScrollbar: false, mode: 'compact-wheel' }, wheel: { placement: 'auto' } },
      },
      {
        name: 'with ui.enableScrollbar: true',
        updates: { ui: { enableScrollbar: true } },
      },
    ])('writes nothing to <html> or <body> $name', ({ updates }) => {
      const manager = createManager(updates, 'scroll-lock-skipped');

      manager.setScrollbarOrNot();
      manager.lockScroll();
      manager.unlockScroll();

      expectPageUntouched();
    });
  });

  describe('inline mode showButtons option', () => {
    it('should hide buttons when showButtons is false in inline mode', () => {
      const inlineContainer = document.createElement('div');
      inlineContainer.id = 'inline-hide-buttons';
      document.body.appendChild(inlineContainer);

      const inlineOptions = {
        ...DEFAULT_OPTIONS,
        ui: {
          ...DEFAULT_OPTIONS.ui,
          inline: {
            enabled: true,
            containerId: 'inline-hide-buttons',
            showButtons: false,
          },
        },
      };

      const inlineCore = new CoreState(mockElement, inlineOptions, 'test-inline-hide-buttons');
      const inlineModalManager = new ModalManager(inlineCore, emitter);

      inlineModalManager.setModalTemplate();

      const buttons = inlineContainer.querySelectorAll('.tp-ui-wrapper-btn');
      buttons.forEach((btn) => {
        expect((btn as HTMLElement).style.display).toBe('none');
      });

      inlineModalManager.destroy();
    });

    it('should show buttons when showButtons is true in inline mode', () => {
      const inlineContainer = document.createElement('div');
      inlineContainer.id = 'inline-show-buttons';
      document.body.appendChild(inlineContainer);

      const inlineOptions = {
        ...DEFAULT_OPTIONS,
        ui: {
          ...DEFAULT_OPTIONS.ui,
          inline: {
            enabled: true,
            containerId: 'inline-show-buttons',
            showButtons: true,
          },
        },
      };

      const inlineCore = new CoreState(mockElement, inlineOptions, 'test-inline-show-buttons');
      const inlineModalManager = new ModalManager(inlineCore, emitter);

      inlineModalManager.setModalTemplate();

      const buttons = inlineContainer.querySelectorAll('.tp-ui-wrapper-btn');
      buttons.forEach((btn) => {
        expect((btn as HTMLElement).style.display).not.toBe('none');
      });

      inlineModalManager.destroy();
    });
  });

  describe('setInitialFocus', () => {
    const renderWith = (updates: TimepickerOptions, id: string): ModalManager => {
      const manager = createManager(updates, id);
      manager.setModalTemplate();
      return manager;
    };

    const wrapperOf = (): HTMLElement | null =>
      document.querySelector<HTMLElement>('.tp-ui-modal .tp-ui-wrapper');

    beforeEach(() => {
      jest.useFakeTimers();
      const host = document.createElement('div');
      host.id = 'focus-inline-host';
      document.body.appendChild(host);
    });

    it.each<{ name: string; updates: TimepickerOptions }>([
      { name: 'with a backdrop', updates: { ui: { backdrop: true } } },
      {
        name: 'inline without a backdrop',
        updates: { ui: { backdrop: false, inline: { enabled: true, containerId: 'focus-inline-host' } } },
      },
      {
        name: 'in the compact-wheel popover without a backdrop',
        updates: { ui: { backdrop: false, mode: 'compact-wheel' }, wheel: { placement: 'auto' } },
      },
    ])('should focus the wrapper on the next animation frame $name', ({ updates }) => {
      const manager = renderWith({ ...updates, behavior: { focusTrap: true } }, 'focus-gated-on');

      manager.setInitialFocus();

      expect(document.activeElement).not.toBe(wrapperOf());

      jest.runOnlyPendingTimers();

      expect(document.activeElement).toBe(wrapperOf());
    });

    it.each<{ name: string; updates: TimepickerOptions }>([
      { name: 'focusTrap is off', updates: { ui: { backdrop: true }, behavior: { focusTrap: false } } },
      {
        name: 'there is no backdrop, inline or popover',
        updates: { ui: { backdrop: false }, behavior: { focusTrap: true } },
      },
    ])('should leave focus alone when $name', ({ updates }) => {
      const manager = renderWith(updates, 'focus-gated-off');
      const outside = document.createElement('button');
      document.body.appendChild(outside);
      outside.focus();

      manager.setInitialFocus();

      expect(jest.getTimerCount()).toBe(0);

      jest.runOnlyPendingTimers();

      expect(document.activeElement).toBe(outside);
    });

    it('should keep focus that is already inside the wrapper', () => {
      const manager = renderWith({ behavior: { focusTrap: true } }, 'focus-inside');
      const hour = document.querySelector<HTMLElement>('.tp-ui-modal .tp-ui-hour');
      hour?.focus();

      manager.setInitialFocus();
      jest.runOnlyPendingTimers();

      expect(document.activeElement).toBe(hour);
    });

    it('should focus the wrapper of the modal rendered when the animation frame runs', () => {
      const manager = renderWith({ behavior: { focusTrap: true } }, 'focus-rerendered');

      manager.setInitialFocus();
      manager.setModalTemplate();
      const wrapper = wrapperOf();
      jest.runOnlyPendingTimers();

      expect(document.querySelectorAll('.tp-ui-modal')).toHaveLength(1);
      expect(document.activeElement).toBe(wrapper);
    });
  });

  describe('focus across a re-render', () => {
    const renderModal = (): HTMLElement => {
      modalManager.setModalTemplate();
      const modal = document.querySelector<HTMLElement>('.tp-ui-modal');
      if (!modal) throw new Error('modal is not rendered');
      return modal;
    };

    const control = (modal: HTMLElement, selector: string): HTMLElement => {
      const element = modal.querySelector<HTMLElement>(selector);
      if (!element) throw new Error(`${selector} is not rendered`);
      return element;
    };

    const focusOutside = (): HTMLButtonElement => {
      const outside = document.createElement('button');
      document.body.appendChild(outside);
      outside.focus();
      return outside;
    };

    describe('getFocusedControlSelector', () => {
      it('should return null when focus is outside the modal', () => {
        renderModal();
        focusOutside();

        expect(modalManager.getFocusedControlSelector()).toBeNull();
      });

      it('should return null when no modal is rendered', () => {
        focusOutside();

        expect(modalManager.getFocusedControlSelector()).toBeNull();
      });

      it.each([
        ['the minutes input', '.tp-ui-minutes', '.tp-ui-minutes'],
        ['the AM button', '.tp-ui-am', '.tp-ui-type-mode.tp-ui-am'],
        ['the OK button', '.tp-ui-ok-btn', '.tp-ui-ok-btn'],
      ])('should describe %s by its tp-ui- classes only', (_label, selector, expected) => {
        const target = control(renderModal(), selector);
        target.classList.add('active', 'expanded');
        target.focus();

        expect(modalManager.getFocusedControlSelector()).toBe(expected);
      });

      it('should return an empty selector for a focused element without a tp-ui- class', () => {
        const wrapper = control(renderModal(), '.tp-ui-wrapper');
        const custom = document.createElement('button');
        custom.className = 'custom-control expanded';
        wrapper.appendChild(custom);
        custom.focus();

        expect(modalManager.getFocusedControlSelector()).toBe('');
      });
    });

    describe('restoreFocus', () => {
      it('should focus the matching control inside the wrapper', () => {
        const modal = renderModal();
        focusOutside();

        modalManager.restoreFocus('.tp-ui-ok-btn');

        expect(document.activeElement).toBe(control(modal, '.tp-ui-ok-btn'));
      });

      it.each([
        ['an empty selector', '', ''],
        ['a selector that matches nothing', '.tp-ui-missing', ''],
        [
          'a disabled control',
          '.tp-ui-extra-control',
          '<button type="button" class="tp-ui-extra-control" disabled></button>',
        ],
        ['a hidden control', '.tp-ui-extra-control', '<input type="hidden" class="tp-ui-extra-control">'],
      ])('should fall back to the wrapper for %s', (_label, selector, markup) => {
        const wrapper = control(renderModal(), '.tp-ui-wrapper');
        wrapper.insertAdjacentHTML('beforeend', markup);
        focusOutside();

        modalManager.restoreFocus(selector);

        expect(document.activeElement).toBe(wrapper);
      });

      it('should keep focus that is already inside the wrapper when nothing matches', () => {
        const hour = control(renderModal(), '.tp-ui-hour');
        hour.focus();

        modalManager.restoreFocus('.tp-ui-missing');

        expect(document.activeElement).toBe(hour);
      });
    });
  });

  describe('removeBackdrop with open elements', () => {
    it('should add disabled class to open elements', () => {
      const noBackdropOptions = {
        ...DEFAULT_OPTIONS,
        ui: {
          ...DEFAULT_OPTIONS.ui,
          backdrop: false,
        },
      };

      const noBackdropCore = new CoreState(mockElement, noBackdropOptions, 'test-open-elements');
      const noBackdropModalManager = new ModalManager(noBackdropCore, emitter);

      noBackdropModalManager.setModalTemplate();

      const modal = document.querySelector('.tp-ui-modal');
      const openElement = document.createElement('div');
      openElement.setAttribute('data-open', 'test');
      document.body.appendChild(openElement);

      jest.spyOn(noBackdropCore, 'getModalElement').mockReturnValue(modal as HTMLDivElement);
      jest
        .spyOn(noBackdropCore, 'getOpenElement')
        .mockReturnValue([openElement] as unknown as NodeListOf<Element>);

      noBackdropModalManager.removeBackdrop();

      expect(openElement.classList.contains('disabled')).toBe(true);

      noBackdropModalManager.destroy();
    });
  });
});
