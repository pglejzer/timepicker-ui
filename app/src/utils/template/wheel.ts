const TP_PADDING_COUNT = 2;

const pad = (value: number): string => String(value).padStart(2, '0');

const buildPadding = (): string =>
  Array.from({ length: TP_PADDING_COUNT })
    .map(() => '<div class="tp-ui-wheel-padding"></div>')
    .join('');

const buildItems = (values: ReadonlyArray<string>, labelPrefix: string, columnId: string): string =>
  values
    .map(
      (v) =>
        `<div class="tp-ui-wheel-item" role="option" id="${columnId}-${v}" data-value="${v}" aria-label="${labelPrefix} ${v}" aria-selected="false">${v}</div>`,
    )
    .join('');

const buildColumn = (
  className: string,
  ariaLabel: string,
  values: ReadonlyArray<string>,
  labelPrefix: string,
  columnId: string,
): string =>
  `<div class="tp-ui-wheel-column-wrapper at-start"><div class="tp-ui-wheel-column ${className}" role="listbox" aria-label="${ariaLabel}" aria-activedescendant="" tabindex="0">${buildPadding()}${buildItems(values, labelPrefix, columnId)}${buildPadding()}</div></div>`;

const generateHours12 = (): ReadonlyArray<string> => Array.from({ length: 12 }, (_, i) => pad(i + 1));

const generateHours24 = (): ReadonlyArray<string> => Array.from({ length: 24 }, (_, i) => pad(i));

const generateMinutes = (step: number): ReadonlyArray<string> =>
  Array.from({ length: Math.ceil(60 / step) }, (_, i) => pad(i * step));

const AMPM_VALUES: ReadonlyArray<string> = ['AM', 'PM'];

export interface WheelTemplateLabels {
  hourLabel?: string;
  minuteLabel?: string;
  periodLabel?: string;
}

export const getWheelTemplate = (
  clockType: '12h' | '24h',
  incrementMinutes: number,
  includeAmPmColumn: boolean = false,
  instanceId: string = 'tp',
  labels: WheelTemplateLabels = {},
): string => {
  const hourLabel = labels.hourLabel ?? 'Hour';
  const minuteLabel = labels.minuteLabel ?? 'Minute';
  const periodLabel = labels.periodLabel ?? 'Period';

  const hours = clockType === '12h' ? generateHours12() : generateHours24();

  const minutes = generateMinutes(incrementMinutes);

  const hoursColumn = buildColumn('tp-ui-wheel-hours', hourLabel, hours, hourLabel, `${instanceId}-wh`);

  const separator = '<div class="tp-ui-wheel-separator" aria-hidden="true">:</div>';

  const minutesColumn = buildColumn(
    'tp-ui-wheel-minutes',
    minuteLabel,
    minutes,
    minuteLabel,
    `${instanceId}-wm`,
  );

  const ampmColumn =
    includeAmPmColumn && clockType === '12h'
      ? buildColumn('tp-ui-wheel-ampm', periodLabel, AMPM_VALUES, periodLabel, `${instanceId}-wp`)
      : '';

  const highlight = '<div class="tp-ui-wheel-highlight" aria-hidden="true"></div>';

  return `<div class="tp-ui-wheel-container">${hoursColumn}${separator}${minutesColumn}${ampmColumn}${highlight}</div>`;
};
