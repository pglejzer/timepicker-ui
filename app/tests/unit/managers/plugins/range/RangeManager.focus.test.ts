import RangeManager from '@/managers/plugins/range/RangeManager';
import { EventEmitter, type TimepickerEventMap } from '@/utils/EventEmitter';

type ClockType = '12h' | '24h';

interface FocusHarness {
  readonly manager: RangeManager;
  readonly emitter: EventEmitter<TimepickerEventMap>;
  readonly hour: HTMLInputElement;
  readonly okButton: HTMLElement;
  readonly clockFace: HTMLElement;
}

const mount = (clockType: ClockType, hourReadOnly = false): FocusHarness => {
  const modal = document.createElement('div');
  modal.innerHTML =
    '<button type="button" class="tp-ui-range-tab tp-ui-range-from"></button>' +
    '<button type="button" class="tp-ui-range-tab tp-ui-range-to"></button>' +
    '<span class="tp-ui-range-from-time"></span><span class="tp-ui-range-to-time"></span>' +
    '<input class="tp-ui-hour" value="12"><input class="tp-ui-minutes" value="00">' +
    '<div class="tp-ui-clock-face" tabindex="0"></div>' +
    '<div class="tp-ui-ok-btn" role="button" tabindex="0">OK</div>';
  document.body.appendChild(modal);

  const clockFace = modal.querySelector<HTMLElement>('.tp-ui-clock-face') as HTMLElement;
  const hour = modal.querySelector<HTMLInputElement>('.tp-ui-hour') as HTMLInputElement;
  hour.readOnly = hourReadOnly;
  const minutes = modal.querySelector<HTMLInputElement>('.tp-ui-minutes') as HTMLInputElement;
  const okButton = modal.querySelector<HTMLElement>('.tp-ui-ok-btn') as HTMLElement;

  const core = {
    getModalElement: () => modal,
    getInput: () => ({ value: '' }),
    getHour: () => hour,
    getClockFace: () => clockFace,
    getMinutes: () => minutes,
    getSeconds: () => null,
    getAM: () => null,
    getPM: () => null,
    getActiveType: () => undefined,
    getOkButton: () => okButton,
    isOpen: true,
    options: {
      range: { enabled: true, minDuration: undefined, maxDuration: undefined },
      clock: { type: clockType },
    },
  };

  const emitter = new EventEmitter<TimepickerEventMap>();
  const manager = new RangeManager(core as never, emitter);
  manager.init();

  return { manager, emitter, hour, okButton, clockFace };
};

describe('RangeManager moves focus to the hour field when a part starts', () => {
  let harness: FocusHarness | null = null;

  afterEach(() => {
    harness?.manager.destroy();
    harness = null;
    document.body.innerHTML = '';
  });

  it('should focus the hour field after range:minute:commit completes From', () => {
    harness = mount('24h');
    harness.okButton.focus();
    expect(document.activeElement).toBe(harness.okButton);

    harness.emitter.emit('range:minute:commit', { hour: '09', minutes: '15' });

    expect(harness.manager.getActivePart()).toBe('to');
    expect(document.activeElement).toBe(harness.hour);
  });

  it('should focus the clock face instead of an editable hour field after a touch commit', () => {
    harness = mount('24h');
    harness.okButton.focus();

    harness.emitter.emit('range:minute:commit', { hour: '09', minutes: '15', isTouch: true });

    expect(harness.manager.getActivePart()).toBe('to');
    expect(document.activeElement).toBe(harness.clockFace);
  });

  it('should focus a readonly hour field after a touch commit', () => {
    harness = mount('24h', true);
    harness.okButton.focus();

    harness.emitter.emit('range:minute:commit', { hour: '09', minutes: '15', isTouch: true });

    expect(harness.manager.getActivePart()).toBe('to');
    expect(document.activeElement).toBe(harness.hour);
  });

  it('should focus the editable hour field after a commit with isTouch false', () => {
    harness = mount('24h');
    harness.okButton.focus();

    harness.emitter.emit('range:minute:commit', { hour: '09', minutes: '15', isTouch: false });

    expect(document.activeElement).toBe(harness.hour);
  });

  it('should leave focus alone while the committed From is still incomplete (12h without a period)', () => {
    harness = mount('12h');
    harness.okButton.focus();

    harness.emitter.emit('range:minute:commit', { hour: '09', minutes: '15', type: undefined });

    expect(harness.manager.getActivePart()).toBe('from');
    expect(document.activeElement).toBe(harness.okButton);
  });

  it('should focus the hour field again after clear', () => {
    harness = mount('24h');
    harness.emitter.emit('range:minute:commit', { hour: '09', minutes: '15' });
    harness.okButton.focus();
    expect(document.activeElement).toBe(harness.okButton);

    harness.emitter.emit('clear', { previousValue: null });

    expect(harness.manager.getActivePart()).toBe('from');
    expect(harness.manager.getFromValue()).toBeNull();
    expect(document.activeElement).toBe(harness.hour);
  });
});
