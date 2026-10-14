import { RangeState } from '@/managers/plugins/range/RangeState';
import { EventEmitter, type TimepickerEventMap } from '@/utils/EventEmitter';

const firstValues = (count: number): string[] =>
  Array.from({ length: count }, (_, index) => String(index).padStart(2, '0'));

describe('RangeState with seconds', () => {
  let emitter: EventEmitter<TimepickerEventMap>;
  let onValidation: jest.Mock;

  beforeEach(() => {
    emitter = new EventEmitter<TimepickerEventMap>();
    onValidation = jest.fn();
    emitter.on('range:validation', onValidation);
  });

  it('validates minDuration at second precision and reports durationSeconds', () => {
    const state = new RangeState('24h', 1, undefined, emitter, true);
    state.setFromValue({ hour: '10', minutes: '00', seconds: '30' });
    state.setToValue({ hour: '10', minutes: '01', seconds: '15' });

    expect(state.validate()).toEqual({ valid: false, duration: 0, durationSeconds: 45 });
    expect(onValidation).toHaveBeenCalledWith(expect.objectContaining({ valid: false, durationSeconds: 45 }));
  });

  it('validates maxDuration at second precision', () => {
    const state = new RangeState('24h', undefined, 1, emitter, true);
    state.setFromValue({ hour: '10', minutes: '00', seconds: '00' });
    state.setToValue({ hour: '10', minutes: '01', seconds: '30' });

    expect(state.validate()).toEqual({ valid: false, duration: 1, durationSeconds: 90 });
  });

  it('confirms a sub-minute range and rejects an empty or reversed one at second precision', () => {
    const state = new RangeState('24h', undefined, undefined, emitter, true);
    state.setFromValue({ hour: '10', minutes: '00', seconds: '30' });

    state.setToValue({ hour: '10', minutes: '00', seconds: '45' });
    expect(state.canConfirm()).toBe(true);

    state.setToValue({ hour: '10', minutes: '00', seconds: '30' });
    expect(state.canConfirm()).toBe(false);

    state.setToValue({ hour: '10', minutes: '00', seconds: '10' });
    expect(state.canConfirm()).toBe(false);
  });

  it('limits the "to" part to seconds after "from" in the same hour and minute (24h)', () => {
    const state = new RangeState('24h', undefined, undefined, emitter, true);
    state.setFromValue({ hour: '10', minutes: '05', seconds: '20' });
    state.setActivePart('to');

    expect(state.getDisabledTimeForEndPart()).toEqual(
      expect.objectContaining({ fromHour: 10, fromMinute: 5, seconds: firstValues(20) }),
    );
  });

  it('limits the "to" part to seconds after "from" in the same hour and minute (12h)', () => {
    const state = new RangeState('12h', undefined, undefined, emitter, true);
    state.setFromValue({ hour: '02', minutes: '30', seconds: '15', type: 'PM' });
    state.setActivePart('to');

    expect(state.getDisabledTimeForEndPart()).toEqual(
      expect.objectContaining({ fromType: 'PM', fromHour: 2, fromMinute: 30, seconds: firstValues(15) }),
    );
  });

  it('keeps validation and the "to" limits minute-based when seconds are not shown', () => {
    const state = new RangeState('24h', 30, undefined, emitter);
    state.setFromValue({ hour: '10', minutes: '05' });
    state.setToValue({ hour: '10', minutes: '20' });

    expect(state.validate()).toEqual(expect.objectContaining({ valid: false, duration: 15 }));
    expect(onValidation).toHaveBeenCalledWith(expect.objectContaining({ valid: false, duration: 15 }));
    expect(onValidation.mock.calls[0][0].durationSeconds).toBeUndefined();

    state.setActivePart('to');
    const disabledTime = state.getDisabledTimeForEndPart();

    expect(disabledTime).toEqual(
      expect.objectContaining({ hours: firstValues(10), minutes: firstValues(5), fromHour: 10 }),
    );
    expect(disabledTime?.seconds).toBeUndefined();
  });
});
