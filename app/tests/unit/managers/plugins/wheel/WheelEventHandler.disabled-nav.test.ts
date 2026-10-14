import { WheelEventHandler } from '../../../../../src/managers/plugins/wheel/WheelEventHandler';
import { EventEmitter, type TimepickerEventMap } from '../../../../../src/utils/EventEmitter';
import { CoreState } from '../../../../../src/timepicker/CoreState';
import { createWheelOptions } from './wheel-test-helpers';

function buildModal(values: string[], disabled: string[]): HTMLDivElement {
  const modal = document.createElement('div');
  modal.setAttribute('data-owner-id', 'nav-test');
  const col = document.createElement('div');
  col.className = 'tp-ui-wheel-column tp-ui-wheel-minutes';
  values.forEach((v) => {
    const item = document.createElement('div');
    item.className = disabled.includes(v) ? 'tp-ui-wheel-item is-disabled' : 'tp-ui-wheel-item';
    item.setAttribute('data-value', v);
    col.appendChild(item);
  });
  modal.appendChild(col);
  return modal;
}

describe('wheel keyboard navigation skips disabled items (S3)', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it.each([
    ['ArrowDown', '30', '32'],
    ['ArrowUp', '32', '30'],
  ])('%s from %s lands on %s', (key, current, expected) => {
    const host = document.createElement('div');
    host.innerHTML = '<input type="text" />';
    document.body.appendChild(host);
    const modal = buildModal(['29', '30', '31', '32'], ['31']);
    document.body.appendChild(modal);
    const core = new CoreState(host, createWheelOptions({ clock: { type: '24h' } }), 'nav-test');
    core.setIsOpen(true);
    const scrollHandler = {
      getSelectedValue: jest.fn(() => current),
      scrollToValue: jest.fn(),
      getCurrentSelection: jest.fn(() => ({ hour: '10', minute: current, ampm: null })),
      setScrollEndCallback: jest.fn(),
      setScrollStartCallback: jest.fn(),
    };
    const handler = new WheelEventHandler(
      new EventEmitter<TimepickerEventMap>(),
      scrollHandler as never,
      core,
    );
    handler.init();
    modal
      .querySelector('.tp-ui-wheel-minutes')!
      .dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
    expect(scrollHandler.scrollToValue).toHaveBeenCalledWith('minutes', expected);
  });
});
