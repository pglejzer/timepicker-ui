export const numberOfHours24 = [
  '00',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23',
  '24',
];
export const numberOfHours12 = ['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
export const numberOfMinutes = [
  '00',
  '05',
  '10',
  '15',
  '20',
  '25',
  '30',
  '35',
  '40',
  '45',
  '50',
  '55',
];

export const getModalTemplate = ({
  iconClass,
  selectTimeLabel,
  amLabel,
  pmLabel,
  cancelLabel,
  okLabel,
}) => {
  return `
  <div class="timepicker-ui-modal normalize" role="dialog">
    <div class="timepicker-ui-wrapper ">
      <div class="timepicker-ui-header">
        <div class="timepicker-ui-select-time">${selectTimeLabel}</div>
        <div class="timepicker-ui-wrapper-time">
          <div class="timepicker-ui-hour" role="button">05</div>  
          <div class="timepicker-ui-dots">:</div>    
          <div class="timepicker-ui-minutes" role="button">00</div>   
        </div>
      <div class="timepicker-ui-wrapper-type-time">
        <div class="timepicker-ui-type-mode timepicker-ui-am" role="button" data-type="AM">${amLabel}</div>    
        <div class="timepicker-ui-type-mode timepicker-ui-pm" role="button" data-type="PM">${pmLabel}</div>    
      </div>
      </div>
      <div class="timepicker-ui-wrapper-landspace">
        <div class="timepicker-ui-body">
          <div class="timepicker-ui-clock-face">
            <div class="timepicker-ui-dot"></div>
            <div class="timepicker-ui-clock-hand">
              <div class="timepicker-ui-circle-hand"></div>
            </div>
            <div class="timepicker-ui-tips-wrapper"></div>
          </div>
        </div>
        <div class="timepicker-ui-footer">
        <div class="timepicker-ui-keyboard-icon-wrapper" role="button" aria-pressed="false" data-view="desktop">
          <i class="${iconClass} timepicker-ui-keyboard-icon"></i>
        </div>
        <div class="timepicker-ui-wrapper-btn">
          <div class="timepicker-ui-cancel-btn" role="button" aria-pressed="false">${cancelLabel}</div>
          <div class="timepicker-ui-ok-btn" role="button" aria-pressed="false">${okLabel}</div>
        </div>
        </div>
      </div>
    </div>  
  </div>`;
};

export const getMobileModalTemplate = ({
  enterTimeLabel,
  amLabel,
  pmLabel,
  cancelLabel,
  okLabel,
  iconClassMobile,
  minuteMobileLabel,
  hourMobileLabel,
}) => {
  return `
  <div class="timepicker-ui-modal normalize mobile" role="dialog">
    <div class="timepicker-ui-wrapper mobile">
      <div class="timepicker-ui-header mobile">
        <div class="timepicker-ui-select-time mobile">${enterTimeLabel}</div>
        <div class="timepicker-ui-wrapper-time mobile">
          <div class="timepicker-ui-hour mobile" contenteditable="false">12</div>  
          <div class="timepicker-ui-hour-text mobile">${hourMobileLabel}</div>
          <div class="timepicker-ui-dots mobile">:</div>  
          <div class="timepicker-ui-minute-text mobile">${minuteMobileLabel}</div>
          <div class="timepicker-ui-minutes mobile" contenteditable="false">00</div>   
        </div>
      <div class="timepicker-ui-wrapper-type-time mobile">
        <div class="timepicker-ui-type-mode timepicker-ui-am mobile" data-type="AM">${amLabel}</div>    
        <div class="timepicker-ui-type-mode timepicker-ui-pm mobile" data-type="PM">${pmLabel}</div>    
      </div>
      </div>
      <div class="timepicker-ui-footer mobile" data-view="mobile">
      <div class="timepicker-ui-keyboard-icon-wrapper mobile" role="button" aria-pressed="false" data-view="desktop">
        <i class="${iconClassMobile} timepicker-ui-keyboard-icon mobile"></i>
      </div>
      <div class="timepicker-ui-wrapper-btn mobile">
        <div class="timepicker-ui-cancel-btn mobile" role="button" aria-pressed="false">${cancelLabel}</div>
        <div class="timepicker-ui-ok-btn mobile" role="button" aria-pressed="false">${okLabel}</div>
      </div>
      </div>
    </div>  
  </div>`;
};
