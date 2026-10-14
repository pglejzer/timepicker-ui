import { pad } from '../time/parse';
import { isHourOnIncrement } from '../time/rules';
import { escapeHtml } from './escape';

const TP_PADDING_COUNT = 2;

const buildPadding = (): string =>
  Array.from({ length: TP_PADDING_COUNT })
    .map(() => '<div class="tp-ui-wheel-padding"></div>')
    .join('');

const buildItems = (
  values: ReadonlyArray<string>,
  texts: ReadonlyArray<string>,
  labelPrefix: string,
  columnId: string,
): string =>
  values
    .map(
      (v, index) =>
        `<div class="tp-ui-wheel-item" role="option" id="${columnId}-${v}" data-value="${v}" aria-label="${labelPrefix} ${texts[index]}" aria-selected="false">${texts[index]}</div>`,
    )
    .join('');

const buildColumn = (
  className: string,
  ariaLabel: string,
  values: ReadonlyArray<string>,
  labelPrefix: string,
  columnId: string,
  texts: ReadonlyArray<string> = values,
): string =>
  `<div class="tp-ui-wheel-column-wrapper at-start"><div class="tp-ui-wheel-column ${className}" role="listbox" aria-label="${ariaLabel}" aria-activedescendant="" tabindex="0">${buildPadding()}${buildItems(values, texts, labelPrefix, columnId)}${buildPadding()}</div></div>`;

const generateHours12 = (): ReadonlyArray<string> => Array.from({ length: 12 }, (_, i) => pad(i + 1));

const generateHours24 = (): ReadonlyArray<string> => Array.from({ length: 24 }, (_, i) => pad(i));

const generateMinutes = (step: number): ReadonlyArray<string> =>
  Array.from({ length: Math.ceil(60 / step) }, (_, i) => pad(i * step));

const AMPM_VALUES: ReadonlyArray<string> = ['AM', 'PM'];

export interface WheelTemplateLabels {
  hourLabel?: string;
  minuteLabel?: string;
  second?: string;
  periodLabel?: string;
  am?: string;
  pm?: string;
}

export const getWheelTemplate = (
  clockType: '12h' | '24h',
  incrementMinutes: number,
  includeAmPmColumn: boolean = false,
  instanceId: string = 'tp',
  labels: WheelTemplateLabels = {},
  seconds: { show: boolean; increment: number } = { show: false, increment: 1 },
  incrementHours: number = 1,
): string => {
  const hourLabel = escapeHtml(labels.hourLabel);
  const minuteLabel = escapeHtml(labels.minuteLabel);
  const secondLabel = escapeHtml(labels.second);
  const periodLabel = escapeHtml(labels.periodLabel);
  const id = escapeHtml(instanceId);

  const hours = (clockType === '12h' ? generateHours12() : generateHours24()).filter((hour) =>
    isHourOnIncrement(Number(hour), incrementHours || 1),
  );

  const minutes = generateMinutes(incrementMinutes);

  const hoursColumn = buildColumn('tp-ui-wheel-hours', hourLabel, hours, hourLabel, `${id}-wh`);

  const separator = '<div class="tp-ui-wheel-separator" aria-hidden="true">:</div>';

  const minutesColumn = buildColumn('tp-ui-wheel-minutes', minuteLabel, minutes, minuteLabel, `${id}-wm`);

  const secondsColumn = seconds.show
    ? separator +
      buildColumn(
        'tp-ui-wheel-seconds',
        secondLabel,
        generateMinutes(seconds.increment),
        secondLabel,
        `${id}-ws`,
      )
    : '';

  const periodTexts = [escapeHtml(labels.am), escapeHtml(labels.pm)];

  const ampmColumn =
    includeAmPmColumn && clockType === '12h'
      ? buildColumn(
          'tp-ui-wheel-ampm',
          periodLabel,
          AMPM_VALUES,
          periodLabel,
          `${id}-wp`,
          periodTexts,
        )
      : '';

  const highlight = '<div class="tp-ui-wheel-highlight" aria-hidden="true"></div>';

  return `<div class="tp-ui-wheel-container">${hoursColumn}${separator}${minutesColumn}${secondsColumn}${ampmColumn}${highlight}</div>`;
};
