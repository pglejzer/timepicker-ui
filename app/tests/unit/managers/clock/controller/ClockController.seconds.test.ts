import { ClockController, type ClockControllerCallbacks } from '@/managers/clock/controller/ClockController';
import type { ClockMode, ClockState, DisabledTimeConfig, Point } from '@/managers/clock/types';

const CENTER: Point = { x: 100, y: 100 };
const RADIUS = 100;

const at = (degrees: number): Point => ({
  x: CENTER.x + RADIUS * Math.sin((degrees * Math.PI) / 180),
  y: CENTER.y - RADIUS * Math.cos((degrees * Math.PI) / 180),
});

const createRenderer = (): Record<string, jest.Mock> => ({
  setHandAngle: jest.fn(),
  setActiveValue: jest.fn(),
  setCircle24hMode: jest.fn(),
  animateToAngle: jest.fn(),
  followHand: jest.fn(),
  destroy: jest.fn(),
});

const STATE: ClockState = {
  hour: '10',
  minute: '20',
  second: '30',
  amPm: '',
  hourAngle: 300,
  minuteAngle: 120,
  secondAngle: 180,
  mode: 'hours',
};

interface SecondsSetup {
  readonly mode?: ClockMode;
  readonly minute?: string;
  readonly disabledTime?: DisabledTimeConfig | null;
  readonly incrementSeconds?: number;
  readonly callbacks?: ClockControllerCallbacks;
}

const createController = (
  renderer: Record<string, jest.Mock>,
  {
    mode = 'hours',
    minute = '20',
    disabledTime = null,
    incrementSeconds = 1,
    callbacks = {},
  }: SecondsSetup = {},
): ClockController =>
  new ClockController(
    renderer as never,
    { ...STATE, mode, minute },
    '24h',
    disabledTime,
    1,
    1,
    true,
    callbacks,
    incrementSeconds,
    true,
  );

describe('ClockController with seconds', () => {
  it('switchMode("seconds") shows the second hand on the outer ring and followHand settles on the second', () => {
    const renderer = createRenderer();
    const controller = createController(renderer);

    controller.switchMode('seconds');
    controller.followHand('seconds');

    expect(renderer.setHandAngle).toHaveBeenLastCalledWith(180);
    expect(renderer.setCircle24hMode).toHaveBeenLastCalledWith(false);
    expect(renderer.followHand).toHaveBeenLastCalledWith(expect.any(Function), '30');
  });

  it('a pointer move on the seconds face sets the second, snapped to incrementSeconds', () => {
    const renderer = createRenderer();
    const onMinuteChange = jest.fn();
    const onSecondChange = jest.fn();
    const controller = createController(renderer, {
      mode: 'seconds',
      incrementSeconds: 15,
      callbacks: { onMinuteChange, onSecondChange },
    });

    expect(controller.handlePointerMove(at(100), CENTER, RADIUS)).toBe(true);
    expect(onSecondChange).toHaveBeenCalledWith('15');
    expect(onMinuteChange).not.toHaveBeenCalled();
    expect(controller.getSecond()).toBe('15');
    expect(controller.getMinute()).toBe('20');
    expect(controller.getState().secondAngle).toBe(90);
    expect(renderer.setHandAngle).toHaveBeenLastCalledWith(90);
    expect(renderer.setActiveValue).toHaveBeenLastCalledWith('15');
  });

  it('checks a second against disabled time in the current hour and minute', () => {
    const disabledTime: DisabledTimeConfig = {
      isInterval: true,
      intervals: ['10:20:10 - 10:20:20'],
      clockType: '24h',
    };
    const onSecondChange = jest.fn();
    const blocked = createController(createRenderer(), {
      mode: 'seconds',
      disabledTime,
      callbacks: { onSecondChange },
    });
    const nextMinute = createController(createRenderer(), { mode: 'seconds', minute: '21', disabledTime });

    expect(blocked.handlePointerMove(at(90), CENTER, RADIUS)).toBe(false);
    expect(onSecondChange).not.toHaveBeenCalled();
    expect(blocked.getSecond()).toBe('30');
    expect(nextMinute.handlePointerMove(at(90), CENTER, RADIUS)).toBe(true);
    expect(nextMinute.getSecond()).toBe('15');
  });

  it('setValue("seconds") stores the second and shows it when the seconds face opens', () => {
    const renderer = createRenderer();
    const controller = createController(renderer);

    controller.setValue('seconds', '45');

    expect(controller.getSecond()).toBe('45');
    expect(controller.getMinute()).toBe('20');
    expect(controller.getState().secondAngle).toBe(270);
    expect(renderer.setHandAngle).not.toHaveBeenCalled();

    controller.switchMode('seconds');
    controller.followHand('seconds');

    expect(renderer.setHandAngle).toHaveBeenLastCalledWith(270);
    expect(renderer.followHand).toHaveBeenLastCalledWith(expect.any(Function), '45');
  });

  it('setValue("seconds") moves the hand at once while the seconds face is shown', () => {
    const renderer = createRenderer();
    const controller = createController(renderer, { mode: 'seconds' });

    controller.setValue('seconds', '45');

    expect(renderer.setHandAngle).toHaveBeenLastCalledWith(270);
    expect(renderer.setActiveValue).toHaveBeenLastCalledWith('45');
    expect(controller.getMinute()).toBe('20');
  });

  it('keeps the minute face unchanged when seconds are not shown', () => {
    const renderer = createRenderer();
    const onMinuteChange = jest.fn();
    const controller = new ClockController(
      renderer as never,
      { ...STATE, mode: 'minutes' },
      '24h',
      null,
      1,
      1,
      true,
      { onMinuteChange },
    );

    expect(controller.handlePointerMove(at(90), CENTER, RADIUS)).toBe(true);
    expect(onMinuteChange).toHaveBeenCalledWith('15');
    expect(controller.getMinute()).toBe('15');
    expect(renderer.setHandAngle).toHaveBeenLastCalledWith(90);

    controller.switchMode('hours');
    controller.followHand('hours');

    expect(renderer.setHandAngle).toHaveBeenLastCalledWith(300);
    expect(renderer.followHand).toHaveBeenLastCalledWith(expect.any(Function), '10');
  });
});
