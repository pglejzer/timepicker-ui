(() => {
  if (window.__tp) return;
  const errors = [];
  window.addEventListener('error', (e) => errors.push('pageerror: ' + String(e.message).slice(0, 300)));
  window.addEventListener('unhandledrejection', (e) => {
    const reason = e.reason && e.reason.message ? e.reason.message : e.reason;
    errors.push('unhandledrejection: ' + String(reason).slice(0, 300));
  });
  const originalConsoleError = console.error.bind(console);
  console.error = (...args) => {
    errors.push('console.error: ' + args.map((a) => (a && a.message) || String(a)).join(' ').slice(0, 300));
    originalConsoleError(...args);
  };
  const FREEZE_CSS =
    '*,*::before,*::after{transition:none!important;animation:none!important;caret-color:transparent!important}' +
    'html{scroll-behavior:auto!important}';
  const addStyle = (id, css) => {
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement('style');
      el.id = id;
      (document.head || document.documentElement).appendChild(el);
    }
    el.textContent = css;
  };
  const whenDom = (fn) => {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn, { once: true });
    else fn();
  };
  whenDom(() => addStyle('verify-freeze', FREEZE_CSS));
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const frames = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  const until = async (predicate, timeout) => {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const value = predicate();
      if (value) return value;
      await sleep(50);
    }
    return null;
  };
  const MODAL = 'body > .tp-ui-modal.show';
  const modal = () => document.querySelector(MODAL);
  const resolve = (selector) => selector.replace(/^M(?=\s|$)/, MODAL);
  const describe = (el) => {
    if (!el) return null;
    const cls = typeof el.className === 'string' ? el.className.trim().split(/\s+/).slice(0, 3).join('.') : '';
    return el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (cls ? '.' + cls : '');
  };
  const center = (el) => {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  };
  const hits = (el, x, y) => {
    const top = document.elementFromPoint(x, y);
    return !!top && (top === el || el.contains(top));
  };
  const PROBE_EVENTS = ['show', 'open', 'confirm', 'cancel', 'update', 'select:am', 'select:pm', 'error'];
  const probes = {};
  const findTimepicker = () => {
    if (window.__tpClass) return window.__tpClass;
    const chunk = window.webpackChunktimepicker_ui_build;
    if (!chunk) return null;
    let req;
    chunk.push([[Symbol('verify-probe')], {}, (r) => (req = r)]);
    if (!req || !req.c) return null;
    for (const id of Object.keys(req.c)) {
      const exp = req.c[id].exports;
      if (!exp || typeof exp !== 'object') continue;
      for (const key of Object.keys(exp)) {
        try {
          if (exp[key] && typeof exp[key].getById === 'function') return (window.__tpClass = exp[key]);
        } catch (e) {}
      }
    }
    return null;
  };
  const compact = (obj) =>
    Object.fromEntries(
      Object.entries(obj).filter(([, v]) => v !== null && v !== undefined && v !== '' && !(Array.isArray(v) && !v.length)),
    );
  const settle = async () => {
    await sleep(60);
    await until(() => !document.querySelector('.tp-ui-clock-hand.tp-ui-tips-animation'), 2000);
    document
      .querySelectorAll('.is-rippling, .is-pressed, .ripple-hold')
      .forEach((el) => el.classList.remove('is-rippling', 'is-pressed', 'ripple-hold'));
    await frames();
  };
  const readState = (inputSelector) => {
    const m = modal();
    const q = (s) => (m ? m.querySelector(s) : null);
    const txt = (s) => (q(s) ? q(s).textContent.trim() : null);
    const wheel = (col) => {
      const item = q('.tp-ui-wheel-' + col + ' .tp-ui-wheel-item.is-center');
      return item ? item.dataset.value : null;
    };
    const ok = q('.tp-ui-ok-btn');
    const clear = q('.tp-ui-clear-btn');
    const activeTab = q('.tp-ui-range-tab.active');
    const tz = q('.tp-ui-timezone-dropdown');
    const input = inputSelector ? document.querySelector(resolve(inputSelector)) : null;
    let rangeActive = null;
    if (activeTab) rangeActive = activeTab.classList.contains('tp-ui-range-from') ? 'from' : 'to';
    return compact({
      open: !!m,
      theme: m ? m.dataset.theme : null,
      modalClass: m ? m.className : null,
      popover: m ? m.classList.contains('tp-ui-popover') : null,
      placement: m ? m.getAttribute('data-popover-placement') : null,
      title: txt('.tp-ui-select-time'),
      hour: q('.tp-ui-hour') ? q('.tp-ui-hour').value : null,
      minutes: q('.tp-ui-minutes') ? q('.tp-ui-minutes').value : null,
      seconds: q('.tp-ui-seconds') ? q('.tp-ui-seconds').value : null,
      hourActive: q('.tp-ui-hour') ? q('.tp-ui-hour').classList.contains('active') : null,
      minutesActive: q('.tp-ui-minutes') ? q('.tp-ui-minutes').classList.contains('active') : null,
      secondsActive: q('.tp-ui-seconds') ? q('.tp-ui-seconds').classList.contains('active') : null,
      hourReadonly: q('.tp-ui-hour') ? q('.tp-ui-hour').readOnly : null,
      ampm: txt('.tp-ui-type-mode.active'),
      wheelHours: wheel('hours'),
      wheelMinutes: wheel('minutes'),
      wheelSeconds: wheel('seconds'),
      wheelAmpm: wheel('ampm'),
      okDisabled: ok ? ok.getAttribute('aria-disabled') === 'true' || ok.classList.contains('disabled') : null,
      clearDisabled: clear ? clear.getAttribute('aria-disabled') === 'true' : null,
      rangeFrom: txt('.tp-ui-range-from-time'),
      rangeTo: txt('.tp-ui-range-to-time'),
      rangeActive,
      rangeToDisabled: q('.tp-ui-range-to') ? q('.tp-ui-range-to').getAttribute('aria-disabled') === 'true' : null,
      tzExpanded: tz ? tz.getAttribute('aria-expanded') : null,
      tzSelected: txt('.tp-ui-timezone-selected'),
      disabledTips: m
        ? Array.from(m.querySelectorAll('.tp-ui-value-tips.tp-ui-tips-disabled, .tp-ui-value-tips-24h.tp-ui-tips-disabled')).map(
            (s) => s.textContent.trim(),
          )
        : [],
      focusInModal: m ? m.contains(document.activeElement) : null,
      active: describe(document.activeElement),
      bodyOverflowY: document.body.style.overflowY,
      htmlOverflowY: document.documentElement.style.overflowY,
      inputValue: input ? input.value : null,
    });
  };
  const fingerprint = (rootSelector, ignoreSelector) => {
    const root = document.querySelector(resolve(rootSelector));
    if (!root) return { root: rootSelector, viewport: [innerWidth, innerHeight], count: 0, missing: true, nodes: [] };
    const ignored = ignoreSelector ? Array.from(document.querySelectorAll(ignoreSelector)) : [];
    const isIgnored = (el) => ignored.some((i) => i === el || i.contains(el));
    const pickSelector = '[class*="tp-ui"], button, input, select, [role], h1, h2, h3, pre, img, table, svg';
    const styleProps = [
      'display',
      'visibility',
      'opacity',
      'color',
      'background-color',
      'border-top-color',
      'border-top-width',
      'border-radius',
      'font-size',
      'font-weight',
      'line-height',
      'box-shadow',
      'transform',
      'z-index',
    ];
    const ariaProps = ['aria-selected', 'aria-pressed', 'aria-disabled', 'aria-expanded', 'aria-checked', 'disabled'];
    const base = root.getBoundingClientRect();
    const counters = {};
    const label = (el) => {
      const tp = Array.from(el.classList)
        .filter((c) => c.startsWith('tp-ui'))
        .sort();
      return el.tagName.toLowerCase() + (tp.length ? '.' + tp.join('.') : '');
    };
    const nodes = [];
    for (const el of [root, ...root.querySelectorAll(pickSelector)]) {
      if (isIgnored(el)) continue;
      const key = label(el);
      counters[key] = (counters[key] || 0) + 1;
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      const style = {};
      for (const p of styleProps) style[p] = cs.getPropertyValue(p);
      const aria = {};
      for (const a of ariaProps) if (el.hasAttribute(a)) aria[a] = el.getAttribute(a);
      nodes.push({
        el: key + '#' + counters[key],
        rect: [Math.round(r.left - base.left), Math.round(r.top - base.top), Math.round(r.width), Math.round(r.height)],
        text: el.children.length === 0 ? (el.textContent || '').trim().slice(0, 40) : undefined,
        value: el.tagName === 'INPUT' ? el.value : undefined,
        aria,
        style,
      });
    }
    return { root: rootSelector, viewport: [innerWidth, innerHeight], count: nodes.length, missing: false, nodes };
  };
  window.__tp = {
    async ready(selector, options = {}) {
      const el = await until(() => document.querySelector(selector), options.timeout || 20000);
      if (document.fonts && document.fonts.ready) await document.fonts.ready;
      if (options.shiki) await until(() => !document.querySelector('pre code[class*="language-"]'), 15000);
      if (options.extraWait) await sleep(options.extraWait);
      await frames();
      return { ready: !!el, selector };
    },
    hide(css) {
      addStyle('verify-hide', css);
      return { ok: true };
    },
    async top() {
      window.scrollTo(0, 0);
      await frames();
      return { ok: true };
    },
    async reveal(selector) {
      const el = document.querySelector(resolve(selector));
      if (!el) return { ok: false, error: 'not found: ' + selector };
      el.scrollIntoView({ block: 'center', behavior: 'instant' });
      await settle();
      return { ok: true };
    },
    async settle() {
      await settle();
      return { ok: true };
    },
    async wait(ms) {
      await sleep(ms);
      return { ok: true };
    },
    async open(selector) {
      const input = document.querySelector(resolve(selector));
      if (!input) return { ok: false, error: 'not found: ' + selector };
      input.scrollIntoView({ block: 'center', behavior: 'instant' });
      await frames();
      const p = center(input);
      if (!hits(input, p.x, p.y)) return { ok: false, error: 'covered by ' + describe(document.elementFromPoint(p.x, p.y)) };
      input.click();
      const m = await until(() => modal(), 3000);
      await settle();
      if (!m) return { ok: false, error: 'no modal opened' };
      return { ok: true, ...readState(selector) };
    },
    async tip(text) {
      const m = modal();
      if (!m) return { ok: false, error: 'no open modal' };
      await settle();
      const face = m.querySelector('.tp-ui-clock-face');
      const span = Array.from(m.querySelectorAll('.tp-ui-value-tips, .tp-ui-value-tips-24h')).find(
        (s) => s.offsetParent !== null && s.textContent.trim() === String(text),
      );
      if (!face || !span) return { ok: false, error: 'no visible tip ' + text };
      const p = center(span);
      const top = document.elementFromPoint(p.x, p.y);
      if (!top || !face.contains(top)) return { ok: false, error: 'tip covered by ' + describe(top) };
      const init = { bubbles: true, cancelable: true, view: window, clientX: p.x, clientY: p.y, button: 0 };
      face.dispatchEvent(new MouseEvent('mousedown', { ...init, buttons: 1 }));
      document.dispatchEvent(new MouseEvent('mouseup', { ...init, buttons: 0 }));
      await settle();
      return { ok: true, disabledTip: span.classList.contains('tp-ui-tips-disabled'), ...readState() };
    },
    async click(selector) {
      const el = document.querySelector(resolve(selector));
      if (!el) return { ok: false, error: 'not found: ' + selector };
      let p = center(el);
      if (!hits(el, p.x, p.y)) {
        el.scrollIntoView({ block: 'center', behavior: 'instant' });
        await frames();
        p = center(el);
      }
      if (!hits(el, p.x, p.y)) return { ok: false, error: 'not clickable, top: ' + describe(document.elementFromPoint(p.x, p.y)) };
      el.click();
      await settle();
      return { ok: true };
    },
    async backdrop() {
      const m = modal();
      if (!m) return { ok: false, error: 'no open modal' };
      const top = document.elementFromPoint(5, 5);
      if (top !== m) return { ok: false, error: 'backdrop not at 5,5: ' + describe(top) };
      m.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window, clientX: 5, clientY: 5 }));
      await settle();
      return { ok: true };
    },
    async outside() {
      await sleep(50);
      const init = { bubbles: true, cancelable: true, clientX: 5, clientY: 5, pointerType: 'mouse', isPrimary: true };
      document.body.dispatchEvent(new PointerEvent('pointerdown', init));
      document.body.dispatchEvent(new PointerEvent('pointerup', init));
      await settle();
      return { ok: true };
    },
    focus(selector) {
      const el = document.querySelector(resolve(selector));
      if (!el) return { ok: false, error: 'not found: ' + selector };
      el.focus();
      return { ok: document.activeElement === el, active: describe(document.activeElement) };
    },
    async type(selector, value) {
      const el = document.querySelector(resolve(selector));
      if (!el) return { ok: false, error: 'not found: ' + selector };
      el.focus();
      el.value = String(value);
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
      el.blur();
      await settle();
      return { ok: true, value: el.value };
    },
    async waitOpen(timeout = 3000) {
      const m = await until(() => modal(), timeout);
      await settle();
      return { open: !!m, ...readState() };
    },
    async waitClosed(timeout = 4000) {
      await until(() => !document.querySelector('body > .tp-ui-modal'), timeout);
      await sleep(100);
      return { closed: !document.querySelector('body > .tp-ui-modal') };
    },
    async waitText(selector, contains, timeout = 5000) {
      const found = await until(() => {
        const el = document.querySelector(selector);
        return !!el && el.textContent.includes(contains);
      }, timeout);
      return { ok: !!found };
    },
    state(inputSelector) {
      return readState(inputSelector);
    },
    value(selector) {
      const el = document.querySelector(resolve(selector));
      return { value: el ? el.value : null };
    },
    text(selector) {
      const el = document.querySelector(resolve(selector));
      return { text: el ? el.textContent.trim() : null };
    },
    errors() {
      return { errors: errors.slice() };
    },
    probe(id, value, options = {}) {
      const TP = findTimepicker();
      if (!TP) return { ok: false, error: 'TimepickerUI not found in the webpack module cache (lib demo only)' };
      if (probes[id]) return { ok: false, error: 'probe exists: ' + id };
      const host = document.createElement('div');
      const index = Object.keys(probes).length;
      host.style.cssText = `position:fixed;top:${8 + 44 * index}px;right:8px;z-index:4999;background:#fff;padding:4px`;
      const input = document.createElement('input');
      input.id = id;
      input.value = value;
      host.appendChild(input);
      document.body.appendChild(host);
      const log = [];
      const picker = new TP(input, options);
      picker.create();
      PROBE_EVENTS.forEach((name) => picker.on(name, () => log.push(name)));
      probes[id] = { picker, log, host };
      return { ok: true };
    },
    log(id) {
      const p = probes[id];
      return p ? { log: p.log.join(','), count: p.log.length } : { error: 'no probe ' + id };
    },
    clearLog(id) {
      const p = probes[id];
      if (p) p.log.length = 0;
      return { ok: !!p };
    },
    getValue(id) {
      const p = probes[id];
      return p ? { time: p.picker.getValue().time } : { error: 'no probe ' + id };
    },
    async clickTwice(selector, gap = 40) {
      const el = document.querySelector(resolve(selector));
      if (!el) return { ok: false, error: 'not found: ' + selector };
      el.click();
      await sleep(gap);
      el.click();
      return { ok: true };
    },
    async clickThen(first, second, gap = 60) {
      const a = document.querySelector(resolve(first));
      if (!a) return { ok: false, error: 'not found: ' + first };
      a.click();
      await sleep(gap);
      const b = document.querySelector(second);
      if (!b) return { ok: false, error: 'not found: ' + second };
      b.click();
      return { ok: true };
    },
    modalCount() {
      return { count: document.querySelectorAll('body > .tp-ui-modal').length };
    },
    fingerprint,
  };
})();
