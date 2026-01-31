import { PluginRegistry } from '../../../src/core/PluginRegistry';
import type { Plugin, PluginManager } from '../../../src/core/PluginRegistry';

describe('PluginRegistry', () => {
  const createMockPlugin = (name: string): Plugin => ({
    name,
    factory: jest.fn().mockReturnValue({
      init: jest.fn(),
      destroy: jest.fn(),
    } as PluginManager),
  });

  beforeEach(() => {});

  describe('register', () => {
    it('should register a plugin', () => {
      const plugin = createMockPlugin('test-plugin-1');
      PluginRegistry.register(plugin);

      expect(PluginRegistry.has('test-plugin-1')).toBe(true);
    });

    it('should not register duplicate plugins', () => {
      const plugin1 = createMockPlugin('test-plugin-2');
      const plugin2 = createMockPlugin('test-plugin-2');

      PluginRegistry.register(plugin1);
      PluginRegistry.register(plugin2);

      const allPlugins = PluginRegistry.getAll();
      const count = allPlugins.filter((p) => p.name === 'test-plugin-2').length;
      expect(count).toBe(1);
    });

    it('should register plugin with optionsExtender', () => {
      const optionsExtender = jest.fn();
      const plugin: Plugin = {
        name: 'test-plugin-3',
        factory: jest.fn().mockReturnValue({ init: jest.fn(), destroy: jest.fn() }),
        optionsExtender,
      };

      PluginRegistry.register(plugin);
      const registered = PluginRegistry.get('test-plugin-3');

      expect(registered?.optionsExtender).toBe(optionsExtender);
    });
  });

  describe('has', () => {
    it('should return true for registered plugin', () => {
      const plugin = createMockPlugin('test-plugin-4');
      PluginRegistry.register(plugin);

      expect(PluginRegistry.has('test-plugin-4')).toBe(true);
    });

    it('should return false for unregistered plugin', () => {
      expect(PluginRegistry.has('non-existent-plugin')).toBe(false);
    });
  });

  describe('get', () => {
    it('should return registered plugin', () => {
      const plugin = createMockPlugin('test-plugin-5');
      PluginRegistry.register(plugin);

      const retrieved = PluginRegistry.get('test-plugin-5');
      expect(retrieved).toBeDefined();
      expect(retrieved?.name).toBe('test-plugin-5');
    });

    it('should return undefined for unregistered plugin', () => {
      expect(PluginRegistry.get('non-existent')).toBeUndefined();
    });
  });

  describe('getAll', () => {
    it('should return array of all registered plugins', () => {
      const plugin = createMockPlugin('test-plugin-6');
      PluginRegistry.register(plugin);

      const all = PluginRegistry.getAll();
      expect(Array.isArray(all)).toBe(true);
      expect(all.some((p) => p.name === 'test-plugin-6')).toBe(true);
    });
  });
});

