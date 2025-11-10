import type { OptionTypes } from '../../types/types';
import keyboardSvg from '../../../assets/keyboard.svg';
import scheduleSvg from '../../../assets/schedule.svg';

export const HOURS_24 = ['00', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
export const HOURS_12 = ['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
export const MINUTES_STEP_5 = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];

export const getModalTemplate = (options: OptionTypes, instanceId: string): string => {
  const {
    iconTemplate,
    timeLabel,
    mobileTimeLabel,
    amLabel,
    pmLabel,
    cancelLabel,
    okLabel,
    iconTemplateMobile,
    minuteMobileLabel,
    hourMobileLabel,
    enableSwitchIcon,
    animation,
    clockType,
    editable,
    theme,
    mobile,
  } = options;

  const mobileClass = !!mobile ? 'mobile' : '';
  const keyboardIcon = `<i class="timepicker-ui-keyboard-icon">${iconTemplate || keyboardSvg}</i>`;
  const clockIcon =
    iconTemplateMobile || `<i class="timepicker-ui-keyboard-icon">${iconTemplateMobile || scheduleSvg}</i>`;

  return `

  <div class="timepicker-ui-modal normalize ${mobileClass} ${theme}" role="dialog" aria-modal="true" aria-labelledby="timepicker-ui-label-${instanceId}" data-owner-id="${instanceId}" style='transition:${
    animation ? 'opacity 0.15s linear' : 'none'
  }'>
    <div class="timepicker-ui-wrapper ${mobileClass}" tabindex="0">
      <div class="timepicker-ui-select-time ${mobileClass}" id="timepicker-ui-label-${instanceId}">${mobileClass ? mobileTimeLabel : timeLabel}</div>
      <div class="timepicker-ui-header ${mobileClass}">
        <div class="timepicker-ui-wrapper-time ${mobileClass} ${
          clockType === '24h' ? 'timepicker-ui-wrapper-time-24h' : ''
        }" role="group" aria-label="${mobileClass ? mobileTimeLabel : timeLabel}">
          <div class="timepicker-ui-input-wrapper ${mobileClass}">
            <div class="timepicker-ui-input-ripple-wrapper ${mobileClass}" data-md3-ripple>
              <input name="hour" ${
                !editable && !mobileClass ? 'readonly' : ''
              } class="timepicker-ui-hour ${mobileClass}" tabindex="0" type="number" min="0" max="${
                clockType === '12h' ? '12' : '23'
              }" aria-label="${mobileClass ? hourMobileLabel : 'Hour'}" role="spinbutton" aria-valuenow="12" />
            </div>
            <div class="timepicker-ui-hour-text ${mobileClass}">${hourMobileLabel}</div>
          </div>
          <div class="timepicker-ui-dots ${mobileClass}" aria-hidden="true">  
            <span></span>
            <span></span>
          </div>    
          <div class="timepicker-ui-input-wrapper ${mobileClass}">
            <div class="timepicker-ui-input-ripple-wrapper ${mobileClass}" data-md3-ripple>
              <input name="minutes" ${
                !editable && !mobileClass ? 'readonly' : ''
              } class="timepicker-ui-minutes ${mobileClass}" tabindex="0" type="number" min="0" max="59" aria-label="${mobileClass ? minuteMobileLabel : 'Minute'}" role="spinbutton" aria-valuenow="0" />
            </div>
            <div class="timepicker-ui-minute-text ${mobileClass}">${minuteMobileLabel}</div>
          </div>
        </div>
        ${
          clockType !== '24h'
            ? `
        <div class="timepicker-ui-wrapper-type-time ${mobileClass}" role="group" aria-label="Time period">
          <div class="timepicker-ui-type-mode timepicker-ui-am ${mobileClass ? 'mobile' : 'timepicker-ui-ripple'}" data-md3-ripple tabindex="0" role="button" aria-label="${amLabel}" aria-pressed="false" data-type="AM">${amLabel}</div>    
          <div class="timepicker-ui-type-mode timepicker-ui-pm ${mobileClass ? 'mobile' : 'timepicker-ui-ripple'}" data-md3-ripple tabindex="0" role="button" aria-label="${pmLabel}" aria-pressed="false" data-type="PM">${pmLabel}</div>    
        </div>
        `
            : ''
        }
      </div>
      <div class="timepicker-ui-mobile-clock-wrapper ${mobileClass}">
        <div class="timepicker-ui-body ${mobileClass}">
          <div class="timepicker-ui-clock-face ${mobileClass}" role="group" aria-label="Clock face">
            <div class="timepicker-ui-dot ${mobileClass}" aria-hidden="true"></div>
            <div class="timepicker-ui-clock-hand ${mobileClass}" aria-hidden="true">
              <div class="timepicker-ui-circle-hand ${mobileClass}"></div>
            </div>
            <div class="timepicker-ui-tips-wrapper ${mobileClass}" role="listbox" aria-label="Time values"></div>
            ${
              clockType === '24h'
                ? `<div class="timepicker-ui-tips-wrapper-24h ${mobileClass}" role="listbox" aria-label="24-hour time values"></div>`
                : ''
            }
          </div>
        </div>
      </div>
      <div class="timepicker-ui-footer ${mobileClass}" ${mobileClass ? 'data-view="mobile"' : ''}>
        ${
          enableSwitchIcon
            ? `
        <div class="timepicker-ui-keyboard-icon-wrapper ${mobileClass}" tabindex="0" role="button" aria-pressed="false" aria-label="Toggle keyboard mode" data-view="desktop">
          ${mobileClass ? clockIcon : keyboardIcon}
        </div>`
            : ''
        }
        <div class="timepicker-ui-wrapper-btn ${mobileClass}">
          <div class="timepicker-ui-cancel-btn ${mobileClass}" data-md3-ripple tabindex="0" role="button" aria-pressed="false" aria-label="${cancelLabel}">${cancelLabel}</div>
          <div class="timepicker-ui-ok-btn ${mobileClass}" data-md3-ripple tabindex="0" role="button" aria-pressed="false" aria-label="${okLabel}">${okLabel}</div>
        </div>
      </div>
    </div>
    <div class="timepicker-announcer sr-only" role="status" aria-live="polite" aria-atomic="true"></div>  
  </div>`;
};
