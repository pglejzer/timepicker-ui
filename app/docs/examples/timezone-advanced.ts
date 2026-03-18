import { TimepickerUI } from './setup';

const timezonePicker = new TimepickerUI('#timezone-picker', {
  clock: { type: '24h' },
  timezone: {
    enabled: true,
    label: 'Timezone',
  },
  ui: { theme: 'dark', enableSwitchIcon: true },
  callbacks: {
    onTimezoneChange: (data) => {
      console.log('Timezone changed:', data.timezone);
      const tzDisplay = document.getElementById('tz-display');
      if (tzDisplay) {
        tzDisplay.textContent = data.timezone;
      }
    },
  },
});
timezonePicker.create();

const worldTimezonePicker = new TimepickerUI('#timezone-world-picker', {
  clock: { type: '24h' },
  ui: { theme: 'm3-green', enableSwitchIcon: true },
  timezone: {
    enabled: true,
    label: 'Select City',
    whitelist: [
      'UTC',
      'America/New_York',
      'America/Los_Angeles',
      'America/Chicago',
      'America/Sao_Paulo',
      'Europe/London',
      'Europe/Paris',
      'Europe/Berlin',
      'Europe/Moscow',
      'Asia/Dubai',
      'Asia/Tokyo',
      'Asia/Shanghai',
      'Asia/Singapore',
      'Australia/Sydney',
      'Pacific/Auckland',
    ],
  },
  callbacks: {
    onTimezoneChange: (data) => {
      console.log('Timezone changed to:', data.timezone);

      const tzWorldDisplay = document.getElementById('tz-world-display');
      const tzWorldOffset = document.getElementById('tz-world-offset');

      if (tzWorldDisplay) {
        tzWorldDisplay.textContent = data.timezone;
      }

      if (tzWorldOffset) {
        try {
          const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: data.timezone,
            timeZoneName: 'shortOffset',
          });
          const parts = formatter.formatToParts(new Date());
          const offsetPart = parts.find((p) => p.type === 'timeZoneName');
          const offset = offsetPart?.value || 'UTC';
          tzWorldOffset.textContent = offset;

          console.log(`${data.timezone} -> ${offset}`);
        } catch (error) {
          console.error('Error getting timezone offset:', error);
          tzWorldOffset.textContent = 'N/A';
        }
      }
    },
    onConfirm: (data) => {
      const tzWorldTime = document.getElementById('tz-world-time');
      if (tzWorldTime) {
        const time = `${data.hour}:${data.minutes}${data.type ? ' ' + data.type : ''}`;
        tzWorldTime.textContent = time;
        console.log('Time confirmed:', time);
      }
    },
    onUpdate: (data) => {
      const tzWorldTime = document.getElementById('tz-world-time');
      if (tzWorldTime) {
        const time = `${data.hour}:${data.minutes}${data.type ? ' ' + data.type : ''}`;
        tzWorldTime.textContent = time;
      }
    },
  },
});
worldTimezonePicker.create();

// Timezone - All Themes
const themes = [
  'basic',
  'crane',
  'crane-straight',
  'm3-green',
  'dark',
  'm2',
  'glassmorphic',
  'pastel',
  'ai',
  'cyberpunk',
] as const;

themes.forEach((theme) => {
  const picker = new TimepickerUI(`#tz-theme-${theme}`, {
    clock: { type: '24h' },
    ui: { theme, enableSwitchIcon: true },
    timezone: {
      enabled: true,
      label: 'Timezone',
      whitelist: ['UTC', 'America/New_York', 'Europe/London', 'Europe/Warsaw', 'Asia/Tokyo'],
    },
  });
  picker.create();
});

