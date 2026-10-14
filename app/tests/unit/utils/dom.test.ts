import * as node from '@/utils/node';
import { getInlineContainer, resolveElement } from '@/utils/dom';

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
    expect(getInlineContainer({ enabled: true, container: preferred, containerId: 'id-host' })).toBe(preferred);
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
