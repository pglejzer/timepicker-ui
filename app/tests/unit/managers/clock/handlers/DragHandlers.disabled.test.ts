import { DragHandlers } from '../../../../../src/managers/clock/handlers/DragHandlers';

describe('rejected clock selection does not auto-switch (bug #1)', () => {
  let clockFace: HTMLDivElement;
  let hour: HTMLInputElement;
  let minutes: HTMLInputElement;

  beforeEach(() => {
    clockFace = document.createElement('div');
    Object.defineProperty(clockFace, 'offsetWidth', { value: 200, configurable: true });
    Object.defineProperty(clockFace, 'offsetHeight', { value: 200, configurable: true });
    hour = document.createElement('input');
    hour.classList.add('active');
    minutes = document.createElement('input');
    document.body.append(clockFace, hour, minutes);
  });
  afterEach(() => {
    document.body.innerHTML = '';
    jest.restoreAllMocks();
  });

  const pressAndRelease = (): void => {
    clockFace.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: 150, clientY: 100 }));
    document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
  };

  it('stays on hours when the pointer only hit disabled values', () => {
    const controller = {
      handlePointerMove: jest.fn(() => false),
      handlePointerUp: jest.fn(),
      snapToNearestHour: jest.fn(),
    };
    const openMinutesFace = jest.spyOn(minutes, 'click');
    new DragHandlers(controller as never, clockFace, {
      autoSwitchToMinutes: true,
      hourElement: hour,
      minutesElement: minutes,
    }).attach();
    pressAndRelease();
    expect(openMinutesFace).not.toHaveBeenCalled();
    expect(document.activeElement).not.toBe(minutes);
    expect(hour.classList.contains('active')).toBe(true);
  });

  it('still hands off to minutes after a valid selection', () => {
    const controller = {
      handlePointerMove: jest.fn(() => true),
      handlePointerUp: jest.fn(),
      snapToNearestHour: jest.fn(),
    };
    const openMinutesFace = jest.spyOn(minutes, 'click');
    const leaveHour = jest.spyOn(hour, 'blur');
    new DragHandlers(controller as never, clockFace, {
      autoSwitchToMinutes: true,
      hourElement: hour,
      minutesElement: minutes,
    }).attach();
    pressAndRelease();
    expect(openMinutesFace).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(minutes);
    expect(leaveHour).toHaveBeenCalledTimes(1);
  });

  it('does not commit a range minute when the drag was rejected', () => {
    hour.classList.remove('active');
    minutes.classList.add('active');
    const onMinuteCommit = jest.fn();
    const controller = {
      handlePointerMove: jest.fn(() => false),
      handlePointerUp: jest.fn(),
      snapToNearestHour: jest.fn(),
    };
    new DragHandlers(controller as never, clockFace, {
      hourElement: hour,
      minutesElement: minutes,
      onMinuteCommit,
    }).attach();
    pressAndRelease();
    expect(onMinuteCommit).not.toHaveBeenCalled();
  });
});
