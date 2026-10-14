import { getWheelTemplate } from '../../../../src/utils/template/wheel';
import TimepickerUI from '../../../../src/timepicker/TimepickerUI';
import { PluginRegistry } from '../../../../src/core/PluginRegistry';
import { WheelPlugin } from '../../../../src/plugins/wheel';

describe('compact-wheel period column uses labels (bug #6)', () => {
  afterEach(() => {
    TimepickerUI.destroyAll();
    document.body.innerHTML = '';
  });

  it('renders localized AM/PM text but keeps AM/PM values', () => {
    const host = document.createElement('div');
    host.innerHTML = getWheelTemplate('12h', 1, true, 'tp', { am: 'rano', pm: 'po poł.' });
    const items = [...host.querySelectorAll('.tp-ui-wheel-ampm .tp-ui-wheel-item')];
    expect(items.map((i) => i.textContent)).toEqual(['rano', 'po poł.']);
    expect(items.map((i) => i.getAttribute('data-value'))).toEqual(['AM', 'PM']);
  });

  it('passes labels.am/pm from the options to the template', () => {
    PluginRegistry.register(WheelPlugin);
    const input = document.createElement('input');
    input.value = '02:30 PM';
    document.body.appendChild(input);
    const picker = new TimepickerUI(input, {
      ui: { mode: 'compact-wheel', animation: false },
      labels: { am: 'rano', pm: 'po poł.' },
    });
    picker.create();
    picker.open();
    const texts = [...document.querySelectorAll('.tp-ui-modal .tp-ui-wheel-ampm .tp-ui-wheel-item')].map(
      (i) => i.textContent,
    );
    expect(texts).toEqual(['rano', 'po poł.']);
  });
});
