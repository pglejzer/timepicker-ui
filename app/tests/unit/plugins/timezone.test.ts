import { TimezonePlugin, TimezoneManager } from '../../../src/plugins/timezone';
import { TimezoneManager as TimezoneManagerDirect } from '../../../src/managers/plugins/timezone';
import { CoreState } from '../../../src/timepicker/CoreState';
import { EventEmitter } from '../../../src/utils/EventEmitter';
import { DEFAULT_OPTIONS } from '../../../src/utils/options/defaults';

describe('TimezonePlugin', () => {
  it('should export TimezonePlugin with name timezone', () => {
    expect(TimezonePlugin.name).toBe('timezone');
  });

  it('should have factory function', () => {
    expect(typeof TimezonePlugin.factory).toBe('function');
  });

  it('should re-export TimezoneManager', () => {
    expect(TimezoneManager).toBe(TimezoneManagerDirect);
  });

  it('should create TimezoneManager instance via factory', () => {
    const mockElement = document.createElement('div');
    mockElement.innerHTML = '<input type="text" />';
    document.body.appendChild(mockElement);

    const core = new CoreState(mockElement, DEFAULT_OPTIONS, 'test-id');
    const emitter = new EventEmitter();

    const instance = TimezonePlugin.factory(core, emitter);

    expect(instance).toBeInstanceOf(TimezoneManager);
    instance.destroy();
    document.body.removeChild(mockElement);
  });
});
