import * as rangeIndex from '../../../../../src/managers/plugins/range/index';
import RangeManager from '../../../../../src/managers/plugins/range/RangeManager';
import { RangeState } from '../../../../../src/managers/plugins/range/RangeState';
import { RangeUI } from '../../../../../src/managers/plugins/range/RangeUI';

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
});

