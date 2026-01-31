import { ClockController } from '../../../../../src/managers/clock/controller/ClockController';
import type { ClockState } from '../../../../../src/managers/clock/types';

const createMockRenderer = (): {
  setHandAngle: jest.Mock;
  setActiveValue: jest.Mock;
  setCircleSize: jest.Mock;
  setCircle24hMode: jest.Mock;
  animateToAngle: jest.Mock;
  destroy: jest.Mock;
} => ({
  setHandAngle: jest.fn(),
  setActiveValue: jest.fn(),
  setCircleSize: jest.fn(),
  setCircle24hMode: jest.fn(),
  animateToAngle: jest.fn(),
  destroy: jest.fn(),
});

describe('ClockController', () => {
  const createInitialState = (): ClockState => ({
    hour: '12',
    minute: '00',
    amPm: 'AM',
    hourAngle: 0,
    minuteAngle: 0,
    mode: 'hours',
  });

  describe('constructor', () => {
    it('should create controller with initial state', () => {
      const renderer = createMockRenderer();
      const state = createInitialState();

      const controller = new ClockController(renderer as never, state, '12h', null, 1, 1, true);

      expect(controller.getState()).toEqual(state);
    });

    it('should accept 24h clock type', () => {
      const renderer = createMockRenderer();
      const state: ClockState = {
        hour: '14',
        minute: '30',
        amPm: '',
        hourAngle: 60,
        minuteAngle: 180,
        mode: 'hours',
      };

      const controller = new ClockController(renderer as never, state, '24h', null, 1, 1, true);

      expect(controller.getHour()).toBe('14');
      expect(controller.getMinute()).toBe('30');
    });
  });

  describe('getState', () => {
    it('should return copy of state', () => {
      const renderer = createMockRenderer();
      const state = createInitialState();

      const controller = new ClockController(renderer as never, state, '12h', null, 1, 1, true);

      const returnedState = controller.getState();
      expect(returnedState).toEqual(state);
      expect(returnedState).not.toBe(state);
    });
  });

  describe('getHour', () => {
    it('should return current hour', () => {
      const renderer = createMockRenderer();
      const state = createInitialState();
      state.hour = '05';

      const controller = new ClockController(renderer as never, state, '12h', null, 1, 1, true);

      expect(controller.getHour()).toBe('05');
    });
  });

  describe('getMinute', () => {
    it('should return current minute', () => {
      const renderer = createMockRenderer();
      const state = createInitialState();
      state.minute = '45';

      const controller = new ClockController(renderer as never, state, '12h', null, 1, 1, true);

      expect(controller.getMinute()).toBe('45');
    });
  });

  describe('getAmPm', () => {
    it('should return current AM/PM', () => {
      const renderer = createMockRenderer();
      const state = createInitialState();
      state.amPm = 'PM';

      const controller = new ClockController(renderer as never, state, '12h', null, 1, 1, true);

      expect(controller.getAmPm()).toBe('PM');
    });
  });

  describe('setAmPm', () => {
    it('should set AM/PM value', () => {
      const renderer = createMockRenderer();
      const state = createInitialState();

      const controller = new ClockController(renderer as never, state, '12h', null, 1, 1, true);

      controller.setAmPm('PM');
      expect(controller.getAmPm()).toBe('PM');
    });

    it('should accept empty string for 24h mode', () => {
      const renderer = createMockRenderer();
      const state = createInitialState();
      state.amPm = '';

      const controller = new ClockController(renderer as never, state, '24h', null, 1, 1, true);

      controller.setAmPm('');
      expect(controller.getAmPm()).toBe('');
    });
  });

  describe('switchMode', () => {
    it('should switch to hours mode', () => {
      const renderer = createMockRenderer();
      const state = createInitialState();
      state.mode = 'minutes';

      const controller = new ClockController(renderer as never, state, '12h', null, 1, 1, true);

      controller.switchMode('hours');

      expect(renderer.setHandAngle).toHaveBeenCalled();
      expect(renderer.setActiveValue).toHaveBeenCalledWith('12');
    });

    it('should switch to minutes mode', () => {
      const renderer = createMockRenderer();
      const state = createInitialState();

      const controller = new ClockController(renderer as never, state, '12h', null, 1, 1, true);

      controller.switchMode('minutes');

      expect(renderer.setHandAngle).toHaveBeenCalled();
      expect(renderer.setActiveValue).toHaveBeenCalledWith('00');
    });

    it('should handle 24h mode inner circle', () => {
      const renderer = createMockRenderer();
      const state: ClockState = {
        hour: '00',
        minute: '00',
        amPm: '',
        hourAngle: 0,
        minuteAngle: 0,
        mode: 'minutes',
      };

      const controller = new ClockController(renderer as never, state, '24h', null, 1, 1, true);

      controller.switchMode('hours');

      expect(renderer.setCircle24hMode).toHaveBeenCalledWith(true);
    });
  });

  describe('setValue', () => {
    it('should set hour value', () => {
      const renderer = createMockRenderer();
      const state = createInitialState();

      const controller = new ClockController(renderer as never, state, '12h', null, 1, 1, true);

      controller.setValue('hours', '05');

      expect(controller.getHour()).toBe('05');
    });

    it('should set minute value', () => {
      const renderer = createMockRenderer();
      const state = createInitialState();

      const controller = new ClockController(renderer as never, state, '12h', null, 1, 1, true);

      controller.setValue('minutes', '30');

      expect(controller.getMinute()).toBe('30');
    });

    it('should update renderer when in same mode', () => {
      const renderer = createMockRenderer();
      const state = createInitialState();

      const controller = new ClockController(renderer as never, state, '12h', null, 1, 1, true);

      controller.setValue('hours', '03');

      expect(renderer.setHandAngle).toHaveBeenCalled();
      expect(renderer.setActiveValue).toHaveBeenCalledWith('03');
    });
  });

  describe('handlePointerMove', () => {
    it('should process pointer movement for hours', () => {
      const renderer = createMockRenderer();
      const state = createInitialState();
      const onHourChange = jest.fn();

      const controller = new ClockController(renderer as never, state, '12h', null, 1, 1, false, {
        onHourChange,
      });

      controller.handlePointerMove({ x: 150, y: 100 }, { x: 100, y: 100 }, 100);

      expect(onHourChange).toHaveBeenCalled();
      expect(renderer.setHandAngle).toHaveBeenCalled();
    });

    it('should process pointer movement for minutes', () => {
      const renderer = createMockRenderer();
      const state = createInitialState();
      state.mode = 'minutes';
      const onMinuteChange = jest.fn();

      const controller = new ClockController(renderer as never, state, '12h', null, 1, 1, true, {
        onMinuteChange,
      });

      controller.handlePointerMove({ x: 150, y: 100 }, { x: 100, y: 100 }, 100);

      expect(onMinuteChange).toHaveBeenCalled();
      expect(renderer.setHandAngle).toHaveBeenCalled();
    });
  });

  describe('handlePointerUp', () => {
    it('should not throw on pointer up', () => {
      const renderer = createMockRenderer();
      const state = createInitialState();

      const controller = new ClockController(renderer as never, state, '12h', null, 1, 1, true);

      expect(() => controller.handlePointerUp()).not.toThrow();
    });
  });

  describe('snapToNearestHour', () => {
    it('should animate to nearest hour in hours mode', () => {
      const renderer = createMockRenderer();
      const state = createInitialState();
      state.hour = '03';
      state.hourAngle = 85;

      const controller = new ClockController(renderer as never, state, '12h', null, 1, 1, true);

      controller.snapToNearestHour();

      expect(renderer.animateToAngle).toHaveBeenCalled();
    });

    it('should not animate in minutes mode', () => {
      const renderer = createMockRenderer();
      const state = createInitialState();
      state.mode = 'minutes';

      const controller = new ClockController(renderer as never, state, '12h', null, 1, 1, true);

      controller.snapToNearestHour();

      expect(renderer.animateToAngle).not.toHaveBeenCalled();
    });
  });

  describe('updateDisabledTime', () => {
    it('should update disabled time config', () => {
      const renderer = createMockRenderer();
      const state = createInitialState();

      const controller = new ClockController(renderer as never, state, '12h', null, 1, 1, true);

      expect(() => {
        controller.updateDisabledTime({ hours: ['03', '04'] });
      }).not.toThrow();
    });
  });

  describe('destroy', () => {
    it('should call renderer destroy', () => {
      const renderer = createMockRenderer();
      const state = createInitialState();

      const controller = new ClockController(renderer as never, state, '12h', null, 1, 1, true);

      controller.destroy();

      expect(renderer.destroy).toHaveBeenCalled();
    });
  });
});

