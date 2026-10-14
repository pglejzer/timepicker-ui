import { WheelRenderer } from '@/managers/plugins/wheel/WheelRenderer';
import { WheelDragHandler } from '@/managers/plugins/wheel/WheelDragHandler';
import { WheelScrollHandler } from '@/managers/plugins/wheel/WheelScrollHandler';
import { WheelEventHandler } from '@/managers/plugins/wheel/WheelEventHandler';
import { mockWheelItemHeight, setupWheelTestContext, type WheelTestContext } from './wheel-test-helpers';

type ToggleState = { active: boolean; pressed: string | null };
type PeriodToggles = { am: ToggleState; pm: ToggleState };

const SNAP_SETTLE_MS = 500;
const SCROLL_STEP_PX = 50;

const PM_PRESSED: PeriodToggles = {
  am: { active: false, pressed: 'false' },
  pm: { active: true, pressed: 'true' },
};

const AM_PRESSED: PeriodToggles = {
  am: { active: true, pressed: 'true' },
  pm: { active: false, pressed: 'false' },
};

const toggleState = (button: HTMLElement | null): ToggleState => ({
  active: button?.classList.contains('active') ?? false,
  pressed: button?.getAttribute('aria-pressed') ?? null,
});

describe('wheel AM/PM column keeps the header AM/PM toggles in sync', () => {
  let ctx: WheelTestContext;
  let renderer: WheelRenderer;
  let dragHandler: WheelDragHandler;
  let scrollHandler: WheelScrollHandler;
  let eventHandler: WheelEventHandler;

  const periodToggles = (): PeriodToggles => ({
    am: toggleState(ctx.core.getAM()),
    pm: toggleState(ctx.core.getPM()),
  });

  const ampmColumn = (): HTMLDivElement => {
    const column = renderer.getColumnElement('ampm');
    if (!column) throw new Error('ampm column is not rendered');
    return column;
  };

  const press = (key: string): void => {
    ampmColumn().dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
  };

  const scroll = (deltaY: number): void => {
    ampmColumn().dispatchEvent(new WheelEvent('wheel', { deltaY, bubbles: true, cancelable: true }));
    jest.advanceTimersByTime(SNAP_SETTLE_MS);
  };

  beforeEach(() => {
    jest.useFakeTimers();
    ctx = setupWheelTestContext('12h', 'wheel-period-test');
    mockWheelItemHeight();

    renderer = new WheelRenderer(ctx.core);
    dragHandler = new WheelDragHandler(renderer);
    scrollHandler = new WheelScrollHandler(renderer, ctx.core);
    scrollHandler.setDragHandler(dragHandler);
    eventHandler = new WheelEventHandler(ctx.emitter, scrollHandler, ctx.core);

    renderer.init();
    dragHandler.init();
    scrollHandler.init();
    eventHandler.init();
  });

  afterEach(() => {
    eventHandler.destroy();
    scrollHandler.destroy();
    dragHandler.destroy();
    renderer.destroy();
    document.body.innerHTML = '';
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  it('should press PM and release AM on ArrowDown, then the reverse on ArrowUp', () => {
    press('ArrowDown');
    expect(periodToggles()).toEqual(PM_PRESSED);

    press('ArrowUp');
    expect(periodToggles()).toEqual(AM_PRESSED);
  });

  it('should press PM and release AM when the column is scrolled down, then the reverse when scrolled back', () => {
    scroll(SCROLL_STEP_PX);
    expect(scrollHandler.getSelectedValue('ampm')).toBe('PM');
    expect(periodToggles()).toEqual(PM_PRESSED);

    scroll(-SCROLL_STEP_PX);
    expect(scrollHandler.getSelectedValue('ampm')).toBe('AM');
    expect(periodToggles()).toEqual(AM_PRESSED);
  });
});
