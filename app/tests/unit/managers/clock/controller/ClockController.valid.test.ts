import { ClockController } from '../../../../../src/managers/clock/controller/ClockController';

const renderer = (): Record<string, jest.Mock> => ({
  setHandAngle: jest.fn(),
  setActiveValue: jest.fn(),
  setCircle24hMode: jest.fn(),
  animateToAngle: jest.fn(),
  destroy: jest.fn(),
});

describe('ClockController.handlePointerMove result (bug #1)', () => {
  it('returns false for a disabled hour and true for an allowed one', () => {
    const controller = new ClockController(
      renderer() as never,
      { hour: '12', minute: '00', amPm: 'AM', hourAngle: 0, minuteAngle: 0, mode: 'hours' },
      '12h',
      { hours: ['3'] },
      1,
      1,
      false,
    );
    expect(controller.handlePointerMove({ x: 200, y: 100 }, { x: 100, y: 100 }, 100)).toBe(false);
    expect(controller.handlePointerMove({ x: 100, y: 200 }, { x: 100, y: 100 }, 100)).toBe(true);
  });
});
