import type { OptionTypes } from '../../types/types';

export const getNumberOfHours24 = ['00', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
export const getNumberOfHours12 = ['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
export const getNumberOfMinutes = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];

export const getModalTemplate = (options: OptionTypes, instanceId: string): string => {
  const {
    iconTemplate,
    timeLabel,
    amLabel,
    pmLabel,
    cancelLabel,
    okLabel,
    enableSwitchIcon,
    animation,
    clockType,
    editable,
    theme,
  } = options;

  return `
  <div class="timepicker-ui-modal normalize ${theme}" role="dialog" aria-modal="true" aria-labelledby="timepicker-ui-label-${instanceId}" data-owner-id="${instanceId}" style='transition:${
    animation ? 'opacity 0.15s linear' : 'none'
  }'>
    <div class="timepicker-ui-wrapper" tabindex="0">
      <div class="timepicker-ui-header">
        <div class="timepicker-ui-select-time" id="timepicker-ui-label-${instanceId}">${timeLabel}</div>
        <div class="timepicker-ui-wrapper-time ${
          clockType === '24h' ? 'timepicker-ui-wrapper-time-24h' : ''
        }" role="group" aria-label="${timeLabel}">
          <input name="hour" ${
            !editable ? 'readonly' : ''
          } class="timepicker-ui-hour" tabindex="0" type="number" min="0" max="${
            clockType === '12h' ? '12' : '23'
          }" aria-label="Hour" role="spinbutton" aria-valuenow="12" />
          <div class="timepicker-ui-dots" aria-hidden="true">  
            <span></span>
            <span></span>
          </div>    
          <input name="minutes" ${
            !editable ? 'readonly' : ''
          } class="timepicker-ui-minutes" tabindex="0" type="number" min="0" max="59" aria-label="Minute" role="spinbutton" aria-valuenow="0" /> 
        </div>
      ${
        clockType !== '24h'
          ? `
      <div class="timepicker-ui-wrapper-type-time" role="group" aria-label="Time period">
        <div class="timepicker-ui-type-mode timepicker-ui-am" tabindex="0" role="button" aria-label="${amLabel}" aria-pressed="false" data-type="AM">${amLabel}</div>    
        <div class="timepicker-ui-type-mode timepicker-ui-pm" tabindex="0" role="button" aria-label="${pmLabel}" aria-pressed="false" data-type="PM">${pmLabel}</div>    
      </div>
      `
          : ''
      }
      </div>
      <div class="timepicker-ui-wrapper-landspace">
        <div class="timepicker-ui-body">
          <div class="timepicker-ui-clock-face" role="group" aria-label="Clock face">
            <div class="timepicker-ui-dot" aria-hidden="true"></div>
            <div class="timepicker-ui-clock-hand" aria-hidden="true">
              <div class="timepicker-ui-circle-hand"></div>
            </div>
            <div class="timepicker-ui-tips-wrapper" role="listbox" aria-label="Time values"></div>
            ${clockType === '24h' ? '<div class="timepicker-ui-tips-wrapper-24h" role="listbox" aria-label="24-hour time values"></div>' : ''}
          </div>
        </div>
        <div class="timepicker-ui-footer">
        ${
          enableSwitchIcon
            ? `
      <div class="timepicker-ui-keyboard-icon-wrapper" tabindex="0" role="button" aria-pressed="false" aria-label="Toggle keyboard mode" data-view="desktop">
        ${iconTemplate}
      </div>`
            : ''
        }
        <div class="timepicker-ui-wrapper-btn" >
          <div class="timepicker-ui-cancel-btn" tabindex="0" role="button" aria-pressed="false" aria-label="${cancelLabel}">${cancelLabel}</div>
          <div class="timepicker-ui-ok-btn" tabindex="0" role="button" aria-pressed="false" aria-label="${okLabel}">${okLabel}</div>
        </div>
        </div>
      </div>
    </div>
    <div class="timepicker-announcer sr-only" role="status" aria-live="polite" aria-atomic="true"></div>  
  </div>`;
};

export const getMobileModalTemplate = (options: OptionTypes, instanceId: string): string => {
  const {
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
    theme,
  } = options;

  return `
  <div class="timepicker-ui-modal normalize mobile ${theme}" role="dialog" aria-modal="true" aria-labelledby="timepicker-ui-label-mobile-${instanceId}" data-owner-id="${instanceId}" style='transition:${
    animation ? 'opacity 0.15s linear' : 'none'
  }'>
    <div class="timepicker-ui-wrapper mobile" tabindex="0">
      <div class="timepicker-ui-header mobile">
        <div class="timepicker-ui-select-time mobile" id="timepicker-ui-label-mobile-${instanceId}">${mobileTimeLabel}</div>
        <div class="timepicker-ui-wrapper-time mobile" role="group" aria-label="${mobileTimeLabel}">
          <input class="timepicker-ui-hour mobile" tabindex="0" type="number" min="0" max="${
            clockType === '12h' ? '12' : '23'
          }" aria-label="${hourMobileLabel}" role="spinbutton" aria-valuenow="12" />
          <div class="timepicker-ui-hour-text mobile">${hourMobileLabel}</div>
          <div class="timepicker-ui-dots mobile" aria-hidden="true">
            <span></span>
            <span></span>
          </div>  
          <div class="timepicker-ui-minute-text mobile">${minuteMobileLabel}</div>
          <input class="timepicker-ui-minutes mobile" tabindex="0" type="number" min="0" max="59" aria-label="${minuteMobileLabel}" role="spinbutton" aria-valuenow="0" /> 
        </div>
  ${
    clockType !== '24h'
      ? `<div class="timepicker-ui-wrapper-type-time mobile" role="group" aria-label="Time period">
          <div class="timepicker-ui-type-mode timepicker-ui-am mobile" data-type="AM" tabindex="0" role="button" aria-label="${amLabel}" aria-pressed="false">${amLabel}</div>    
          <div class="timepicker-ui-type-mode timepicker-ui-pm mobile" data-type="PM" tabindex="0" role="button" aria-label="${pmLabel}" aria-pressed="false">${pmLabel}</div>    
        </div>`
      : ''
  }
      </div>
      <div class="timepicker-ui-footer mobile" data-view="mobile">
      ${
        enableSwitchIcon
          ? `
      <div class="timepicker-ui-keyboard-icon-wrapper mobile" role="button" aria-pressed="false" aria-label="Toggle keyboard mode" data-view="desktop" tabindex="0">
      ${iconTemplateMobile}
      </div>`
          : ''
      }
      <div class="timepicker-ui-wrapper-btn mobile">
        <div class="timepicker-ui-cancel-btn mobile" role="button" aria-pressed="false" aria-label="${cancelLabel}" tabindex="0">${cancelLabel}</div>
        <div class="timepicker-ui-ok-btn mobile" role="button" aria-pressed="false" aria-label="${okLabel}" tabindex="0">${okLabel}</div>
      </div>
      </div>
    </div>
    <div class="timepicker-announcer sr-only" role="status" aria-live="polite" aria-atomic="true"></div>  
  </div>`;
};
