import { ClockEventHandler } from '../../../../../src/managers/clock/handlers/ClockEventHandler';
import { EventEmitter, type TimepickerEventMap } from '../../../../../src/utils/EventEmitter';
import type { ClockSystem } from '../../../../../src/managers/clock/ClockSystem';
import type { DisabledTimeConfig } from '../../../../../src/managers/clock/types';

describe('ClockEventHandler', () => {
  let emitter: EventEmitter<TimepickerEventMap>;
  let mockClockSystem: Partial<ClockSystem>;
  let setHoursToClockMock: jest.Mock;
  let setMinutesToClockMock: jest.Mock;
  let setSecondsToClockMock: jest.Mock;
  let updateAmPmMock: jest.Mock;
  let convertDisabledTimeMock: jest.Mock;
  let setValueIfShownMock: jest.Mock;
  let handler: ClockEventHandler;

  beforeEach(() => {
    emitter = new EventEmitter<TimepickerEventMap>();
    setValueIfShownMock = jest.fn().mockReturnValue(false);
    mockClockSystem = {
      blockInteractions: jest.fn(),
      unblockInteractions: jest.fn(),
      updateDisabledTime: jest.fn(),
      setValueIfShown: setValueIfShownMock,
    };
    setHoursToClockMock = jest.fn();
    setMinutesToClockMock = jest.fn();
    setSecondsToClockMock = jest.fn();
    updateAmPmMock = jest.fn();
    convertDisabledTimeMock = jest.fn().mockReturnValue(null);

    handler = new ClockEventHandler(
      emitter,
      () => mockClockSystem as ClockSystem,
      setHoursToClockMock,
      setMinutesToClockMock,
      updateAmPmMock,
      convertDisabledTimeMock,
      setSecondsToClockMock,
    );
    handler.setup();
  });

  describe('setup', () => {
    it('should emit animation:clock and call setHoursToClock on select:hour when the hour face is not shown', () => {
      const emitSpy = jest.spyOn(emitter, 'emit');

      emitter.emit('select:hour', { hour: '09' });

      expect(emitSpy).toHaveBeenCalledWith('animation:clock', {});
      expect(setHoursToClockMock).toHaveBeenCalledWith('09');
    });

    it('should handle select:hour with undefined hour', () => {
      emitter.emit('select:hour', { hour: '' });

      expect(setHoursToClockMock).toHaveBeenCalledWith(null);
    });

    it('should emit animation:clock and call setMinutesToClock on select:minute when the minutes face is not shown', () => {
      const emitSpy = jest.spyOn(emitter, 'emit');

      emitter.emit('select:minute', { minutes: '30' });

      expect(emitSpy).toHaveBeenCalledWith('animation:clock', {});
      expect(setMinutesToClockMock).toHaveBeenCalledWith('30');
    });

    it('should handle select:minute with undefined minutes', () => {
      emitter.emit('select:minute', { minutes: '' });

      expect(setMinutesToClockMock).toHaveBeenCalledWith(null);
    });

    it('should call updateAmPm on select:am', () => {
      emitter.emit('select:am', {});

      expect(updateAmPmMock).toHaveBeenCalled();
    });

    it('should call updateAmPm on select:pm', () => {
      emitter.emit('select:pm', {});

      expect(updateAmPmMock).toHaveBeenCalled();
    });

    it('should call blockInteractions on animation:start', () => {
      emitter.emit('animation:start', {});

      expect(mockClockSystem.blockInteractions).toHaveBeenCalled();
    });

    it('should call unblockInteractions on animation:end', () => {
      emitter.emit('animation:end', {});

      expect(mockClockSystem.unblockInteractions).toHaveBeenCalled();
    });

    it('should not throw when clockSystem is null on animation:start', () => {
      const nullEmitter = new EventEmitter<TimepickerEventMap>();
      const nullHandler = new ClockEventHandler(
        nullEmitter,
        () => null,
        setHoursToClockMock,
        setMinutesToClockMock,
        updateAmPmMock,
        convertDisabledTimeMock,
      );
      nullHandler.setup();

      expect(() => nullEmitter.emit('animation:start', {})).not.toThrow();
    });

    it('should not throw when clockSystem is null on animation:end', () => {
      const nullEmitter = new EventEmitter<TimepickerEventMap>();
      const nullHandler = new ClockEventHandler(
        nullEmitter,
        () => null,
        setHoursToClockMock,
        setMinutesToClockMock,
        updateAmPmMock,
        convertDisabledTimeMock,
      );
      nullHandler.setup();

      expect(() => nullEmitter.emit('animation:end', {})).not.toThrow();
    });
  });

  describe('select value on the face that is shown or on another face', () => {
    type SelectCase = {
      event: string;
      mode: 'hours' | 'minutes' | 'seconds';
      value: string;
      select: (value: string) => void;
      setter: () => jest.Mock;
    };

    const CASES: SelectCase[] = [
      {
        event: 'select:hour',
        mode: 'hours',
        value: '09',
        select: (hour) => emitter.emit('select:hour', { hour }),
        setter: () => setHoursToClockMock,
      },
      {
        event: 'select:minute',
        mode: 'minutes',
        value: '30',
        select: (minutes) => emitter.emit('select:minute', { minutes }),
        setter: () => setMinutesToClockMock,
      },
      {
        event: 'select:second',
        mode: 'seconds',
        value: '15',
        select: (seconds) => emitter.emit('select:second', { seconds }),
        setter: () => setSecondsToClockMock,
      },
    ];

    it.each(CASES)(
      '$event on the $mode face that is already shown moves the hand in place: no animation:clock, no face rebuild',
      ({ mode, value, select, setter }) => {
        setValueIfShownMock.mockReturnValue(true);
        const animation = jest.fn();
        emitter.on('animation:clock', animation);

        select(value);

        expect(setValueIfShownMock).toHaveBeenCalledTimes(1);
        expect(setValueIfShownMock).toHaveBeenCalledWith(mode, value);
        expect(animation).not.toHaveBeenCalled();
        expect(setter()).not.toHaveBeenCalled();
      },
    );

    it.each(CASES)(
      '$event while another face is shown animates once, then switches the face through the setter',
      ({ mode, value, select, setter }) => {
        const order: string[] = [];
        emitter.on('animation:clock', () => order.push('animation:clock'));
        setter().mockImplementation((next: string | null) => order.push(`setter:${next}`));

        select(value);

        expect(setValueIfShownMock).toHaveBeenCalledWith(mode, value);
        expect(order).toEqual(['animation:clock', `setter:${value}`]);
      },
    );

    it.each(CASES)(
      '$event while another face is shown emits switch:face with the new face after the face is switched',
      ({ mode, value, select, setter }) => {
        const order: string[] = [];
        const switchFace = jest.fn(() => order.push('switch:face'));
        emitter.on('switch:face', switchFace);
        setter().mockImplementation((next: string | null) => order.push(`setter:${next}`));

        select(value);

        expect(switchFace).toHaveBeenCalledTimes(1);
        expect(switchFace).toHaveBeenCalledWith({ face: mode });
        expect(order).toEqual([`setter:${value}`, 'switch:face']);
      },
    );

    it.each(CASES)(
      '$event does not emit switch:face when the $mode face is already shown',
      ({ value, select }) => {
        setValueIfShownMock.mockReturnValue(true);
        const switchFace = jest.fn();
        emitter.on('switch:face', switchFace);

        select(value);

        expect(switchFace).not.toHaveBeenCalled();
      },
    );

    it.each(CASES)(
      '$event with an empty value takes the face-switch path without asking the clock',
      ({ select, setter }) => {
        setValueIfShownMock.mockReturnValue(true);
        const animation = jest.fn();
        emitter.on('animation:clock', animation);

        select('');

        expect(setValueIfShownMock).not.toHaveBeenCalled();
        expect(animation).toHaveBeenCalledTimes(1);
        expect(setter()).toHaveBeenCalledWith(null);
      },
    );

    it('takes the face-switch path when there is no clock system', () => {
      const nullEmitter = new EventEmitter<TimepickerEventMap>();
      const animation = jest.fn();
      nullEmitter.on('animation:clock', animation);
      new ClockEventHandler(
        nullEmitter,
        () => null,
        setHoursToClockMock,
        setMinutesToClockMock,
        updateAmPmMock,
        convertDisabledTimeMock,
      ).setup();

      nullEmitter.emit('select:hour', { hour: '09' });

      expect(animation).toHaveBeenCalledTimes(1);
      expect(setHoursToClockMock).toHaveBeenCalledWith('09');
    });
  });

  describe('range:switch event', () => {
    it('should not update when clockSystem is null', () => {
      const nullEmitter = new EventEmitter<TimepickerEventMap>();
      const nullHandler = new ClockEventHandler(
        nullEmitter,
        () => null,
        setHoursToClockMock,
        setMinutesToClockMock,
        updateAmPmMock,
        convertDisabledTimeMock,
      );
      nullHandler.setup();

      expect(() =>
        nullEmitter.emit('range:switch', {
          active: 'from',
          disabledTime: { hours: ['01'], minutes: ['30'] },
        }),
      ).not.toThrow();
    });

    it('should update disabled time with range data', () => {
      emitter.emit('range:switch', {
        active: 'to',
        disabledTime: { hours: ['13', '14'], minutes: ['00', '30'] },
      });

      expect(mockClockSystem.updateDisabledTime).toHaveBeenCalled();
    });

    it("keeps the user's lists and passes the range limit separately", () => {
      const baseDisabled: DisabledTimeConfig = {
        hours: ['01', '02'],
        minutes: ['15'],
      };
      convertDisabledTimeMock.mockReturnValue(baseDisabled);

      emitter.emit('range:switch', {
        active: 'to',
        disabledTime: { hours: ['03'], minutes: ['45'], fromType: 'AM', fromHour: 10 },
      });

      expect(mockClockSystem.updateDisabledTime).toHaveBeenCalledWith({
        hours: ['01', '02'],
        minutes: ['15'],
        rangeFromType: 'AM',
        rangeFromHour: 10,
        rangeFromMinute: 46,
      });
    });

    it('sets the range "from" minute one past the last blocked minute', () => {
      emitter.emit('range:switch', {
        active: 'to',
        disabledTime: { hours: [], minutes: ['00', '01', '02', '03', '04'], fromHour: 14 },
      });

      expect(mockClockSystem.updateDisabledTime).toHaveBeenCalledWith(
        expect.objectContaining({ rangeFromHour: 14, rangeFromMinute: 5 }),
      );
    });

    it('keeps interval rules from the user config next to the range limit', () => {
      const baseDisabled: DisabledTimeConfig = {
        isInterval: true,
        intervals: ['11:00 - 11:59'],
        clockType: '24h',
      };
      convertDisabledTimeMock.mockReturnValue(baseDisabled);

      emitter.emit('range:switch', {
        active: 'to',
        disabledTime: { hours: [], minutes: ['00', '01'], fromHour: 10 },
      });

      expect(mockClockSystem.updateDisabledTime).toHaveBeenCalledWith({
        isInterval: true,
        intervals: ['11:00 - 11:59'],
        clockType: '24h',
        rangeFromType: undefined,
        rangeFromHour: 10,
        rangeFromMinute: 2,
      });
    });

    it('passes the user config unchanged when range:switch carries no range data', () => {
      const baseDisabled: DisabledTimeConfig = { hours: ['01'] };
      convertDisabledTimeMock.mockReturnValue(baseDisabled);

      emitter.emit('range:switch', { active: 'from', disabledTime: null });

      expect(mockClockSystem.updateDisabledTime).toHaveBeenCalledWith(baseDisabled);
    });

    it('should handle null disabledTime in range:switch', () => {
      emitter.emit('range:switch', {
        active: 'from',
        disabledTime: null,
      });

      expect(mockClockSystem.updateDisabledTime).toHaveBeenCalledWith(null);
    });

    it('should handle undefined disabledTime in range:switch', () => {
      emitter.emit('range:switch', {
        active: 'from',
        disabledTime: undefined,
      });

      expect(mockClockSystem.updateDisabledTime).toHaveBeenCalledWith(null);
    });

    it('leaves the range "from" minute unset when no minutes are blocked', () => {
      emitter.emit('range:switch', {
        active: 'to',
        disabledTime: { hours: [], minutes: [] },
      });

      expect(mockClockSystem.updateDisabledTime).toHaveBeenCalledWith({
        rangeFromType: undefined,
        rangeFromHour: undefined,
        rangeFromMinute: undefined,
      });
    });
  });
});

