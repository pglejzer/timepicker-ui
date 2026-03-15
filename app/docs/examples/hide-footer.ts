import { TimepickerUI } from './setup';

const noFooterThemes = [
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

noFooterThemes.forEach((theme) => {
  new TimepickerUI(`#nofooter-${theme}`, {
    ui: { mode: 'compact-wheel', theme, wheel: { hideFooter: true, commitOnScroll: true } },
  }).create();
});

