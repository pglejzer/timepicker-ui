import { ClockTimeHandler } from '../../../../../src/managers/clock/handlers/ClockTimeHandler';
import type { ClockSystem } from '../../../../../src/managers/clock/ClockSystem';

type ClockType = '12h' | '24h';

describe('ClockTimeHandler', () => {
  let mockClockSystem: Partial<ClockSystem>;
  let getAmPmValueMock: jest.Mock;
  let handler: ClockTimeHandler;

  const createHandler = (getClockType: () => ClockType): ClockTimeHandler =>
    new ClockTimeHandler(() => mockClockSystem as ClockSystem, getAmPmValueMock, getClockType);

  const createDetachedHandler = (): ClockTimeHandler =>
    new ClockTimeHandler(() => null, getAmPmValueMock, () => '12h');

  beforeEach(() => {
    mockClockSystem = {
      setMinute: jest.fn(),
      setSecond: jest.fn(),
      setHour: jest.fn(),
      setAmPm: jest.fn(),
      switchToMinutes: jest.fn(),
      switchToSeconds: jest.fn(),
      switchToHours: jest.fn(),
    };

    getAmPmValueMock = jest.fn().mockReturnValue('AM');

    handler = createHandler(() => '12h');
  });

  describe('setMinutesToClock', () => {
    it('should call setMinute with value', () => {
      handler.setMinutesToClock('45');

      expect(mockClockSystem.setMinute).toHaveBeenCalledWith('45');
    });

    it('should call switchToMinutes', () => {
      handler.setMinutesToClock('30');

      expect(mockClockSystem.switchToMinutes).toHaveBeenCalled();
    });

    it('should not call setMinute when value is null', () => {
      handler.setMinutesToClock(null);

      expect(mockClockSystem.setMinute).not.toHaveBeenCalled();
      expect(mockClockSystem.switchToMinutes).toHaveBeenCalled();
    });

    it('should not throw when clockSystem is null', () => {
      expect(() => createDetachedHandler().setMinutesToClock('30')).not.toThrow();
    });
  });

  describe('setHoursToClock', () => {
    it('should call setHour with value', () => {
      handler.setHoursToClock('09');

      expect(mockClockSystem.setHour).toHaveBeenCalledWith('09');
    });

    it('should call switchToHours', () => {
      handler.setHoursToClock('09');

      expect(mockClockSystem.switchToHours).toHaveBeenCalled();
    });

    it('should not call setHour when value is null', () => {
      handler.setHoursToClock(null);

      expect(mockClockSystem.setHour).not.toHaveBeenCalled();
      expect(mockClockSystem.switchToHours).toHaveBeenCalled();
    });

    it('should not throw when clockSystem is null', () => {
      expect(() => createDetachedHandler().setHoursToClock('09')).not.toThrow();
    });
  });

  describe('setSecondsToClock', () => {
    it('should set the second and then show the seconds face', () => {
      handler.setSecondsToClock('15');

      expect(mockClockSystem.setSecond).toHaveBeenCalledWith('15');
      expect(mockClockSystem.switchToSeconds).toHaveBeenCalledTimes(1);
      expect((mockClockSystem.setSecond as jest.Mock).mock.invocationCallOrder[0]).toBeLessThan(
        (mockClockSystem.switchToSeconds as jest.Mock).mock.invocationCallOrder[0],
      );
      expect(mockClockSystem.switchToMinutes).not.toHaveBeenCalled();
    });

    it('should only show the seconds face when value is null', () => {
      handler.setSecondsToClock(null);

      expect(mockClockSystem.setSecond).not.toHaveBeenCalled();
      expect(mockClockSystem.switchToSeconds).toHaveBeenCalledTimes(1);
    });

    it('should not throw when clockSystem is null', () => {
      expect(() => createDetachedHandler().setSecondsToClock('15')).not.toThrow();
    });
  });

  describe('updateAmPm', () => {
    it.each(['AM', 'PM'])('should call setAmPm with %s', (period) => {
      getAmPmValueMock.mockReturnValue(period);

      handler.updateAmPm();

      expect(mockClockSystem.setAmPm).toHaveBeenCalledWith(period);
    });

    it('should not call setAmPm when value is empty string', () => {
      getAmPmValueMock.mockReturnValue('');

      handler.updateAmPm();

      expect(mockClockSystem.setAmPm).not.toHaveBeenCalled();
    });

    it('should not call setAmPm when the clock type is 24h', () => {
      createHandler(() => '24h').updateAmPm();

      expect(mockClockSystem.setAmPm).not.toHaveBeenCalled();
    });

    it('should read the clock type on every call and call setAmPm once it changes from 24h to 12h', () => {
      let clockType: ClockType = '24h';
      const switchingHandler = createHandler(() => clockType);
      getAmPmValueMock.mockReturnValue('PM');

      switchingHandler.updateAmPm();

      expect(mockClockSystem.setAmPm).not.toHaveBeenCalled();

      clockType = '12h';
      switchingHandler.updateAmPm();

      expect(mockClockSystem.setAmPm).toHaveBeenCalledTimes(1);
      expect(mockClockSystem.setAmPm).toHaveBeenCalledWith('PM');
    });

    it('should not throw when clockSystem is null', () => {
      expect(() => createDetachedHandler().updateAmPm()).not.toThrow();
    });
  });
});
