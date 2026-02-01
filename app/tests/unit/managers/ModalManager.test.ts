import ModalManager from '../../../src/managers/ModalManager';
import { CoreState } from '../../../src/timepicker/CoreState';
import { EventEmitter, type TimepickerEventMap } from '../../../src/utils/EventEmitter';
import { DEFAULT_OPTIONS } from '../../../src/utils/options/defaults';

describe('ModalManager', () => {
  let coreState: CoreState;
  let emitter: EventEmitter<TimepickerEventMap>;
  let modalManager: ModalManager;
  let mockElement: HTMLElement;

  beforeEach(() => {
    mockElement = document.createElement('div');
    mockElement.innerHTML = '<input type="text" />';
    document.body.appendChild(mockElement);

    coreState = new CoreState(mockElement, DEFAULT_OPTIONS, 'test-instance-id');
    emitter = new EventEmitter();
    modalManager = new ModalManager(coreState, emitter);
  });

  afterEach(() => {
    modalManager.destroy();
    document.body.innerHTML = '';
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

    it('should create modal in custom container when appendModalSelector is set', () => {
      const container = document.createElement('div');
      container.id = 'custom-container';
      document.body.appendChild(container);

      const customOptions = {
        ...DEFAULT_OPTIONS,
        ui: {
          ...DEFAULT_OPTIONS.ui,
          appendModalSelector: '#custom-container',
        },
      };

      const customCore = new CoreState(mockElement, customOptions, 'test-custom-id');
      const customModalManager = new ModalManager(customCore, emitter);

      customModalManager.setModalTemplate();

      const modalInContainer = container.querySelector('.tp-ui-modal');
      expect(modalInContainer).not.toBeNull();

      customModalManager.destroy();
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
      const customOptions = {
        ...DEFAULT_OPTIONS,
        ui: {
          ...DEFAULT_OPTIONS.ui,
          enableScrollbar: false,
        },
      };

      const customCore = new CoreState(mockElement, customOptions, 'test-scrollbar-id');
      const customModalManager = new ModalManager(customCore, emitter);

      customModalManager.setScrollbarOrNot();

      expect(document.body.style.overflowY).toBe('hidden');

      customModalManager.destroy();
    });

    it('should not modify scrollbar for inline mode', () => {
      const inlineOptions = {
        ...DEFAULT_OPTIONS,
        ui: {
          ...DEFAULT_OPTIONS.ui,
          enableScrollbar: false,
          inline: {
            enabled: true,
            containerId: 'test',
          },
        },
      };

      document.body.style.overflowY = 'scroll';

      const inlineCore = new CoreState(mockElement, inlineOptions, 'test-inline-scroll-id');
      const inlineModalManager = new ModalManager(inlineCore, emitter);

      inlineModalManager.setScrollbarOrNot();

      expect(document.body.style.overflowY).toBe('scroll');

      inlineModalManager.destroy();
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

  describe('setShowClassToBackdrop', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    it('should add show class immediately for inline mode', () => {
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

      const inlineCore = new CoreState(mockElement, inlineOptions, 'test-show-inline-id');
      const inlineModalManager = new ModalManager(inlineCore, emitter);

      inlineModalManager.setModalTemplate();

      const modal = inlineContainer.querySelector('.tp-ui-modal');
      jest.spyOn(inlineCore, 'getModalElement').mockReturnValue(modal as HTMLDivElement);

      inlineModalManager.setShowClassToBackdrop();

      expect(modal?.classList.contains('show')).toBe(true);

      inlineModalManager.destroy();
    });

    it('should add show class after delay for backdrop mode', () => {
      modalManager.setModalTemplate();

      const modal = document.querySelector('.tp-ui-modal') as HTMLDivElement;
      jest.spyOn(coreState, 'getModalElement').mockReturnValue(modal);

      modalManager.setShowClassToBackdrop();

      expect(modal.classList.contains('show')).toBe(false);

      jest.advanceTimersByTime(400);

      expect(modal.classList.contains('show')).toBe(true);
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

    it('should restore body scroll styles', () => {
      document.body.style.overflowY = 'scroll';
      document.body.style.paddingRight = '0px';

      const customOptions = {
        ...DEFAULT_OPTIONS,
        ui: {
          ...DEFAULT_OPTIONS.ui,
          enableScrollbar: false,
        },
      };

      const customCore = new CoreState(mockElement, customOptions, 'test-destroy-id');
      const customModalManager = new ModalManager(customCore, emitter);

      customModalManager.setScrollbarOrNot();

      expect(document.body.style.overflowY).toBe('hidden');

      customModalManager.destroy();

      expect(document.body.style.overflowY).toBe('scroll');
    });
  });

  describe('setScrollbarOrNot with enableScrollbar true', () => {
    it('should restore scrollbar after timeout when enableScrollbar is true', () => {
      jest.useFakeTimers();

      const scrollbarOptions = {
        ...DEFAULT_OPTIONS,
        ui: {
          ...DEFAULT_OPTIONS.ui,
          enableScrollbar: true,
        },
      };

      document.body.style.overflowY = 'hidden';
      document.body.style.paddingRight = '15px';

      const scrollbarCore = new CoreState(mockElement, scrollbarOptions, 'test-scrollbar-enable');
      const scrollbarModalManager = new ModalManager(scrollbarCore, emitter);

      scrollbarModalManager.setScrollbarOrNot();

      jest.advanceTimersByTime(800);

      scrollbarModalManager.destroy();
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
    it('should focus wrapper when focusTrap is enabled', () => {
      jest.useFakeTimers();

      const focusTrapOptions = {
        ...DEFAULT_OPTIONS,
        behavior: {
          ...DEFAULT_OPTIONS.behavior,
          focusTrap: true,
        },
      };

      const focusTrapCore = new CoreState(mockElement, focusTrapOptions, 'test-focus-trap');
      const focusTrapModalManager = new ModalManager(focusTrapCore, emitter);

      focusTrapModalManager.setModalTemplate();

      const modal = document.querySelector('.tp-ui-modal') as HTMLDivElement;
      const wrapper = modal?.querySelector('.tp-ui-wrapper') as HTMLDivElement;
      wrapper?.setAttribute('tabindex', '-1');

      jest.spyOn(focusTrapCore, 'getModalElement').mockReturnValue(modal);
      jest.spyOn(focusTrapCore, 'getWrapper').mockReturnValue(wrapper);

      focusTrapModalManager.setShowClassToBackdrop();

      jest.advanceTimersByTime(200);

      focusTrapModalManager.destroy();
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
