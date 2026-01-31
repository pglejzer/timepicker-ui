import { ClockSystem } from '../../../../src/managers/clock/ClockSystem';

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

