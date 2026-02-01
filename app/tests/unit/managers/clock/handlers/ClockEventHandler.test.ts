import { ClockEventHandler } from '../../../../../src/managers/clock/handlers/ClockEventHandler';
import { EventEmitter, type TimepickerEventMap } from '../../../../../src/utils/EventEmitter';
import type { ClockSystem } from '../../../../../src/managers/clock/ClockSystem';
import type { DisabledTimeConfig } from '../../../../../src/managers/clock/types';

describe('ClockEventHandler', () => {
  let emitter: EventEmitter<TimepickerEventMap>;
  let mockClockSystem: Partial<ClockSystem>;
  let setHoursToClockMock: jest.Mock;
  let setMinutesToClockMock: jest.Mock;
  let updateAmPmMock: jest.Mock;
  let convertDisabledTimeMock: jest.Mock;
  let handler: ClockEventHandler;

  beforeEach(() => {
    emitter = new EventEmitter<TimepickerEventMap>();
    mockClockSystem = {
      blockInteractions: jest.fn(),
      unblockInteractions: jest.fn(),
      updateDisabledTime: jest.fn(),
    };
    setHoursToClockMock = jest.fn();
    setMinutesToClockMock = jest.fn();
    updateAmPmMock = jest.fn();
    convertDisabledTimeMock = jest.fn().mockReturnValue(null);

    handler = new ClockEventHandler(
      emitter,
      () => mockClockSystem as ClockSystem,
      setHoursToClockMock,
      setMinutesToClockMock,
      updateAmPmMock,
      convertDisabledTimeMock,
    );
    handler.setup();
  });

  describe('setup', () => {
    it('should emit animation:clock and call setHoursToClock on select:hour', () => {
      const emitSpy = jest.spyOn(emitter, 'emit');

      emitter.emit('select:hour', { hour: '09' });

      expect(emitSpy).toHaveBeenCalledWith('animation:clock', {});
      expect(setHoursToClockMock).toHaveBeenCalledWith('09');
    });

    it('should handle select:hour with undefined hour', () => {
      emitter.emit('select:hour', { hour: '' });

      expect(setHoursToClockMock).toHaveBeenCalledWith(null);
    });

    it('should emit animation:clock and call setMinutesToClock on select:minute', () => {
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

    it('should merge base disabled time with range disabled time', () => {
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
        hours: ['01', '02', '03'],
        minutes: ['15', '45'],
        rangeFromType: 'AM',
        rangeFromHour: 10,
      });
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

    it('should handle empty hours and minutes arrays', () => {
      emitter.emit('range:switch', {
        active: 'to',
        disabledTime: { hours: [], minutes: [] },
      });

      expect(mockClockSystem.updateDisabledTime).toHaveBeenCalledWith({
        hours: undefined,
        minutes: undefined,
        rangeFromType: undefined,
        rangeFromHour: undefined,
      });
    });
  });
});

