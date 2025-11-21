import type { TimepickerOptions } from '../../types/options';
import keyboardSvg from '../../../assets/keyboard.svg';
import scheduleSvg from '../../../assets/schedule.svg';

export const HOURS_24 = ['00', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
export const HOURS_12 = ['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
export const MINUTES_STEP_5 = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];

export const getModalTemplate = (options: Required<TimepickerOptions>, instanceId: string): string => {
  const {
    ui: { iconTemplate, enableSwitchIcon, animation, theme, mobile, editable, iconTemplateMobile },
    labels: {
      time: timeLabel,
      mobileTime: mobileTimeLabel,
      am: amLabel,
      pm: pmLabel,
      cancel: cancelLabel,
      ok: okLabel,
      mobileMinute: minuteMobileLabel,
      mobileHour: hourMobileLabel,
    },
    clock: { type: clockType },
  } = options;

  const mobileClass = !!mobile ? 'mobile' : '';
  const keyboardIcon = `<button aria-label="Keyboard" type="button" class="tp-ui-keyboard-icon">${iconTemplate || keyboardSvg}</button>`;
  const clockIcon =
    iconTemplateMobile ||
    `<button aria-label="Clock" type="button" class="tp-ui-keyboard-icon">${iconTemplateMobile || scheduleSvg}</button>`;

  return `<div class="tp-ui-modal normalize ${mobileClass}" data-theme="${theme}" role="dialog" aria-modal="true" aria-labelledby="tp-ui-label-${instanceId}" data-owner-id="${instanceId}" style='transition:${animation ? 'opacity 0.15s linear' : 'none'}'><div class="tp-ui-wrapper ${mobileClass}" tabindex="0"><div class="tp-ui-select-time ${mobileClass}" id="tp-ui-label-${instanceId}">${mobileClass ? mobileTimeLabel : timeLabel}</div><div class="tp-ui-header ${mobileClass}"><div class="tp-ui-wrapper-time ${mobileClass} ${clockType === '24h' ? 'tp-ui-wrapper-time-24h' : ''}" role="group" aria-label="${mobileClass ? mobileTimeLabel : timeLabel}"><div class="tp-ui-input-wrapper ${mobileClass}"><div class="tp-ui-input-ripple-wrapper ${mobileClass}" data-md3-ripple><input name="hour" ${!editable && !mobileClass ? 'readonly' : ''} class="tp-ui-hour ${mobileClass}" tabindex="0" type="number" min="0" max="${clockType === '12h' ? '12' : '23'}" aria-label="${mobileClass ? hourMobileLabel : 'Hour'}" role="spinbutton" aria-valuenow="12"></div><div class="tp-ui-hour-text ${mobileClass}">${hourMobileLabel}</div></div><div class="tp-ui-dots ${mobileClass}" aria-hidden="true"><span></span><span></span></div><div class="tp-ui-input-wrapper ${mobileClass}"><div class="tp-ui-input-ripple-wrapper ${mobileClass}" data-md3-ripple><input name="minutes" ${!editable && !mobileClass ? 'readonly' : ''} class="tp-ui-minutes ${mobileClass}" tabindex="0" type="number" min="0" max="59" aria-label="${mobileClass ? minuteMobileLabel : 'Minute'}" role="spinbutton" aria-valuenow="0"></div><div class="tp-ui-minute-text ${mobileClass}">${minuteMobileLabel}</div></div></div>${clockType !== '24h' ? `<div class="tp-ui-wrapper-type-time ${mobileClass}" role="group" aria-label="Period"><div class="tp-ui-type-mode tp-ui-am ${mobileClass ? 'mobile' : 'tp-ui-ripple'}" data-md3-ripple tabindex="0" role="button" aria-label="${amLabel}" aria-pressed="false" data-type="AM">${amLabel}</div><div class="tp-ui-type-mode tp-ui-pm ${mobileClass ? 'mobile' : 'tp-ui-ripple'}" data-md3-ripple tabindex="0" role="button" aria-label="${pmLabel}" aria-pressed="false" data-type="PM">${pmLabel}</div></div>` : ''}</div><div class="tp-ui-mobile-clock-wrapper ${mobileClass}"><div class="tp-ui-body ${mobileClass}"><div class="tp-ui-clock-face ${mobileClass}" role="group" aria-label="Clock"><div class="tp-ui-dot ${mobileClass}" aria-hidden="true"></div><div class="tp-ui-clock-hand ${mobileClass}" aria-hidden="true"><div class="tp-ui-circle-hand ${mobileClass}"></div></div><div class="tp-ui-tips-wrapper ${mobileClass}" role="listbox" aria-label="Time"></div>${clockType === '24h' ? `<div class="tp-ui-tips-wrapper-24h ${mobileClass}" role="listbox" aria-label="24h"></div>` : ''}</div></div></div><div class="tp-ui-footer ${mobileClass}" ${mobileClass ? 'data-view="mobile"' : ''}>${enableSwitchIcon ? `<div class="tp-ui-keyboard-icon-wrapper ${mobileClass}" tabindex="0" role="button" aria-pressed="false" aria-label="Toggle" data-view="desktop">${mobileClass ? clockIcon : keyboardIcon}</div>` : ''}<div class="tp-ui-wrapper-btn ${mobileClass}"><div class="tp-ui-cancel-btn ${mobileClass}" data-md3-ripple tabindex="0" role="button" aria-pressed="false" aria-label="${cancelLabel}">${cancelLabel}</div><div class="tp-ui-ok-btn ${mobileClass}" data-md3-ripple tabindex="0" role="button" aria-pressed="false" aria-label="${okLabel}">${okLabel}</div></div></div></div><div class="timepicker-announcer sr-only" role="status" aria-live="polite" aria-atomic="true"></div></div>`;
};
