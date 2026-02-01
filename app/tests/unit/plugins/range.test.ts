import { RangePlugin, RangeManager } from '../../../src/plugins/range';
import { RangeManager as RangeManagerDirect } from '../../../src/managers/plugins/range';
import { CoreState } from '../../../src/timepicker/CoreState';
import { EventEmitter } from '../../../src/utils/EventEmitter';
import { DEFAULT_OPTIONS } from '../../../src/utils/options/defaults';

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

  it('should create RangeManager instance via factory', () => {
    const mockElement = document.createElement('div');
    mockElement.innerHTML = '<input type="text" />';
    document.body.appendChild(mockElement);

    const core = new CoreState(mockElement, DEFAULT_OPTIONS, 'test-id');
    const emitter = new EventEmitter();

    const instance = RangePlugin.factory(core, emitter);

    expect(instance).toBeInstanceOf(RangeManager);
    instance.destroy();
    document.body.removeChild(mockElement);
  });
});
