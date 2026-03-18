import { TimepickerUI } from './setup';

// getValue() Without Opening Widget Demo
const getValueDemoPicker = new TimepickerUI('#getvalue-demo-picker', {
  clock: { type: '24h' },
});
getValueDemoPicker.create();

const getValueButton = document.getElementById('getvalue-button');
const setValueButton = document.getElementById('setvalue-button');
const openCheckButton = document.getElementById('open-check-button');
const getValueOutput = document.getElementById('getvalue-output');

if (getValueButton && getValueOutput) {
  getValueButton.addEventListener('click', () => {
    const value = getValueDemoPicker.getValue();
    console.log('getValue() output:', value);
    getValueOutput.textContent = JSON.stringify(
      {
        hour: value.hour,
        minutes: value.minutes,
        time: value.time,
        degreesHours: value.degreesHours,
        degreesMinutes: value.degreesMinutes,
      },
      null,
      2,
    );
  });
}

if (setValueButton && getValueOutput) {
  setValueButton.addEventListener('click', () => {
    getValueDemoPicker.setValue('18:45');
    getValueOutput.textContent = JSON.stringify(
      {
        message: 'Value set to 18:45',
        ...getValueDemoPicker.getValue(),
      },
      null,
      2,
    );
  });
}

if (openCheckButton && getValueOutput) {
  openCheckButton.addEventListener('click', () => {
    getValueDemoPicker.open();
    setTimeout(() => {
      getValueDemoPicker.close();
      const value = getValueDemoPicker.getValue();
      getValueOutput.textContent = JSON.stringify(
        {
          message: 'Opened and closed, value still matches input',
          hour: value.hour,
          minutes: value.minutes,
          time: value.time,
        },
        null,
        2,
      );
    }, 1000);
  });
}

// Range Pickers
const rangePicker = new TimepickerUI('#range-picker', {
  clock: { type: '12h' },
  ui: { enableSwitchIcon: true },
  range: {
    enabled: true,
    minDuration: 30,
    maxDuration: 480,
    fromLabel: 'Start',
    toLabel: 'End',
  },
  callbacks: {
    onRangeConfirm: (data) => {
      console.log('Range confirmed:', data.from, '–', data.to, 'Duration:', data.duration);
      const rangeDisplay = document.getElementById('range-display');
      const durationDisplay = document.getElementById('range-duration');
      if (rangeDisplay) {
        rangeDisplay.textContent = `${data.from} – ${data.to}`;
      }
      if (durationDisplay) {
        durationDisplay.textContent = String(data.duration);
      }
    },
    onRangeSwitch: (data) => {
      console.log('Range part switched to:', data.active);
    },
    onRangeValidation: (data) => {
      if (!data.valid) {
        console.log('Invalid range duration. Expected:', data.minDuration, '-', data.maxDuration, 'minutes');
      }
    },
  },
});
rangePicker.create();

const range24hPicker = new TimepickerUI('#range-picker-24h', {
  clock: { type: '24h' },
  ui: { enableSwitchIcon: true },
  range: {
    enabled: true,
    minDuration: 60,
    maxDuration: 720,
    fromLabel: 'Start',
    toLabel: 'End',
  },
  callbacks: {
    onRangeConfirm: (data) => {
      console.log('Range 24h confirmed:', data.from, '–', data.to, 'Duration:', data.duration);
      const rangeDisplay = document.getElementById('range-display-24h');
      const durationDisplay = document.getElementById('range-duration-24h');
      if (rangeDisplay) {
        rangeDisplay.textContent = `${data.from} – ${data.to}`;
      }
      if (durationDisplay) {
        durationDisplay.textContent = String(data.duration);
      }
    },
    onRangeSwitch: (data) => {
      console.log('Range 24h part switched to:', data.active);
    },
    onRangeValidation: (data) => {
      if (!data.valid) {
        console.log('Invalid range duration. Expected:', data.minDuration, '-', data.maxDuration, 'minutes');
      }
    },
  },
});
range24hPicker.create();

const range12hAmPmPicker = new TimepickerUI('#range-picker-12h-ampm', {
  clock: { type: '12h' },
  ui: { enableSwitchIcon: true },
  range: {
    enabled: true,
    fromLabel: 'From',
    toLabel: 'To',
  },
  callbacks: {
    onRangeConfirm: (data) => {
      console.log('Range 12h AM/PM confirmed:', data.from, '–', data.to, 'Duration:', data.duration);
      const rangeDisplay = document.getElementById('range-display-12h-ampm');
      const durationDisplay = document.getElementById('range-duration-12h-ampm');
      if (rangeDisplay) {
        rangeDisplay.textContent = `${data.from} – ${data.to}`;
      }
      if (durationDisplay) {
        durationDisplay.textContent = String(data.duration);
      }
    },
    onRangeSwitch: (data) => {
      console.log('Range 12h AM/PM part switched to:', data.active);
    },
  },
});
range12hAmPmPicker.create();

