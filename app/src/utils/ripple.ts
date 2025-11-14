type RippleTarget = HTMLElement & { _rippleHold?: boolean };
const RIPPLE_CLASS = 'is-rippling';
const HOLD_CLASS = 'ripple-hold';
let activeRippleElement: RippleTarget | null = null;

function startRipple(e: PointerEvent) {
  const target = e.target as HTMLElement;
  const el = (
    target.hasAttribute('data-md3-ripple') ? target : target.closest('[data-md3-ripple]')
  ) as RippleTarget | null;

  if (!el) return;
  if (e.button !== 0 && e.pointerType === 'mouse') return;

  const rect = el.getBoundingClientRect();
  const maxDim = Math.max(rect.width, rect.height);
  const size = maxDim * 2;
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  el.style.setProperty('--ripple-size', `${size}px`);
  el.style.setProperty('--ripple-x', `${x}px`);
  el.style.setProperty('--ripple-y', `${y}px`);

  el.classList.remove(RIPPLE_CLASS, HOLD_CLASS);
  void el.offsetWidth;
  el.classList.add(RIPPLE_CLASS, HOLD_CLASS);
  el._rippleHold = true;
  activeRippleElement = el;
}

function endRipple(e: PointerEvent) {
  const target = e.target as HTMLElement;
  const el = (
    target.hasAttribute('data-md3-ripple') ? target : target.closest('[data-md3-ripple]')
  ) as RippleTarget | null;

  const rippleEl = el || activeRippleElement;
  if (!rippleEl) return;

  rippleEl._rippleHold = false;
  rippleEl.classList.remove(HOLD_CLASS);
  setTimeout(() => {
    rippleEl.classList.remove(RIPPLE_CLASS);
    if (activeRippleElement === rippleEl) {
      activeRippleElement = null;
    }
  }, 1000);
}

function handleMouseLeave(e: MouseEvent) {
  const el = e.currentTarget as RippleTarget;
  if (!el || !el._rippleHold) return;

  el._rippleHold = false;
  el.classList.remove(HOLD_CLASS);
  setTimeout(() => {
    el.classList.remove(RIPPLE_CLASS);
    if (activeRippleElement === el) {
      activeRippleElement = null;
    }
  }, 1000);
}

export function initMd3Ripple(root: Document | HTMLElement = document) {
  root.addEventListener('pointerdown', startRipple as EventListener);
  root.addEventListener('pointerup', endRipple as EventListener);
  root.addEventListener('pointercancel', endRipple as EventListener);

  const rippleElements = root.querySelectorAll('[data-md3-ripple]');
  rippleElements.forEach((el) => {
    el.addEventListener('mouseleave', handleMouseLeave as EventListener);
  });
}
