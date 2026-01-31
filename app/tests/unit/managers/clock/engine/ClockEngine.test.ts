import { ClockEngine } from '../../../../../src/managers/clock/engine/ClockEngine';
import type { EngineInput } from '../../../../../src/managers/clock/types';

describe('ClockEngine', () => {
  describe('processPointerInput', () => {
    describe('hours mode 12h', () => {
      it('should process pointer at 12 oclock position', () => {
        const input: EngineInput = {
          pointerPosition: { x: 100, y: 50 },
          clockCenter: { x: 100, y: 100 },
          clockRadius: 100,
          mode: 'hours',
          clockType: '12h',
          amPm: 'AM',
          disabledTime: null,
          incrementHours: 1,
          incrementMinutes: 1,
          smoothHourSnap: false,
        };

        const output = ClockEngine.processPointerInput(input);

        expect(output.value).toBe('12');
        expect(output.angle).toBe(0);
        expect(output.isValid).toBe(true);
      });

      it('should process pointer at 3 oclock position', () => {
        const input: EngineInput = {
          pointerPosition: { x: 150, y: 100 },
          clockCenter: { x: 100, y: 100 },
          clockRadius: 100,
          mode: 'hours',
          clockType: '12h',
          amPm: 'AM',
          disabledTime: null,
          incrementHours: 1,
          incrementMinutes: 1,
          smoothHourSnap: false,
        };

        const output = ClockEngine.processPointerInput(input);

        expect(output.value).toBe('03');
        expect(output.angle).toBe(90);
        expect(output.isValid).toBe(true);
      });

      it('should process pointer at 6 oclock position', () => {
        const input: EngineInput = {
          pointerPosition: { x: 100, y: 150 },
          clockCenter: { x: 100, y: 100 },
          clockRadius: 100,
          mode: 'hours',
          clockType: '12h',
          amPm: 'AM',
          disabledTime: null,
          incrementHours: 1,
          incrementMinutes: 1,
          smoothHourSnap: false,
        };

        const output = ClockEngine.processPointerInput(input);

        expect(output.value).toBe('06');
        expect(output.angle).toBe(180);
        expect(output.isValid).toBe(true);
      });
    });

    describe('hours mode 24h', () => {
      it('should detect outer circle for larger distance', () => {
        const input: EngineInput = {
          pointerPosition: { x: 100, y: 20 },
          clockCenter: { x: 100, y: 100 },
          clockRadius: 100,
          mode: 'hours',
          clockType: '24h',
          amPm: '',
          disabledTime: null,
          incrementHours: 1,
          incrementMinutes: 1,
          smoothHourSnap: false,
        };

        const output = ClockEngine.processPointerInput(input);

        expect(output.isInnerCircle).toBe(false);
        expect(output.isValid).toBe(true);
      });

      it('should detect inner circle for smaller distance', () => {
        const input: EngineInput = {
          pointerPosition: { x: 100, y: 60 },
          clockCenter: { x: 100, y: 100 },
          clockRadius: 100,
          mode: 'hours',
          clockType: '24h',
          amPm: '',
          disabledTime: null,
          incrementHours: 1,
          incrementMinutes: 1,
          smoothHourSnap: false,
        };

        const output = ClockEngine.processPointerInput(input);

        expect(output.isInnerCircle).toBe(true);
        expect(output.value).toBe('00');
        expect(output.isValid).toBe(true);
      });
    });

    describe('minutes mode', () => {
      it('should process pointer at 0 minutes position', () => {
        const input: EngineInput = {
          pointerPosition: { x: 100, y: 50 },
          clockCenter: { x: 100, y: 100 },
          clockRadius: 100,
          mode: 'minutes',
          clockType: '12h',
          amPm: 'AM',
          disabledTime: null,
          incrementHours: 1,
          incrementMinutes: 1,
          currentHour: '10',
        };

        const output = ClockEngine.processPointerInput(input);

        expect(output.value).toBe('00');
        expect(output.angle).toBe(0);
        expect(output.isValid).toBe(true);
      });

      it('should process pointer at 15 minutes position', () => {
        const input: EngineInput = {
          pointerPosition: { x: 150, y: 100 },
          clockCenter: { x: 100, y: 100 },
          clockRadius: 100,
          mode: 'minutes',
          clockType: '12h',
          amPm: 'AM',
          disabledTime: null,
          incrementHours: 1,
          incrementMinutes: 1,
          currentHour: '10',
        };

        const output = ClockEngine.processPointerInput(input);

        expect(output.value).toBe('15');
        expect(output.angle).toBe(90);
        expect(output.isValid).toBe(true);
      });

      it('should process pointer at 30 minutes position', () => {
        const input: EngineInput = {
          pointerPosition: { x: 100, y: 150 },
          clockCenter: { x: 100, y: 100 },
          clockRadius: 100,
          mode: 'minutes',
          clockType: '12h',
          amPm: 'AM',
          disabledTime: null,
          incrementHours: 1,
          incrementMinutes: 1,
          currentHour: '10',
        };

        const output = ClockEngine.processPointerInput(input);

        expect(output.value).toBe('30');
        expect(output.angle).toBe(180);
        expect(output.isValid).toBe(true);
      });

      it('should respect increment setting', () => {
        const input: EngineInput = {
          pointerPosition: { x: 115, y: 65 },
          clockCenter: { x: 100, y: 100 },
          clockRadius: 100,
          mode: 'minutes',
          clockType: '12h',
          amPm: 'AM',
          disabledTime: null,
          incrementHours: 1,
          incrementMinutes: 5,
          currentHour: '10',
        };

        const output = ClockEngine.processPointerInput(input);

        const minuteValue = parseInt(output.value, 10);
        expect(minuteValue % 5).toBe(0);
      });
    });

    describe('disabled time handling', () => {
      it('should mark disabled hours as invalid', () => {
        const input: EngineInput = {
          pointerPosition: { x: 150, y: 100 },
          clockCenter: { x: 100, y: 100 },
          clockRadius: 100,
          mode: 'hours',
          clockType: '12h',
          amPm: 'AM',
          disabledTime: {
            hours: ['03'],
          },
          incrementHours: 1,
          incrementMinutes: 1,
          smoothHourSnap: false,
        };

        const output = ClockEngine.processPointerInput(input);

        expect(output.value).not.toBe('03');
      });

      it('should mark disabled minutes as invalid', () => {
        const input: EngineInput = {
          pointerPosition: { x: 150, y: 100 },
          clockCenter: { x: 100, y: 100 },
          clockRadius: 100,
          mode: 'minutes',
          clockType: '12h',
          amPm: 'AM',
          disabledTime: {
            minutes: ['15'],
          },
          incrementHours: 1,
          incrementMinutes: 1,
          currentHour: '10',
        };

        const output = ClockEngine.processPointerInput(input);

        expect(output.value).not.toBe('15');
      });
    });
  });

  describe('valueToAngle', () => {
    describe('hours', () => {
      it('should convert hour 12 to angle 0 in 12h mode', () => {
        const angle = ClockEngine.valueToAngle('12', 'hours', '12h');
        expect(angle).toBe(0);
      });

      it('should convert hour 3 to angle 90 in 12h mode', () => {
        const angle = ClockEngine.valueToAngle('3', 'hours', '12h');
        expect(angle).toBe(90);
      });

      it('should convert hour 6 to angle 180 in 12h mode', () => {
        const angle = ClockEngine.valueToAngle('6', 'hours', '12h');
        expect(angle).toBe(180);
      });

      it('should convert hour 0 to angle 0 in 24h mode', () => {
        const angle = ClockEngine.valueToAngle('0', 'hours', '24h');
        expect(angle).toBe(0);
      });

      it('should convert hour 15 to angle 90 in 24h mode', () => {
        const angle = ClockEngine.valueToAngle('15', 'hours', '24h');
        expect(angle).toBe(90);
      });
    });

    describe('minutes', () => {
      it('should convert minute 0 to angle 0', () => {
        const angle = ClockEngine.valueToAngle('0', 'minutes', '12h');
        expect(angle).toBe(0);
      });

      it('should convert minute 15 to angle 90', () => {
        const angle = ClockEngine.valueToAngle('15', 'minutes', '12h');
        expect(angle).toBe(90);
      });

      it('should convert minute 30 to angle 180', () => {
        const angle = ClockEngine.valueToAngle('30', 'minutes', '12h');
        expect(angle).toBe(180);
      });

      it('should convert minute 45 to angle 270', () => {
        const angle = ClockEngine.valueToAngle('45', 'minutes', '12h');
        expect(angle).toBe(270);
      });
    });
  });
});

