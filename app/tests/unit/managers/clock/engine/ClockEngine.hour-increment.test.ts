import { ClockEngine } from '@/managers/clock/engine/ClockEngine';
import type { EngineInput, EngineOutput, Point } from '@/managers/clock/types';

const CENTER: Point = { x: 100, y: 100 };
const RADIUS = 100;
const INNER_RING = 50;

const at = (degrees: number, distance: number = RADIUS): Point => ({
  x: CENTER.x + distance * Math.sin((degrees * Math.PI) / 180),
  y: CENTER.y - distance * Math.cos((degrees * Math.PI) / 180),
});

const pickHour = (overrides: Partial<EngineInput>): EngineOutput =>
  ClockEngine.processPointerInput({
    pointerPosition: at(0),
    clockCenter: CENTER,
    clockRadius: RADIUS,
    mode: 'hours',
    clockType: '12h',
    amPm: 'AM',
    disabledTime: null,
    incrementHours: 1,
    incrementMinutes: 1,
    smoothHourSnap: true,
    ...overrides,
  });

describe('ClockEngine hour face with incrementHours', () => {
  describe('smooth hour snap', () => {
    it('picks the nearest hour on the grid and keeps the hand at the raw pointer angle', () => {
      const output = pickHour({ incrementHours: 2, pointerPosition: at(90) });

      expect(output.value).toBe('04');
      expect(output.angle).toBe(90);
      expect(output.isValid).toBe(true);
    });

    it('picks the lower grid hour when the pointer is nearer to it', () => {
      const output = pickHour({ incrementHours: 2, pointerPosition: at(70) });

      expect(output.value).toBe('02');
      expect(output.angle).toBeCloseTo(70, 6);
      expect(output.isValid).toBe(true);
    });

    it.each([
      [100, '03'],
      [130, '03'],
    ])('12h with incrementHours 3: pointer at %i degrees selects %s', (degrees, expected) => {
      const output = pickHour({ incrementHours: 3, pointerPosition: at(degrees) });

      expect(output.value).toBe(expected);
      expect(output.isValid).toBe(true);
    });

    it('keeps every hour selectable with incrementHours 1', () => {
      const output = pickHour({ incrementHours: 1, pointerPosition: at(100) });

      expect(output.value).toBe('03');
      expect(output.angle).toBeCloseTo(100, 6);
      expect(output.isValid).toBe(true);
    });
  });

  describe('without smooth hour snap', () => {
    it('snaps both the value and the hand to the grid hour', () => {
      const output = pickHour({ incrementHours: 2, smoothHourSnap: false, pointerPosition: at(70) });

      expect(output.value).toBe('02');
      expect(output.angle).toBe(60);
      expect(output.isValid).toBe(true);
    });
  });

  describe('24h', () => {
    it.each([
      ['inner', INNER_RING, '16', true],
      ['outer', RADIUS, '04', false],
    ])('incrementHours 2 on the %s ring at 90 degrees selects %s', (_ring, distance, expected, isInner) => {
      const output = pickHour({
        clockType: '24h',
        amPm: '',
        incrementHours: 2,
        pointerPosition: at(90, distance),
      });

      expect(output.value).toBe(expected);
      expect(output.isInnerCircle).toBe(isInner);
      expect(output.isValid).toBe(true);
    });
  });

  describe('disabled hours', () => {
    it.each([true, false])(
      'skips a disabled grid hour to the next grid hour, never an off-grid one (smoothHourSnap %s)',
      (smoothHourSnap) => {
        const output = pickHour({
          incrementHours: 2,
          smoothHourSnap,
          disabledTime: { hours: ['04'] },
          pointerPosition: at(120),
        });

        expect(output.value).toBe('06');
      },
    );

    it('moves the snapped hand to the grid hour it falls back to', () => {
      const output = pickHour({
        incrementHours: 2,
        smoothHourSnap: false,
        disabledTime: { hours: ['04'] },
        pointerPosition: at(120),
      });

      expect(output.angle).toBe(180);
    });
  });
});
