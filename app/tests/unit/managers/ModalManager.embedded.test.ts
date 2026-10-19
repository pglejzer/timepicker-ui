import ModalManager from '@/managers/ModalManager';
import EventManager from '@/managers/EventManager';
import TimepickerUI from '@/timepicker/TimepickerUI';
import { CoreState } from '@/timepicker/CoreState';
import { EventEmitter, type TimepickerEventMap } from '@/utils/EventEmitter';
import { DEFAULT_OPTIONS, mergeOptionGroups } from '@/utils/options/defaults';
import type { TimepickerOptions } from '@/types/options';

const HOST_ID = 'embedded-host';

describe('ModalManager with an embedded inline picker', () => {
  let host: HTMLDivElement;
  let anchor: HTMLElement;
  let managers: ModalManager[];

  const inline = (embedded?: boolean): TimepickerOptions => ({
    ui: {
      backdrop: false,
      inline: { enabled: true, containerId: HOST_ID, ...(embedded === undefined ? {} : { embedded }) },
    },
    behavior: { focusTrap: true },
  });

  const render = (options: TimepickerOptions, id: string): ModalManager => {
    const core = new CoreState(anchor, mergeOptionGroups(DEFAULT_OPTIONS, options), id);
    const manager = new ModalManager(core, new EventEmitter<TimepickerEventMap>());
    managers.push(manager);
    manager.setModalTemplate();
    return manager;
  };

  const modal = (): HTMLElement | null => host.querySelector<HTMLElement>('.tp-ui-modal');
  const wrapper = (): HTMLElement => {
    const el = host.querySelector<HTMLElement>('.tp-ui-wrapper');
    if (!el) throw new Error('.tp-ui-wrapper is not rendered');
    return el;
  };

  beforeEach(() => {
    jest.useFakeTimers();
    managers = [];
    anchor = document.createElement('div');
    anchor.innerHTML = '<input type="text" />';
    host = document.createElement('div');
    host.id = HOST_ID;
    document.body.append(anchor, host);
  });

  afterEach(() => {
    managers.forEach((manager) => manager.destroy());
    TimepickerUI.destroyAll();
    jest.restoreAllMocks();
    jest.useRealTimers();
    document.body.innerHTML = '';
  });

  describe('tp-ui--embedded class', () => {
    it('should be added next to tp-ui--inline when embedded', () => {
      render(inline(true), 'embedded-on');

      expect(modal()).toHaveClass('tp-ui--inline', 'tp-ui--embedded');
    });

    it.each<[string, boolean | undefined]>([
      ['embedded is false', false],
      ['embedded is unset', undefined],
    ])('should be absent when %s', (_name, embedded) => {
      render(inline(embedded), 'embedded-off');

      expect(modal()).toHaveClass('tp-ui--inline');
      expect(modal()).not.toHaveClass('tp-ui--embedded');
    });

    it('should be absent when embedded is set without enabling inline', () => {
      render({ ui: { inline: { enabled: false, embedded: true } } }, 'embedded-not-inline');

      expect(document.querySelector('.tp-ui-modal')).not.toHaveClass('tp-ui--embedded');
      expect(document.querySelector('.tp-ui-modal')).not.toHaveClass('tp-ui--inline');
    });
  });

  describe('setInitialFocus', () => {
    it('should focus the wrapper of a plain inline picker (control)', () => {
      const manager = render(inline(false), 'focus-control');
      const focus = jest.spyOn(wrapper(), 'focus');

      manager.setInitialFocus();
      jest.runOnlyPendingTimers();

      expect(focus).toHaveBeenCalledTimes(1);
    });

    it('should not focus the wrapper when embedded, even with focusTrap true', () => {
      const manager = render(inline(true), 'focus-embedded');
      const focus = jest.spyOn(wrapper(), 'focus');
      const outside = document.createElement('button');
      document.body.appendChild(outside);
      outside.focus();

      manager.setInitialFocus();
      jest.runOnlyPendingTimers();

      expect(focus).not.toHaveBeenCalled();
      expect(document.activeElement).toBe(outside);
    });
  });

  describe('focus trap through TimepickerUI', () => {
    const createPicker = (embedded: boolean, id: string): TimepickerUI => {
      const picker = new TimepickerUI(anchor, {
        ui: { animation: false, inline: { enabled: true, containerId: HOST_ID, embedded } },
        behavior: { focusTrap: true, id },
      });
      picker.create();
      return picker;
    };

    it('should attach the trap for a plain inline picker that asks for it (control)', () => {
      const attach = jest.spyOn(EventManager.prototype, 'focusTrapHandler');

      createPicker(false, 'trap-control');

      expect(attach).toHaveBeenCalled();
    });

    it('should not attach the trap when embedded, even with focusTrap true', () => {
      const attach = jest.spyOn(EventManager.prototype, 'focusTrapHandler');

      createPicker(true, 'trap-embedded');
      jest.runOnlyPendingTimers();

      expect(attach).not.toHaveBeenCalled();
      expect(modal()).toHaveClass('tp-ui--embedded');
    });
  });
});
