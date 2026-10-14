import TimepickerUI from '@/timepicker/TimepickerUI';
import { PluginRegistry } from '@/core/PluginRegistry';
import { WheelPlugin } from '@/plugins/wheel';
import type { ClockOptions, UIOptions } from '@/types/options';
import { mockWheelItemHeight } from './plugins/wheel/wheel-test-helpers';

const CONTAINER_ID = 'inline-footer-host';

type Mode = 'clock' | 'wheel';

interface InlineSetup {
  mode: Mode;
  inline?: { showButtons?: boolean };
  ui?: UIOptions;
  clock?: ClockOptions;
}

interface MountedInline {
  picker: TimepickerUI;
  container: HTMLElement;
}

const inlineModal = (container: HTMLElement): HTMLElement => {
  const modal = container.querySelector<HTMLElement>('.tp-ui-modal.tp-ui--inline');
  if (!modal) throw new Error('the inline modal .tp-ui-modal.tp-ui--inline is not rendered');
  return modal;
};

const part = (container: HTMLElement, selector: string): HTMLElement => {
  const element = inlineModal(container).querySelector<HTMLElement>(selector);
  if (!element) throw new Error(`${selector} is not rendered in the inline modal`);
  return element;
};

const footer = (container: HTMLElement): HTMLElement => part(container, '.tp-ui-footer');
const actionButtons = (container: HTMLElement): HTMLElement => part(container, '.tp-ui-wrapper-btn');

const mountInline = ({ mode, inline, ui, clock }: InlineSetup): MountedInline => {
  const input = document.createElement('input');
  input.value = clock?.showSeconds ? '10:30:15' : '10:30';
  const container = document.createElement('div');
  container.id = CONTAINER_ID;
  document.body.append(input, container);

  const picker = new TimepickerUI(input, {
    clock: { type: '24h', ...clock },
    ui: { ...ui, mode, animation: false, inline: { enabled: true, containerId: CONTAINER_ID, ...inline } },
  });
  picker.create();

  expect(inlineModal(container).classList.contains('tp-ui-wheel-mode')).toBe(mode === 'wheel');
  return { picker, container };
};

describe('inline picker footer visibility', () => {
  beforeAll(() => PluginRegistry.register(WheelPlugin));

  beforeEach(() => {
    jest.useFakeTimers();
    mockWheelItemHeight();
  });

  afterEach(() => {
    TimepickerUI.destroyAll();
    jest.restoreAllMocks();
    jest.useRealTimers();
    document.body.innerHTML = '';
  });

  describe.each<Mode>(['clock', 'wheel'])('in %s mode', (mode) => {
    it.each([false, undefined])(
      'should hide the footer and the action buttons when showButtons is %p and there is no switch icon',
      (showButtons) => {
        const { container } = mountInline({ mode, inline: { showButtons } });

        expect(inlineModal(container).querySelector('.tp-ui-keyboard-icon-wrapper')).toBeNull();
        expect(actionButtons(container).style.display).toBe('none');
        expect(footer(container).style.display).toBe('none');
      },
    );

    it('should keep a footer holding the switch icon visible while the action buttons hide', () => {
      const { container } = mountInline({
        mode,
        inline: { showButtons: false },
        ui: { enableSwitchIcon: true },
      });

      expect(footer(container).querySelector('.tp-ui-keyboard-icon-wrapper')).not.toBeNull();
      expect(actionButtons(container).style.display).toBe('none');
      expect(footer(container).style.display).not.toBe('none');
    });

    it('should keep the footer and the action buttons visible when showButtons is true', () => {
      const { container } = mountInline({ mode, inline: { showButtons: true } });

      expect(actionButtons(container).style.display).not.toBe('none');
      expect(footer(container).style.display).not.toBe('none');
    });
  });

  it('should hide the footer with seconds shown when showButtons is false and no switch icon', () => {
    const { container } = mountInline({
      mode: 'clock',
      clock: { showSeconds: true },
      inline: { showButtons: false },
    });

    expect(inlineModal(container).querySelector('.tp-ui-seconds')).not.toBeNull();
    expect(actionButtons(container).style.display).toBe('none');
    expect(footer(container).style.display).toBe('none');
  });

  describe('after update() re-renders the inline picker', () => {
    it('should keep the footer hidden when an unrelated option changes', () => {
      const { picker, container } = mountInline({ mode: 'clock', inline: { showButtons: false } });

      picker.update({ options: { labels: { ok: 'Done' } } });

      expect(part(container, '.tp-ui-ok-btn').textContent).toBe('Done');
      expect(footer(container).style.display).toBe('none');
    });

    it('should show the footer and the action buttons again once showButtons is turned on', () => {
      const { picker, container } = mountInline({ mode: 'clock', inline: { showButtons: false } });

      picker.update({
        options: { ui: { inline: { enabled: true, containerId: CONTAINER_ID, showButtons: true } } },
      });

      expect(actionButtons(container).style.display).not.toBe('none');
      expect(footer(container).style.display).not.toBe('none');
    });
  });
});
