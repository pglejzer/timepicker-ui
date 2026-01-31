import { RangeState } from '../../../../../src/managers/plugins/range/RangeState';
import { EventEmitter, type TimepickerEventMap } from '../../../../../src/utils/EventEmitter';

describe('RangeState', () => {
  let emitter: EventEmitter<TimepickerEventMap>;

  beforeEach(() => {
    emitter = new EventEmitter<TimepickerEventMap>();
  });

  describe('constructor', () => {
    it('should create state with 12h clock type', () => {
      const state = new RangeState('12h', undefined, undefined, emitter);

      expect(state.getActivePart()).toBe('from');
      expect(state.getFromValue()).toBeNull();
      expect(state.getToValue()).toBeNull();
    });

    it('should create state with 24h clock type', () => {
      const state = new RangeState('24h', undefined, undefined, emitter);

      expect(state.getActivePart()).toBe('from');
    });

    it('should accept min and max duration', () => {
      const state = new RangeState('12h', 30, 120, emitter);

      expect(state.getActivePart()).toBe('from');
    });
  });

  describe('getActivePart', () => {
    it('should return from as initial active part', () => {
      const state = new RangeState('12h', undefined, undefined, emitter);

      expect(state.getActivePart()).toBe('from');
    });
  });

  describe('setFromValue', () => {
    it('should set from value', () => {
      const state = new RangeState('12h', undefined, undefined, emitter);
      const value = { hour: '10', minutes: '30', type: 'AM' as const };

      state.setFromValue(value);

      expect(state.getFromValue()).toEqual(value);
    });

    it('should accept null value', () => {
      const state = new RangeState('12h', undefined, undefined, emitter);

      state.setFromValue(null);

      expect(state.getFromValue()).toBeNull();
    });
  });

  describe('setToValue', () => {
    it('should set to value', () => {
      const state = new RangeState('12h', undefined, undefined, emitter);
      const value = { hour: '02', minutes: '45', type: 'PM' as const };

      state.setToValue(value);

      expect(state.getToValue()).toEqual(value);
    });
  });

  describe('setPreviewValue', () => {
    it('should set preview value', () => {
      const state = new RangeState('12h', undefined, undefined, emitter);
      const value = { hour: '11', minutes: '15', type: 'AM' as const };

      state.setPreviewValue(value);

      expect(state.getPreviewValue()).toEqual(value);
    });
  });

  describe('isFromComplete', () => {
    it('should return false when no from value', () => {
      const state = new RangeState('12h', undefined, undefined, emitter);

      expect(state.isFromComplete()).toBe(false);
    });

    it('should return true when from value is complete for 12h', () => {
      const state = new RangeState('12h', undefined, undefined, emitter);
      state.setFromValue({ hour: '10', minutes: '30', type: 'AM' });

      expect(state.isFromComplete()).toBe(true);
    });

    it('should return true when from value is complete for 24h', () => {
      const state = new RangeState('24h', undefined, undefined, emitter);
      state.setFromValue({ hour: '14', minutes: '30', type: '' });

      expect(state.isFromComplete()).toBe(true);
    });
  });

  describe('isToComplete', () => {
    it('should return false when no to value', () => {
      const state = new RangeState('12h', undefined, undefined, emitter);

      expect(state.isToComplete()).toBe(false);
    });

    it('should return true when to value is complete', () => {
      const state = new RangeState('12h', undefined, undefined, emitter);
      state.setToValue({ hour: '02', minutes: '45', type: 'PM' });

      expect(state.isToComplete()).toBe(true);
    });
  });

  describe('canSwitchToEnd', () => {
    it('should return false when from is not complete', () => {
      const state = new RangeState('12h', undefined, undefined, emitter);

      expect(state.canSwitchToEnd()).toBe(false);
    });

    it('should return true when from is complete', () => {
      const state = new RangeState('12h', undefined, undefined, emitter);
      state.setFromValue({ hour: '10', minutes: '30', type: 'AM' });

      expect(state.canSwitchToEnd()).toBe(true);
    });
  });

  describe('canConfirm', () => {
    it('should return false when both values are incomplete', () => {
      const state = new RangeState('12h', undefined, undefined, emitter);

      expect(state.canConfirm()).toBe(false);
    });

    it('should return false when only from is complete', () => {
      const state = new RangeState('12h', undefined, undefined, emitter);
      state.setFromValue({ hour: '10', minutes: '30', type: 'AM' });

      expect(state.canConfirm()).toBe(false);
    });

    it('should return true when both are complete', () => {
      const state = new RangeState('12h', undefined, undefined, emitter);
      state.setFromValue({ hour: '10', minutes: '30', type: 'AM' });
      state.setToValue({ hour: '02', minutes: '45', type: 'PM' });

      expect(state.canConfirm()).toBe(true);
    });
  });

  describe('setActivePart', () => {
    it('should switch to from part', () => {
      const state = new RangeState('12h', undefined, undefined, emitter);
      state.setFromValue({ hour: '10', minutes: '30', type: 'AM' });
      state.setActivePart('to');
      state.setActivePart('from');

      expect(state.getActivePart()).toBe('from');
    });

    it('should not switch to to if from is incomplete', () => {
      const state = new RangeState('12h', undefined, undefined, emitter);

      const result = state.setActivePart('to');

      expect(result).toBe(false);
      expect(state.getActivePart()).toBe('from');
    });

    it('should switch to to if from is complete', () => {
      const state = new RangeState('12h', undefined, undefined, emitter);
      state.setFromValue({ hour: '10', minutes: '30', type: 'AM' });

      const result = state.setActivePart('to');

      expect(result).toBe(true);
      expect(state.getActivePart()).toBe('to');
    });

    it('should clear preview on switch', () => {
      const state = new RangeState('12h', undefined, undefined, emitter);
      state.setFromValue({ hour: '10', minutes: '30', type: 'AM' });
      state.setPreviewValue({ hour: '11', minutes: '00', type: 'AM' });

      state.setActivePart('to');

      expect(state.getPreviewValue()).toBeNull();
    });
  });

  describe('getCurrentValue', () => {
    it('should return preview value if set', () => {
      const state = new RangeState('12h', undefined, undefined, emitter);
      const preview = { hour: '11', minutes: '15', type: 'AM' as const };
      state.setPreviewValue(preview);

      expect(state.getCurrentValue()).toEqual(preview);
    });

    it('should return from value when active part is from', () => {
      const state = new RangeState('12h', undefined, undefined, emitter);
      const fromValue = { hour: '10', minutes: '30', type: 'AM' as const };
      state.setFromValue(fromValue);

      expect(state.getCurrentValue()).toEqual(fromValue);
    });

    it('should return to value when active part is to', () => {
      const state = new RangeState('12h', undefined, undefined, emitter);
      const fromValue = { hour: '10', minutes: '30', type: 'AM' as const };
      const toValue = { hour: '02', minutes: '45', type: 'PM' as const };
      state.setFromValue(fromValue);
      state.setToValue(toValue);
      state.setActivePart('to');

      expect(state.getCurrentValue()).toEqual(toValue);
    });
  });

  describe('getSavedValue', () => {
    it('should return from value when active part is from', () => {
      const state = new RangeState('12h', undefined, undefined, emitter);
      const fromValue = { hour: '10', minutes: '30', type: 'AM' as const };
      state.setFromValue(fromValue);

      expect(state.getSavedValue()).toEqual(fromValue);
    });

    it('should return to value when active part is to', () => {
      const state = new RangeState('12h', undefined, undefined, emitter);
      const fromValue = { hour: '10', minutes: '30', type: 'AM' as const };
      const toValue = { hour: '02', minutes: '45', type: 'PM' as const };
      state.setFromValue(fromValue);
      state.setToValue(toValue);
      state.setActivePart('to');

      expect(state.getSavedValue()).toEqual(toValue);
    });
  });

  describe('commitPreview', () => {
    it('should not do anything if no preview', () => {
      const state = new RangeState('12h', undefined, undefined, emitter);
      const fromValue = { hour: '10', minutes: '30', type: 'AM' as const };
      state.setFromValue(fromValue);

      state.commitPreview();

      expect(state.getFromValue()).toEqual(fromValue);
    });

    it('should commit preview to from value', () => {
      const state = new RangeState('12h', undefined, undefined, emitter);
      const preview = { hour: '11', minutes: '15', type: 'AM' as const };
      state.setPreviewValue(preview);

      state.commitPreview();

      expect(state.getFromValue()).toEqual(preview);
      expect(state.getPreviewValue()).toBeNull();
    });

    it('should commit preview to to value when in to part', () => {
      const state = new RangeState('12h', undefined, undefined, emitter);
      state.setFromValue({ hour: '10', minutes: '30', type: 'AM' });
      state.setActivePart('to');
      const preview = { hour: '02', minutes: '45', type: 'PM' as const };
      state.setPreviewValue(preview);

      state.commitPreview();

      expect(state.getToValue()).toEqual(preview);
      expect(state.getPreviewValue()).toBeNull();
    });
  });

  describe('getDuration', () => {
    it('should calculate duration between from and to', () => {
      const state = new RangeState('12h', undefined, undefined, emitter);
      state.setFromValue({ hour: '10', minutes: '00', type: 'AM' });
      state.setToValue({ hour: '11', minutes: '00', type: 'AM' });

      const duration = state.getDuration();

      expect(duration).toBe(60);
    });
  });

  describe('validate', () => {
    it('should return valid when values are not set', () => {
      const state = new RangeState('12h', undefined, undefined, emitter);

      const result = state.validate();

      expect(result.valid).toBe(true);
      expect(result.duration).toBe(0);
    });

    it('should emit validation event', () => {
      const state = new RangeState('12h', 30, 120, emitter);
      state.setFromValue({ hour: '10', minutes: '00', type: 'AM' });
      state.setToValue({ hour: '11', minutes: '00', type: 'AM' });

      const callback = jest.fn();
      emitter.on('range:validation', callback);

      state.validate();

      expect(callback).toHaveBeenCalled();
    });

    it('should return invalid when duration is below minimum', () => {
      const state = new RangeState('12h', 120, undefined, emitter);
      state.setFromValue({ hour: '10', minutes: '00', type: 'AM' });
      state.setToValue({ hour: '10', minutes: '30', type: 'AM' });

      const result = state.validate();

      expect(result.valid).toBe(false);
    });

    it('should return invalid when duration is above maximum', () => {
      const state = new RangeState('12h', undefined, 30, emitter);
      state.setFromValue({ hour: '10', minutes: '00', type: 'AM' });
      state.setToValue({ hour: '11', minutes: '00', type: 'AM' });

      const result = state.validate();

      expect(result.valid).toBe(false);
    });
  });

  describe('getDisabledTimeForEndPart', () => {
    it('should return null when active part is from', () => {
      const state = new RangeState('12h', undefined, undefined, emitter);

      expect(state.getDisabledTimeForEndPart()).toBeNull();
    });

    it('should return null when from is not complete', () => {
      const state = new RangeState('12h', undefined, undefined, emitter);
      state.setFromValue({ hour: '10', minutes: '30', type: 'AM' });
      state.setActivePart('to');
      state.setFromValue(null);

      expect(state.getDisabledTimeForEndPart()).toBeNull();
    });

    it('should return disabled config for 24h mode', () => {
      const state = new RangeState('24h', undefined, undefined, emitter);
      state.setFromValue({ hour: '10', minutes: '30', type: '' });
      state.setActivePart('to');

      const config = state.getDisabledTimeForEndPart();

      expect(config).not.toBeNull();
      expect(config?.hours).toBeDefined();
      expect(config?.minutes).toBeDefined();
    });

    it('should return disabled config for 12h mode', () => {
      const state = new RangeState('12h', undefined, undefined, emitter);
      state.setFromValue({ hour: '10', minutes: '30', type: 'AM' });
      state.setActivePart('to');

      const config = state.getDisabledTimeForEndPart();

      expect(config).not.toBeNull();
    });
  });

  describe('reset', () => {
    it('should reset all values', () => {
      const state = new RangeState('12h', undefined, undefined, emitter);
      state.setFromValue({ hour: '10', minutes: '30', type: 'AM' });
      state.setToValue({ hour: '02', minutes: '45', type: 'PM' });
      state.setActivePart('to');
      state.setPreviewValue({ hour: '03', minutes: '00', type: 'PM' });

      state.reset();

      expect(state.getActivePart()).toBe('from');
      expect(state.getFromValue()).toBeNull();
      expect(state.getToValue()).toBeNull();
      expect(state.getPreviewValue()).toBeNull();
    });
  });
});

