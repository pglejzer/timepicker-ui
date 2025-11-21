import { TimepickerUI } from 'timepicker-ui';
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

const basicTimePicker = new TimepickerUI('#basic-picker', {
  clock: {
    autoSwitchToMinutes: true,
  },
});
basicTimePicker.create();

const format24hPicker = new TimepickerUI('#format-24h-picker', {
  clock: { type: '24h' },
  ui: { enableSwitchIcon: true },
});
format24hPicker.create();

const mobilePicker = new TimepickerUI('#mobile-picker', {
  clock: { type: '24h' },
  ui: { mobile: true, enableSwitchIcon: true },
});
mobilePicker.create();

const themeBasicPicker = new TimepickerUI('#theme-basic', {
  ui: { theme: 'basic', enableSwitchIcon: true },
});
themeBasicPicker.create();

const themeCraneStraightPicker = new TimepickerUI('#theme-crane-straight', {
  ui: { theme: 'crane-straight', enableSwitchIcon: true },
});
themeCraneStraightPicker.create();

const themeCraneRadiusPicker = new TimepickerUI('#theme-crane-radius', {
  ui: { theme: 'crane', enableSwitchIcon: true },
});
themeCraneRadiusPicker.create();

const themeM3Picker = new TimepickerUI('#theme-m3', {
  ui: { theme: 'm3-green', enableSwitchIcon: true },
});
themeM3Picker.create();

const themeDarkPicker = new TimepickerUI('#theme-dark', {
  ui: { theme: 'dark', enableSwitchIcon: true },
});
themeDarkPicker.create();

const themeM2Picker = new TimepickerUI('#theme-m2', {
  ui: { theme: 'm2', enableSwitchIcon: true },
});
themeM2Picker.create();

const themeGlassmorphicPicker = new TimepickerUI('#theme-glassmorphic', {
  ui: { theme: 'glassmorphic', enableSwitchIcon: true },
});
themeGlassmorphicPicker.create();

const themePastelPicker = new TimepickerUI('#theme-pastel', {
  ui: { theme: 'pastel', enableSwitchIcon: true },
});
themePastelPicker.create();

const themeAIPicker = new TimepickerUI('#theme-ai', {
  ui: { theme: 'ai', enableSwitchIcon: true },
});

themeAIPicker.create();

const themeCyberpunkPicker = new TimepickerUI('#theme-cyberpunk', {
  ui: { theme: 'cyberpunk', enableSwitchIcon: true },
});
themeCyberpunkPicker.create();

const disabledHoursPicker = new TimepickerUI('#disabled-hours', {
  clock: { type: '24h', disabledTime: { hours: [1, 2, 3, 22, 23] } },
});
disabledHoursPicker.create();

const disabledMinutesPicker = new TimepickerUI('#disabled-minutes', {
  clock: { type: '12h', disabledTime: { minutes: [15, 30, 45] } },
});
disabledMinutesPicker.create();

const disabledIntervalPicker = new TimepickerUI('#disabled-interval', {
  clock: { type: '24h', disabledTime: { interval: '12:00 - 18:00' } },
});
disabledIntervalPicker.create();

const editablePicker = new TimepickerUI('#editable-picker', {
  ui: { editable: true, enableSwitchIcon: true },
  behavior: { focusInputAfterClose: true },
});
editablePicker.create();

const inlinePicker = new TimepickerUI('#inline-picker', {
  clock: { type: '24h' },
  ui: {
    inline: {
      enabled: true,
      containerId: 'inline-container',
      showButtons: false,
      autoUpdate: true,
    },
  },
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
  labels: {
    time: 'Select time',
    ok: 'It is ok',
    cancel: 'Nope',
    am: 'AM',
    pm: 'PM',
    mobileTime: 'Enter Time',
    mobileHour: 'Hour',
    mobileMinute: 'Minute',
  },
});
customLabelsPicker.create();

const multiPicker1 = new TimepickerUI('#multi-picker-1', {
  clock: { type: '24h' },
  ui: { theme: 'basic' },
});
multiPicker1.create();

const multiPicker2 = new TimepickerUI('#multi-picker-2', {
  clock: { type: '12h' },
  ui: { theme: 'm3-green' },
});
multiPicker2.create();

const multiPicker3 = new TimepickerUI('#multi-picker-3', {
  clock: { type: '24h' },
  ui: { theme: 'crane' },
});
multiPicker3.create();

const eventEmitterPicker = new TimepickerUI('#event-emitter-picker', {
  ui: { theme: 'm3-green' },
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

  eventEmitterPicker.on('confirm', (data) => {
    logEvent('confirm', { hour: data.hour, minutes: data.minutes, type: data.type });
  });

  eventEmitterPicker.on('cancel', () => {
    logEvent('cancel');
  });

  eventEmitterPicker.on('open', () => {
    logEvent('open');
  });

  eventEmitterPicker.on('update', (data) => {
    logEvent('update', { hour: data.hour, minutes: data.minutes });
  });

  eventEmitterPicker.on('select:hour', (data) => {
    logEvent('select:hour', { hour: data.hour });
  });

  eventEmitterPicker.on('select:minute', (data) => {
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
  ui: { cssClass: 'test' },
});
customThemePicker.create();

const advancedPicker = new TimepickerUI('#advanced-picker', {
  clock: {
    type: '12h',
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
  },
  ui: {
    theme: 'm3-green',
    enableSwitchIcon: true,
    editable: true,
    cssClass: 'my-custom-picker',
  },
  behavior: {
    focusTrap: true,
    focusInputAfterClose: true,
    delayHandler: 500,
  },
});
advancedPicker.create();

const newEventsAndCallbacksPicker = new TimepickerUI('#new-events-and-callbacks-picker', {
  callbacks: {
    onOpen: (data) => {
      console.log('Picker opened v4!', data);
    },
    onCancel: () => {
      console.log('Picker cancelled v4!');
    },
    onConfirm: (data) => {
      console.log('Time confirmed v4!', data);
    },
    onUpdate: (data) => {
      console.log('Time updated v4!', data);
    },
    onSelectHour: (data) => {
      console.log('Hour mode selected v4!', data);
    },
    onSelectMinute: (data) => {
      console.log('Minute mode selected v4!', data);
    },
    onSelectAM: () => {
      console.log('AM selected v4!');
    },
    onSelectPM: () => {
      console.log('PM selected v4!');
    },
    onError: (data) => {
      console.log('Error occurred v4!', data.error);
    },
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
  clock: { type: '24h' },
  ui: { theme: 'm3-green' },
  behavior: { focusTrap: false, delayHandler: 200 },
  callbacks: {
    onOpen: (data) => {
      console.log('Version 4.0 picker opened!', data);
    },
  },
});

const elementExists = document.querySelector('#version3-example');
if (elementExists) {
  version3Example.create();
}

const destroyExample = new TimepickerUI('#destroy-example', {
  clock: { type: '24h' },
  ui: { theme: 'm3-green' },
  behavior: { focusTrap: false, delayHandler: 200 },
});
destroyExample.create();

const button = document.querySelector('#destroy-button');

if (button) {
  button.addEventListener('click', () => {
    destroyExample.destroy();
  });
}

const multipleIntervalsPicker = new TimepickerUI('#disabled-intervals-12h', {
  clock: {
    type: '12h',
    disabledTime: {
      interval: ['12:00 AM - 4:00 AM', '5:30 PM - 8:00 PM'],
    },
  },
});
multipleIntervalsPicker.create();

const multipleIntervalsPicker24h = new TimepickerUI('#disabled-intervals-24h', {
  clock: {
    type: '24h',
    disabledTime: {
      interval: ['04:33 - 12:12', '16:34 - 20:22', '21:37 - 23:23'],
    },
  },
});
multipleIntervalsPicker24h.create();
