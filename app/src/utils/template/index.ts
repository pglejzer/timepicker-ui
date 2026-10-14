import type { TimepickerOptions } from '../../types/options';
import keyboardSvg from '../../../assets/keyboard.svg';
import scheduleSvg from '../../../assets/schedule.svg';
import { PluginRegistry } from '../../core/PluginRegistry';
import { DEFAULT_OPTIONS } from '../options/defaults';
import { escapeHtml as text } from './escape';

export const HOURS_24 = ['00', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
export const HOURS_12 = ['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
export const MINUTES_STEP_5 = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];

interface TemplateConfig {
  mobileClass: string;
  clockType: string;
  instanceId: string;
  isWheelMode: boolean;
  isCompactWheel: boolean;
  isRangeMode: boolean;
}

const buildTimezoneSelector = (
  options: Required<TimepickerOptions>,
  mobileClass: string,
  instanceId: string,
): string => {
  const {
    timezone: { enabled: tzEnabled, label },
  } = options;

  if (!tzEnabled || !PluginRegistry.has('timezone')) return '';

  const tzLabel = text(label ?? DEFAULT_OPTIONS.timezone.label);
  const id = text(instanceId);

  return `<div class="tp-ui-timezone ${mobileClass}">
        <span class="tp-ui-timezone-label" id="tp-tz-label-${id}">${tzLabel}</span>
        <div class="tp-ui-timezone-dropdown" role="combobox" aria-expanded="false" aria-haspopup="listbox" aria-labelledby="tp-tz-label-${id}" tabindex="0" data-tz-id="${id}">
          <div class="tp-ui-timezone-selected" data-md3-ripple data-placeholder="${tzLabel}...">${tzLabel}...</div>
          <svg class="tp-ui-timezone-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          <div class="tp-ui-timezone-menu" role="listbox" aria-labelledby="tp-tz-label-${id}"></div>
        </div>
      </div>`;
};

const buildRangeSelector = (options: Required<TimepickerOptions>): string => {
  const {
    range: { enabled: rangeEnabled, fromLabel, toLabel },
    labels: { rangeSelectionLabel },
  } = options;

  if (!rangeEnabled || !PluginRegistry.has('range')) return '';

  return `<div class="tp-ui-range-header" role="tablist" aria-label="${text(rangeSelectionLabel)}"><button type="button" class="tp-ui-range-tab tp-ui-range-from active" data-md3-ripple role="tab" tabindex="0" aria-selected="true"><span class="tp-ui-range-tab-label">${text(fromLabel)}</span><span class="tp-ui-range-tab-value tp-ui-range-from-time" aria-hidden="true">--:--</span></button><button type="button" class="tp-ui-range-tab tp-ui-range-to" data-md3-ripple role="tab" tabindex="-1" aria-selected="false"><span class="tp-ui-range-tab-label">${text(toLabel)}</span><span class="tp-ui-range-tab-value tp-ui-range-to-time" aria-hidden="true">--:--</span></button></div>`;
};

const buildClearButton = (options: Required<TimepickerOptions>, mobileClass: string): string => {
  const {
    ui: { clearButton: clearButtonEnabled },
    labels: { clear },
  } = options;

  if (!clearButtonEnabled) return '';

  const clearLabel = text(clear);

  return `<div class="tp-ui-clear-btn ${mobileClass} disabled" data-md3-ripple tabindex="0" role="button" aria-label="${clearLabel}" aria-disabled="true">${clearLabel}</div>`;
};

const buildPickerBody = (
  config: TemplateConfig,
  incrementMinutes: number,
  options: Required<TimepickerOptions>,
): string => {
  if (config.isWheelMode) {
    const wheelTemplateProvider = PluginRegistry.getTemplateProvider('wheel');
    if (wheelTemplateProvider) {
      return `<div class="tp-ui-mobile-clock-wrapper ${config.mobileClass}">${wheelTemplateProvider(options, config.instanceId)}</div>`;
    }
    return `<div class="tp-ui-mobile-clock-wrapper ${config.mobileClass}"></div>`;
  }

  const { clockLabel } = options.labels;

  return `<div class="tp-ui-mobile-clock-wrapper ${config.mobileClass}"><div class="tp-ui-body ${config.mobileClass}" role="group" aria-label="${text(clockLabel)}"><div class="tp-ui-clock-face ${config.mobileClass}" role="slider" tabindex="0"><div class="tp-ui-dot ${config.mobileClass}" aria-hidden="true"></div><div class="tp-ui-clock-hand ${config.mobileClass}" aria-hidden="true"><div class="tp-ui-circle-hand ${config.mobileClass}"></div></div><div class="tp-ui-tips-wrapper ${config.mobileClass}" aria-hidden="true"></div>${config.clockType === '24h' ? `<div class="tp-ui-tips-wrapper-24h ${config.mobileClass}" aria-hidden="true"></div>` : ''}</div></div></div>`;
};

interface TimeFieldConfig {
  name: 'hour' | 'minutes' | 'seconds';
  inputClass: string;
  textClass: string;
  min: string;
  max: string;
  valueNow: string;
  valueText: string;
  label: string | undefined;
  mobileLabel: string | undefined;
}

const SIXTY_RANGE = { min: '0', max: '59', valueNow: '0', valueText: '00' };

const buildColon = (mobileClass: string): string =>
  `<div class="tp-ui-dots ${mobileClass}" aria-hidden="true"><span></span><span></span></div>`;

const buildTimeField = (field: TimeFieldConfig, mobileClass: string, readonly: boolean): string => {
  const caption = text(field.mobileLabel);
  const ariaLabel = mobileClass ? caption : text(field.label);

  return `<div class="tp-ui-input-wrapper ${mobileClass}"><div class="tp-ui-input-ripple-wrapper ${mobileClass}" data-md3-ripple><input name="${field.name}" ${readonly ? 'readonly' : ''} class="${field.inputClass} ${mobileClass}" tabindex="0" type="number" min="${field.min}" max="${field.max}" aria-label="${ariaLabel}" role="spinbutton" aria-valuemin="${field.min}" aria-valuemax="${field.max}" aria-valuenow="${field.valueNow}" aria-valuetext="${field.valueText}"></div><div class="${field.textClass} ${mobileClass}">${caption}</div></div>`;
};

const buildHeader = (options: Required<TimepickerOptions>, config: TemplateConfig): string => {
  const {
    labels,
    ui: { editable },
    clock: { showSeconds },
  } = options;
  const { mobileClass, clockType, instanceId } = config;
  const headingText = text(mobileClass ? labels.mobileTime : labels.time);
  const timeLabel = text(labels.timeLabel);
  const amLabel = text(labels.am);
  const pmLabel = text(labels.pm);
  const periodLabel = text(labels.periodLabel);

  const is12h = clockType === '12h';
  const hourValueNow = is12h ? '12' : '0';

  const fields: TimeFieldConfig[] = [
    {
      name: 'hour',
      inputClass: 'tp-ui-hour',
      textClass: 'tp-ui-hour-text',
      min: is12h ? '1' : '0',
      max: is12h ? '12' : '23',
      valueNow: hourValueNow,
      valueText: hourValueNow,
      label: labels.hourLabel,
      mobileLabel: labels.mobileHour,
    },
    {
      name: 'minutes',
      inputClass: 'tp-ui-minutes',
      textClass: 'tp-ui-minute-text',
      ...SIXTY_RANGE,
      label: labels.minuteLabel,
      mobileLabel: labels.mobileMinute,
    },
  ];

  if (showSeconds) {
    fields.push({
      name: 'seconds',
      inputClass: 'tp-ui-seconds',
      textClass: 'tp-ui-second-text',
      ...SIXTY_RANGE,
      label: labels.second,
      mobileLabel: labels.second,
    });
  }

  const readonly = !editable && !mobileClass;
  const timeFields = fields
    .map((field) => buildTimeField(field, mobileClass, readonly))
    .join(buildColon(mobileClass));

  const periodSelector =
    clockType !== '24h'
      ? `<div class="tp-ui-wrapper-type-time ${mobileClass}" role="group" aria-label="${periodLabel}"><div class="tp-ui-type-mode tp-ui-am ${mobileClass}" data-md3-ripple tabindex="0" role="button" aria-label="${amLabel}" aria-pressed="false" data-type="AM">${amLabel}</div><div class="tp-ui-type-mode tp-ui-pm ${mobileClass}" data-md3-ripple tabindex="0" role="button" aria-label="${pmLabel}" aria-pressed="false" data-type="PM">${pmLabel}</div></div>`
      : '';

  return `<div class="tp-ui-select-time ${mobileClass}" id="tp-ui-label-${text(instanceId)}">${headingText}</div><div class="tp-ui-header ${mobileClass}"><div class="tp-ui-wrapper-time ${mobileClass} ${clockType === '24h' ? 'tp-ui-wrapper-time-24h' : ''}" role="group" aria-label="${timeLabel}">${timeFields}</div>${periodSelector}</div>`;
};

const buildSwitchButton = (label: string | undefined, icon: string): string =>
  `<button aria-label="${text(label)}" type="button" class="tp-ui-keyboard-icon">${icon}</button>`;

const buildFooter = (options: Required<TimepickerOptions>, mobileClass: string): string => {
  const {
    ui: { enableSwitchIcon, iconTemplate, iconTemplateMobile },
    labels,
  } = options;
  const cancelLabel = text(labels.cancel);
  const okLabel = text(labels.ok);

  const switchButton = mobileClass
    ? buildSwitchButton(labels.switchToClockLabel, iconTemplateMobile || scheduleSvg)
    : buildSwitchButton(labels.switchToKeyboardLabel, iconTemplate || keyboardSvg);

  const switchIcon = enableSwitchIcon
    ? `<div class="tp-ui-keyboard-icon-wrapper ${mobileClass}" data-md3-ripple data-view="desktop">${switchButton}</div>`
    : '';

  const clearButton = buildClearButton(options, mobileClass);

  return `<div class="tp-ui-footer ${mobileClass}" ${mobileClass ? 'data-view="mobile"' : ''}>${switchIcon}<div class="tp-ui-wrapper-btn ${mobileClass}">${clearButton}<div class="tp-ui-cancel-btn ${mobileClass}" data-md3-ripple tabindex="0" role="button" aria-label="${cancelLabel}">${cancelLabel}</div><div class="tp-ui-ok-btn ${mobileClass}" data-md3-ripple tabindex="0" role="button" aria-label="${okLabel}">${okLabel}</div></div></div>`;
};

export const getModalTemplate = (options: Required<TimepickerOptions>, instanceId: string): string => {
  const {
    ui: { mode: pickerMode, animation, theme, mobile },
    clock: { incrementMinutes, showSeconds },
  } = options;

  const mobileClass = !!mobile ? 'mobile' : '';
  const isCompactWheel = pickerMode === 'compact-wheel' && PluginRegistry.has('wheel');
  const isWheelMode = (pickerMode === 'wheel' || isCompactWheel) && PluginRegistry.has('wheel');
  const isRangeMode = !!options.range?.enabled && PluginRegistry.has('range');
  const isTzMode = !!options.timezone?.enabled && PluginRegistry.has('timezone');

  const config: TemplateConfig = {
    mobileClass,
    clockType: options.clock.type || '12h',
    instanceId,
    isWheelMode,
    isCompactWheel,
    isRangeMode,
  };

  const rangeSelector = buildRangeSelector(options);
  const timezoneSelector = buildTimezoneSelector(options, mobileClass, instanceId);
  const header = isCompactWheel ? '' : buildHeader(options, config);
  const pickerBody = buildPickerBody(config, incrementMinutes ?? 1, options);
  const footer =
    isCompactWheel && options.wheel?.hideFooter === true ? '' : buildFooter(options, mobileClass);

  let wheelClass;

  if (isCompactWheel) {
    wheelClass = ' tp-ui-compact-wheel-mode';
  } else if (isWheelMode) {
    wheelClass = ' tp-ui-wheel-mode';
  } else {
    wheelClass = '';
  }

  const id = text(instanceId);

  return `<div class="tp-ui-modal normalize ${mobileClass}${isRangeMode ? ' tp-ui-range-mode' : ''}${isTzMode ? ' tp-ui-tz-mode' : ''}${wheelClass}${showSeconds ? ' tp-ui-has-seconds' : ''}" data-theme="${text(theme)}" role="dialog" aria-modal="true" aria-labelledby="tp-ui-label-${id}" data-owner-id="${id}"${animation ? '' : ' style="transition:none"'}><div class="tp-ui-wrapper ${mobileClass}" tabindex="0">${rangeSelector}${header}${timezoneSelector}${pickerBody}${footer}</div><div class="timepicker-announcer sr-only" role="status" aria-live="polite" aria-atomic="true"></div></div>`;
};
