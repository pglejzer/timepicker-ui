import { ClockEngine } from '@/managers/clock/engine/ClockEngine';
import type { DisabledTimeConfig, EngineInput, EngineOutput, Point } from '@/managers/clock/types';

const CENTER: Point = { x: 100, y: 100 };
const RADIUS = 100;

const at = (degrees: number): Point => ({
  x: CENTER.x + RADIUS * Math.sin((degrees * Math.PI) / 180),
  y: CENTER.y - RADIUS * Math.cos((degrees * Math.PI) / 180),
});

const secondAt = (second: number): Point => at(second * 6);

const pick = (overrides: Partial<EngineInput>): EngineOutput =>
  ClockEngine.processPointerInput({
    pointerPosition: secondAt(15),
    clockCenter: CENTER,
    clockRadius: RADIUS,
    mode: 'seconds',
    clockType: '24h',
    amPm: '',
    disabledTime: null,
    incrementHours: 1,
    incrementMinutes: 1,
    incrementSeconds: 1,
    currentHour: '10',
    currentMinute: '00',
    showSeconds: true,
    ...overrides,
  });

describe('ClockEngine on the seconds face', () => {
  describe('pointer to second', () => {
    it('maps the pointer to a second with incrementSeconds, not incrementMinutes', () => {
      expect(pick({ incrementMinutes: 5, pointerPosition: at(96) })).toEqual(
        expect.objectContaining({ value: '16', angle: 96, isValid: true }),
      );
      expect(pick({ incrementSeconds: 15, pointerPosition: at(100) })).toEqual(
        expect.objectContaining({ value: '15', angle: 90, isValid: true }),
      );
    });

    it('places a second at the angle of the minute with the same number', () => {
      expect(ClockEngine.valueToAngle('45', 'seconds', '24h')).toBe(270);
      expect(ClockEngine.valueToAngle('00', 'seconds', '12h')).toBe(0);
    });
  });

  describe('disabled seconds', () => {
    it('rejects a second from disabledTime.seconds and points to the nearest valid one', () => {
      const output = pick({ disabledTime: { seconds: ['15'] } });

      expect(output.isValid).toBe(false);
      expect(output.value).toBe('16');
    });

    it('applies disabledTime.minutes to the current minute, not to the second with the same number', () => {
      const disabledTime: DisabledTimeConfig = { minutes: ['15'] };

      expect(pick({ disabledTime, currentMinute: '00' }).isValid).toBe(true);
      expect(pick({ disabledTime, currentMinute: '15', pointerPosition: secondAt(40) }).isValid).toBe(false);
    });

    it('evaluates a 24h interval with second edges in the current hour and minute', () => {
      const disabledTime: DisabledTimeConfig = {
        isInterval: true,
        intervals: ['10:00:10 - 10:00:20'],
        clockType: '24h',
      };

      expect(pick({ disabledTime }).isValid).toBe(false);
      expect(pick({ disabledTime, pointerPosition: secondAt(25) }).isValid).toBe(true);
      expect(pick({ disabledTime, currentMinute: '01' }).isValid).toBe(true);
    });

    it('evaluates a 12h interval crossing noon at second precision in both periods', () => {
      const disabledTime: DisabledTimeConfig = {
        isInterval: true,
        intervals: ['11:59:30 AM - 12:00:30 PM'],
        clockType: '12h',
      };
      const beforeNoon: Partial<EngineInput> = {
        clockType: '12h',
        amPm: 'AM',
        currentHour: '11',
        currentMinute: '59',
        disabledTime,
      };
      const afterNoon: Partial<EngineInput> = {
        clockType: '12h',
        amPm: 'PM',
        currentHour: '12',
        currentMinute: '00',
        disabledTime,
      };

      expect(pick({ ...beforeNoon, pointerPosition: secondAt(45) }).isValid).toBe(false);
      expect(pick({ ...beforeNoon, pointerPosition: secondAt(10) }).isValid).toBe(true);
      expect(pick({ ...afterNoon, pointerPosition: secondAt(15) }).isValid).toBe(false);
      expect(pick({ ...afterNoon, pointerPosition: secondAt(45) }).isValid).toBe(true);
    });
  });

  describe('range "to" face', () => {
    const from24h: DisabledTimeConfig = { rangeFromHour: 10, rangeFromMinute: 5, rangeFromSecond: 20 };

    it('disables seconds before "from" only in the "from" hour and minute', () => {
      const fromMinute: Partial<EngineInput> = { disabledTime: from24h, currentMinute: '05' };
      const output = pick({ ...fromMinute, pointerPosition: secondAt(10) });

      expect(output.isValid).toBe(false);
      expect(output.value).toBe('20');
      expect(pick({ ...fromMinute, pointerPosition: secondAt(20) }).isValid).toBe(true);
      expect(pick({ ...fromMinute, currentMinute: '06', pointerPosition: secondAt(10) }).isValid).toBe(true);
    });

    it('applies the same "from" limit on a 12h face', () => {
      const face: Partial<EngineInput> = {
        clockType: '12h',
        amPm: 'PM',
        currentHour: '02',
        pointerPosition: secondAt(10),
        disabledTime: { rangeFromType: 'PM', rangeFromHour: 2, rangeFromMinute: 30, rangeFromSecond: 15 },
      };

      expect(pick({ ...face, currentMinute: '30' }).isValid).toBe(false);
      expect(pick({ ...face, currentMinute: '31' }).isValid).toBe(true);
    });

    it('also disables seconds after "from" that fall inside a disabled interval', () => {
      const disabledTime: DisabledTimeConfig = {
        ...from24h,
        isInterval: true,
        intervals: ['10:05:30 - 10:05:40'],
        clockType: '24h',
      };

      expect(pick({ disabledTime, currentMinute: '05', pointerPosition: secondAt(35) }).isValid).toBe(false);
      expect(pick({ disabledTime, currentMinute: '05', pointerPosition: secondAt(25) }).isValid).toBe(true);
    });

    it('keeps disabledTime.seconds active in every minute, not only in the "from" minute', () => {
      const disabledTime: DisabledTimeConfig = { ...from24h, seconds: ['45'] };

      expect(pick({ disabledTime, currentMinute: '30', pointerPosition: secondAt(45) }).isValid).toBe(false);
      expect(pick({ disabledTime, currentMinute: '30', pointerPosition: secondAt(44) }).isValid).toBe(true);
    });
  });

  it('keeps the minute face unchanged for callers that do not show seconds', () => {
    const minuteFace: EngineInput = {
      pointerPosition: at(96),
      clockCenter: CENTER,
      clockRadius: RADIUS,
      mode: 'minutes',
      clockType: '24h',
      amPm: '',
      disabledTime: { minutes: ['17'], seconds: ['16'] },
      incrementHours: 1,
      incrementMinutes: 1,
      currentHour: '10',
    };

    expect(ClockEngine.processPointerInput(minuteFace)).toEqual(
      expect.objectContaining({ value: '16', angle: 96, index: 16, isValid: true }),
    );
    expect(ClockEngine.processPointerInput({ ...minuteFace, pointerPosition: at(102) })).toEqual(
      expect.objectContaining({ value: '18', isValid: false }),
    );
  });
});
