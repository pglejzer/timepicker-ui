import { getWheelTemplate } from '../../../../src/utils/template/wheel';

describe('getWheelTemplate', () => {
  describe('12h mode', () => {
    it('should return a string containing the wheel container', () => {
      const html = getWheelTemplate('12h', 1);
      expect(html).toContain('tp-ui-wheel-container');
    });

    it('should contain hours column with 12 items', () => {
      const html = getWheelTemplate('12h', 1);
      expect(html).toContain('tp-ui-wheel-hours');

      const container = document.createElement('div');
      container.innerHTML = html;
      const hours = container.querySelectorAll('.tp-ui-wheel-hours .tp-ui-wheel-item');
      expect(hours.length).toBe(12);
    });

    it('should have hour values from 01 to 12', () => {
      const html = getWheelTemplate('12h', 1);
      const container = document.createElement('div');
      container.innerHTML = html;
      const items = container.querySelectorAll('.tp-ui-wheel-hours .tp-ui-wheel-item');

      expect(items[0].getAttribute('data-value')).toBe('01');
      expect(items[11].getAttribute('data-value')).toBe('12');
    });

    it('should contain minutes column with 60 items for step 1', () => {
      const html = getWheelTemplate('12h', 1);
      const container = document.createElement('div');
      container.innerHTML = html;
      const minutes = container.querySelectorAll('.tp-ui-wheel-minutes .tp-ui-wheel-item');
      expect(minutes.length).toBe(60);
    });

    it('should contain minutes column with 12 items for step 5', () => {
      const html = getWheelTemplate('12h', 5);
      const container = document.createElement('div');
      container.innerHTML = html;
      const minutes = container.querySelectorAll('.tp-ui-wheel-minutes .tp-ui-wheel-item');
      expect(minutes.length).toBe(12);
    });

    it('should contain minutes column with 4 items for step 15', () => {
      const html = getWheelTemplate('12h', 15);
      const container = document.createElement('div');
      container.innerHTML = html;
      const minutes = container.querySelectorAll('.tp-ui-wheel-minutes .tp-ui-wheel-item');
      expect(minutes.length).toBe(4);
    });

    it('should contain a separator with colon', () => {
      const html = getWheelTemplate('12h', 1);
      expect(html).toContain('tp-ui-wheel-separator');
      expect(html).toContain(':');
    });

    it('should contain a highlight element', () => {
      const html = getWheelTemplate('12h', 1);
      expect(html).toContain('tp-ui-wheel-highlight');
    });
  });

  describe('24h mode', () => {
    it('should contain 24 hour items', () => {
      const html = getWheelTemplate('24h', 1);
      const container = document.createElement('div');
      container.innerHTML = html;
      const hours = container.querySelectorAll('.tp-ui-wheel-hours .tp-ui-wheel-item');
      expect(hours.length).toBe(24);
    });

    it('should have hour values from 00 to 23', () => {
      const html = getWheelTemplate('24h', 1);
      const container = document.createElement('div');
      container.innerHTML = html;
      const items = container.querySelectorAll('.tp-ui-wheel-hours .tp-ui-wheel-item');

      expect(items[0].getAttribute('data-value')).toBe('00');
      expect(items[23].getAttribute('data-value')).toBe('23');
    });
  });

  describe('column wrapper structure', () => {
    it('should wrap each column in a tp-ui-wheel-column-wrapper', () => {
      const html = getWheelTemplate('12h', 1);
      const container = document.createElement('div');
      container.innerHTML = html;

      const wrappers = container.querySelectorAll('.tp-ui-wheel-column-wrapper');
      expect(wrappers.length).toBe(2);
    });

    it('should set at-start class on wrappers by default', () => {
      const html = getWheelTemplate('12h', 1);
      const container = document.createElement('div');
      container.innerHTML = html;

      const wrappers = container.querySelectorAll('.tp-ui-wheel-column-wrapper');
      wrappers.forEach((wrapper) => {
        expect(wrapper.classList.contains('at-start')).toBe(true);
      });
    });

    it('should have the column as a direct child of the wrapper', () => {
      const html = getWheelTemplate('12h', 1);
      const container = document.createElement('div');
      container.innerHTML = html;

      const hoursWrapper = container.querySelector('.tp-ui-wheel-column-wrapper');
      expect(hoursWrapper?.firstElementChild?.classList.contains('tp-ui-wheel-column')).toBe(true);
    });
  });

  describe('padding elements', () => {
    it('should include padding items before and after hour items', () => {
      const html = getWheelTemplate('12h', 1);
      const container = document.createElement('div');
      container.innerHTML = html;

      const hoursCol = container.querySelector('.tp-ui-wheel-hours');
      const paddings = hoursCol?.querySelectorAll('.tp-ui-wheel-padding');
      expect(paddings?.length).toBe(4);
    });
  });

  describe('accessibility attributes', () => {
    it('should set role=listbox on columns', () => {
      const html = getWheelTemplate('12h', 1);
      const container = document.createElement('div');
      container.innerHTML = html;

      const columns = container.querySelectorAll('.tp-ui-wheel-column');
      columns.forEach((col) => {
        expect(col.getAttribute('role')).toBe('listbox');
      });
    });

    it('should set role=option on items', () => {
      const html = getWheelTemplate('12h', 1);
      const container = document.createElement('div');
      container.innerHTML = html;

      const items = container.querySelectorAll('.tp-ui-wheel-item');
      items.forEach((item) => {
        expect(item.getAttribute('role')).toBe('option');
      });
    });

    it('should set aria-label on items', () => {
      const html = getWheelTemplate('12h', 1);
      const container = document.createElement('div');
      container.innerHTML = html;

      const firstHour = container.querySelector('.tp-ui-wheel-hours .tp-ui-wheel-item');
      expect(firstHour?.getAttribute('aria-label')).toBe('Hour 01');

      const firstMinute = container.querySelector('.tp-ui-wheel-minutes .tp-ui-wheel-item');
      expect(firstMinute?.getAttribute('aria-label')).toBe('Minute 00');
    });

    it('should mark separator and highlight as aria-hidden', () => {
      const html = getWheelTemplate('12h', 1);
      const container = document.createElement('div');
      container.innerHTML = html;

      const separator = container.querySelector('.tp-ui-wheel-separator');
      expect(separator?.getAttribute('aria-hidden')).toBe('true');

      const highlight = container.querySelector('.tp-ui-wheel-highlight');
      expect(highlight?.getAttribute('aria-hidden')).toBe('true');
    });

    it('should set tabindex on columns', () => {
      const html = getWheelTemplate('12h', 1);
      const container = document.createElement('div');
      container.innerHTML = html;

      const columns = container.querySelectorAll('.tp-ui-wheel-column');
      columns.forEach((col) => {
        expect(col.getAttribute('tabindex')).toBe('0');
      });
    });
  });
});

