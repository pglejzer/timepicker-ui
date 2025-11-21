import type { Point } from '../types';

export class AngleEngine {
  private static normalizeAngle(angle: number): number {
    let normalized = angle % 360;
    if (normalized < 0) normalized += 360;
    return normalized;
  }

  static calculateRawAngle(pointer: Point, center: Point): number {
    const deltaX = pointer.x - center.x;
    const deltaY = pointer.y - center.y;
    const radians = Math.atan2(deltaY, deltaX);
    const degrees = (radians * 180) / Math.PI + 90;
    return this.normalizeAngle(degrees);
  }

  static snapToIncrement(angle: number, increment: number): number {
    const snapped = Math.round(angle / increment) * increment;
    return this.normalizeAngle(snapped);
  }

  static calculateDistance(point: Point, center: Point): number {
    const dx = point.x - center.x;
    const dy = point.y - center.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  static isInnerCircle(distance: number, radius: number): boolean {
    return distance < radius * 0.6;
  }

  static calculateShortestPath(currentAngle: number, targetAngle: number): number {
    const currentNormalized = this.normalizeAngle(currentAngle);
    const targetNormalized = this.normalizeAngle(targetAngle);

    const diff = targetNormalized - currentNormalized;
    const diffCW = diff >= 0 ? diff : diff + 360;
    const diffCCW = diff <= 0 ? diff : diff - 360;

    const shortestDiff = Math.abs(diffCW) < Math.abs(diffCCW) ? diffCW : diffCCW;
    return currentAngle + shortestDiff;
  }
}
