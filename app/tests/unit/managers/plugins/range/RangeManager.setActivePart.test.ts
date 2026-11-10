import { mountRangeManager, type RangeHarness } from './range-test-helpers';

describe('RangeManager.setActivePart with focus: false', () => {
  let harness: RangeHarness | null = null;

  afterEach(() => {
    harness?.manager.destroy();
    harness = null;
    document.body.innerHTML = '';
  });

  const switchEvents = (h: RangeHarness): unknown[] =>
    h.events.filter((entry) => entry.event === 'range:switch').map((entry) => entry.payload);

  describe('linked (default)', () => {
    it('should switch to "to" once From is complete and emit range:switch', () => {
      harness = mountRangeManager({ clockType: '24h', linked: true });
      harness.manager.setRange('09:00', '17:00', false);
      harness.events.length = 0;

      expect(harness.manager.setActivePart('to', { focus: false })).toBe(true);

      expect(harness.manager.getActivePart()).toBe('to');
      expect(switchEvents(harness)).toEqual([expect.objectContaining({ active: 'to' })]);
      expect(harness.toTab.getAttribute('aria-selected')).toBe('true');
      expect(harness.hour.value).toBe('17');
    });

    it('should switch back to "from"', () => {
      harness = mountRangeManager({ clockType: '24h', linked: true });
      harness.manager.setRange('09:00', '17:00', false);
      harness.manager.setActivePart('to', { focus: false });
      harness.events.length = 0;

      expect(harness.manager.setActivePart('from', { focus: false })).toBe(true);

      expect(harness.manager.getActivePart()).toBe('from');
      expect(switchEvents(harness)).toEqual([expect.objectContaining({ active: 'from' })]);
    });

    it('should refuse "to" while From is incomplete', () => {
      harness = mountRangeManager({ clockType: '24h', linked: true });

      expect(harness.manager.setActivePart('to', { focus: false })).toBe(false);

      expect(harness.manager.getActivePart()).toBe('from');
      expect(switchEvents(harness)).toEqual([]);
    });

    it('should treat an unset linked option like linked: true', () => {
      harness = mountRangeManager({ clockType: '24h' });

      expect(harness.manager.setActivePart('to', { focus: false })).toBe(false);
      expect(harness.manager.getActivePart()).toBe('from');
    });

    it('should return true when the part is already active', () => {
      harness = mountRangeManager({ clockType: '24h' });

      expect(harness.manager.setActivePart('from', { focus: false })).toBe(true);
    });
  });

  describe('linked: false', () => {
    it('should allow "to" while From is incomplete', () => {
      harness = mountRangeManager({ clockType: '24h', linked: false });

      expect(harness.manager.setActivePart('to', { focus: false })).toBe(true);

      expect(harness.manager.getActivePart()).toBe('to');
      expect(switchEvents(harness)).toEqual([expect.objectContaining({ active: 'to' })]);
    });
  });

  describe('focus', () => {
    it('should not change document.activeElement', () => {
      harness = mountRangeManager({ clockType: '24h' });
      harness.manager.setRange('09:00', '17:00', false);
      harness.okButton.focus();

      harness.manager.setActivePart('to', { focus: false });

      expect(document.activeElement).toBe(harness.okButton);
    });

    it('should not dispatch click on the hour input', () => {
      harness = mountRangeManager({ clockType: '24h' });
      harness.manager.setRange('09:00', '17:00', false);
      const onClick = jest.fn();
      harness.hour.addEventListener('click', onClick);

      harness.manager.setActivePart('to', { focus: false });
      harness.manager.setActivePart('from', { focus: false });

      expect(onClick).not.toHaveBeenCalled();
    });

    it('should not blur the minutes input', () => {
      harness = mountRangeManager({ clockType: '24h' });
      harness.manager.setRange('09:00', '17:00', false);
      harness.minutes.focus();

      harness.manager.setActivePart('to', { focus: false });

      expect(document.activeElement).toBe(harness.minutes);
    });
  });

  describe('existing tab click path', () => {
    it('should still click the hour input when a tab is activated by the user', () => {
      harness = mountRangeManager({ clockType: '24h' });
      harness.manager.setRange('09:00', '17:00', false);
      const onClick = jest.fn();
      harness.hour.addEventListener('click', onClick);

      harness.toTab.click();

      expect(harness.manager.getActivePart()).toBe('to');
      expect(onClick).toHaveBeenCalled();
    });

    it('should still click the hour input for a click on the tab that is already active', () => {
      harness = mountRangeManager({ clockType: '24h' });
      harness.manager.setRange('09:00', '17:00', false);
      const onClick = jest.fn();
      harness.hour.addEventListener('click', onClick);

      harness.fromTab.click();

      expect(harness.manager.getActivePart()).toBe('from');
      expect(onClick).toHaveBeenCalledTimes(1);
      expect(harness.hour.value).toBe('09');
    });
  });

  describe('the dial stays put while the end does not change (P29)', () => {
    const QUIET_EVENTS = ['select:hour', 'select:minute', 'select:am', 'select:pm', 'update'] as const;

    const listenQuiet = (h: RangeHarness): string[] => {
      const heard: string[] = [];
      QUIET_EVENTS.forEach((event) => {
        h.emitter.on(event, () => {
          heard.push(event);
        });
      });
      return heard;
    };

    it('should return true for the active end without select:* or update and keep a typed hour', () => {
      harness = mountRangeManager({ clockType: '24h' });
      harness.hour.dispatchEvent(new KeyboardEvent('keydown', { key: '1', bubbles: true }));
      harness.hour.value = '11';
      harness.emitter.emit('update', { hour: '11', minutes: '00' });
      expect(harness.fromTime.textContent).toBe('11:--');
      const heard = listenQuiet(harness);

      expect(harness.manager.setActivePart('from', { focus: false })).toBe(true);

      expect(heard).toEqual([]);
      expect(harness.hour.value).toBe('11');
      expect(harness.fromTime.textContent).toBe('11:--');
      expect(harness.manager.getRange().from).toBeNull();
    });

    it('should still sync the dial with select:hour and update when the end changes', () => {
      harness = mountRangeManager({ clockType: '24h' });
      harness.manager.setRange('09:00', '17:00', false);
      const heard = listenQuiet(harness);
      const onSelectHour = jest.fn();
      harness.emitter.on('select:hour', onSelectHour);

      expect(harness.manager.setActivePart('to', { focus: false })).toBe(true);

      expect(heard).toEqual(['select:hour', 'update']);
      expect(onSelectHour).toHaveBeenCalledWith({ hour: '17' });
      expect(harness.hour.value).toBe('17');
    });
  });
});
