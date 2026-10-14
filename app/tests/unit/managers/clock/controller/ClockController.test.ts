import { ClockController } from '../../../../../src/managers/clock/controller/ClockController';
import type { ClockMode, ClockState } from '../../../../../src/managers/clock/types';

const createMockRenderer = (): {
  setHandAngle: jest.Mock;
  setActiveValue: jest.Mock;
  setCircle24hMode: jest.Mock;
  animateToAngle: jest.Mock;
  followHand: jest.Mock;
  destroy: jest.Mock;
} => ({
  setHandAngle: jest.fn(),
  setActiveValue: jest.fn(),
  setCircle24hMode: jest.fn(),
  animateToAngle: jest.fn(),
  followHand: jest.fn(),
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

    it('should accept disabledTime config', () => {
      const renderer = createMockRenderer();
      const state = createInitialState();
      const disabledTime = { hours: ['03', '04'], minutes: ['15', '45'] };

      const controller = new ClockController(renderer as never, state, '12h', disabledTime, 1, 1, true);

      expect(controller.getState()).toEqual(state);
    });

    it('should accept callbacks parameter', () => {
      const renderer = createMockRenderer();
      const state = createInitialState();
      const onHourChange = jest.fn();
      const onMinuteChange = jest.fn();

      const controller = new ClockController(renderer as never, state, '12h', null, 1, 1, true, {
        onHourChange,
        onMinuteChange,
      });

      expect(controller.getState()).toEqual(state);
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
    it('should move the hand to the hour and leave the highlight to followHand', () => {
      const renderer = createMockRenderer();
      const state = createInitialState();
      state.mode = 'minutes';

      const controller = new ClockController(renderer as never, state, '12h', null, 1, 1, true);

      controller.switchMode('hours');

      expect(renderer.setHandAngle).toHaveBeenCalled();
      expect(renderer.setActiveValue).not.toHaveBeenCalled();

      controller.followHand('hours');

      expect(renderer.followHand).toHaveBeenCalledWith(expect.any(Function), '12');
    });

    it('should move the hand to the minute and leave the highlight to followHand', () => {
      const renderer = createMockRenderer();
      const state = createInitialState();

      const controller = new ClockController(renderer as never, state, '12h', null, 1, 1, true);

      controller.switchMode('minutes');

      expect(renderer.setHandAngle).toHaveBeenCalled();
      expect(renderer.setActiveValue).not.toHaveBeenCalled();

      controller.followHand('minutes');

      expect(renderer.followHand).toHaveBeenCalledWith(expect.any(Function), '00');
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

  describe('followHand', () => {
    type MockRenderer = ReturnType<typeof createMockRenderer>;
    type ValueAt = (angle: number) => string;

    const createState = (overrides: Partial<ClockState>): ClockState => ({
      hour: '12',
      minute: '00',
      second: '00',
      amPm: 'AM',
      hourAngle: 0,
      minuteAngle: 0,
      secondAngle: 0,
      mode: 'hours',
      ...overrides,
    });

    const followed = (renderer: MockRenderer): { valueAt: ValueAt; finalValue: string } => {
      expect(renderer.followHand).toHaveBeenCalledTimes(1);
      const [valueAt, finalValue] = renderer.followHand.mock.calls[0] as [ValueAt, string];
      return { valueAt, finalValue };
    };

    it('hands the renderer the final 12h hour and maps hand angles to the nearest hour tip', () => {
      const renderer = createMockRenderer();
      const state = createState({ hour: '03', hourAngle: 90 });
      const controller = new ClockController(renderer as never, state, '12h', null, 1, 1, true);

      controller.followHand('hours');

      const { valueAt, finalValue } = followed(renderer);
      expect(finalValue).toBe('03');
      expect([88, 14, 346, -90].map(valueAt)).toEqual(['03', '12', '12', '09']);
    });

    it('maps hand angles to the outer 24h ring when the final hour is 12 or less', () => {
      const renderer = createMockRenderer();
      const state = createState({ hour: '09', hourAngle: 270, amPm: '' });
      const controller = new ClockController(renderer as never, state, '24h', null, 1, 1, true);

      controller.followHand('hours');

      const { valueAt, finalValue } = followed(renderer);
      expect(finalValue).toBe('09');
      expect([0, 90, 270].map(valueAt)).toEqual(['12', '03', '09']);
    });

    it('maps hand angles to the inner 24h ring when the final hour is past 12', () => {
      const renderer = createMockRenderer();
      const state = createState({ hour: '15', hourAngle: 90, amPm: '' });
      const controller = new ClockController(renderer as never, state, '24h', null, 1, 1, true);

      controller.followHand('hours');

      const { valueAt, finalValue } = followed(renderer);
      expect(finalValue).toBe('15');
      expect([90, 0, 180].map(valueAt)).toEqual(['15', '00', '18']);
    });

    it('hands the renderer the final minute and maps hand angles to the nearest 5-minute tip', () => {
      const renderer = createMockRenderer();
      const state = createState({ minute: '30', minuteAngle: 180, mode: 'minutes' });
      const controller = new ClockController(renderer as never, state, '12h', null, 1, 1, true);

      controller.followHand('minutes');

      const { valueAt, finalValue } = followed(renderer);
      expect(finalValue).toBe('30');
      expect([183, 14, 16].map(valueAt)).toEqual(['30', '00', '05']);
    });

    it('hands the renderer the final second and maps a negative hand angle onto the face', () => {
      const renderer = createMockRenderer();
      const state = createState({ second: '45', secondAngle: 270, mode: 'seconds', amPm: '' });
      const controller = new ClockController(renderer as never, state, '24h', null, 1, 1, true, {}, 1, true);

      controller.followHand('seconds');

      const { valueAt, finalValue } = followed(renderer);
      expect(finalValue).toBe('45');
      expect([-90, 183, 16].map(valueAt)).toEqual(['45', '30', '05']);
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

    describe('24h inner ring follows only the shown face', () => {
      type MockRenderer = ReturnType<typeof createMockRenderer>;

      const create24h = (mode: ClockMode): { controller: ClockController; renderer: MockRenderer } => {
        const renderer = createMockRenderer();
        const state: ClockState = {
          hour: '09',
          minute: '00',
          second: '00',
          amPm: '',
          hourAngle: 270,
          minuteAngle: 0,
          secondAngle: 0,
          mode,
        };
        const controller = new ClockController(renderer as never, state, '24h', null, 1, 1, true);
        return { controller, renderer };
      };

      it('should leave the ring alone when the minute changes while the hour face is shown', () => {
        const { controller, renderer } = create24h('hours');

        controller.setValue('minutes', '30');

        expect(renderer.setCircle24hMode).not.toHaveBeenCalled();
      });

      it('should leave the ring alone when the hour changes while the minute face is shown', () => {
        const { controller, renderer } = create24h('minutes');

        controller.setValue('hours', '14');

        expect(renderer.setCircle24hMode).not.toHaveBeenCalled();
      });

      it('should move the ring inward once when the shown hour goes past 12', () => {
        const { controller, renderer } = create24h('hours');

        controller.setValue('hours', '14');

        expect(renderer.setCircle24hMode).toHaveBeenCalledTimes(1);
        expect(renderer.setCircle24hMode).toHaveBeenCalledWith(true);
      });
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

    it('should skip processing when same coordinates are passed twice', () => {
      const renderer = createMockRenderer();
      const state = createInitialState();
      const onHourChange = jest.fn();

      const controller = new ClockController(renderer as never, state, '12h', null, 1, 1, false, {
        onHourChange,
      });

      controller.handlePointerMove({ x: 150, y: 100 }, { x: 100, y: 100 }, 100);
      expect(onHourChange).toHaveBeenCalledTimes(1);

      renderer.setHandAngle.mockClear();
      onHourChange.mockClear();

      controller.handlePointerMove({ x: 150, y: 100 }, { x: 100, y: 100 }, 100);
      expect(onHourChange).not.toHaveBeenCalled();
      expect(renderer.setHandAngle).not.toHaveBeenCalled();
    });

    it('should process new coordinates after same coordinates', () => {
      const renderer = createMockRenderer();
      const state = createInitialState();
      const onHourChange = jest.fn();

      const controller = new ClockController(renderer as never, state, '12h', null, 1, 1, false, {
        onHourChange,
      });

      controller.handlePointerMove({ x: 150, y: 100 }, { x: 100, y: 100 }, 100);
      controller.handlePointerMove({ x: 150, y: 100 }, { x: 100, y: 100 }, 100);
      controller.handlePointerMove({ x: 100, y: 20 }, { x: 100, y: 100 }, 100);

      expect(renderer.setHandAngle).toHaveBeenCalledTimes(2);
    });

    it('should process coordinates after handlePointerUp resets cache', () => {
      const renderer = createMockRenderer();
      const state = createInitialState();

      const controller = new ClockController(renderer as never, state, '12h', null, 1, 1, false, {});

      controller.handlePointerMove({ x: 150, y: 100 }, { x: 100, y: 100 }, 100);
      const firstCallCount = renderer.setHandAngle.mock.calls.length;

      controller.handlePointerUp();

      controller.handlePointerMove({ x: 150, y: 100 }, { x: 100, y: 100 }, 100);

      expect(renderer.setHandAngle.mock.calls.length).toBeGreaterThan(firstCallCount);
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
