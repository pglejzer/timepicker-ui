import ClockManager from '../../../src/managers/ClockManager';
import { CoreState } from '../../../src/timepicker/CoreState';
import { EventEmitter, type TimepickerEventMap } from '../../../src/utils/EventEmitter';
import { DEFAULT_OPTIONS, mergeOptions } from '../../../src/utils/options/defaults';

describe('ClockManager', () => {
  let coreState: CoreState;
  let emitter: EventEmitter<TimepickerEventMap>;
  let clockManager: ClockManager;
  let mockElement: HTMLElement;

  beforeEach(() => {
    mockElement = document.createElement('div');
    mockElement.innerHTML = '<input type="text" />';
    document.body.appendChild(mockElement);

    coreState = new CoreState(mockElement, DEFAULT_OPTIONS, 'test-instance-id');
    emitter = new EventEmitter();
    clockManager = new ClockManager(coreState, emitter);
  });

  afterEach(() => {
    clockManager.destroy();
    document.body.innerHTML = '';
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should create instance with CoreState and EventEmitter', () => {
      expect(clockManager).toBeInstanceOf(ClockManager);
    });

    it('should setup event listeners', () => {
      const newEmitter = new EventEmitter<TimepickerEventMap>();
      const onSpy = jest.spyOn(newEmitter, 'on');

      const newManager = new ClockManager(coreState, newEmitter);

      expect(onSpy).toHaveBeenCalled();

      newManager.destroy();
    });
  });

  describe('event listeners', () => {
    it('should respond to select:hour event', () => {
      expect(() => emitter.emit('select:hour', { hour: '09' })).not.toThrow();
    });

    it('should respond to select:minute event', () => {
      expect(() => emitter.emit('select:minute', { minutes: '30' })).not.toThrow();
    });

    it('should respond to select:am event', () => {
      expect(() => emitter.emit('select:am', {})).not.toThrow();
    });

    it('should respond to select:pm event', () => {
      expect(() => emitter.emit('select:pm', {})).not.toThrow();
    });

    it('should respond to animation:start event', () => {
      expect(() => emitter.emit('animation:start', {})).not.toThrow();
    });

    it('should respond to animation:end event', () => {
      expect(() => emitter.emit('animation:end', {})).not.toThrow();
    });

    it('should respond to range:switch event', () => {
      expect(() =>
        emitter.emit('range:switch', {
          active: 'from',
          disabledTime: { hours: ['01'], minutes: [] },
        }),
      ).not.toThrow();
    });

    it('should handle range:switch with null disabledTime', () => {
      expect(() =>
        emitter.emit('range:switch', {
          active: 'to',
          disabledTime: null,
        }),
      ).not.toThrow();
    });
  });

  describe('initializeClockSystem', () => {
    it('should not initialize if clock elements are missing', () => {
      jest.spyOn(coreState, 'getClockFace').mockReturnValue(null);

      expect(() => clockManager.initializeClockSystem()).not.toThrow();
    });

    it('should not initialize if tips wrapper is missing', () => {
      const clockFace = document.createElement('div');
      const clockHand = document.createElement('div');
      const circle = document.createElement('div');

      jest.spyOn(coreState, 'getClockFace').mockReturnValue(clockFace);
      jest.spyOn(coreState, 'getClockHand').mockReturnValue(clockHand);
      jest.spyOn(coreState, 'getCircle').mockReturnValue(circle);
      jest.spyOn(coreState, 'getTipsWrapper').mockReturnValue(null);

      expect(() => clockManager.initializeClockSystem()).not.toThrow();
    });

    it('should initialize clock system when all elements present', () => {
      const clockFace = document.createElement('div');
      const clockHand = document.createElement('div');
      const circle = document.createElement('div');
      const tipsWrapper = document.createElement('div');
      const hour = document.createElement('input') as HTMLInputElement;
      const minutes = document.createElement('input') as HTMLInputElement;

      hour.value = '09';
      minutes.value = '30';

      jest.spyOn(coreState, 'getClockFace').mockReturnValue(clockFace);
      jest.spyOn(coreState, 'getClockHand').mockReturnValue(clockHand);
      jest.spyOn(coreState, 'getCircle').mockReturnValue(circle);
      jest.spyOn(coreState, 'getTipsWrapper').mockReturnValue(tipsWrapper);
      jest.spyOn(coreState, 'getTipsWrapperFor24h').mockReturnValue(null);
      jest.spyOn(coreState, 'getHour').mockReturnValue(hour);
      jest.spyOn(coreState, 'getMinutes').mockReturnValue(minutes);
      jest.spyOn(coreState, 'getActiveTypeMode').mockReturnValue(null);
      jest.spyOn(coreState, 'getAM').mockReturnValue(null);
      jest.spyOn(coreState, 'getModalElement').mockReturnValue(null);

      expect(() => clockManager.initializeClockSystem()).not.toThrow();
    });

    it('should initialize 24h clock system', () => {
      const options24h = {
        ...DEFAULT_OPTIONS,
        clock: {
          ...DEFAULT_OPTIONS.clock,
          type: '24h' as const,
        },
      };

      const core24h = new CoreState(mockElement, options24h, 'test-24h');
      const manager24h = new ClockManager(core24h, emitter);

      const clockFace = document.createElement('div');
      const clockHand = document.createElement('div');
      const circle = document.createElement('div');
      const tipsWrapper = document.createElement('div');
      const tipsWrapper24h = document.createElement('div');
      const hour = document.createElement('input') as HTMLInputElement;
      const minutes = document.createElement('input') as HTMLInputElement;

      hour.value = '14';
      minutes.value = '30';

      jest.spyOn(core24h, 'getClockFace').mockReturnValue(clockFace);
      jest.spyOn(core24h, 'getClockHand').mockReturnValue(clockHand);
      jest.spyOn(core24h, 'getCircle').mockReturnValue(circle);
      jest.spyOn(core24h, 'getTipsWrapper').mockReturnValue(tipsWrapper);
      jest.spyOn(core24h, 'getTipsWrapperFor24h').mockReturnValue(tipsWrapper24h);
      jest.spyOn(core24h, 'getHour').mockReturnValue(hour);
      jest.spyOn(core24h, 'getMinutes').mockReturnValue(minutes);
      jest.spyOn(core24h, 'getActiveTypeMode').mockReturnValue(null);
      jest.spyOn(core24h, 'getAM').mockReturnValue(null);
      jest.spyOn(core24h, 'getModalElement').mockReturnValue(null);

      expect(() => manager24h.initializeClockSystem()).not.toThrow();

      manager24h.destroy();
    });

    it('should handle disabled time configuration', () => {
      const optionsWithDisabled = {
        ...DEFAULT_OPTIONS,
        clock: {
          ...DEFAULT_OPTIONS.clock,
          disabledTime: {
            hours: ['01', '02'],
            minutes: ['15', '45'],
          },
        },
      };

      const coreDisabled = new CoreState(mockElement, optionsWithDisabled, 'test-disabled');
      const managerDisabled = new ClockManager(coreDisabled, emitter);

      coreDisabled.setDisabledTime({
        value: {
          hours: ['01', '02'],
          minutes: ['15', '45'],
        },
      });

      const clockFace = document.createElement('div');
      const clockHand = document.createElement('div');
      const circle = document.createElement('div');
      const tipsWrapper = document.createElement('div');
      const hour = document.createElement('input') as HTMLInputElement;
      const minutes = document.createElement('input') as HTMLInputElement;

      jest.spyOn(coreDisabled, 'getClockFace').mockReturnValue(clockFace);
      jest.spyOn(coreDisabled, 'getClockHand').mockReturnValue(clockHand);
      jest.spyOn(coreDisabled, 'getCircle').mockReturnValue(circle);
      jest.spyOn(coreDisabled, 'getTipsWrapper').mockReturnValue(tipsWrapper);
      jest.spyOn(coreDisabled, 'getTipsWrapperFor24h').mockReturnValue(null);
      jest.spyOn(coreDisabled, 'getHour').mockReturnValue(hour);
      jest.spyOn(coreDisabled, 'getMinutes').mockReturnValue(minutes);
      jest.spyOn(coreDisabled, 'getActiveTypeMode').mockReturnValue(null);
      jest.spyOn(coreDisabled, 'getAM').mockReturnValue(null);
      jest.spyOn(coreDisabled, 'getModalElement').mockReturnValue(null);

      expect(() => managerDisabled.initializeClockSystem()).not.toThrow();

      managerDisabled.destroy();
    });

    it('should handle interval disabled time', () => {
      const coreInterval = new CoreState(mockElement, DEFAULT_OPTIONS, 'test-interval');
      const managerInterval = new ClockManager(coreInterval, emitter);

      coreInterval.setDisabledTime({
        value: {
          isInterval: true,
          intervals: ['09:00 - 12:00'],
        },
      });

      const clockFace = document.createElement('div');
      const clockHand = document.createElement('div');
      const circle = document.createElement('div');
      const tipsWrapper = document.createElement('div');
      const hour = document.createElement('input') as HTMLInputElement;
      const minutes = document.createElement('input') as HTMLInputElement;

      jest.spyOn(coreInterval, 'getClockFace').mockReturnValue(clockFace);
      jest.spyOn(coreInterval, 'getClockHand').mockReturnValue(clockHand);
      jest.spyOn(coreInterval, 'getCircle').mockReturnValue(circle);
      jest.spyOn(coreInterval, 'getTipsWrapper').mockReturnValue(tipsWrapper);
      jest.spyOn(coreInterval, 'getTipsWrapperFor24h').mockReturnValue(null);
      jest.spyOn(coreInterval, 'getHour').mockReturnValue(hour);
      jest.spyOn(coreInterval, 'getMinutes').mockReturnValue(minutes);
      jest.spyOn(coreInterval, 'getActiveTypeMode').mockReturnValue(null);
      jest.spyOn(coreInterval, 'getAM').mockReturnValue(null);
      jest.spyOn(coreInterval, 'getModalElement').mockReturnValue(null);

      expect(() => managerInterval.initializeClockSystem()).not.toThrow();

      managerInterval.destroy();
    });

    it('should call onHourChange callback', () => {
      const clockFace = document.createElement('div');
      const clockHand = document.createElement('div');
      const circle = document.createElement('div');
      const tipsWrapper = document.createElement('div');
      const hour = document.createElement('input') as HTMLInputElement;
      const minutes = document.createElement('input') as HTMLInputElement;
      const modal = document.createElement('div');
      const typeMode = document.createElement('button') as HTMLButtonElement;
      typeMode.textContent = 'AM';

      jest.spyOn(coreState, 'getClockFace').mockReturnValue(clockFace);
      jest.spyOn(coreState, 'getClockHand').mockReturnValue(clockHand);
      jest.spyOn(coreState, 'getCircle').mockReturnValue(circle);
      jest.spyOn(coreState, 'getTipsWrapper').mockReturnValue(tipsWrapper);
      jest.spyOn(coreState, 'getTipsWrapperFor24h').mockReturnValue(null);
      jest.spyOn(coreState, 'getHour').mockReturnValue(hour);
      jest.spyOn(coreState, 'getMinutes').mockReturnValue(minutes);
      jest.spyOn(coreState, 'getActiveTypeMode').mockReturnValue(typeMode);
      jest.spyOn(coreState, 'getAM').mockReturnValue(null);
      jest.spyOn(coreState, 'getModalElement').mockReturnValue(modal);

      clockManager.initializeClockSystem();
    });
  });

  describe('destroyClockSystem', () => {
    it('should safely destroy when clock system is null', () => {
      expect(() => clockManager.destroyClockSystem()).not.toThrow();
    });

    it('should destroy existing clock system', () => {
      const clockFace = document.createElement('div');
      const clockHand = document.createElement('div');
      const circle = document.createElement('div');
      const tipsWrapper = document.createElement('div');
      const hour = document.createElement('input') as HTMLInputElement;
      const minutes = document.createElement('input') as HTMLInputElement;

      jest.spyOn(coreState, 'getClockFace').mockReturnValue(clockFace);
      jest.spyOn(coreState, 'getClockHand').mockReturnValue(clockHand);
      jest.spyOn(coreState, 'getCircle').mockReturnValue(circle);
      jest.spyOn(coreState, 'getTipsWrapper').mockReturnValue(tipsWrapper);
      jest.spyOn(coreState, 'getTipsWrapperFor24h').mockReturnValue(null);
      jest.spyOn(coreState, 'getHour').mockReturnValue(hour);
      jest.spyOn(coreState, 'getMinutes').mockReturnValue(minutes);
      jest.spyOn(coreState, 'getActiveTypeMode').mockReturnValue(null);
      jest.spyOn(coreState, 'getAM').mockReturnValue(null);
      jest.spyOn(coreState, 'getModalElement').mockReturnValue(null);

      clockManager.initializeClockSystem();

      expect(() => clockManager.destroyClockSystem()).not.toThrow();
    });
  });

  describe('setOnStartCSSClassesIfClockType24h', () => {
    const innerRingClassesAfterStart = (
      type: '12h' | '24h',
      inputValue: string,
    ): { circle: boolean; hand: boolean } => {
      const core = new CoreState(mockElement, mergeOptions({ clock: { type } }), 'test-24h-id');
      const manager = new ClockManager(core, emitter);
      const input = document.createElement('input');
      input.value = inputValue;
      const circle = document.createElement('div');
      const clockHand = document.createElement('div');
      jest.spyOn(core, 'getInput').mockReturnValue(input);
      jest.spyOn(core, 'getCircle').mockReturnValue(circle);
      jest.spyOn(core, 'getClockHand').mockReturnValue(clockHand);

      manager.setOnStartCSSClassesIfClockType24h();
      manager.destroy();

      return {
        circle: circle.classList.contains('tp-ui-circle-hand-24h'),
        hand: clockHand.classList.contains('tp-ui-clock-hand-24h'),
      };
    };

    it.each(['14:30', '23:00', '00:00', '00:30'])(
      'should add both the circle and the hand 24h classes for a 24h start time of %s',
      (value) => {
        expect(innerRingClassesAfterStart('24h', value)).toEqual({ circle: true, hand: true });
      },
    );

    it.each(['01:00', '09:30', '12:00'])(
      'should add neither 24h class for a 24h start time of %s',
      (value) => {
        expect(innerRingClassesAfterStart('24h', value)).toEqual({ circle: false, hand: false });
      },
    );

    it('should add neither 24h class for a 12h clock', () => {
      expect(innerRingClassesAfterStart('12h', '14:30')).toEqual({ circle: false, hand: false });
    });

    it('should add neither 24h class for an empty input', () => {
      expect(innerRingClassesAfterStart('24h', '')).toEqual({ circle: false, hand: false });
    });

    it('should return early when input is null', () => {
      const core24h = new CoreState(mockElement, mergeOptions({ clock: { type: '24h' } }), 'test-24h-id');
      const manager24h = new ClockManager(core24h, emitter);

      jest.spyOn(core24h, 'getInput').mockReturnValue(null);

      expect(() => manager24h.setOnStartCSSClassesIfClockType24h()).not.toThrow();

      manager24h.destroy();
    });
  });

  describe('setClassActiveToHourOnOpen', () => {
    it('should add active class to hour input', () => {
      const hour = document.createElement('input') as HTMLInputElement;
      jest.spyOn(coreState, 'getHour').mockReturnValue(hour);

      clockManager.setClassActiveToHourOnOpen();

      expect(hour.classList.contains('active')).toBe(true);
    });

    it('should not add active class in mobile mode', () => {
      const mobileOptions = {
        ...DEFAULT_OPTIONS,
        ui: {
          ...DEFAULT_OPTIONS.ui,
          mobile: true,
        },
      };

      const mobileCore = new CoreState(mockElement, mobileOptions, 'test-mobile-id');
      const mobileManager = new ClockManager(mobileCore, emitter);

      const hour = document.createElement('input') as HTMLInputElement;
      jest.spyOn(mobileCore, 'getHour').mockReturnValue(hour);

      mobileManager.setClassActiveToHourOnOpen();

      expect(hour.classList.contains('active')).toBe(false);

      mobileManager.destroy();
    });

    it('should not add active class when isMobileView is true', () => {
      coreState.setIsMobileView(true);

      const hour = document.createElement('input') as HTMLInputElement;
      jest.spyOn(coreState, 'getHour').mockReturnValue(hour);

      clockManager.setClassActiveToHourOnOpen();

      expect(hour.classList.contains('active')).toBe(false);
    });
  });

  describe('with a mounted clock face', () => {
    const mountClock = (
      instanceId: string,
      hour: string,
      minutes: string,
      with24hRing = false,
    ): HTMLElement => {
      const modal = document.createElement('div');
      modal.dataset.ownerId = instanceId;
      modal.innerHTML = `
        <input class="tp-ui-hour" value="${hour}" />
        <input class="tp-ui-minutes" value="${minutes}" />
        <div class="tp-ui-clock-face">
          <div class="tp-ui-clock-hand"><div class="tp-ui-circle-hand"></div></div>
          <div class="tp-ui-tips-wrapper"></div>
          ${with24hRing ? '<div class="tp-ui-tips-wrapper-24h"></div>' : ''}
        </div>
      `;
      document.body.appendChild(modal);
      return modal;
    };

    const activeTips = (modal: HTMLElement): Array<string | null> =>
      [...modal.querySelectorAll('.tp-ui-value-tips.active, .tp-ui-value-tips-24h.active')].map(
        (tip) => tip.textContent,
      );

    const handAngle = (modal: HTMLElement): number => {
      const hand = modal.querySelector('.tp-ui-clock-hand') as HTMLElement;
      const match = /rotateZ\((-?[\d.]+)deg\)/.exec(hand.style.transform);
      return ((Number(match?.[1]) % 360) + 360) % 360;
    };

    const innerRing = (modal: HTMLElement): { circle: boolean; hand: boolean } => ({
      circle: modal.querySelector('.tp-ui-circle-hand')!.classList.contains('tp-ui-circle-hand-24h'),
      hand: modal.querySelector('.tp-ui-clock-hand')!.classList.contains('tp-ui-clock-hand-24h'),
    });

    describe('syncClockValue', () => {
      it('should return false before the clock system is initialized', () => {
        expect(clockManager.syncClockValue('03', '45', 'PM')).toBe(false);
      });

      it('should return true and move the hand and the active tip to the synced hour', () => {
        const modal = mountClock(coreState.instanceId, '09', '30');
        clockManager.initializeClockSystem();
        expect(activeTips(modal)).toEqual(['9']);

        expect(clockManager.syncClockValue('03', '45', 'PM')).toBe(true);

        expect(activeTips(modal)).toEqual(['3']);
        expect(handAngle(modal)).toBe(90);
      });

      it('should move a 24h hand onto the inner ring for an hour past 12 and back off it', () => {
        const core24h = new CoreState(mockElement, mergeOptions({ clock: { type: '24h' } }), 'sync-24h');
        const manager24h = new ClockManager(core24h, emitter);
        const modal = mountClock('sync-24h', '09', '30', true);
        manager24h.initializeClockSystem();

        manager24h.syncClockValue('15', '00');
        expect(activeTips(modal)).toEqual(['15']);
        expect(innerRing(modal)).toEqual({ circle: true, hand: true });

        manager24h.syncClockValue('09', '00');
        expect(activeTips(modal)).toEqual(['9']);
        expect(innerRing(modal)).toEqual({ circle: false, hand: false });

        manager24h.destroy();
      });

      describe('ring class writes on a 24h clock', () => {
        let emitter24h: EventEmitter<TimepickerEventMap>;
        let manager24h: ClockManager;

        const mountAt15 = (): HTMLElement => {
          emitter24h = new EventEmitter<TimepickerEventMap>();
          const core24h = new CoreState(mockElement, mergeOptions({ clock: { type: '24h' } }), 'sync-24h');
          manager24h = new ClockManager(core24h, emitter24h);
          const modal = mountClock('sync-24h', '15', '30', true);
          manager24h.initializeClockSystem();
          return modal;
        };

        type RingRecords = Record<'circle' | 'hand', number>;

        const ringClassRecords = (modal: HTMLElement, sync: () => void): RingRecords => {
          const circle = modal.querySelector('.tp-ui-circle-hand')!;
          const hand = modal.querySelector('.tp-ui-clock-hand')!;
          const observer = new MutationObserver(() => {});
          [circle, hand].forEach((target) =>
            observer.observe(target, { attributes: true, attributeFilter: ['class'] }),
          );

          sync();

          const records = observer.takeRecords();
          observer.disconnect();
          return {
            circle: records.filter((record) => record.target === circle).length,
            hand: records.filter((record) => record.target === hand).length,
          };
        };

        afterEach(() => {
          manager24h.destroy();
        });

        it('should write no ring class when the shown hour face stays on the inner ring', () => {
          const modal = mountAt15();
          expect(innerRing(modal)).toEqual({ circle: true, hand: true });

          const records = ringClassRecords(modal, () => manager24h.syncClockValue('14', '30'));

          expect(records).toEqual({ circle: 0, hand: 0 });
          expect(innerRing(modal)).toEqual({ circle: true, hand: true });
          expect(handAngle(modal)).toBe(60);
        });

        it('should write no ring class and keep the outer ring while the minute face is shown', () => {
          const modal = mountAt15();
          emitter24h.emit('select:minute', { minutes: '30' });
          expect(innerRing(modal)).toEqual({ circle: false, hand: false });

          const records = ringClassRecords(modal, () => manager24h.syncClockValue('14', '30'));

          expect(records).toEqual({ circle: 0, hand: 0 });
          expect(innerRing(modal)).toEqual({ circle: false, hand: false });
        });

        it('should write each ring class once when the shown hour moves to the outer ring', () => {
          const modal = mountAt15();

          const records = ringClassRecords(modal, () => manager24h.syncClockValue('09', '30'));

          expect(records).toEqual({ circle: 1, hand: 1 });
          expect(innerRing(modal)).toEqual({ circle: false, hand: false });
          expect(handAngle(modal)).toBe(270);
        });
      });
    });

    describe('selection events', () => {
      it('should switch to the minutes face on select:minute while the hour face is shown', () => {
        const modal = mountClock(coreState.instanceId, '09', '30');
        clockManager.initializeClockSystem();
        const onAnimation = jest.fn();
        emitter.on('animation:clock', onAnimation);

        emitter.emit('select:minute', { minutes: '40' });

        expect(onAnimation).toHaveBeenCalledTimes(1);
        expect(modal.querySelectorAll('.tp-ui-minutes-time')).toHaveLength(12);
        expect(modal.querySelectorAll('.tp-ui-hour-time-12')).toHaveLength(0);
        expect(activeTips(modal)).toEqual(['40']);
        expect(handAngle(modal)).toBe(240);
      });

      it('should switch back to the hour face on select:hour while the minutes face is shown', () => {
        const modal = mountClock(coreState.instanceId, '09', '30');
        clockManager.initializeClockSystem();
        emitter.emit('select:minute', { minutes: '40' });
        const onAnimation = jest.fn();
        emitter.on('animation:clock', onAnimation);

        emitter.emit('select:hour', { hour: '03' });

        expect(onAnimation).toHaveBeenCalledTimes(1);
        expect(modal.querySelectorAll('.tp-ui-hour-time-12')).toHaveLength(12);
        expect(activeTips(modal)).toEqual(['3']);
        expect(handAngle(modal)).toBe(90);
      });

      it('should step the shown hour face in place on select:hour, without animation:clock', () => {
        const modal = mountClock(coreState.instanceId, '09', '30');
        clockManager.initializeClockSystem();
        const tipsBefore = [...modal.querySelectorAll('.tp-ui-value-tips')];
        const onAnimation = jest.fn();
        emitter.on('animation:clock', onAnimation);

        emitter.emit('select:hour', { hour: '10' });

        expect(onAnimation).not.toHaveBeenCalled();
        const tipsAfter = [...modal.querySelectorAll('.tp-ui-value-tips')];
        expect(tipsAfter).toHaveLength(tipsBefore.length);
        tipsAfter.forEach((tip, index) => expect(tip).toBe(tipsBefore[index]));
        expect(activeTips(modal)).toEqual(['10']);
        expect(handAngle(modal)).toBe(300);
      });
    });
  });

  describe('destroy', () => {
    it('should destroy clock system', () => {
      const destroySpy = jest.spyOn(clockManager, 'destroyClockSystem');

      clockManager.destroy();

      expect(destroySpy).toHaveBeenCalled();
    });
  });
});
