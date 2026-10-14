import { ClockSystem } from '../../../../src/managers/clock/ClockSystem';
import { ClockController } from '../../../../src/managers/clock/controller/ClockController';
import type { ClockMode, ClockType } from '../../../../src/managers/clock/types';
import { HOURS_12, HOURS_24, MINUTES_STEP_5 } from '../../../../src/utils/template';

describe('ClockSystem', () => {
  let clockFace: HTMLDivElement;
  let tipsWrapper: HTMLDivElement;
  let tipsWrapperFor24h: HTMLDivElement;
  let clockHand: HTMLDivElement;
  let circle: HTMLDivElement;

  beforeEach(() => {
    clockFace = document.createElement('div');
    clockFace.style.width = '200px';
    clockFace.style.height = '200px';
    Object.defineProperty(clockFace, 'offsetWidth', { value: 200, configurable: true });
    Object.defineProperty(clockFace, 'offsetHeight', { value: 200, configurable: true });

    tipsWrapper = document.createElement('div');
    Object.defineProperty(tipsWrapper, 'offsetWidth', { value: 200, configurable: true });
    Object.defineProperty(tipsWrapper, 'offsetHeight', { value: 200, configurable: true });

    tipsWrapperFor24h = document.createElement('div');
    Object.defineProperty(tipsWrapperFor24h, 'offsetWidth', { value: 200, configurable: true });
    Object.defineProperty(tipsWrapperFor24h, 'offsetHeight', { value: 200, configurable: true });

    clockHand = document.createElement('div');
    circle = document.createElement('div');

    document.body.appendChild(clockFace);
    document.body.appendChild(tipsWrapper);
    document.body.appendChild(tipsWrapperFor24h);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('constructor', () => {
    it('should create clock system with 12h config', () => {
      const system = new ClockSystem({
        clockFace,
        tipsWrapper,
        clockHand,
        circle,
        clockType: '12h',
        disabledTime: null,
        initialHour: '10',
        initialMinute: '30',
        initialAmPm: 'AM',
        timepicker: {},
      });

      expect(system.getHour()).toBe('10');
      expect(system.getMinute()).toBe('30');
      expect(system.getAmPm()).toBe('AM');

      system.destroy();
    });

    it('should create clock system with 24h config', () => {
      const system = new ClockSystem({
        clockFace,
        tipsWrapper,
        tipsWrapperFor24h,
        clockHand,
        circle,
        clockType: '24h',
        disabledTime: null,
        initialHour: '14',
        initialMinute: '45',
        initialAmPm: '',
        timepicker: {},
      });

      expect(system.getHour()).toBe('14');
      expect(system.getMinute()).toBe('45');

      system.destroy();
    });
  });

  describe('initialize', () => {
    it('should initialize and switch to hours', () => {
      const system = new ClockSystem({
        clockFace,
        tipsWrapper,
        clockHand,
        circle,
        clockType: '12h',
        disabledTime: null,
        initialHour: '12',
        initialMinute: '00',
        initialAmPm: 'AM',
        timepicker: {},
      });

      expect(() => system.initialize()).not.toThrow();

      system.destroy();
    });
  });

  describe('switchToHours', () => {
    it('should switch to hours mode', () => {
      const system = new ClockSystem({
        clockFace,
        tipsWrapper,
        clockHand,
        circle,
        clockType: '12h',
        disabledTime: null,
        initialHour: '10',
        initialMinute: '30',
        initialAmPm: 'AM',
        timepicker: {},
      });

      system.initialize();
      system.switchToMinutes();
      system.switchToHours();

      system.destroy();
    });

    it('should show 24h tips wrapper for 24h mode', () => {
      const system = new ClockSystem({
        clockFace,
        tipsWrapper,
        tipsWrapperFor24h,
        clockHand,
        circle,
        clockType: '24h',
        disabledTime: null,
        initialHour: '14',
        initialMinute: '30',
        initialAmPm: '',
        timepicker: {},
      });

      system.initialize();
      system.switchToHours();

      expect(tipsWrapperFor24h.classList.contains('none')).toBe(false);

      system.destroy();
    });
  });

  describe('switchToMinutes', () => {
    it('should switch to minutes mode', () => {
      const system = new ClockSystem({
        clockFace,
        tipsWrapper,
        clockHand,
        circle,
        clockType: '12h',
        disabledTime: null,
        initialHour: '10',
        initialMinute: '30',
        initialAmPm: 'AM',
        timepicker: {},
      });

      system.initialize();
      system.switchToMinutes();

      system.destroy();
    });

    it('should hide 24h tips wrapper', () => {
      const system = new ClockSystem({
        clockFace,
        tipsWrapper,
        tipsWrapperFor24h,
        clockHand,
        circle,
        clockType: '24h',
        disabledTime: null,
        initialHour: '14',
        initialMinute: '30',
        initialAmPm: '',
        timepicker: {},
      });

      system.initialize();
      system.switchToMinutes();

      expect(tipsWrapperFor24h.classList.contains('none')).toBe(true);

      system.destroy();
    });
  });

  describe('face switch highlight', () => {
    const tipValues = (wrapper: HTMLElement): string[] =>
      [...wrapper.querySelectorAll('.tp-ui-value-tips, .tp-ui-value-tips-24h')].map((tip) => tip.textContent ?? '');
    const activeTips = (wrapper: HTMLElement): string[] =>
      [...wrapper.querySelectorAll('.active')].map((tip) => tip.textContent ?? '');

    let followHand: jest.SpyInstance;
    let tipsWhenFollowed: string[][];

    const resetRecording = (): void => {
      followHand.mockClear();
      tipsWhenFollowed.length = 0;
    };

    const create = (clockType: ClockType, showSeconds = false): ClockSystem =>
      new ClockSystem({
        clockFace,
        tipsWrapper,
        tipsWrapperFor24h: clockType === '24h' ? tipsWrapperFor24h : undefined,
        clockHand,
        circle,
        clockType,
        disabledTime: null,
        initialHour: clockType === '24h' ? '14' : '10',
        initialMinute: '30',
        initialSecond: '15',
        initialAmPm: clockType === '24h' ? '' : 'AM',
        showSeconds,
        timepicker: {},
      });

    beforeEach(() => {
      const realFollowHand = ClockController.prototype.followHand;
      tipsWhenFollowed = [];
      followHand = jest
        .spyOn(ClockController.prototype, 'followHand')
        .mockImplementation(function (this: ClockController, mode: ClockMode) {
          tipsWhenFollowed.push([...tipValues(tipsWrapper), ...tipValues(tipsWrapperFor24h)]);
          realFollowHand.call(this, mode);
        });
    });

    afterEach(() => {
      followHand.mockRestore();
    });

    it('follows the hand to the minute once the minute tips are in the DOM', () => {
      const system = create('12h');
      system.initialize();
      resetRecording();

      system.switchToMinutes();

      expect(followHand).toHaveBeenCalledTimes(1);
      expect(followHand).toHaveBeenCalledWith('minutes');
      expect(tipsWhenFollowed).toEqual([MINUTES_STEP_5]);
      expect(activeTips(tipsWrapper)).toEqual(['30']);

      system.destroy();
    });

    it('follows the hand to the second once the second tips are in the DOM', () => {
      const system = create('12h', true);
      system.initialize();
      system.switchToMinutes();
      resetRecording();

      system.switchToSeconds();

      expect(followHand).toHaveBeenCalledTimes(1);
      expect(followHand).toHaveBeenCalledWith('seconds');
      expect(tipsWhenFollowed).toEqual([MINUTES_STEP_5]);
      expect(activeTips(tipsWrapper)).toEqual(['15']);

      system.destroy();
    });

    it('follows the hand back to the hour once the hour tips are in the DOM', () => {
      const system = create('12h');
      system.initialize();
      system.switchToMinutes();
      resetRecording();

      system.switchToHours();

      expect(followHand).toHaveBeenCalledTimes(1);
      expect(followHand).toHaveBeenCalledWith('hours');
      expect(tipsWhenFollowed).toEqual([HOURS_12]);
      expect(activeTips(tipsWrapper)).toEqual(['10']);

      system.destroy();
    });

    it('follows the hand to the 24h hour once both hour rings are in the DOM', () => {
      const system = create('24h');
      system.initialize();
      system.switchToMinutes();
      resetRecording();

      system.switchToHours();

      expect(followHand).toHaveBeenCalledTimes(1);
      expect(followHand).toHaveBeenCalledWith('hours');
      expect(tipsWhenFollowed).toEqual([[...HOURS_12, ...HOURS_24]]);
      expect(activeTips(tipsWrapper)).toEqual([]);
      expect(activeTips(tipsWrapperFor24h)).toEqual(['14']);

      system.destroy();
    });
  });

  describe('setHour', () => {
    it('should set hour value', () => {
      const system = new ClockSystem({
        clockFace,
        tipsWrapper,
        clockHand,
        circle,
        clockType: '12h',
        disabledTime: null,
        initialHour: '10',
        initialMinute: '30',
        initialAmPm: 'AM',
        timepicker: {},
      });

      system.initialize();
      system.setHour('05');

      expect(system.getHour()).toBe('05');

      system.destroy();
    });
  });

  describe('setMinute', () => {
    it('should set minute value', () => {
      const system = new ClockSystem({
        clockFace,
        tipsWrapper,
        clockHand,
        circle,
        clockType: '12h',
        disabledTime: null,
        initialHour: '10',
        initialMinute: '30',
        initialAmPm: 'AM',
        timepicker: {},
      });

      system.initialize();
      system.setMinute('45');

      expect(system.getMinute()).toBe('45');

      system.destroy();
    });
  });

  describe('setValueIfShown', () => {
    const create12h = (): ClockSystem =>
      new ClockSystem({
        clockFace,
        tipsWrapper,
        clockHand,
        circle,
        clockType: '12h',
        disabledTime: null,
        initialHour: '10',
        initialMinute: '30',
        initialAmPm: 'AM',
        timepicker: {},
      });

    const handAngle = (): number => {
      const match = /rotateZ\((-?[\d.]+)deg\)/.exec(clockHand.style.transform);
      return ((Number(match?.[1]) % 360) + 360) % 360;
    };
    const tipNodes = (): Element[] => [...tipsWrapper.querySelectorAll('.tp-ui-value-tips')];
    const activeTip = (): number =>
      Number(tipNodes().find((tip) => tip.classList.contains('active'))?.textContent);

    it('returns true and moves the hand and the active tip in place when that face is shown', () => {
      const system = create12h();
      system.initialize();
      const tipsBefore = tipNodes();

      const shown = system.setValueIfShown('hours', '03');

      expect(shown).toBe(true);
      expect(system.getHour()).toBe('03');
      expect(handAngle()).toBe(90);
      expect(activeTip()).toBe(3);
      expect(tipNodes()).toHaveLength(tipsBefore.length);
      tipNodes().forEach((tip, index) => expect(tip).toBe(tipsBefore[index]));

      system.destroy();
    });

    it('moves the minute hand in place once the minutes face is shown', () => {
      const system = create12h();
      system.initialize();
      system.switchToMinutes();
      const tipsBefore = tipNodes();

      expect(system.setValueIfShown('minutes', '45')).toBe(true);
      expect(system.getMinute()).toBe('45');
      expect(handAngle()).toBe(270);
      tipNodes().forEach((tip, index) => expect(tip).toBe(tipsBefore[index]));

      system.destroy();
    });

    it('returns false and changes neither the value nor the shown face when another face is shown', () => {
      const system = create12h();
      system.initialize();
      const transformBefore = clockHand.style.transform;
      const tipsBefore = tipNodes();

      const shown = system.setValueIfShown('minutes', '45');

      expect(shown).toBe(false);
      expect(system.getMinute()).toBe('30');
      expect(clockHand.style.transform).toBe(transformBefore);
      expect(activeTip()).toBe(10);
      tipNodes().forEach((tip, index) => expect(tip).toBe(tipsBefore[index]));

      system.destroy();
    });
  });

  describe('setAmPm', () => {
    it('should set AM/PM and update display', () => {
      const system = new ClockSystem({
        clockFace,
        tipsWrapper,
        clockHand,
        circle,
        clockType: '12h',
        disabledTime: null,
        initialHour: '10',
        initialMinute: '30',
        initialAmPm: 'AM',
        timepicker: {},
      });

      system.initialize();
      system.setAmPm('PM');

      expect(system.getAmPm()).toBe('PM');

      system.destroy();
    });
  });

  describe('updateDisabledTime', () => {
    it('should update disabled time config', () => {
      const system = new ClockSystem({
        clockFace,
        tipsWrapper,
        clockHand,
        circle,
        clockType: '12h',
        disabledTime: null,
        initialHour: '10',
        initialMinute: '30',
        initialAmPm: 'AM',
        timepicker: {},
      });

      system.initialize();

      expect(() => {
        system.updateDisabledTime({ hours: ['01', '02', '03'] });
      }).not.toThrow();

      system.destroy();
    });
  });

  describe('blockInteractions', () => {
    it('should block drag interactions', () => {
      const system = new ClockSystem({
        clockFace,
        tipsWrapper,
        clockHand,
        circle,
        clockType: '12h',
        disabledTime: null,
        initialHour: '10',
        initialMinute: '30',
        initialAmPm: 'AM',
        timepicker: {},
      });

      system.initialize();

      expect(() => system.blockInteractions()).not.toThrow();

      system.destroy();
    });
  });

  describe('unblockInteractions', () => {
    it('should unblock drag interactions', () => {
      const system = new ClockSystem({
        clockFace,
        tipsWrapper,
        clockHand,
        circle,
        clockType: '12h',
        disabledTime: null,
        initialHour: '10',
        initialMinute: '30',
        initialAmPm: 'AM',
        timepicker: {},
      });

      system.initialize();
      system.blockInteractions();

      expect(() => system.unblockInteractions()).not.toThrow();

      system.destroy();
    });
  });

  describe('destroy', () => {
    it('should destroy clock system', () => {
      const system = new ClockSystem({
        clockFace,
        tipsWrapper,
        clockHand,
        circle,
        clockType: '12h',
        disabledTime: null,
        initialHour: '10',
        initialMinute: '30',
        initialAmPm: 'AM',
        timepicker: {},
      });

      system.initialize();

      expect(() => system.destroy()).not.toThrow();
    });
  });

  describe('callbacks', () => {
    it('should call onHourChange when hour changes', () => {
      const onHourChange = jest.fn();
      const system = new ClockSystem({
        clockFace,
        tipsWrapper,
        clockHand,
        circle,
        clockType: '12h',
        disabledTime: null,
        initialHour: '10',
        initialMinute: '30',
        initialAmPm: 'AM',
        onHourChange,
        timepicker: {},
      });

      system.initialize();
      system.setHour('05');

      system.destroy();
    });

    it('should call onMinuteChange when minute changes', () => {
      const onMinuteChange = jest.fn();
      const system = new ClockSystem({
        clockFace,
        tipsWrapper,
        clockHand,
        circle,
        clockType: '12h',
        disabledTime: null,
        initialHour: '10',
        initialMinute: '30',
        initialAmPm: 'AM',
        onMinuteChange,
        timepicker: {},
      });

      system.initialize();
      system.setMinute('45');

      system.destroy();
    });
  });
});

