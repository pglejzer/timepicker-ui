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
  <div class="timepicker-ui-modal normalize ${theme}" role="dialog" data-owner-id="${instanceId}" style='transition:${
    animation ? 'opacity 0.15s linear' : 'none'
  }'>
    <div class="timepicker-ui-wrapper" tabindex="0">
      <div class="timepicker-ui-header">
        <div class="timepicker-ui-select-time">${timeLabel}</div>
        <div class="timepicker-ui-wrapper-time ${
          clockType === '24h' ? 'timepicker-ui-wrapper-time-24h' : ''
        }">
          <input name="hour" ${
            !editable ? 'readonly' : ''
          } class="timepicker-ui-hour" tabindex="0" type="number" min="0" max="${
            clockType === '12h' ? '12' : '23'
          }" />
          <div class="timepicker-ui-dots">  
            <span></span>
            <span></span>
          </div>    
          <input name="minutes" ${
            !editable ? 'readonly' : ''
          } class="timepicker-ui-minutes" tabindex="0" type="number" min="0" max="59" /> 
        </div>
      ${
        clockType !== '24h'
          ? `
      <div class="timepicker-ui-wrapper-type-time">
        <div class="timepicker-ui-type-mode timepicker-ui-am" tabindex="0" role="button" data-type="AM">${amLabel}</div>    
        <div class="timepicker-ui-type-mode timepicker-ui-pm" tabindex="0" role="button" data-type="PM">${pmLabel}</div>    
      </div>
      `
          : ''
      }
      </div>
      <div class="timepicker-ui-wrapper-landspace">
        <div class="timepicker-ui-body">
          <div class="timepicker-ui-clock-face">
            <div class="timepicker-ui-dot"></div>
            <div class="timepicker-ui-clock-hand">
              <div class="timepicker-ui-circle-hand"></div>
            </div>
            <div class="timepicker-ui-tips-wrapper"></div>
            ${clockType === '24h' ? '<div class="timepicker-ui-tips-wrapper-24h"></div>' : ''}
          </div>
        </div>
        <div class="timepicker-ui-footer">
        ${
          enableSwitchIcon
            ? `
      <div class="timepicker-ui-keyboard-icon-wrapper" tabindex="0" role="button" aria-pressed="false" data-view="desktop">
        ${iconTemplate}
      </div>`
            : ''
        }
        <div class="timepicker-ui-wrapper-btn" >
          <div class="timepicker-ui-cancel-btn" tabindex="0" role="button" aria-pressed="false">${cancelLabel}</div>
          <div class="timepicker-ui-ok-btn" tabindex="0" role="button" aria-pressed="false">${okLabel}</div>
        </div>
        </div>
      </div>
    </div>  
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
  <div class="timepicker-ui-modal normalize mobile ${theme}" role="dialog" data-owner-id="${instanceId}" style='transition:${
    animation ? 'opacity 0.15s linear' : 'none'
  }'>
    <div class="timepicker-ui-wrapper mobile" tabindex="0">
      <div class="timepicker-ui-header mobile">
        <div class="timepicker-ui-select-time mobile">${mobileTimeLabel}</div>
        <div class="timepicker-ui-wrapper-time mobile">
          <input class="timepicker-ui-hour mobile" tabindex="0" type="number" min="0" max="${
            clockType === '12h' ? '12' : '23'
          }" />
          <div class="timepicker-ui-hour-text mobile">${hourMobileLabel}</div>
          <div class="timepicker-ui-dots mobile">
            <span></span>
            <span></span>
          </div>  
          <div class="timepicker-ui-minute-text mobile">${minuteMobileLabel}</div>
          <input class="timepicker-ui-minutes mobile" tabindex="0" type="number" min="0" max="59" /> 
        </div>
  ${
    clockType !== '24h'
      ? `<div class="timepicker-ui-wrapper-type-time mobile">
          <div class="timepicker-ui-type-mode timepicker-ui-am mobile" data-type="AM" tabindex="0">${amLabel}</div>    
          <div class="timepicker-ui-type-mode timepicker-ui-pm mobile" data-type="PM" tabindex="0">${pmLabel}</div>    
        </div>`
      : ''
  }
      </div>
      <div class="timepicker-ui-footer mobile" data-view="mobile">
      ${
        enableSwitchIcon
          ? `
      <div class="timepicker-ui-keyboard-icon-wrapper mobile" role="button" aria-pressed="false" data-view="desktop" tabindex="0">
      ${iconTemplateMobile}
      </div>`
          : ''
      }
      <div class="timepicker-ui-wrapper-btn mobile">
        <div class="timepicker-ui-cancel-btn mobile" role="button" aria-pressed="false" tabindex="0">${cancelLabel}</div>
        <div class="timepicker-ui-ok-btn mobile" role="button" aria-pressed="false" tabindex="0">${okLabel}</div>
      </div>
      </div>
    </div>  
  </div>`;
};
