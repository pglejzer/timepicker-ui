import {
  TimezonePlugin,
  TimezoneManager,
  getTimezoneList,
  DEFAULT_TIMEZONES,
  type TimezoneInfo,
} from '../../../src/plugins/timezone';
import { TimezoneManager as TimezoneManagerDirect } from '../../../src/managers/plugins/timezone';
import * as timezoneUtils from '../../../src/utils/timezone';
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

  it('should re-export the timezone list helpers from the plugin entry', () => {
    expect(getTimezoneList).toBe(timezoneUtils.getTimezoneList);
    expect(DEFAULT_TIMEZONES).toBe(timezoneUtils.DEFAULT_TIMEZONES);
    expect(DEFAULT_TIMEZONES).toContain('UTC');
  });

  it('should list a whitelist built from DEFAULT_TIMEZONES plus an extra zone', () => {
    const list: TimezoneInfo[] = getTimezoneList([...DEFAULT_TIMEZONES, 'Europe/Warsaw']);
    const ids = list.map((tz) => tz.id);

    expect(ids).toContain('Europe/Warsaw');
    expect(ids).toContain('UTC');
    expect(list.find((tz) => tz.id === 'Europe/Warsaw')).toEqual(
      expect.objectContaining({ label: expect.stringContaining('Warsaw'), offset: expect.any(String) }),
    );
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
