import { RangeUI } from '../../../../../src/managers/plugins/range/RangeUI';
import { RangeState } from '../../../../../src/managers/plugins/range/RangeState';
import { EventEmitter, type TimepickerEventMap } from '../../../../../src/utils/EventEmitter';

const createMockCoreState = (): {
  getModalElement: jest.Mock;
  getOkButton: jest.Mock;
  getInput: jest.Mock;
  getHour: jest.Mock;
  getMinutes: jest.Mock;
  getAM: jest.Mock;
  getPM: jest.Mock;
  options: { clock: { type: '12h' | '24h' } };
} => ({
  getModalElement: jest.fn(),
  getOkButton: jest.fn(),
  getInput: jest.fn(),
  getHour: jest.fn(),
  getMinutes: jest.fn(),
  getAM: jest.fn(),
  getPM: jest.fn(),
  options: { clock: { type: '12h' } },
});

describe('RangeUI', () => {
  let emitter: EventEmitter<TimepickerEventMap>;
  let state: RangeState;
  let mockCore: ReturnType<typeof createMockCoreState>;
  let modal: HTMLDivElement;

  beforeEach(() => {
    emitter = new EventEmitter<TimepickerEventMap>();
    state = new RangeState('12h', undefined, undefined, emitter);
    mockCore = createMockCoreState();

    modal = document.createElement('div');

    const fromTab = document.createElement('button');
    fromTab.classList.add('tp-ui-range-tab', 'tp-ui-range-from');
    modal.appendChild(fromTab);

    const toTab = document.createElement('button');
    toTab.classList.add('tp-ui-range-tab', 'tp-ui-range-to');
    modal.appendChild(toTab);

    const fromTime = document.createElement('span');
    fromTime.classList.add('tp-ui-range-from-time');
    modal.appendChild(fromTime);

    const toTime = document.createElement('span');
    toTime.classList.add('tp-ui-range-to-time');
    modal.appendChild(toTime);

    mockCore.getModalElement.mockReturnValue(modal);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('constructor', () => {
    it('should create RangeUI instance', () => {
      expect(() => new RangeUI(mockCore as never, state)).not.toThrow();
    });
  });

  describe('updateTabs', () => {
    it('should set from tab as active when from is active part', () => {
      const ui = new RangeUI(mockCore as never, state);

      ui.updateTabs();

      const fromTab = modal.querySelector('.tp-ui-range-from');
      const toTab = modal.querySelector('.tp-ui-range-to');

      expect(fromTab?.classList.contains('active')).toBe(true);
      expect(toTab?.classList.contains('active')).toBe(false);
    });

    it('should disable to tab when from is not complete', () => {
      const ui = new RangeUI(mockCore as never, state);

      ui.updateTabs();

      const toTab = modal.querySelector('.tp-ui-range-to');

      expect(toTab?.classList.contains('disabled')).toBe(true);
      expect(toTab?.getAttribute('aria-disabled')).toBe('true');
    });

    it('should enable to tab when from is complete', () => {
      state.setFromValue({ hour: '10', minutes: '30', type: 'AM' });
      const ui = new RangeUI(mockCore as never, state);

      ui.updateTabs();

      const toTab = modal.querySelector('.tp-ui-range-to');

      expect(toTab?.classList.contains('disabled')).toBe(false);
      expect(toTab?.getAttribute('aria-disabled')).toBe('false');
    });

    it('should set aria-selected correctly', () => {
      const ui = new RangeUI(mockCore as never, state);

      ui.updateTabs();

      const fromTab = modal.querySelector('.tp-ui-range-from');
      const toTab = modal.querySelector('.tp-ui-range-to');

      expect(fromTab?.getAttribute('aria-selected')).toBe('true');
      expect(toTab?.getAttribute('aria-selected')).toBe('false');
    });

    it('should not throw when modal is null', () => {
      mockCore.getModalElement.mockReturnValue(null);
      const ui = new RangeUI(mockCore as never, state);

      expect(() => ui.updateTabs()).not.toThrow();
    });
  });

  describe('updateTimeDisplay', () => {
    it('should show placeholder when no values', () => {
      const ui = new RangeUI(mockCore as never, state);

      ui.updateTimeDisplay();

      const fromTime = modal.querySelector('.tp-ui-range-from-time');
      const toTime = modal.querySelector('.tp-ui-range-to-time');

      expect(fromTime?.textContent).toBe('--:--');
      expect(toTime?.textContent).toBe('--:--');
    });

    it('should show from value when set', () => {
      state.setFromValue({ hour: '10', minutes: '30', type: 'AM' });
      const ui = new RangeUI(mockCore as never, state);

      ui.updateTimeDisplay();

      const fromTime = modal.querySelector('.tp-ui-range-from-time');
      expect(fromTime?.textContent).toContain('10:30');
    });

    it('should show preview value when set', () => {
      state.setPreviewValue({ hour: '11', minutes: '15', type: 'AM' });
      const ui = new RangeUI(mockCore as never, state);

      ui.updateTimeDisplay();

      const fromTime = modal.querySelector('.tp-ui-range-from-time');
      expect(fromTime?.textContent).toContain('11:15');
    });

    it('should not throw when modal is null', () => {
      mockCore.getModalElement.mockReturnValue(null);
      const ui = new RangeUI(mockCore as never, state);

      expect(() => ui.updateTimeDisplay()).not.toThrow();
    });
  });

  describe('updateOkButton', () => {
    it('should disable ok button when cannot confirm', () => {
      const okBtn = document.createElement('button');
      mockCore.getOkButton.mockReturnValue(okBtn);
      const ui = new RangeUI(mockCore as never, state);

      ui.updateOkButton();

      expect(okBtn.classList.contains('disabled')).toBe(true);
      expect(okBtn.getAttribute('aria-disabled')).toBe('true');
    });

    it('should enable ok button when can confirm', () => {
      state.setFromValue({ hour: '10', minutes: '30', type: 'AM' });
      state.setToValue({ hour: '02', minutes: '45', type: 'PM' });
      const okBtn = document.createElement('button');
      mockCore.getOkButton.mockReturnValue(okBtn);
      const ui = new RangeUI(mockCore as never, state);

      ui.updateOkButton();

      expect(okBtn.classList.contains('disabled')).toBe(false);
      expect(okBtn.getAttribute('aria-disabled')).toBe('false');
    });

    it('should not throw when ok button is null', () => {
      mockCore.getOkButton.mockReturnValue(null);
      const ui = new RangeUI(mockCore as never, state);

      expect(() => ui.updateOkButton()).not.toThrow();
    });
  });

  describe('updateInputValue', () => {
    it('should set input value with placeholder when no values', () => {
      const input = document.createElement('input') as HTMLInputElement;
      mockCore.getInput.mockReturnValue(input);
      const ui = new RangeUI(mockCore as never, state);

      ui.updateInputValue();

      expect(input.value).toBe('--:-- - --:--');
    });

    it('should set input value with times when values are set', () => {
      state.setFromValue({ hour: '10', minutes: '30', type: 'AM' });
      state.setToValue({ hour: '02', minutes: '45', type: 'PM' });
      const input = document.createElement('input') as HTMLInputElement;
      mockCore.getInput.mockReturnValue(input);
      const ui = new RangeUI(mockCore as never, state);

      ui.updateInputValue();

      expect(input.value).toContain('10:30');
      expect(input.value).toContain('2:45');
      expect(input.value).toContain('-');
    });

    it('should not throw when input is null', () => {
      mockCore.getInput.mockReturnValue(null);
      const ui = new RangeUI(mockCore as never, state);

      expect(() => ui.updateInputValue()).not.toThrow();
    });
  });

  describe('syncClockToActivePart', () => {
    it('should set hour and minute inputs', () => {
      state.setFromValue({ hour: '10', minutes: '30', type: 'AM' });
      const hourInput = document.createElement('input') as HTMLInputElement;
      const minutesInput = document.createElement('input') as HTMLInputElement;
      minutesInput.classList.add('active');
      minutesInput.blur = jest.fn();
      hourInput.click = jest.fn();
      mockCore.getHour.mockReturnValue(hourInput);
      mockCore.getMinutes.mockReturnValue(minutesInput);
      mockCore.getAM.mockReturnValue(document.createElement('div'));
      mockCore.getPM.mockReturnValue(document.createElement('div'));

      const ui = new RangeUI(mockCore as never, state);
      ui.syncClockToActivePart();

      expect(hourInput.value).toBe('10');
      expect(minutesInput.value).toBe('30');
    });

    it('should set default values when no saved value', () => {
      const hourInput = document.createElement('input') as HTMLInputElement;
      const minutesInput = document.createElement('input') as HTMLInputElement;
      minutesInput.blur = jest.fn();
      hourInput.click = jest.fn();
      mockCore.getHour.mockReturnValue(hourInput);
      mockCore.getMinutes.mockReturnValue(minutesInput);

      const ui = new RangeUI(mockCore as never, state);
      ui.syncClockToActivePart();

      expect(hourInput.value).toBe('12');
      expect(minutesInput.value).toBe('00');
    });

    it('should set AM/PM for 12h mode', () => {
      state.setFromValue({ hour: '10', minutes: '30', type: 'AM' });
      const hourInput = document.createElement('input') as HTMLInputElement;
      const minutesInput = document.createElement('input') as HTMLInputElement;
      const amBtn = document.createElement('div');
      const pmBtn = document.createElement('div');
      minutesInput.blur = jest.fn();
      hourInput.click = jest.fn();
      mockCore.getHour.mockReturnValue(hourInput);
      mockCore.getMinutes.mockReturnValue(minutesInput);
      mockCore.getAM.mockReturnValue(amBtn);
      mockCore.getPM.mockReturnValue(pmBtn);

      const ui = new RangeUI(mockCore as never, state);
      ui.syncClockToActivePart();

      expect(amBtn.classList.contains('active')).toBe(true);
      expect(pmBtn.classList.contains('active')).toBe(false);
    });

    it('should click hour input to focus', () => {
      const hourInput = document.createElement('input') as HTMLInputElement;
      const minutesInput = document.createElement('input') as HTMLInputElement;
      minutesInput.blur = jest.fn();
      hourInput.click = jest.fn();
      mockCore.getHour.mockReturnValue(hourInput);
      mockCore.getMinutes.mockReturnValue(minutesInput);

      const ui = new RangeUI(mockCore as never, state);
      ui.syncClockToActivePart();

      expect(hourInput.click).toHaveBeenCalled();
    });
  });

  describe('updateAll', () => {
    it('should call all update methods', () => {
      const okBtn = document.createElement('button');
      const input = document.createElement('input') as HTMLInputElement;
      mockCore.getOkButton.mockReturnValue(okBtn);
      mockCore.getInput.mockReturnValue(input);

      const ui = new RangeUI(mockCore as never, state);
      const updateTabsSpy = jest.spyOn(ui, 'updateTabs');
      const updateTimeDisplaySpy = jest.spyOn(ui, 'updateTimeDisplay');
      const updateOkButtonSpy = jest.spyOn(ui, 'updateOkButton');
      const updateInputValueSpy = jest.spyOn(ui, 'updateInputValue');

      ui.updateAll();

      expect(updateTabsSpy).toHaveBeenCalled();
      expect(updateTimeDisplaySpy).toHaveBeenCalled();
      expect(updateOkButtonSpy).toHaveBeenCalled();
      expect(updateInputValueSpy).toHaveBeenCalled();
    });
  });
});

