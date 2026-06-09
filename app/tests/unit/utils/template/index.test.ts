import { getModalTemplate } from '../../../../src/utils/template';
import { mergeOptions } from '../../../../src/utils/options/defaults';
import type { TimepickerOptions } from '../../../../src/types/options';

function render(options: TimepickerOptions): HTMLDivElement {
  const merged = mergeOptions(options);
  const container = document.createElement('div');
  container.innerHTML = getModalTemplate(merged, 'tmpl-instance');
  return container;
}

describe('getModalTemplate accessibility semantics', () => {
  describe('hour spinbutton - 12h mode', () => {
    it('carries spinbutton range and initial value attributes', () => {
      const dom = render({ clock: { type: '12h' } });
      const hour = dom.querySelector('input[name="hour"]') as HTMLInputElement;

      expect(hour.getAttribute('role')).toBe('spinbutton');
      expect(hour.getAttribute('aria-valuemin')).toBe('1');
      expect(hour.getAttribute('aria-valuemax')).toBe('12');
      expect(hour.getAttribute('aria-valuenow')).toBe('12');
    });
  });

  describe('hour spinbutton - 24h mode', () => {
    it('carries spinbutton range and initial value attributes', () => {
      const dom = render({ clock: { type: '24h' } });
      const hour = dom.querySelector('input[name="hour"]') as HTMLInputElement;

      expect(hour.getAttribute('aria-valuemin')).toBe('0');
      expect(hour.getAttribute('aria-valuemax')).toBe('23');
      expect(hour.getAttribute('aria-valuenow')).toBe('0');
    });
  });

  describe('minute spinbutton', () => {
    it('carries 0-59 spinbutton range and initial value', () => {
      const dom = render({ clock: { type: '12h' } });
      const minutes = dom.querySelector('input[name="minutes"]') as HTMLInputElement;

      expect(minutes.getAttribute('role')).toBe('spinbutton');
      expect(minutes.getAttribute('aria-valuemin')).toBe('0');
      expect(minutes.getAttribute('aria-valuemax')).toBe('59');
      expect(minutes.getAttribute('aria-valuenow')).toBe('0');
    });
  });

  describe('aria-pressed presence', () => {
    it('does NOT set aria-pressed on OK, Cancel, or Clear buttons', () => {
      const dom = render({ clock: { type: '12h' }, ui: { clearButton: true } });

      const ok = dom.querySelector('.tp-ui-ok-btn') as HTMLElement;
      const cancel = dom.querySelector('.tp-ui-cancel-btn') as HTMLElement;
      const clear = dom.querySelector('.tp-ui-clear-btn') as HTMLElement;

      expect(ok.hasAttribute('aria-pressed')).toBe(false);
      expect(cancel.hasAttribute('aria-pressed')).toBe(false);
      expect(clear).not.toBeNull();
      expect(clear.hasAttribute('aria-pressed')).toBe(false);
    });

    it('keeps aria-pressed on AM and PM buttons', () => {
      const dom = render({ clock: { type: '12h' } });

      const am = dom.querySelector('.tp-ui-am') as HTMLElement;
      const pm = dom.querySelector('.tp-ui-pm') as HTMLElement;

      expect(am.getAttribute('aria-pressed')).toBe('false');
      expect(pm.getAttribute('aria-pressed')).toBe('false');
    });

    it('keeps aria-pressed on the view-switch toggle', () => {
      const dom = render({ clock: { type: '12h' }, ui: { enableSwitchIcon: true } });

      const toggle = dom.querySelector('.tp-ui-keyboard-icon-wrapper') as HTMLElement;
      expect(toggle).not.toBeNull();
      expect(toggle.getAttribute('aria-pressed')).toBe('false');
    });
  });

  describe('clock face semantics', () => {
    it('marks the tips wrapper aria-hidden and the clock face as group', () => {
      const dom = render({ clock: { type: '12h' } });

      const clockFace = dom.querySelector('.tp-ui-clock-face') as HTMLElement;
      const tipsWrapper = dom.querySelector('.tp-ui-tips-wrapper') as HTMLElement;

      expect(clockFace.getAttribute('role')).toBe('group');
      expect(tipsWrapper.getAttribute('aria-hidden')).toBe('true');
      expect(tipsWrapper.getAttribute('role')).toBeNull();
    });
  });
});
