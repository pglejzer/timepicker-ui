import { TimepickerUI, CallbackData } from 'timepicker-ui';
import { codeToHtml } from 'shiki';

console.log(
  `%c
████████╗██╗███╗   ███╗███████╗██████╗ ██╗ ██████╗███████╗██████╗ 
╚══██╔══╝██║████╗ ████║██╔════╝██╔══██╗██║██╔════╝██╔════╝██╔══██╗
   ██║   ██║██╔████╔██║█████╗  ██████╔╝██║██║     █████╗  ██████╔╝
   ██║   ██║██║╚██╔╝██║██╔══╝  ██╔═══╝ ██║██║     ██╔══╝  ██╔══██╗
   ██║   ██║██║ ╚═╝ ██║███████╗██║     ██║╚██████╗███████╗██║  ██║
   ╚═╝   ╚═╝╚═╝     ╚═╝╚══════╝╚═╝     ╚═╝ ╚═════╝╚══════╝╚═╝  ╚═╝
                    T I M E P I C K E R - U I                  

✨ Because native <input type="time"> is illegal.
🤫 Shh... it just wraps <input>. But damn it looks good.
👉 github.com/pglejzer/timepicker-ui
`,
  'color: #00BCD4; font-weight: bold; font-family: monospace; font-size: 11px;',
);

const codeBlocks = document.querySelectorAll<HTMLElement>('pre');

codeBlocks.forEach(async (block) => {
  const lang = block.dataset.lang || 'js';
  const rawCode = block.innerText.trim();

  const html = await codeToHtml(rawCode, {
    lang,
    theme: 'github-dark',
  });

  const wrapper = document.createElement('div');
  wrapper.innerHTML = html;
  const highlightedBlock = wrapper.firstElementChild!;

  highlightedBlock.classList.add(
    'w-full',
    'overflow-x-auto',
    'overflow-y-hidden',
    'px-4',
    'py-3',
    'rounded-md',
    'bg-[#0d1117]',
  );

  const copyBtn = document.createElement('button');
  copyBtn.innerText = 'Copy';
  copyBtn.className =
    'absolute top-2 right-2 text-xs px-2 py-1 bg-gray-800 text-white rounded hover:bg-gray-700 transition';
  copyBtn.addEventListener('click', async () => {
    await navigator.clipboard.writeText(rawCode);
    copyBtn.innerText = 'Copied!';
    setTimeout(() => (copyBtn.innerText = 'Copy'), 1500);
  });

  const wrapperDiv = document.createElement('div');
  wrapperDiv.className = 'relative mb-6';
  wrapperDiv.appendChild(copyBtn);
  wrapperDiv.appendChild(highlightedBlock);

  block.replaceWith(wrapperDiv);
});

const basicTimePicker = new TimepickerUI('#basic-picker');
basicTimePicker.create();

const format24hPicker = new TimepickerUI('#format-24h-picker', {
  clockType: '24h',
  enableSwitchIcon: true,
});
format24hPicker.create();

const mobilePicker = new TimepickerUI('#mobile-picker', {
  mobile: true,
  clockType: '24h',
  enableSwitchIcon: true,
});
mobilePicker.create();

const themeBasicPicker = new TimepickerUI('#theme-basic', {
  theme: 'basic',
});
themeBasicPicker.create();

const themeCraneStraightPicker = new TimepickerUI('#theme-crane-straight', {
  theme: 'crane-straight',
});
themeCraneStraightPicker.create();

const themeCraneRadiusPicker = new TimepickerUI('#theme-crane-radius', {
  theme: 'crane-radius',
});
themeCraneRadiusPicker.create();

const themeM3Picker = new TimepickerUI('#theme-m3', {
  theme: 'm3',
});
themeM3Picker.create();

const themeDarkPicker = new TimepickerUI('#theme-dark', {
  theme: 'dark',
});
themeDarkPicker.create();

const themeGlassmorphicPicker = new TimepickerUI('#theme-glassmorphic', {
  theme: 'glassmorphic',
});
themeGlassmorphicPicker.create();

const themePastelPicker = new TimepickerUI('#theme-pastel', {
  theme: 'pastel',
});
themePastelPicker.create();

const themeAIPicker = new TimepickerUI('#theme-ai', {
  theme: 'ai',
});
themeAIPicker.create();

const themeCyberpunkPicker = new TimepickerUI('#theme-cyberpunk', {
  theme: 'cyberpunk',
});
themeCyberpunkPicker.create();

const disabledHoursPicker = new TimepickerUI('#disabled-hours', {
  disabledTime: { hours: [1, 2, 3, 22, 23] },
  clockType: '24h',
});
disabledHoursPicker.create();

const disabledMinutesPicker = new TimepickerUI('#disabled-minutes', {
  disabledTime: { minutes: [15, 30, 45] },
  clockType: '12h',
});
disabledMinutesPicker.create();

const disabledIntervalPicker = new TimepickerUI('#disabled-interval', {
  disabledTime: { interval: '12:00 - 18:00' },
  clockType: '24h',
});
disabledIntervalPicker.create();

const editablePicker = new TimepickerUI('#editable-picker', {
  editable: true,
  focusInputAfterCloseModal: true,
  enableSwitchIcon: true,
});
editablePicker.create();

const inlinePicker = new TimepickerUI('#inline-picker', {
  inline: {
    enabled: true,
    containerId: 'inline-container',
    showButtons: false,
    autoUpdate: true,
  },
  clockType: '24h',
});
inlinePicker.create();

const eventPicker = new TimepickerUI('#event-picker');
eventPicker.create();
const eventPickerElement = eventPicker.getElement();

const eventLog = document.querySelector('#event-log');

if (eventPickerElement && eventLog) {
  eventPickerElement.addEventListener('accept', (e: any) => {
    console.log(e);
    const timestamp = new Date().toLocaleTimeString();
    eventLog.innerHTML += `<p class="text-green-600 dark:text-green-400 text-sm">[${timestamp}] Accept: ${e.detail.hour}:${e.detail.minutes} ${e.detail.type || ''}</p>`;
    eventLog.scrollTop = eventLog.scrollHeight;
  });

  eventPickerElement.addEventListener('cancel', (e: any) => {
    console.log(e);

    const timestamp = new Date().toLocaleTimeString();
    eventLog.innerHTML += `<p class="text-red-600 dark:text-red-400 text-sm">[${timestamp}] Cancel event fired</p>`;
    eventLog.scrollTop = eventLog.scrollHeight;
  });

  eventPickerElement.addEventListener('show', (e: any) => {
    const timestamp = new Date().toLocaleTimeString();
    console.log(e);

    eventLog.innerHTML += `<p class="text-blue-600 dark:text-blue-400 text-sm">[${timestamp}] Picker opened</p>`;
    eventLog.scrollTop = eventLog.scrollHeight;
  });
}
const customLabelsPicker = new TimepickerUI('#custom-labels-picker', {
  timeLabel: 'Select Time',
  okLabel: 'It is ok',
  cancelLabel: 'Nope',
  amLabel: 'AM',
  pmLabel: 'PM',
  mobileTimeLabel: 'Enter Time',
  hourMobileLabel: 'Hour',
  minuteMobileLabel: 'Minute',
});
customLabelsPicker.create();

const multiPicker1 = new TimepickerUI('#multi-picker-1', {
  clockType: '24h',
  theme: 'basic',
});
multiPicker1.create();

const multiPicker2 = new TimepickerUI('#multi-picker-2', {
  clockType: '12h',
  theme: 'm3',
});
multiPicker2.create();

const multiPicker3 = new TimepickerUI('#multi-picker-3', {
  clockType: '24h',
  theme: 'crane-radius',
});
multiPicker3.create();

const eventEmitterPicker = new TimepickerUI('#event-emitter-picker', {
  theme: 'm3',
});
eventEmitterPicker.create();

const emitterEventLog = document.querySelector('#emitter-event-log');

if (emitterEventLog) {
  const logEvent = (eventName: string, data?: any) => {
    const timestamp = new Date().toLocaleTimeString();
    const dataStr = data ? `: ${JSON.stringify(data, null, 2)}` : '';
    emitterEventLog.innerHTML += `<p class="text-cyan-400 text-xs mb-1">[${timestamp}] <span class="text-white font-semibold">${eventName}</span>${dataStr}</p>`;
    emitterEventLog.scrollTop = emitterEventLog.scrollHeight;
  };

  eventEmitterPicker.on('confirm', (data: CallbackData) => {
    logEvent('confirm', { hour: data.hour, minutes: data.minutes, type: data.type });
  });

  eventEmitterPicker.on('cancel', (data: CallbackData) => {
    logEvent('cancel');
  });

  eventEmitterPicker.on('open', () => {
    logEvent('open');
  });

  eventEmitterPicker.on('update', (data: CallbackData) => {
    logEvent('update', { hour: data.hour, minutes: data.minutes });
  });

  eventEmitterPicker.on('select:hour', (data: CallbackData) => {
    logEvent('select:hour', { hour: data.hour });
  });

  eventEmitterPicker.on('select:minute', (data: CallbackData) => {
    logEvent('select:minute', { minutes: data.minutes });
  });

  eventEmitterPicker.on('select:am', () => {
    logEvent('select:am');
  });

  eventEmitterPicker.on('select:pm', () => {
    logEvent('select:pm');
  });

  eventEmitterPicker.once('open', () => {
    logEvent('once:open', 'This runs only once!');
  });
}

const customThemePicker = new TimepickerUI('#custom-theme-picker', {
  cssClass: 'dupa',
  theme: 'custom',
});
customThemePicker.create();

const advancedPicker = new TimepickerUI('#advanced-picker', {
  clockType: '12h',
  theme: 'm3',
  enableSwitchIcon: true,
  focusTrap: true,
  editable: true,
  focusInputAfterCloseModal: true,
  delayHandler: 500,
  incrementHours: 1,
  incrementMinutes: 15,
  currentTime: {
    time: new Date(),
    updateInput: false,
    preventClockType: true,
  },
  disabledTime: {
    interval: '22:00 - 06:00',
  },
  cssClass: 'my-custom-picker',
});
advancedPicker.create();

const newEventsAndCallbacksPicker = new TimepickerUI('#new-events-and-callbacks-picker', {
  onOpen: (data) => {
    console.log('Picker opened v3!', data);
  },
  onCancel: (data) => {
    console.log('Picker cancelled v3!', data);
  },
  onConfirm: (data) => {
    console.log('Time confirmed v3!', data);
  },
  onUpdate: (data) => {
    console.log('Time updated v3!', data);
  },
  onSelectHour: (data) => {
    console.log('Hour mode selected v3!', data);
  },
  onSelectMinute: (data) => {
    console.log('Minute mode selected v3!', data);
  },
  onSelectAM: (data) => {
    console.log('AM selected v3!', data);
  },
  onSelectPM: (data) => {
    console.log('PM selected v3!', data);
  },
  onError: (data) => {
    console.log('Error occurred v3!', data.error);
  },
});
newEventsAndCallbacksPicker.create();

const pickerElement = newEventsAndCallbacksPicker.getElement();

if (pickerElement) {
  pickerElement.addEventListener('timepicker:open', (data) => {
    console.log({ data });
    console.log('Picker opened with addEvent v3!', data);
  });
  pickerElement.addEventListener('timepicker:cancel', (data) => {
    console.log('Picker cancelled with addEvent v3!', data);
  });
  pickerElement.addEventListener('timepicker:confirm', (data) => {
    console.log('Time confirmed with addEvent v3!', data);
  });
  pickerElement.addEventListener('timepicker:update', (data) => {
    console.log('Time updated with addEvent v3!', data);
  });
  pickerElement.addEventListener('timepicker:select-hour', (data) => {
    console.log('Hour mode selected with addEvent v3!', data);
  });
  pickerElement.addEventListener('timepicker:select-minute', (data) => {
    console.log('Minute mode selected with addEvent v3!', data);
  });
}

const version3Example = new TimepickerUI('#version3-example', {
  theme: 'm3',
  clockType: '24h',
  focusTrap: false,
  delayHandler: 200,
  onOpen: (data) => {
    console.log('Version 3.0 picker opened!', data);
  },
});

const elementExists = document.querySelector('#version3-example');
if (elementExists) {
  version3Example.create();
}

const destroyExample = new TimepickerUI('#destroy-example', {
  theme: 'm3',
  clockType: '24h',
  focusTrap: false,
  delayHandler: 200,
});
destroyExample.create();

const button = document.querySelector('#destroy-button');

if (button) {
  button.addEventListener('click', () => {
    destroyExample.destroy();
  });
}

const multipleIntervalsPicker = new TimepickerUI('#disabled-intervals-12h', {
  disabledTime: {
    interval: ['12:00 AM - 4:00 AM', '5:30 PM - 8:00 PM'],
  },
  clockType: '12h',
});
multipleIntervalsPicker.create();

const multipleIntervalsPicker24h = new TimepickerUI('#disabled-intervals-24h', {
  disabledTime: {
    interval: ['04:33 - 12:12', '16:34 - 20:22', '21:37 - 23:23'],
  },
  clockType: '24h',
});
multipleIntervalsPicker24h.create();
