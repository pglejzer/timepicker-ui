import type { TimepickerOptions } from '../../types/options';
import keyboardSvg from '../../../assets/keyboard.svg';
import scheduleSvg from '../../../assets/schedule.svg';
import { PluginRegistry } from '../../core/PluginRegistry';

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
    timezone: { enabled: tzEnabled, label: tzLabel },
  } = options;

  if (!tzEnabled || !PluginRegistry.has('timezone')) return '';

  return `<div class="tp-ui-timezone ${mobileClass}">
        <span class="tp-ui-timezone-label" id="tp-tz-label-${instanceId}">${tzLabel}</span>
        <div class="tp-ui-timezone-dropdown" role="combobox" aria-expanded="false" aria-haspopup="listbox" aria-labelledby="tp-tz-label-${instanceId}" tabindex="0" data-tz-id="${instanceId}">
          <div class="tp-ui-timezone-selected" data-placeholder="${tzLabel}...">${tzLabel}...</div>
          <svg class="tp-ui-timezone-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          <div class="tp-ui-timezone-menu" role="listbox" aria-labelledby="tp-tz-label-${instanceId}"></div>
        </div>
      </div>`;
};

const buildRangeSelector = (options: Required<TimepickerOptions>): string => {
  const {
    range: { enabled: rangeEnabled, fromLabel, toLabel },
  } = options;

  if (!rangeEnabled || !PluginRegistry.has('range')) return '';

  return `<div class="tp-ui-range-header" role="tablist" aria-label="Range selection"><button type="button" class="tp-ui-range-tab tp-ui-range-from active" role="tab" tabindex="0" aria-selected="true"><span class="tp-ui-range-tab-label">${fromLabel}</span><span class="tp-ui-range-tab-value tp-ui-range-from-time">--:--</span></button><button type="button" class="tp-ui-range-tab tp-ui-range-to" role="tab" tabindex="-1" aria-selected="false"><span class="tp-ui-range-tab-label">${toLabel}</span><span class="tp-ui-range-tab-value tp-ui-range-to-time">--:--</span></button></div>`;
};

const buildClearButton = (options: Required<TimepickerOptions>, mobileClass: string): string => {
  const {
    ui: { clearButton: clearButtonEnabled },
    labels: { clear: clearLabel },
  } = options;

  if (!clearButtonEnabled) return '';

  return `<div class="tp-ui-clear-btn ${mobileClass} disabled" data-md3-ripple tabindex="0" role="button" aria-pressed="false" aria-label="${clearLabel}" aria-disabled="true">${clearLabel}</div>`;
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

  return `<div class="tp-ui-mobile-clock-wrapper ${config.mobileClass}"><div class="tp-ui-body ${config.mobileClass}"><div class="tp-ui-clock-face ${config.mobileClass}" role="group" aria-label="Clock"><div class="tp-ui-dot ${config.mobileClass}" aria-hidden="true"></div><div class="tp-ui-clock-hand ${config.mobileClass}" aria-hidden="true"><div class="tp-ui-circle-hand ${config.mobileClass}"></div></div><div class="tp-ui-tips-wrapper ${config.mobileClass}" role="listbox" aria-label="Time"></div>${config.clockType === '24h' ? `<div class="tp-ui-tips-wrapper-24h ${config.mobileClass}" role="listbox" aria-label="24h"></div>` : ''}</div></div></div>`;
};

const buildHeader = (options: Required<TimepickerOptions>, config: TemplateConfig): string => {
  const {
    labels: {
      time: timeLabel,
      mobileTime: mobileTimeLabel,
      am: amLabel,
      pm: pmLabel,
      mobileMinute: minuteMobileLabel,
      mobileHour: hourMobileLabel,
    },
    ui: { editable },
  } = options;
  const { mobileClass, clockType, instanceId } = config;
  const label = mobileClass ? mobileTimeLabel : timeLabel;

  const periodSelector =
    clockType !== '24h'
      ? `<div class="tp-ui-wrapper-type-time ${mobileClass}" role="group" aria-label="Period"><div class="tp-ui-type-mode tp-ui-am ${mobileClass ? 'mobile' : 'tp-ui-ripple'}" data-md3-ripple tabindex="0" role="button" aria-label="${amLabel}" aria-pressed="false" data-type="AM">${amLabel}</div><div class="tp-ui-type-mode tp-ui-pm ${mobileClass ? 'mobile' : 'tp-ui-ripple'}" data-md3-ripple tabindex="0" role="button" aria-label="${pmLabel}" aria-pressed="false" data-type="PM">${pmLabel}</div></div>`
      : '';

  return `<div class="tp-ui-select-time ${mobileClass}" id="tp-ui-label-${instanceId}">${label}</div><div class="tp-ui-header ${mobileClass}"><div class="tp-ui-wrapper-time ${mobileClass} ${clockType === '24h' ? 'tp-ui-wrapper-time-24h' : ''}" role="group" aria-label="${label}"><div class="tp-ui-input-wrapper ${mobileClass}"><div class="tp-ui-input-ripple-wrapper ${mobileClass}" data-md3-ripple><input name="hour" ${!editable && !mobileClass ? 'readonly' : ''} class="tp-ui-hour ${mobileClass}" tabindex="0" type="number" min="0" max="${clockType === '12h' ? '12' : '23'}" aria-label="${mobileClass ? hourMobileLabel : 'Hour'}" role="spinbutton" aria-valuenow="12"></div><div class="tp-ui-hour-text ${mobileClass}">${hourMobileLabel}</div></div><div class="tp-ui-dots ${mobileClass}" aria-hidden="true"><span></span><span></span></div><div class="tp-ui-input-wrapper ${mobileClass}"><div class="tp-ui-input-ripple-wrapper ${mobileClass}" data-md3-ripple><input name="minutes" ${!editable && !mobileClass ? 'readonly' : ''} class="tp-ui-minutes ${mobileClass}" tabindex="0" type="number" min="0" max="59" aria-label="${mobileClass ? minuteMobileLabel : 'Minute'}" role="spinbutton" aria-valuenow="0"></div><div class="tp-ui-minute-text ${mobileClass}">${minuteMobileLabel}</div></div></div>${periodSelector}</div>`;
};

const buildFooter = (options: Required<TimepickerOptions>, mobileClass: string): string => {
  const {
    ui: { enableSwitchIcon, iconTemplate, iconTemplateMobile },
    labels: { cancel: cancelLabel, ok: okLabel },
  } = options;

  const keyboardIcon = `<button aria-label="Keyboard" type="button" class="tp-ui-keyboard-icon">${iconTemplate || keyboardSvg}</button>`;
  const clockIcon =
    iconTemplateMobile ||
    `<button aria-label="Clock" type="button" class="tp-ui-keyboard-icon">${iconTemplateMobile || scheduleSvg}</button>`;

  const switchIcon = enableSwitchIcon
    ? `<div class="tp-ui-keyboard-icon-wrapper ${mobileClass}" tabindex="0" role="button" aria-pressed="false" aria-label="Toggle" data-view="desktop">${mobileClass ? clockIcon : keyboardIcon}</div>`
    : '';

  const clearButton = buildClearButton(options, mobileClass);

  return `<div class="tp-ui-footer ${mobileClass}" ${mobileClass ? 'data-view="mobile"' : ''}>${switchIcon}<div class="tp-ui-wrapper-btn ${mobileClass}">${clearButton}<div class="tp-ui-cancel-btn ${mobileClass}" data-md3-ripple tabindex="0" role="button" aria-pressed="false" aria-label="${cancelLabel}">${cancelLabel}</div><div class="tp-ui-ok-btn ${mobileClass}" data-md3-ripple tabindex="0" role="button" aria-pressed="false" aria-label="${okLabel}">${okLabel}</div></div></div>`;
};

export const getModalTemplate = (options: Required<TimepickerOptions>, instanceId: string): string => {
  const {
    ui: { mode: pickerMode, animation, theme, mobile },
    clock: { incrementMinutes },
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

  return `<div class="tp-ui-modal normalize ${mobileClass}${isRangeMode ? ' tp-ui-range-mode' : ''}${isTzMode ? ' tp-ui-tz-mode' : ''}${wheelClass}" data-theme="${theme}" role="dialog" aria-modal="true" aria-labelledby="tp-ui-label-${instanceId}" data-owner-id="${instanceId}" style='transition:${animation ? 'opacity 0.15s linear' : 'none'}'><div class="tp-ui-wrapper ${mobileClass}" tabindex="0">${rangeSelector}${header}${timezoneSelector}${pickerBody}${footer}</div><div class="timepicker-announcer sr-only" role="status" aria-live="polite" aria-atomic="true"></div></div>`;
};
