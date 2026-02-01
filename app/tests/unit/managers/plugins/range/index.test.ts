import * as rangeIndex from '../../../../../src/managers/plugins/range/index';
import RangeManager from '../../../../../src/managers/plugins/range/RangeManager';
import { RangeState } from '../../../../../src/managers/plugins/range/RangeState';
import { RangeUI } from '../../../../../src/managers/plugins/range/RangeUI';
import type {
  RangePart,
  RangeValue,
  RangeValidationResult,
  FormattedRange,
} from '../../../../../src/managers/plugins/range/types';

describe('range index exports', () => {
  it('should export RangeManager', () => {
    expect(rangeIndex.RangeManager).toBe(RangeManager);
  });

  it('should export RangeState', () => {
    expect(rangeIndex.RangeState).toBe(RangeState);
  });

  it('should export RangeUI', () => {
    expect(rangeIndex.RangeUI).toBe(RangeUI);
  });

  it('should export utils functions', () => {
    expect(typeof rangeIndex.parseRangeInput).toBe('function');
    expect(typeof rangeIndex.formatDisplayTime).toBe('function');
    expect(typeof rangeIndex.isValueComplete).toBe('function');
    expect(typeof rangeIndex.calculateDuration).toBe('function');
  });

  it('should have types available from re-export', () => {
    const rangePart: RangePart = 'from';
    const rangeValue: RangeValue = { hour: '10', minutes: '00' };
    const validationResult: RangeValidationResult = { valid: true, duration: 60 };
    const formattedRange: FormattedRange = { from: '10:00', to: '11:00' };

    expect(rangePart).toBe('from');
    expect(rangeValue.hour).toBe('10');
    expect(validationResult.valid).toBe(true);
    expect(formattedRange.from).toBe('10:00');
  });
});
