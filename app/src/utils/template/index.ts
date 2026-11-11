import type { TimepickerOptions } from '../../types/options';
import keyboardSvg from '../../../assets/keyboard.svg';
import scheduleSvg from '../../../assets/schedule.svg';
import { PluginRegistry } from '../../core/PluginRegistry';
import { DEFAULT_OPTIONS } from '../options/defaults';
import { isEmbeddedInlineMode } from '../options/predicates';
import { escapeHtml as text } from './escape';
import { formatValueText, VALUE_TEXT_ATTRIBUTE } from '../accessibility';

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
        <div class="tp-ui-timezone-dropdown" data-tz-id="${id}">
          <div class="tp-ui-timezone-selected" role="combobox" tabindex="0" aria-expanded="false" aria-haspopup="listbox" aria-controls="tp-tz-list-${id}" aria-labelledby="tp-tz-label-${id}" data-md3-ripple data-placeholder="${tzLabel}...">${tzLabel}...</div>
          <svg class="tp-ui-timezone-arrow" aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          <div class="tp-ui-timezone-menu" id="tp-tz-list-${id}" role="listbox" aria-labelledby="tp-tz-label-${id}"></div>
        </div>
      </div>`;
};

const buildRangeSelector = (options: Required<TimepickerOptions>, instanceId: string): string => {
  const {
    range: { enabled: rangeEnabled, fromLabel, toLabel },
    labels: { rangeSelectionLabel },
  } = options;

  if (!rangeEnabled || !PluginRegistry.has('range')) return '';

  const id = text(instanceId);
  const panelId = `tp-ui-range-panel-${id}`;

  return `<div class="tp-ui-range-header" role="tablist" aria-label="${text(rangeSelectionLabel)}"><button type="button" class="tp-ui-range-tab tp-ui-range-from active" id="tp-ui-range-from-${id}" data-md3-ripple role="tab" tabindex="0" aria-selected="true" aria-controls="${panelId}"><span class="tp-ui-range-tab-label">${text(fromLabel)}</span><span class="tp-ui-range-tab-value tp-ui-range-from-time" aria-hidden="true">--:--</span></button><button type="button" class="tp-ui-range-tab tp-ui-range-to" id="tp-ui-range-to-${id}" data-md3-ripple role="tab" tabindex="-1" aria-selected="false" aria-controls="${panelId}"><span class="tp-ui-range-tab-label">${text(toLabel)}</span><span class="tp-ui-range-tab-value tp-ui-range-to-time" aria-hidden="true">--:--</span></button></div>`;
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

const SIXTY_RANGE = { min: '0', max: '59', valueNow: '0' };

const buildColon = (mobileClass: string): string =>
  `<div class="tp-ui-dots ${mobileClass}" aria-hidden="true"><span></span><span></span></div>`;

const buildTimeField = (
  field: TimeFieldConfig,
  mobileClass: string,
  readonly: boolean,
  withName: boolean,
): string => {
  const caption = text(field.mobileLabel);
  const ariaLabel = mobileClass ? caption : text(field.label);
  const nameAttribute = withName ? ` name="${field.name}"` : '';

  return `<div class="tp-ui-input-wrapper ${mobileClass}"><div class="tp-ui-input-ripple-wrapper ${mobileClass}" data-md3-ripple><input${nameAttribute} ${readonly ? 'readonly' : ''} class="${field.inputClass} ${mobileClass}" tabindex="0" type="number" min="${field.min}" max="${field.max}" aria-label="${ariaLabel}" role="spinbutton" aria-valuemin="${field.min}" aria-valuemax="${field.max}" aria-valuenow="${field.valueNow}" aria-valuetext="${text(field.valueText)}"></div><div class="${field.textClass} ${mobileClass}">${caption}</div></div>`;
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
  const valueTextTemplate = labels.valueText ?? DEFAULT_OPTIONS.labels.valueText!;
  const hourCount = is12h ? 12 : 24;
  const valueTextFor = (valueNow: string, count: number): string =>
    formatValueText(valueTextTemplate, Number(valueNow), count);

  const fields: TimeFieldConfig[] = [
    {
      name: 'hour',
      inputClass: 'tp-ui-hour',
      textClass: 'tp-ui-hour-text',
      min: is12h ? '1' : '0',
      max: is12h ? '12' : '23',
      valueNow: hourValueNow,
      valueText: valueTextFor(hourValueNow, hourCount),
      label: labels.hourLabel,
      mobileLabel: labels.mobileHour,
    },
    {
      name: 'minutes',
      inputClass: 'tp-ui-minutes',
      textClass: 'tp-ui-minute-text',
      ...SIXTY_RANGE,
      valueText: valueTextFor(SIXTY_RANGE.valueNow, 60),
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
      valueText: valueTextFor(SIXTY_RANGE.valueNow, 60),
      label: labels.second,
      mobileLabel: labels.second,
    });
  }

  const readonly = !editable && !mobileClass;
  const withName = !isEmbeddedInlineMode(options);
  const timeFields = fields
    .map((field) => buildTimeField(field, mobileClass, readonly, withName))
    .join(buildColon(mobileClass));

  const periodSelector =
    clockType !== '24h'
      ? `<div class="tp-ui-wrapper-type-time ${mobileClass}" role="radiogroup" aria-label="${periodLabel}"><div class="tp-ui-type-mode tp-ui-am ${mobileClass}" data-md3-ripple tabindex="0" role="radio" aria-label="${amLabel}" aria-checked="false" data-type="AM">${amLabel}</div><div class="tp-ui-type-mode tp-ui-pm ${mobileClass}" data-md3-ripple tabindex="-1" role="radio" aria-label="${pmLabel}" aria-checked="false" data-type="PM">${pmLabel}</div></div>`
      : '';

  return `<div class="tp-ui-select-time ${mobileClass}" id="tp-ui-label-${text(instanceId)}">${headingText}</div><div class="tp-ui-header ${mobileClass}"><div class="tp-ui-wrapper-time ${mobileClass} ${clockType === '24h' ? 'tp-ui-wrapper-time-24h' : ''}" role="group" aria-label="${timeLabel}">${timeFields}</div>${periodSelector}</div>`;
};

const buildSwitchButton = (label: string | undefined, icon: string): string =>
  `<button aria-label="${text(label)}" type="button" class="tp-ui-keyboard-icon">${icon}</button>`;

const buildFooter = (
  options: Required<TimepickerOptions>,
  mobileClass: string,
  isWheelMode: boolean,
): string => {
  const {
    ui: { enableSwitchIcon, iconTemplate, iconTemplateMobile },
    labels,
  } = options;
  const cancelLabel = text(labels.cancel);
  const okLabel = text(labels.ok);

  const switchButton = mobileClass
    ? buildSwitchButton(labels.switchToClockLabel, iconTemplateMobile || scheduleSvg)
    : buildSwitchButton(labels.switchToKeyboardLabel, iconTemplate || keyboardSvg);

  const switchIcon =
    enableSwitchIcon && !isWheelMode
      ? `<div class="tp-ui-keyboard-icon-wrapper ${mobileClass}" data-md3-ripple data-view="desktop">${switchButton}</div>`
      : '';

  const clearButton = buildClearButton(options, mobileClass);

  return `<div class="tp-ui-footer ${mobileClass}" ${mobileClass ? 'data-view="mobile"' : ''}>${switchIcon}<div class="tp-ui-wrapper-btn ${mobileClass}">${clearButton}<div class="tp-ui-cancel-btn ${mobileClass}" data-md3-ripple tabindex="0" role="button" aria-label="${cancelLabel}">${cancelLabel}</div><div class="tp-ui-ok-btn ${mobileClass}" data-md3-ripple tabindex="0" role="button" aria-label="${okLabel}">${okLabel}</div></div></div>`;
};

export const getModalTemplate = (
  options: Required<TimepickerOptions>,
  instanceId: string,
  isKeyboardView = !!options.ui.mobile,
): string => {
  const {
    ui: { mode: pickerMode, animation, theme },
    clock: { incrementMinutes, showSeconds },
  } = options;

  const mobileClass = isKeyboardView ? 'mobile' : '';
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

  const id = text(instanceId);
  const rangeSelector = buildRangeSelector(options, instanceId);
  const timezoneSelector = buildTimezoneSelector(options, mobileClass, instanceId);
  const header = isCompactWheel ? '' : buildHeader(options, config);
  const pickerBody = buildPickerBody(config, incrementMinutes ?? 1, options);
  const footer =
    isCompactWheel && options.wheel?.hideFooter === true
      ? ''
      : buildFooter(options, mobileClass, isWheelMode);
  const panelContent = `${header}${timezoneSelector}${pickerBody}`;
  const body = rangeSelector
    ? `<div class="tp-ui-range-panel" role="tabpanel" id="tp-ui-range-panel-${id}" aria-labelledby="tp-ui-range-from-${id}">${panelContent}</div>`
    : panelContent;

  let wheelClass;

  if (isCompactWheel) {
    wheelClass = ' tp-ui-compact-wheel-mode';
  } else if (isWheelMode) {
    wheelClass = ' tp-ui-wheel-mode';
  } else {
    wheelClass = '';
  }

  const accessibleName = isCompactWheel
    ? `aria-label="${text(options.labels.time)}"`
    : `aria-labelledby="tp-ui-label-${id}"`;
  const roleAttributes = isEmbeddedInlineMode(options)
    ? `role="group" ${accessibleName}`
    : `role="dialog" aria-modal="true" ${accessibleName}`;
  const wrapperTabIndex = isEmbeddedInlineMode(options) ? '-1' : '0';

  return `<div class="tp-ui-modal normalize ${mobileClass}${isRangeMode ? ' tp-ui-range-mode' : ''}${isTzMode ? ' tp-ui-tz-mode' : ''}${wheelClass}${showSeconds ? ' tp-ui-has-seconds' : ''}" data-theme="${text(theme)}" ${roleAttributes} data-owner-id="${id}" ${VALUE_TEXT_ATTRIBUTE}="${text(options.labels.valueText)}"${animation ? '' : ' style="transition:none"'}><div class="tp-ui-wrapper ${mobileClass}" tabindex="${wrapperTabIndex}">${rangeSelector}${body}${footer}</div><div class="timepicker-announcer sr-only" role="status" aria-live="polite" aria-atomic="true"></div></div>`;
};
