import ClockFaceManager from './ClockFaceManager';

interface ClockFaceConfig {
  array?: string[];
  classToAdd?: string;
  clockFace?: HTMLElement;
  tipsWrapper?: HTMLElement;
  theme?: string;
  clockType?: string;
  disabledTime?: { isInterval?: boolean; intervals?: string[]; clockType?: string } | string[] | null;
  hour?: string;
  activeTypeMode?: string;
}

export default class ClockFaceManagerPool {
  private pool: ClockFaceManager[] = [];
  private maxSize = 5;

  acquire(config: ClockFaceConfig): ClockFaceManager {
    const instance = this.pool.pop();

    if (instance) {
      Object.assign(instance, config);
      return instance;
    }

    return new ClockFaceManager(config);
  }

  release(instance: ClockFaceManager): void {
    if (this.pool.length < this.maxSize) {
      this.pool.push(instance);
    }
  }

  clear(): void {
    this.pool = [];
  }
}
