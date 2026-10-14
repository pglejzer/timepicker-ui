import { isElementDisabled, prefersReducedMotion } from './accessibility';

const PRESSED = 'is-pressed';
const RIPPLING = 'is-rippling';
const attachedRoots = new WeakSet<Document | HTMLElement>();

const hostOf = (target: EventTarget | null): HTMLElement | null =>
  target instanceof Element ? target.closest<HTMLElement>('[data-md3-ripple]') : null;

const release = (event: Event): void => {
  hostOf(event.target)?.classList.remove(PRESSED);
};

const fadeOut = (event: Event): void => {
  if ((event as AnimationEvent).animationName === 'tp-ripple-fade') {
    hostOf(event.target)?.classList.remove(RIPPLING);
  }
};

const press = (event: Event): void => {
  const { pointerType, button, clientX, clientY } = event as PointerEvent;
  const host = hostOf(event.target);
  if (!host || isElementDisabled(host) || (pointerType === 'mouse' && button !== 0)) return;

  host.classList.remove(RIPPLING);
  const { left, top, width, height } = host.getBoundingClientRect();
  host.style.setProperty('--ripple-x', `${clientX - left}px`);
  host.style.setProperty('--ripple-y', `${clientY - top}px`);
  host.style.setProperty('--ripple-size', `${Math.max(width, height) * 2}px`);
  host.classList.add(PRESSED);
  host.addEventListener('pointerleave', release, { once: true });

  if (!prefersReducedMotion()) {
    requestAnimationFrame(() => host.classList.add(RIPPLING));
  }
};

const ROOT_LISTENERS: ReadonlyArray<[string, EventListener]> = [
  ['pointerdown', press],
  ['pointerup', release],
  ['pointercancel', release],
  ['animationend', fadeOut],
];

export const initMd3Ripple = (root: Document | HTMLElement): (() => void) => {
  if (attachedRoots.has(root)) return () => {};

  attachedRoots.add(root);
  ROOT_LISTENERS.forEach(([type, listener]) => root.addEventListener(type, listener));

  let attached = true;
  return () => {
    if (!attached) return;
    attached = false;
    attachedRoots.delete(root);
    ROOT_LISTENERS.forEach(([type, listener]) => root.removeEventListener(type, listener));
  };
};
