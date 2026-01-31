import { RangePlugin, RangeManager } from '../../../src/plugins/range';
import { RangeManager as RangeManagerDirect } from '../../../src/managers/plugins/range';

describe('RangePlugin', () => {
  it('should export RangePlugin with name range', () => {
    expect(RangePlugin.name).toBe('range');
  });

  it('should have factory function', () => {
    expect(typeof RangePlugin.factory).toBe('function');
  });

  it('should re-export RangeManager', () => {
    expect(RangeManager).toBe(RangeManagerDirect);
  });
});

