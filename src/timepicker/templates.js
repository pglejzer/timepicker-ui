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

export const getModalTemplate = () => {
  return `
  <div class="timepicker-ui-modal" role="dialog">
    <div class="timepicker-ui-wrapper">
      <div class="timepicker-ui-header">
        <div class="timepicker-ui-select-time">select time</div>
        <div class="timepicker-ui-wrapper-time">
          <div class="timepicker-ui-hour" role="button">05</div>  
          <div class="timepicker-ui-dots">:</div>    
          <div class="timepicker-ui-minutes" role="button">00</div>   
        </div>
      <div class="timepicker-ui-wrapper-type-time">
        <div class="timepicker-ui-am" role="button">AM</div>    
        <div class="timepicker-ui-pm" role="button">PM</div>    
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
        <div class="timepicker-ui-keyboard-icon-wrapper" role="button" aria-pressed="false">
          <i class="far fa-keyboard timepicker-ui-keyboard-icon"></i>
        </div>
        <div class="timepicker-ui-wrapper-btn">
          <div class="timepicker-ui-cancel-btn" role="button" aria-pressed="false">cancel</div>
          <div class="timepicker-ui-ok-btn" role="button" aria-pressed="false">ok</div>
        </div>
        </div>
      </div>
    </div>  
  </div>`;
};

export const getMobileModalTemplate = () => {
  return `
  <div class="timepicker-ui-modal" role="dialog">
    <div class="timepicker-ui-wrapper-mobile">
      <div class="timepicker-ui-header-mobile">
        <div class="timepicker-ui-select-time-mobile">enter time</div>
        <div class="timepicker-ui-wrapper-time-mobile">
          <div class="timepicker-ui-hour-mobile">12</div>  
          <div class="timepicker-ui-hour-text">Hour</div>
          <div class="timepicker-ui-dots-mobile">:</div>  
          <div class="timepicker-ui-minute-text">Minute</div>
          <div class="timepicker-ui-minutes-mobile">00</div>   
        </div>
      <div class="timepicker-ui-wrapper-type-time-mobile">
        <div class="timepicker-ui-am-mobile">AM</div>    
        <div class="timepicker-ui-pm-mobile">PM</div>    
      </div>
      </div>
      <div class="timepicker-ui-footer-mobile">
      <div class="timepicker-ui-keyboard-icon-wrapper-mobile" role="button" aria-pressed="false">
        <i class="far fa-keyboard timepicker-ui-keyboard-icon-mobile"></i>
      </div>
      <div class="timepicker-ui-wrapper-btn-mobile">
        <div class="timepicker-ui-cancel-btn-mobile" role="button" aria-pressed="false">cancel</div>
        <div class="timepicker-ui-ok-btn-mobile" role="button" aria-pressed="false">ok</div>
      </div>
      </div>
    </div>  
  </div>`;
};
