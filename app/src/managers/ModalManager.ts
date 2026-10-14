import { getModalTemplate } from '../utils/template';
import type { CoreState } from '../timepicker/CoreState';
import type { EventEmitter, TimepickerEventMap } from '../utils/EventEmitter';
import { isDocument } from '../utils/node';
import { isPopoverMode } from '../utils/options/predicates';
import { getInlineContainer, resolveElement } from '../utils/dom';

const SCROLLBAR_GAP_PROPERTY = '--tp-scrollbar-gap';
const SCROLLING_OVERFLOW = ['auto', 'scroll'];
const CONTROL_CLASS = /^tp-ui-[\w-]+$/;

interface SavedScrollStyles {
  element: HTMLElement;
  overflowY: string;
  paddingRight: string;
}

let scrollLockCount = 0;
let savedScrollStyles: SavedScrollStyles[] = [];
let savedScrollbarGap = '';

function isScrollContainer(element: HTMLElement): boolean {
  return SCROLLING_OVERFLOW.includes(window.getComputedStyle(element).overflowY);
}

function lockElementScroll(element: HTMLElement): number {
  const { style } = element;
  const widthBefore = element.clientWidth;
  const paddingBefore = parseFloat(window.getComputedStyle(element).paddingRight) || 0;
  savedScrollStyles.push({ element, overflowY: style.overflowY, paddingRight: style.paddingRight });
  style.overflowY = 'hidden';
  const gap = Math.max(0, element.clientWidth - widthBefore);
  if (gap > 0) style.paddingRight = `${paddingBefore + gap}px`;
  return gap;
}

function acquireScrollLock(): void {
  if (scrollLockCount === 0) {
    const { body, documentElement: root } = document;
    const bodyGap = isScrollContainer(body) ? lockElementScroll(body) : 0;
    const rootGap = lockElementScroll(root);
    savedScrollbarGap = root.style.getPropertyValue(SCROLLBAR_GAP_PROPERTY);
    root.style.setProperty(SCROLLBAR_GAP_PROPERTY, `${Math.max(bodyGap, rootGap)}px`);
  }
  scrollLockCount += 1;
}

function releaseScrollLock(): void {
  if (scrollLockCount === 0) return;
  scrollLockCount -= 1;
  if (scrollLockCount === 0) {
    savedScrollStyles.forEach(({ element, overflowY, paddingRight }) => {
      element.style.overflowY = overflowY;
      element.style.paddingRight = paddingRight;
    });
    const root = document.documentElement;
    if (savedScrollbarGap) {
      root.style.setProperty(SCROLLBAR_GAP_PROPERTY, savedScrollbarGap);
    } else {
      root.style.removeProperty(SCROLLBAR_GAP_PROPERTY);
    }
    savedScrollStyles = [];
    savedScrollbarGap = '';
  }
}

export default class ModalManager {
  private core: CoreState;
  private scrollLocked = false;

  constructor(core: CoreState, emitter: EventEmitter<TimepickerEventMap>) {
    this.core = core;
    void emitter;
  }

  private clearExistingModal(): void {
    if (isDocument() === false) {
      return;
    }

    const existing = this.core.getModalElement();
    if (existing) existing.remove();
  }

  setModalTemplate(): void {
    if (isDocument() === false) {
      return;
    }

    this.clearExistingModal();

    const modalTemplate = getModalTemplate(this.core.options, this.core.instanceId);

    if (this.core.options.ui.inline?.enabled) {
      const containerElement = getInlineContainer(this.core.options.ui.inline);
      if (!containerElement) return;

      containerElement.innerHTML = '';
      containerElement.insertAdjacentHTML('beforeend', modalTemplate);

      const modalElement = containerElement.querySelector('.tp-ui-modal') as HTMLDivElement;
      if (modalElement) {
        modalElement.classList.add('tp-ui--inline');

        const { showButtons } = this.core.options.ui.inline;
        if (showButtons === false || showButtons === undefined) {
          modalElement
            .querySelectorAll('.tp-ui-wrapper-btn, .tp-ui-wrapper-btn.mobile')
            .forEach((btn) => ((btn as HTMLElement).style.display = 'none'));
          modalElement.querySelectorAll<HTMLElement>('.tp-ui-footer').forEach((footer) => {
            if (!footer.querySelector('.tp-ui-keyboard-icon-wrapper')) footer.style.display = 'none';
          });
        }
      }
      return;
    }

    const { appendTo } = this.core.options.ui;
    const target = appendTo ? resolveElement(appendTo) : document.body;
    target?.insertAdjacentHTML('beforeend', modalTemplate);
  }

  lockScroll(): void {
    if (isDocument() === false) return;
    if (this.core.options.ui.inline?.enabled || isPopoverMode(this.core.options)) return;
    if (this.core.options.ui.enableScrollbar) return;
    if (this.scrollLocked) return;

    this.scrollLocked = true;
    acquireScrollLock();
  }

  unlockScroll(): void {
    if (isDocument() === false) return;
    if (!this.scrollLocked) return;

    this.scrollLocked = false;
    releaseScrollLock();
  }

  setScrollbarOrNot(): void {
    if (this.core.options.ui.enableScrollbar) {
      this.unlockScroll();
    } else {
      this.lockScroll();
    }
  }

  removeBackdrop(): void {
    if (this.core.options.ui.inline?.enabled || this.core.options.ui.backdrop) return;

    const modal = this.core.getModalElement();
    const openElements = this.core.getOpenElement();

    modal?.classList.add('removed');
    openElements.forEach((openEl: Element) => openEl?.classList.add('disabled'));
  }

  setNormalizeClass(): void {
    const modal = this.core.getModalElement();
    if (!modal) return;

    modal.classList.add('tp-ui-normalize');
    const divs = modal.querySelectorAll(':scope > div') as NodeListOf<HTMLDivElement>;
    divs.forEach((div: HTMLDivElement) => div.classList.add('tp-ui-normalize'));
  }

  setInitialFocus(): void {
    const { options } = this.core;
    if (!options.behavior.focusTrap || typeof requestAnimationFrame === 'undefined') return;
    if (!options.ui.backdrop && !options.ui.inline?.enabled && !isPopoverMode(options)) return;

    requestAnimationFrame(() => this.focusWrapperUnlessInside());
  }

  private focusWrapperUnlessInside(): void {
    const wrapper = this.core.getWrapper();
    if (wrapper && !wrapper.contains(wrapper.ownerDocument.activeElement)) wrapper.focus();
  }

  getFocusedControlSelector(): string | null {
    const modal = this.core.getModalElement();
    const active = modal?.ownerDocument.activeElement;
    if (!modal || !active || !modal.contains(active)) return null;

    return Array.from(active.classList)
      .filter((name) => CONTROL_CLASS.test(name))
      .map((name) => `.${name}`)
      .join('');
  }

  restoreFocus(controlSelector: string): void {
    if (controlSelector) {
      this.core.getWrapper()?.querySelector<HTMLElement>(controlSelector)?.focus();
    }

    this.focusWrapperUnlessInside();
  }

  setFlexEndToFooterIfNoKeyboardIcon(): void {
    const footer = this.core.getFooter();
    if (!this.core.options.ui.enableSwitchIcon && footer) {
      footer.style.justifyContent = 'flex-end';
    }
  }

  destroy(): void {
    this.unlockScroll();
    this.clearExistingModal();
  }
}
