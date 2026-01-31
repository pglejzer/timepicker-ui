import { TimezonePlugin, TimezoneManager } from '../../../src/plugins/timezone';
import { TimezoneManager as TimezoneManagerDirect } from '../../../src/managers/plugins/timezone';

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
});

