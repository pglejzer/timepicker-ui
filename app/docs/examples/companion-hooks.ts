import { TimepickerUI } from './setup';
import type { TimeOfDay } from '../../src/index';

const byId = <T extends HTMLElement>(id: string): T | null => document.getElementById(id) as T | null;

const onClick = (id: string, handler: () => void): void => {
  byId<HTMLButtonElement>(id)?.addEventListener('click', handler);
};

const write = (id: string, text: string): void => {
  const element = byId(id);
  if (element) element.textContent = text;
};

const setupEmbedded = (): void => {
  const dialog = byId<HTMLDialogElement>('ch-embedded-dialog');
  if (!dialog) return;
  let picker: TimepickerUI | null = null;

  onClick('ch-embedded-open', () => {
    dialog.showModal();
    if (picker) return;
    picker = new TimepickerUI('#ch-embedded-input', {
      ui: { inline: { enabled: true, container: '#ch-embedded-container', embedded: true, autoUpdate: true } },
    });
    picker.create();
  });
  onClick('ch-embedded-close', () => dialog.close());
};

const setupRange = (): void => {
  if (!byId('ch-range-input') || !byId('ch-range-overnight')) return;

  const picker = new TimepickerUI('#ch-range-input', {
    clock: { type: '24h' },
    range: { enabled: true },
  });
  picker.create();

  const overnight = new TimepickerUI('#ch-range-overnight', {
    clock: { type: '24h' },
    range: { enabled: true, linked: false, minDuration: 30 },
  });
  overnight.create();

  const show = (label: string, source: TimepickerUI): void => {
    write('ch-range-output', `${label}\n${JSON.stringify(source.getRange(), null, 2)}`);
  };

  onClick('ch-range-set', () => {
    picker.setRange({ from: '09:00', to: '17:00' });
    show('setRange 09:00 - 17:00', picker);
  });
  onClick('ch-range-get', () => show('getRange()', picker));
  onClick('ch-range-to', () => {
    picker.open();
    const switched = picker.setActivePart('to');
    write('ch-range-output', `setActivePart('to') → ${switched}`);
  });
  onClick('ch-range-overnight-set', () => {
    overnight.setRange({ from: '22:00', to: '01:00' });
    show('linked: false, setRange 22:00 - 01:00', overnight);
  });
};

const setupDisabled = (): void => {
  if (!byId('ch-disabled-input')) return;
  let lunchBreak = false;

  const isTimeDisabled = ({ hour }: TimeOfDay): boolean => {
    if (hour < 9 || hour >= 17) return true;
    return lunchBreak && hour === 12;
  };

  const picker = new TimepickerUI('#ch-disabled-input', {
    clock: { type: '24h', isTimeDisabled },
    ui: { inline: { enabled: true, container: '#ch-disabled-container', autoUpdate: true } },
  });
  picker.create();

  const describe = (): void => write('ch-disabled-state', `Lunch break: ${lunchBreak ? 'on' : 'off'}`);
  describe();

  onClick('ch-disabled-lunch', () => {
    lunchBreak = !lunchBreak;
    picker.refreshDisabledTime();
    describe();
  });
};

const setupEvents = (): void => {
  if (!byId('ch-events-input')) return;
  const picker = new TimepickerUI('#ch-events-input');
  picker.create();

  const lines: string[] = [];
  const log = (line: string): void => {
    lines.unshift(line);
    write('ch-events-log', lines.slice(0, 6).join('\n'));
  };

  let unsubscribe: (() => void) | null = null;

  onClick('ch-events-sub', () => {
    if (unsubscribe) return;
    unsubscribe = picker.on('confirm', (data) => log(`confirm ${JSON.stringify(data)}`));
    log('subscribed');
  });
  onClick('ch-events-unsub', () => {
    if (!unsubscribe) return;
    unsubscribe();
    unsubscribe = null;
    log('unsubscribed');
  });
};

const setupHidden = (): void => {
  const wrap = byId('ch-hidden-wrap');
  if (!wrap) return;

  const picker = new TimepickerUI('#ch-hidden-input', {
    ui: { inline: { enabled: true, container: '#ch-hidden-container', autoUpdate: true } },
  });
  picker.create();

  onClick('ch-hidden-show', () => {
    wrap.hidden = false;
  });
  onClick('ch-hidden-rerender', () => picker.setOptions({}));
};

setupEmbedded();
setupRange();
setupDisabled();
setupEvents();
setupHidden();
