import ThemeManager from '../../../src/managers/ThemeManager';
import { CoreState } from '../../../src/timepicker/CoreState';
import { EventEmitter, type TimepickerEventMap } from '../../../src/utils/EventEmitter';
import { DEFAULT_OPTIONS } from '../../../src/utils/options/defaults';

describe('ThemeManager', () => {
  let coreState: CoreState;
  let emitter: EventEmitter<TimepickerEventMap>;
  let themeManager: ThemeManager;
  let mockElement: HTMLElement;

  beforeEach(() => {
    mockElement = document.createElement('div');
    mockElement.innerHTML = '<input type="text" />';
    document.body.appendChild(mockElement);

    coreState = new CoreState(mockElement, DEFAULT_OPTIONS, 'test-instance-id');
    emitter = new EventEmitter();
    themeManager = new ThemeManager(coreState, emitter);
  });

  afterEach(() => {
    themeManager.destroy();
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create instance with CoreState and EventEmitter', () => {
      expect(themeManager).toBeInstanceOf(ThemeManager);
    });
  });

  describe('setTheme', () => {
    it('should do nothing when modal is null', () => {
      jest.spyOn(coreState, 'getModalElement').mockReturnValue(null);

      expect(() => themeManager.setTheme()).not.toThrow();
    });

    it('should set data-theme attribute on modal', () => {
      const modal = document.createElement('div') as HTMLDivElement;
      jest.spyOn(coreState, 'getModalElement').mockReturnValue(modal);

      themeManager.setTheme();

      expect(modal.getAttribute('data-theme')).toBe('basic');
    });

    it('should set custom theme on modal', () => {
      const customOptions = {
        ...DEFAULT_OPTIONS,
        ui: {
          ...DEFAULT_OPTIONS.ui,
          theme: 'm3-green' as const,
        },
      };

      const customCore = new CoreState(mockElement, customOptions, 'test-custom-theme-id');
      const customThemeManager = new ThemeManager(customCore, emitter);

      const modal = document.createElement('div') as HTMLDivElement;
      jest.spyOn(customCore, 'getModalElement').mockReturnValue(modal);

      customThemeManager.setTheme();

      expect(modal.getAttribute('data-theme')).toBe('m3-green');

      customThemeManager.destroy();
    });
  });

  describe('setInputClassToInputElement', () => {
    it('should do nothing when input is null', () => {
      jest.spyOn(coreState, 'getInput').mockReturnValue(null);

      expect(() => themeManager.setInputClassToInputElement()).not.toThrow();
    });

    it('should add tp-ui-input class to input', () => {
      const input = document.createElement('input') as HTMLInputElement;
      jest.spyOn(coreState, 'getInput').mockReturnValue(input);

      themeManager.setInputClassToInputElement();

      expect(input.classList.contains('tp-ui-input')).toBe(true);
    });

    it('should not duplicate class if already present', () => {
      const input = document.createElement('input') as HTMLInputElement;
      input.classList.add('tp-ui-input');
      jest.spyOn(coreState, 'getInput').mockReturnValue(input);

      themeManager.setInputClassToInputElement();

      expect(input.classList.length).toBe(1);
    });
  });

  describe('setDataOpenToInputIfDoesntExistInWrapper', () => {
    it('should set data-open when no open element exists', () => {
      const input = document.createElement('input') as HTMLInputElement;
      jest.spyOn(coreState, 'getOpenElementData').mockReturnValue(null);
      jest.spyOn(coreState, 'getInput').mockReturnValue(input);

      themeManager.setDataOpenToInputIfDoesntExistInWrapper();

      expect(input.getAttribute('data-open')).toBe('tp-ui-input');
    });

    it('should not set data-open when open element exists', () => {
      const input = document.createElement('input') as HTMLInputElement;
      jest.spyOn(coreState, 'getOpenElementData').mockReturnValue(['existing']);
      jest.spyOn(coreState, 'getInput').mockReturnValue(input);

      themeManager.setDataOpenToInputIfDoesntExistInWrapper();

      expect(input.getAttribute('data-open')).toBeNull();
    });
  });

  describe('setClassTopOpenElement', () => {
    it('should add class to all open elements', () => {
      const btn1 = document.createElement('button');
      const btn2 = document.createElement('button');
      btn1.setAttribute('data-open', 'test');
      btn2.setAttribute('data-open', 'test');
      mockElement.appendChild(btn1);
      mockElement.appendChild(btn2);

      const nodeList = mockElement.querySelectorAll('[data-open]');
      jest.spyOn(coreState, 'getOpenElement').mockReturnValue(nodeList);

      themeManager.setClassTopOpenElement();

      expect(btn1.classList.contains('tp-ui-open-element')).toBe(true);
      expect(btn2.classList.contains('tp-ui-open-element')).toBe(true);
    });
  });

  describe('setTimepickerClassToElement', () => {
    it('should add tp-ui class to element', () => {
      themeManager.setTimepickerClassToElement();

      expect(mockElement.classList.contains('tp-ui')).toBe(true);
    });

    it('should add custom cssClass if provided', () => {
      const customElement = document.createElement('div');
      document.body.appendChild(customElement);

      const customOptions = {
        ...DEFAULT_OPTIONS,
        ui: {
          ...DEFAULT_OPTIONS.ui,
          cssClass: 'my-custom-class',
        },
      };

      const customCore = new CoreState(customElement, customOptions, 'test-css-class-id');
      const customThemeManager = new ThemeManager(customCore, emitter);

      customThemeManager.setTimepickerClassToElement();

      expect(customElement.classList.contains('tp-ui')).toBe(true);
      expect(customElement.classList.contains('my-custom-class')).toBe(true);

      customThemeManager.destroy();
    });
  });

  describe('destroy', () => {
    it('should remove data-theme attribute from modal', () => {
      const modal = document.createElement('div') as HTMLDivElement;
      modal.setAttribute('data-theme', 'basic');
      jest.spyOn(coreState, 'getModalElement').mockReturnValue(modal);

      themeManager.destroy();

      expect(modal.getAttribute('data-theme')).toBeNull();
    });

    it('should not throw when modal is null', () => {
      jest.spyOn(coreState, 'getModalElement').mockReturnValue(null);

      expect(() => themeManager.destroy()).not.toThrow();
    });
  });
});

