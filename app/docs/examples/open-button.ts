import { TimepickerUI } from './setup';

new TimepickerUI('#open-button-end', {
  behavior: { returnFocus: true },
}).create();

new TimepickerUI('#open-button-start', {
  clock: { type: '24h' },
  behavior: { returnFocus: true },
}).create();
