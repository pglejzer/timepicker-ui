import { hasClass } from '../utils/config';
import { name } from '../utils/variables';
import type { CoreState } from '../timepicker/CoreState';
import type { EventEmitter, TimepickerEventMap } from '../utils/EventEmitter';

export default class ThemeManager {
  private core: CoreState;
  private emitter: EventEmitter<TimepickerEventMap>;

  constructor(core: CoreState, emitter: EventEmitter<TimepickerEventMap>) {
    this.core = core;
    this.emitter = emitter;
  }

  setTheme(): void {
    const modal = this.core.getModalElement();
    if (!modal) return;

    const { theme } = this.core.options.ui;
    if (!theme) return;

    modal.setAttribute('data-theme', theme);
  }

  setInputClassToInputElement(): void {
    const input = this.core.getInput();
    if (!input) return;

    if (!hasClass(input, 'tp-ui-input')) {
      input.classList.add('tp-ui-input');
    }
  }

  setDataOpenToInputIfDoesntExistInWrapper(): void {
    const openData = this.core.getOpenElementData();
    const input = this.core.getInput();

    if (openData === null && input) {
      input.setAttribute('data-open', 'tp-ui-input');
    }
  }

  setClassTopOpenElement(): void {
    const openElements = this.core.getOpenElement();
    for (const el of openElements) {
      if (el) el.classList.add('tp-ui-open-element');
    }
  }

  setTimepickerClassToElement(): void {
    const root = this.core.element;
    if (!root) return;

    root.classList.add(name);

    const customClass = this.core.options.ui.cssClass;
    if (customClass && customClass !== name) {
      root.classList.add(customClass);
    }
  }

  destroy(): void {
    const modal = this.core.getModalElement();
    if (!modal) return;

    modal.removeAttribute('data-theme');
  }
}

