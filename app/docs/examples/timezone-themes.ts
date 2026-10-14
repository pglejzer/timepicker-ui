import { TimepickerUI } from './setup';

const timezoneBasic = new TimepickerUI('#timezone-basic', {
  ui: { theme: 'basic', viewSwitch: true },
  timezone: { enabled: true, default: 'America/New_York' },
});
timezoneBasic.create();

const timezoneCrane = new TimepickerUI('#timezone-crane', {
  ui: { theme: 'crane', viewSwitch: true },
  timezone: { enabled: true, default: 'Europe/London' },
});
timezoneCrane.create();

const timezoneCraneStraight = new TimepickerUI('#timezone-crane-straight', {
  ui: { theme: 'crane-straight', viewSwitch: true },
  timezone: { enabled: true, default: 'Asia/Tokyo' },
});
timezoneCraneStraight.create();

const timezoneM3 = new TimepickerUI('#timezone-m3', {
  ui: { theme: 'm3-green', viewSwitch: true },
  timezone: { enabled: true, default: 'America/Los_Angeles' },
});
timezoneM3.create();

const timezoneDark = new TimepickerUI('#timezone-dark', {
  ui: { theme: 'dark', viewSwitch: true },
  timezone: { enabled: true, default: 'Europe/Paris' },
});
timezoneDark.create();

const timezoneM2 = new TimepickerUI('#timezone-m2', {
  ui: { theme: 'm2', viewSwitch: true },
  timezone: { enabled: true, default: 'Australia/Sydney' },
});
timezoneM2.create();

const timezoneGlassmorphic = new TimepickerUI('#timezone-glassmorphic', {
  ui: { theme: 'glassmorphic', viewSwitch: true },
  timezone: { enabled: true, default: 'America/Chicago' },
});
timezoneGlassmorphic.create();

const timezonePastel = new TimepickerUI('#timezone-pastel', {
  ui: { theme: 'pastel', viewSwitch: true },
  timezone: { enabled: true, default: 'Europe/Berlin' },
});
timezonePastel.create();

const timezoneAI = new TimepickerUI('#timezone-ai', {
  ui: { theme: 'ai', viewSwitch: true },
  timezone: { enabled: true, default: 'Asia/Dubai' },
});
timezoneAI.create();

const timezoneCyberpunk = new TimepickerUI('#timezone-cyberpunk', {
  ui: { theme: 'cyberpunk', viewSwitch: true },
  timezone: { enabled: true, default: 'America/Toronto' },
});
timezoneCyberpunk.create();

