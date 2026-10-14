import { getModalTemplate } from '../../../../src/utils/template';
import { mergeOptions } from '../../../../src/utils/options/defaults';
import { PluginRegistry } from '../../../../src/core/PluginRegistry';
import { RangePlugin } from '../../../../src/plugins/range';
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

    it('does NOT set aria-pressed anywhere in the view-switch control (its label names the action)', () => {
      const dom = render({ clock: { type: '12h' }, ui: { enableSwitchIcon: true } });

      const control = dom.querySelector('.tp-ui-keyboard-icon-wrapper') as HTMLElement;
      expect(control).not.toBeNull();
      expect(control.hasAttribute('aria-pressed')).toBe(false);
      expect(control.querySelectorAll('[aria-pressed]')).toHaveLength(0);
    });
  });

  describe('custom labels flow into rendered ARIA', () => {
    it('uses custom hour/minute/clock/period labels in aria-labels', () => {
      const dom = render({
        clock: { type: '12h' },
        labels: {
          hourLabel: 'Godzina',
          minuteLabel: 'Minuta',
          clockLabel: 'Tarcza zegara',
          periodLabel: 'Pora dnia',
        },
      });

      const hour = dom.querySelector('input[name="hour"]') as HTMLInputElement;
      const minutes = dom.querySelector('input[name="minutes"]') as HTMLInputElement;
      const clockGroup = dom.querySelector('.tp-ui-body') as HTMLElement;
      const periodGroup = dom.querySelector('.tp-ui-wrapper-type-time') as HTMLElement;

      expect(hour.getAttribute('aria-label')).toBe('Godzina');
      expect(minutes.getAttribute('aria-label')).toBe('Minuta');
      expect(clockGroup.getAttribute('aria-label')).toBe('Tarcza zegara');
      expect(periodGroup.getAttribute('aria-label')).toBe('Pora dnia');
    });

    it('uses custom timeLabel on the time-input group and custom time on the select-time heading', () => {
      const dom = render({
        clock: { type: '12h' },
        labels: { time: 'Wybierz czas', timeLabel: 'Grupa czasu' },
      });

      const timeGroup = dom.querySelector('.tp-ui-wrapper-time') as HTMLElement;
      const heading = dom.querySelector('.tp-ui-select-time') as HTMLElement;

      expect(timeGroup.getAttribute('aria-label')).toBe('Grupa czasu');
      expect(heading.textContent).toBe('Wybierz czas');
    });

    it('keeps the visible heading (labels.time) and the group aria-label (labels.timeLabel) independent', () => {
      const dom = render({
        clock: { type: '12h' },
        labels: { time: 'Naglowek', timeLabel: 'Etykieta grupy' },
      });

      const timeGroup = dom.querySelector('.tp-ui-wrapper-time') as HTMLElement;
      const heading = dom.querySelector('.tp-ui-select-time') as HTMLElement;

      expect(heading.textContent).toBe('Naglowek');
      expect(timeGroup.getAttribute('aria-label')).toBe('Etykieta grupy');
      expect(timeGroup.getAttribute('aria-label')).not.toBe(heading.textContent);
    });

    it('names the view-switch button with the custom switch label and leaves its wrapper unnamed', () => {
      const dom = render({
        clock: { type: '12h' },
        ui: { enableSwitchIcon: true },
        labels: {
          switchToKeyboardLabel: 'Przelacz na klawiature',
          toggleLabel: 'Przelacz widok',
        },
      });

      const wrapper = dom.querySelector('.tp-ui-keyboard-icon-wrapper') as HTMLElement;
      const keyboardIcon = dom.querySelector('.tp-ui-keyboard-icon') as HTMLElement;

      expect(wrapper.hasAttribute('aria-label')).toBe(false);
      expect(keyboardIcon.getAttribute('aria-label')).toBe('Przelacz na klawiature');
    });

    it('names the mobile view-switch button with the custom switch-to-clock label', () => {
      const dom = render({
        clock: { type: '12h' },
        ui: { enableSwitchIcon: true, mobile: true },
        labels: { switchToClockLabel: 'Pokaz tarcze' },
      });

      const clockIcon = dom.querySelector('button.tp-ui-keyboard-icon') as HTMLElement;

      expect(clockIcon).not.toBeNull();
      expect(clockIcon.getAttribute('aria-label')).toBe('Pokaz tarcze');
    });

    it('uses custom rangeSelectionLabel on the range tablist when range is enabled', () => {
      PluginRegistry.register(RangePlugin);

      const dom = render({
        clock: { type: '12h' },
        range: { enabled: true },
        labels: { rangeSelectionLabel: 'Wybor zakresu' },
      });

      const tablist = dom.querySelector('.tp-ui-range-header') as HTMLElement;

      expect(tablist).not.toBeNull();
      expect(tablist.getAttribute('role')).toBe('tablist');
      expect(tablist.getAttribute('aria-label')).toBe('Wybor zakresu');
    });

    it('renders aria-valuetext on the hour and minute spinbuttons', () => {
      const dom = render({ clock: { type: '24h' } });

      const hour = dom.querySelector('input[name="hour"]') as HTMLInputElement;
      const minutes = dom.querySelector('input[name="minutes"]') as HTMLInputElement;

      expect(hour.hasAttribute('aria-valuetext')).toBe(true);
      expect(hour.getAttribute('aria-valuetext')).toBe('0');
      expect(minutes.hasAttribute('aria-valuetext')).toBe(true);
      expect(minutes.getAttribute('aria-valuetext')).toBe('00');
    });
  });

  describe('clock face semantics', () => {
    it('names the clock body as a group with labels.clockLabel', () => {
      const dom = render({ clock: { type: '12h' } });

      const clockGroup = dom.querySelector('.tp-ui-body') as HTMLElement;

      expect(clockGroup.getAttribute('role')).toBe('group');
      expect(clockGroup.getAttribute('aria-label')).toBe('Clock');
    });

    it.each(['12h', '24h'] as const)(
      'renders the %s dial as a focusable slider without a static name or value',
      (type) => {
        const dom = render({ clock: { type } });

        const clockFace = dom.querySelector('.tp-ui-clock-face') as HTMLElement;

        expect(clockFace.getAttribute('role')).toBe('slider');
        expect(clockFace.getAttribute('tabindex')).toBe('0');
        ['aria-label', 'aria-valuemin', 'aria-valuemax', 'aria-valuenow', 'aria-valuetext'].forEach((name) => {
          expect(clockFace.hasAttribute(name)).toBe(false);
        });
      },
    );

    it.each([
      ['12h', 1],
      ['24h', 2],
    ] as const)('marks every %s tips wrapper aria-hidden without a role', (type, count) => {
      const dom = render({ clock: { type } });

      const tipsWrappers = dom.querySelectorAll('.tp-ui-tips-wrapper, .tp-ui-tips-wrapper-24h');

      expect(tipsWrappers).toHaveLength(count);
      tipsWrappers.forEach((wrapper) => {
        expect(wrapper.getAttribute('aria-hidden')).toBe('true');
        expect(wrapper.getAttribute('role')).toBeNull();
      });
    });
  });
});

describe('getModalTemplate modal transition style', () => {
  const modalOf = (options: TimepickerOptions): HTMLElement =>
    render(options).querySelector('.tp-ui-modal') as HTMLElement;

  it.each<[string, TimepickerOptions]>([
    ['by default', {}],
    ['with ui.animation: true', { ui: { animation: true } }],
  ])('leaves the transition to the stylesheet %s (no inline style)', (_name, options) => {
    expect(modalOf(options).hasAttribute('style')).toBe(false);
  });

  it.each<[string, TimepickerOptions]>([
    ['the clock', { ui: { animation: false } }],
    ['the mobile view', { ui: { mobile: true, animation: false } }],
  ])('turns the transition off inline for %s when ui.animation is false', (_name, options) => {
    expect(modalOf(options).getAttribute('style')).toBe('transition:none');
  });
});
