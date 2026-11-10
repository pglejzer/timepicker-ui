import * as node from '@/utils/node';
import { getInlineContainer, resolveElement, whenSized } from '@/utils/dom';
import {
  FakeResizeObserver,
  installFakeResizeObserver,
  removeResizeObserver,
  sizeOf,
} from './resize-observer-helpers';

const addHost = (id: string): HTMLElement => {
  const host = document.createElement('div');
  host.id = id;
  document.body.appendChild(host);
  return host;
};

afterEach(() => {
  jest.restoreAllMocks();
  document.body.innerHTML = '';
});

describe('resolveElement', () => {
  it('returns the element a selector matches', () => {
    const host = addHost('dom-host');

    expect(resolveElement('#dom-host')).toBe(host);
  });

  it('returns an element it is given as it is', () => {
    const element = document.createElement('section');

    expect(resolveElement(element)).toBe(element);
  });

  it.each<[string, string | undefined]>([
    ['an empty selector', ''],
    ['undefined', undefined],
    ['a selector that matches nothing', '#missing-host'],
  ])('returns null for %s', (_name, target) => {
    expect(resolveElement(target)).toBeNull();
  });

  it('returns null without a document', () => {
    addHost('dom-host');
    jest.spyOn(node, 'isDocument').mockReturnValue(false);

    expect(resolveElement('#dom-host')).toBeNull();
  });
});

describe('getInlineContainer', () => {
  it('prefers container over containerId', () => {
    const preferred = addHost('preferred-host');
    addHost('id-host');

    expect(getInlineContainer({ enabled: true, container: '#preferred-host', containerId: 'id-host' })).toBe(
      preferred,
    );
    expect(getInlineContainer({ enabled: true, container: preferred, containerId: 'id-host' })).toBe(
      preferred,
    );
  });

  it('finds the container by containerId', () => {
    const host = addHost('id-host');

    expect(getInlineContainer({ enabled: true, containerId: 'id-host' })).toBe(host);
  });

  it('returns null when neither container nor containerId is set', () => {
    expect(getInlineContainer({ enabled: true })).toBeNull();
    expect(getInlineContainer(undefined)).toBeNull();
  });

  it('returns null when the container is not in the document', () => {
    expect(getInlineContainer({ enabled: true, container: '#missing-host' })).toBeNull();
    expect(getInlineContainer({ enabled: true, containerId: 'missing-host' })).toBeNull();
  });

  it('returns null for a containerId without a document', () => {
    addHost('id-host');
    jest.spyOn(node, 'isDocument').mockReturnValue(false);

    expect(getInlineContainer({ enabled: true, containerId: 'id-host' })).toBeNull();
  });
});

describe('whenSized', () => {
  let restoreResizeObserver: () => void;

  afterEach(() => {
    restoreResizeObserver();
  });

  describe('without ResizeObserver', () => {
    beforeEach(() => {
      restoreResizeObserver = removeResizeObserver();
    });

    it('does nothing and returns a cleanup that does not throw', () => {
      const callback = jest.fn();
      const element = document.createElement('div');
      sizeOf(element, 0);

      expect(() => whenSized(element, callback)()).not.toThrow();
      expect(callback).not.toHaveBeenCalled();
    });
  });

  describe('with ResizeObserver', () => {
    beforeEach(() => {
      restoreResizeObserver = installFakeResizeObserver();
    });

    it('does nothing for a missing element', () => {
      const callback = jest.fn();

      expect(() => whenSized(null, callback)()).not.toThrow();
      expect(() => whenSized(undefined, callback)()).not.toThrow();
      expect(FakeResizeObserver.instances).toHaveLength(0);
      expect(callback).not.toHaveBeenCalled();
    });

    it('calls back once on the first non-zero size, then disconnects', () => {
      const element = document.createElement('div');
      sizeOf(element, 0);
      const callback = jest.fn();
      whenSized(element, callback);
      const [observer] = FakeResizeObserver.instances;

      expect(observer.observe).toHaveBeenCalledWith(element);

      observer.fire();
      expect(callback).not.toHaveBeenCalled();
      expect(observer.disconnect).not.toHaveBeenCalled();

      sizeOf(element, 200);
      observer.fire();
      expect(callback).toHaveBeenCalledTimes(1);
      expect(observer.disconnect).toHaveBeenCalledTimes(1);
    });

    it('keeps waiting while only one side has a size', () => {
      const element = document.createElement('div');
      sizeOf(element, 200, 0);
      const callback = jest.fn();
      whenSized(element, callback);
      const [observer] = FakeResizeObserver.instances;

      observer.fire();
      expect(callback).not.toHaveBeenCalled();

      sizeOf(element, 200, 100);
      observer.fire();
      expect(callback).toHaveBeenCalledTimes(1);
    });

    it('skips an element that already has a size', () => {
      const sized = document.createElement('div');
      sizeOf(sized, 200);
      const callback = jest.fn();

      expect(() => whenSized(sized, callback)()).not.toThrow();
      expect(FakeResizeObserver.instances).toHaveLength(0);
      expect(callback).not.toHaveBeenCalled();
    });

    it('returns a cleanup that disconnects a pending observer', () => {
      const hidden = document.createElement('div');
      sizeOf(hidden, 0);

      whenSized(hidden, jest.fn())();

      expect(FakeResizeObserver.instances).toHaveLength(1);
      expect(FakeResizeObserver.instances[0].disconnect).toHaveBeenCalledTimes(1);
    });
  });
});
