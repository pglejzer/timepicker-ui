import TimepickerUI from '../../../src/timepicker/TimepickerUI';
import type { TimepickerEventName } from '../../../src/utils/EventEmitter';
import type { RangeChangeEventData, SwitchViewEventData } from '../../../src/types/types';

type Equals<A, B> = (<T>() => T extends A ? 1 : 2) extends <T>() => T extends B ? 1 : 2 ? true : false;
const assertType = <T extends true>(): T => true as T;

describe('TimepickerEventName', () => {
  afterEach(() => {
    TimepickerUI.destroyAll();
    document.body.innerHTML = '';
  });

  it('lists the public events and leaves the internal ones out', () => {
    assertType<
      Equals<Extract<TimepickerEventName, 'range:change' | 'switch:view'>, 'range:change' | 'switch:view'>
    >();
    assertType<Equals<Extract<TimepickerEventName, 'open:request' | 'input:commit'>, never>>();
    assertType<Equals<string extends TimepickerEventName ? true : false, false>>();
    expect(true).toBe(true);
  });

  it('types the payload of a known event and keeps custom names', () => {
    const input = document.createElement('input');
    document.body.appendChild(input);
    const picker = new TimepickerUI(input);

    picker.on('switch:view', (data) => {
      assertType<Equals<typeof data, SwitchViewEventData>>();
    });
    picker.once('range:change', (data) => {
      assertType<Equals<typeof data, RangeChangeEventData>>();
    });
    picker.on('my:custom', (data) => {
      assertType<Equals<typeof data, unknown>>();
    });
    picker.off('switch:view');
    expect(true).toBe(true);
  });
});
