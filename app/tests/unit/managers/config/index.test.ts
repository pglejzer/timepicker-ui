import { InputValueHandler, MobileViewHandler, DisabledTimeHandler } from '../../../../src/managers/config';

describe('config/index exports', () => {
  it('should export InputValueHandler', () => {
    expect(InputValueHandler).toBeDefined();
    expect(typeof InputValueHandler).toBe('function');
  });

  it('should export MobileViewHandler', () => {
    expect(MobileViewHandler).toBeDefined();
    expect(typeof MobileViewHandler).toBe('function');
  });

  it('should export DisabledTimeHandler', () => {
    expect(DisabledTimeHandler).toBeDefined();
    expect(typeof DisabledTimeHandler).toBe('function');
  });
});

