import { DragHandlers, type DragHandlersConfig } from '@/managers/clock/handlers/DragHandlers';

describe('DragHandlers with a seconds field', () => {
  let clockFace: HTMLDivElement;
  let hour: HTMLInputElement;
  let minutes: HTMLInputElement;
  let seconds: HTMLInputElement;
  let onMinuteCommit: jest.Mock;

  beforeEach(() => {
    clockFace = document.createElement('div');
    Object.defineProperty(clockFace, 'offsetWidth', { value: 200, configurable: true });
    Object.defineProperty(clockFace, 'offsetHeight', { value: 200, configurable: true });
    hour = document.createElement('input');
    minutes = document.createElement('input');
    seconds = document.createElement('input');
    document.body.append(clockFace, hour, minutes, seconds);
    onMinuteCommit = jest.fn();
  });

  afterEach(() => {
    document.body.innerHTML = '';
    jest.restoreAllMocks();
  });

  const pressAndRelease = (config: DragHandlersConfig, selectionIsValid = true): void => {
    const controller = {
      handlePointerMove: jest.fn(() => selectionIsValid),
      handlePointerUp: jest.fn(),
      snapToNearestHour: jest.fn(),
    };
    new DragHandlers(controller as never, clockFace, config).attach();
    clockFace.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: 150, clientY: 100 }));
    document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
  };

  const withSeconds = (extra: DragHandlersConfig = {}): DragHandlersConfig => ({
    autoSwitchToMinutes: true,
    autoSwitchToSeconds: true,
    hourElement: hour,
    minutesElement: minutes,
    secondsElement: seconds,
    onMinuteCommit,
    ...extra,
  });

  it('hands off from minutes to seconds after a valid minute pick and does not commit yet', () => {
    minutes.classList.add('active');
    minutes.focus();
    const openSecondsFace = jest.spyOn(seconds, 'click');
    const leaveMinutes = jest.spyOn(minutes, 'blur');

    pressAndRelease(withSeconds());

    expect(openSecondsFace).toHaveBeenCalledTimes(1);
    expect(document.activeElement).toBe(seconds);
    expect(leaveMinutes).toHaveBeenCalledTimes(1);
    expect(onMinuteCommit).not.toHaveBeenCalled();
  });

  it('commits the range part once, after the seconds unit', () => {
    seconds.classList.add('active');
    const openSecondsFace = jest.spyOn(seconds, 'click');

    pressAndRelease(withSeconds());

    expect(onMinuteCommit).toHaveBeenCalledTimes(1);
    expect(openSecondsFace).not.toHaveBeenCalled();
    expect(seconds.classList.contains('active')).toBe(true);
  });

  const STAY_ON_MINUTES: Array<[string, DragHandlersConfig]> = [
    ['autoSwitchToSeconds is false', { autoSwitchToSeconds: false }],
    ['the mobile view is shown', { isMobileView: true }],
  ];

  it.each(STAY_ON_MINUTES)('stays on minutes without committing when %s', (_label, extra) => {
    minutes.classList.add('active');
    const openSecondsFace = jest.spyOn(seconds, 'click');

    pressAndRelease(withSeconds(extra));

    expect(openSecondsFace).not.toHaveBeenCalled();
    expect(document.activeElement).not.toBe(seconds);
    expect(onMinuteCommit).not.toHaveBeenCalled();
  });

  it('neither switches to seconds nor commits after a rejected minute pick', () => {
    minutes.classList.add('active');
    const openSecondsFace = jest.spyOn(seconds, 'click');

    pressAndRelease(withSeconds(), false);

    expect(openSecondsFace).not.toHaveBeenCalled();
    expect(document.activeElement).not.toBe(seconds);
    expect(onMinuteCommit).not.toHaveBeenCalled();
  });

  it('still commits on the minutes release when there is no seconds field', () => {
    minutes.classList.add('active');

    pressAndRelease({ hourElement: hour, minutesElement: minutes, onMinuteCommit });

    expect(onMinuteCommit).toHaveBeenCalledTimes(1);
    expect(minutes.classList.contains('active')).toBe(true);
  });
});
