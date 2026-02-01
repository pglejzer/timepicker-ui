import { ClockTimeHandler } from '../../../../../src/managers/clock/handlers/ClockTimeHandler';
import { ClockStyleHandler } from '../../../../../src/managers/clock/handlers/ClockStyleHandler';
import type { ClockSystem } from '../../../../../src/managers/clock/ClockSystem';

describe('ClockTimeHandler', () => {
  let mockClockSystem: Partial<ClockSystem>;
  let mockStyleHandler: Partial<ClockStyleHandler>;
  let getAmPmValueMock: jest.Mock;
  let handler: ClockTimeHandler;

  beforeEach(() => {
    mockClockSystem = {
      setMinute: jest.fn(),
      setHour: jest.fn(),
      setAmPm: jest.fn(),
      switchToMinutes: jest.fn(),
      switchToHours: jest.fn(),
    };

    mockStyleHandler = {
      removeBgColorToCirleWithMinutesTips: jest.fn(),
    };

    getAmPmValueMock = jest.fn().mockReturnValue('AM');

    handler = new ClockTimeHandler(
      () => mockClockSystem as ClockSystem,
      mockStyleHandler as ClockStyleHandler,
      getAmPmValueMock,
      '12h',
    );
  });

  describe('setMinutesToClock', () => {
    it('should call removeBgColorToCirleWithMinutesTips', () => {
      handler.setMinutesToClock('30');

      expect(mockStyleHandler.removeBgColorToCirleWithMinutesTips).toHaveBeenCalled();
    });

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
      const nullHandler = new ClockTimeHandler(
        () => null,
        mockStyleHandler as ClockStyleHandler,
        getAmPmValueMock,
        '12h',
      );

      expect(() => nullHandler.setMinutesToClock('30')).not.toThrow();
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
      const nullHandler = new ClockTimeHandler(
        () => null,
        mockStyleHandler as ClockStyleHandler,
        getAmPmValueMock,
        '12h',
      );

      expect(() => nullHandler.setHoursToClock('09')).not.toThrow();
    });
  });

  describe('setTransformToCircleWithSwitchesHour', () => {
    it('should call setHour with value', () => {
      handler.setTransformToCircleWithSwitchesHour('11');

      expect(mockClockSystem.setHour).toHaveBeenCalledWith('11');
    });

    it('should not call setHour when value is null', () => {
      handler.setTransformToCircleWithSwitchesHour(null);

      expect(mockClockSystem.setHour).not.toHaveBeenCalled();
    });

    it('should not throw when clockSystem is null', () => {
      const nullHandler = new ClockTimeHandler(
        () => null,
        mockStyleHandler as ClockStyleHandler,
        getAmPmValueMock,
        '12h',
      );

      expect(() => nullHandler.setTransformToCircleWithSwitchesHour('11')).not.toThrow();
    });
  });

  describe('setTransformToCircleWithSwitchesMinutes', () => {
    it('should call setMinute with value', () => {
      handler.setTransformToCircleWithSwitchesMinutes('25');

      expect(mockClockSystem.setMinute).toHaveBeenCalledWith('25');
    });

    it('should not call setMinute when value is null', () => {
      handler.setTransformToCircleWithSwitchesMinutes(null);

      expect(mockClockSystem.setMinute).not.toHaveBeenCalled();
    });

    it('should not throw when clockSystem is null', () => {
      const nullHandler = new ClockTimeHandler(
        () => null,
        mockStyleHandler as ClockStyleHandler,
        getAmPmValueMock,
        '12h',
      );

      expect(() => nullHandler.setTransformToCircleWithSwitchesMinutes('25')).not.toThrow();
    });
  });

  describe('updateAmPm', () => {
    it('should call setAmPm with AM value', () => {
      getAmPmValueMock.mockReturnValue('AM');

      handler.updateAmPm();

      expect(mockClockSystem.setAmPm).toHaveBeenCalledWith('AM');
    });

    it('should call setAmPm with PM value', () => {
      getAmPmValueMock.mockReturnValue('PM');

      handler.updateAmPm();

      expect(mockClockSystem.setAmPm).toHaveBeenCalledWith('PM');
    });

    it('should not call setAmPm when value is empty string', () => {
      getAmPmValueMock.mockReturnValue('');

      handler.updateAmPm();

      expect(mockClockSystem.setAmPm).not.toHaveBeenCalled();
    });

    it('should not call setAmPm when clockType is 24h', () => {
      const handler24h = new ClockTimeHandler(
        () => mockClockSystem as ClockSystem,
        mockStyleHandler as ClockStyleHandler,
        getAmPmValueMock,
        '24h',
      );

      handler24h.updateAmPm();

      expect(mockClockSystem.setAmPm).not.toHaveBeenCalled();
    });

    it('should not throw when clockSystem is null', () => {
      const nullHandler = new ClockTimeHandler(
        () => null,
        mockStyleHandler as ClockStyleHandler,
        getAmPmValueMock,
        '12h',
      );

      expect(() => nullHandler.updateAmPm()).not.toThrow();
    });
  });
});

