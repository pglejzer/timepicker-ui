import { COLUMN_SELECTORS, WheelRenderer } from '@/managers/plugins/wheel/WheelRenderer';
import type { WheelTimeColumn } from '@/managers/plugins/wheel/WheelTypes';
import { CoreState, type CoreStateData } from '@/timepicker/CoreState';
import { getWheelTemplate } from '@/utils/template/wheel';
import { createWheelOptions } from './wheel-test-helpers';

type DisabledValue = NonNullable<NonNullable<CoreStateData['disabledTime']>['value']>;
type ItemState = [ariaDisabled: string | null, hasDisabledClass: boolean];

interface MountOptions {
  readonly disabled: DisabledValue;
  readonly hideDisabled?: boolean;
  readonly header?: { hour: string; minutes: string };
}

interface RendererHarness {
  readonly modal: HTMLDivElement;
  readonly core: CoreState;
  readonly renderer: WheelRenderer;
}

const INSTANCE_ID = 'wheel-aria-disabled-test';

const two = (value: number): string => String(value).padStart(2, '0');
const sequence = (length: number): string[] => Array.from({ length }, (_, index) => two(index));
const between = (from: number, to: number): string[] =>
  Array.from({ length: to - from + 1 }, (_, index) => two(from + index));

const HOURS_24 = sequence(24);
const SIXTY = sequence(60);

const mount = ({ disabled, hideDisabled = false, header }: MountOptions): RendererHarness => {
  const element = document.createElement('div');
  element.innerHTML = '<input type="text" />';
  document.body.appendChild(element);

  const options = createWheelOptions({
    clock: { type: '24h', showSeconds: true },
    wheel: { hideDisabled },
  });
  const core = new CoreState(element, options, INSTANCE_ID);
  core.setDisabledTime({ value: disabled });

  const { hour, minutes } = header ?? { hour: '12', minutes: '00' };
  const modal = document.createElement('div');
  modal.setAttribute('data-owner-id', INSTANCE_ID);
  modal.innerHTML =
    `<input class="tp-ui-hour" value="${hour}"><input class="tp-ui-minutes" value="${minutes}">` +
    '<input class="tp-ui-seconds" value="00">' +
    getWheelTemplate('24h', 1, false, INSTANCE_ID, {}, { show: true, increment: 1 });
  document.body.appendChild(modal);

  const renderer = new WheelRenderer(core);
  renderer.init();

  return { modal, core, renderer };
};

const itemStates = (modal: HTMLElement, column: WheelTimeColumn): Record<string, ItemState> =>
  Object.fromEntries(
    Array.from(modal.querySelectorAll<HTMLElement>(`${COLUMN_SELECTORS[column]} .tp-ui-wheel-item`)).map(
      (item) => [
        item.getAttribute('data-value') ?? '',
        [item.getAttribute('aria-disabled'), item.classList.contains('is-disabled')],
      ],
    ),
  );

const expectedStates = (values: string[], disabled: string[]): Record<string, ItemState> =>
  Object.fromEntries(
    values.map((value) => {
      const isDisabled = disabled.includes(value);
      return [value, [String(isDisabled), isDisabled]];
    }),
  );

describe('wheel items expose aria-disabled together with is-disabled', () => {
  let harness: RendererHarness | null = null;

  afterEach(() => {
    harness?.renderer.destroy();
    harness = null;
    document.body.innerHTML = '';
  });

  describe('flat disabled lists', () => {
    it('should mark listed hours, minutes and seconds aria-disabled="true" and every other item "false"', () => {
      harness = mount({ disabled: { hours: ['3', '5'], minutes: ['15', '30'], seconds: ['10', '20'] } });

      expect(itemStates(harness.modal, 'hours')).toEqual(expectedStates(HOURS_24, ['03', '05']));
      expect(itemStates(harness.modal, 'minutes')).toEqual(expectedStates(SIXTY, ['15', '30']));
      expect(itemStates(harness.modal, 'seconds')).toEqual(expectedStates(SIXTY, ['10', '20']));
    });

    it('should flip aria-disabled back to "false" when an hour is no longer listed', () => {
      harness = mount({ disabled: { hours: ['3', '5'] } });

      harness.core.setDisabledTime({ value: { hours: ['7'] } });
      harness.renderer.updateDisabledItems();

      expect(itemStates(harness.modal, 'hours')).toEqual(expectedStates(HOURS_24, ['07']));
    });
  });

  describe('disabled intervals', () => {
    it('should mark hours, minutes and seconds inside 09:00:00-12:30:15 aria-disabled="true" at 12:30', () => {
      harness = mount({
        disabled: { isInterval: true, clockType: '24h', intervals: ['09:00:00-12:30:15'] },
        header: { hour: '12', minutes: '30' },
      });

      expect(itemStates(harness.modal, 'hours')).toEqual(expectedStates(HOURS_24, between(9, 11)));
      expect(itemStates(harness.modal, 'minutes')).toEqual(expectedStates(SIXTY, between(0, 29)));
      expect(itemStates(harness.modal, 'seconds')).toEqual(expectedStates(SIXTY, between(0, 15)));
    });
  });

  describe('hideDisabled', () => {
    it('should bring hidden items back with aria-disabled="false" when the renderer restores them', () => {
      harness = mount({ disabled: { hours: ['3', '5'] }, hideDisabled: true });
      const shownHours = HOURS_24.filter((hour) => hour !== '03' && hour !== '05');
      expect(itemStates(harness.modal, 'hours')).toEqual(expectedStates(shownHours, []));

      harness.renderer.destroy();

      expect(itemStates(harness.modal, 'hours')).toEqual(expectedStates(HOURS_24, []));
    });

    it('should restore previously hidden items as enabled when the disabled hours change', () => {
      harness = mount({ disabled: { hours: ['3', '5'] }, hideDisabled: true });

      harness.core.setDisabledTime({ value: { hours: ['7'] } });
      harness.renderer.updateDisabledItems();

      const shownHours = HOURS_24.filter((hour) => hour !== '07');
      expect(itemStates(harness.modal, 'hours')).toEqual(expectedStates(shownHours, []));
    });
  });
});
