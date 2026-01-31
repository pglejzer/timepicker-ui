import { AngleEngine } from '../../../../../src/managers/clock/engine/AngleEngine';

describe('AngleEngine', () => {
  describe('calculateRawAngle', () => {
    it('should return 0 degrees for point directly above center', () => {
      const pointer = { x: 100, y: 50 };
      const center = { x: 100, y: 100 };

      const angle = AngleEngine.calculateRawAngle(pointer, center);

      expect(angle).toBe(0);
    });

    it('should return 90 degrees for point to the right of center', () => {
      const pointer = { x: 150, y: 100 };
      const center = { x: 100, y: 100 };

      const angle = AngleEngine.calculateRawAngle(pointer, center);

      expect(angle).toBe(90);
    });

    it('should return 180 degrees for point below center', () => {
      const pointer = { x: 100, y: 150 };
      const center = { x: 100, y: 100 };

      const angle = AngleEngine.calculateRawAngle(pointer, center);

      expect(angle).toBe(180);
    });

    it('should return 270 degrees for point to the left of center', () => {
      const pointer = { x: 50, y: 100 };
      const center = { x: 100, y: 100 };

      const angle = AngleEngine.calculateRawAngle(pointer, center);

      expect(angle).toBe(270);
    });

    it('should handle diagonal positions correctly', () => {
      const pointer = { x: 150, y: 50 };
      const center = { x: 100, y: 100 };

      const angle = AngleEngine.calculateRawAngle(pointer, center);

      expect(angle).toBe(45);
    });
  });

  describe('snapToIncrement', () => {
    it('should snap to nearest 30 degree increment for hours', () => {
      const angle = 47;
      const increment = 30;

      const snapped = AngleEngine.snapToIncrement(angle, increment);

      expect(snapped).toBe(60);
    });

    it('should snap to nearest 6 degree increment for minutes', () => {
      const angle = 25;
      const increment = 6;

      const snapped = AngleEngine.snapToIncrement(angle, increment);

      expect(snapped).toBe(24);
    });

    it('should return 0 for angle close to 360', () => {
      const angle = 355;
      const increment = 30;

      const snapped = AngleEngine.snapToIncrement(angle, increment);

      expect(snapped).toBe(0);
    });

    it('should handle exact multiples correctly', () => {
      const angle = 90;
      const increment = 30;

      const snapped = AngleEngine.snapToIncrement(angle, increment);

      expect(snapped).toBe(90);
    });
  });

  describe('calculateDistance', () => {
    it('should calculate correct distance between two points', () => {
      const point = { x: 150, y: 100 };
      const center = { x: 100, y: 100 };

      const distance = AngleEngine.calculateDistance(point, center);

      expect(distance).toBe(50);
    });

    it('should return 0 for same point', () => {
      const point = { x: 100, y: 100 };
      const center = { x: 100, y: 100 };

      const distance = AngleEngine.calculateDistance(point, center);

      expect(distance).toBe(0);
    });

    it('should calculate diagonal distance correctly', () => {
      const point = { x: 103, y: 104 };
      const center = { x: 100, y: 100 };

      const distance = AngleEngine.calculateDistance(point, center);

      expect(distance).toBe(5);
    });
  });

  describe('isInnerCircle', () => {
    it('should return true for distance less than 75% of radius', () => {
      const distance = 70;
      const radius = 100;

      const isInner = AngleEngine.isInnerCircle(distance, radius);

      expect(isInner).toBe(true);
    });

    it('should return false for distance greater than 75% of radius', () => {
      const distance = 80;
      const radius = 100;

      const isInner = AngleEngine.isInnerCircle(distance, radius);

      expect(isInner).toBe(false);
    });

    it('should return false for distance exactly at 75% of radius', () => {
      const distance = 75;
      const radius = 100;

      const isInner = AngleEngine.isInnerCircle(distance, radius);

      expect(isInner).toBe(false);
    });
  });

  describe('calculateShortestPath', () => {
    it('should return shortest clockwise path', () => {
      const current = 350;
      const target = 10;

      const result = AngleEngine.calculateShortestPath(current, target);

      expect(result).toBe(370);
    });

    it('should return shortest counter-clockwise path', () => {
      const current = 10;
      const target = 350;

      const result = AngleEngine.calculateShortestPath(current, target);

      expect(result).toBe(-10);
    });

    it('should handle same angles', () => {
      const current = 90;
      const target = 90;

      const result = AngleEngine.calculateShortestPath(current, target);

      expect(result).toBe(90);
    });

    it('should handle opposite angles', () => {
      const current = 0;
      const target = 180;

      const result = AngleEngine.calculateShortestPath(current, target);

      expect(Math.abs(result)).toBe(180);
    });
  });
});

