import { DEFAULT_OPTIONS, mergeOptions } from '../../../src/utils/options/defaults';
import { isPopoverMode } from '../../../src/utils/options/predicates';
import TimepickerUI from '../../../src/timepicker/TimepickerUI';
import { TIMINGS } from '@/constants/timings';
import type { TimepickerOptions } from '@/types/options';

describe('default options', () => {
  afterEach(() => {
    TimepickerUI.destroyAll();
    jest.useRealTimers();
    document.body.innerHTML = '';
  });

  it('keeps behavior.focusInputAfterClose off by default', () => {
    expect(DEFAULT_OPTIONS.behavior.focusInputAfterClose).toBe(false);
  });

  it('closes without a handler delay by default (behavior.delayHandler is 0)', () => {
    expect(DEFAULT_OPTIONS.behavior.delayHandler).toBe(0);
    expect(mergeOptions({}).behavior.delayHandler).toBe(0);
  });

  describe('focus once a Cancel close has removed the modal', () => {
    type Closed = { input: HTMLInputElement; focus: jest.SpyInstance };

    const openAndCancel = (options: TimepickerOptions = {}): Closed => {
      jest.useFakeTimers();
      const input = document.createElement('input');
      input.value = '10:30';
      document.body.appendChild(input);
      const picker = new TimepickerUI(input, {
        ...options,
        clock: { type: '24h' },
        ui: { animation: false },
      });
      picker.create();
      picker.open();
      const focus = jest.spyOn(input, 'focus');

      (document.querySelector('.tp-ui-modal .tp-ui-cancel-btn') as HTMLElement).click();
      jest.advanceTimersByTime(TIMINGS.MODAL_EXIT);

      expect(document.querySelector('.tp-ui-modal')).toBeNull();
      return { input, focus };
    };

    it('leaves focus off the input with default options', () => {
      const { input, focus } = openAndCancel();

      expect(focus).not.toHaveBeenCalled();
      expect(document.activeElement).not.toBe(input);
    });

    it('moves focus to the input with behavior.focusInputAfterClose: true', () => {
      const { input, focus } = openAndCancel({ behavior: { focusInputAfterClose: true } });

      expect(focus).toHaveBeenCalledTimes(1);
      expect(document.activeElement).toBe(input);
    });
  });

  it('keeps compact-wheel a modal unless wheel.placement is set (S2, behavior unchanged)', () => {
    expect(isPopoverMode(mergeOptions({ ui: { mode: 'compact-wheel' } }))).toBe(false);
    expect(isPopoverMode(mergeOptions({ ui: { mode: 'compact-wheel' }, wheel: { placement: 'auto' } }))).toBe(
      true,
    );
  });
});
