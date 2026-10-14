import TimepickerUI from '../../../src/timepicker/TimepickerUI';

describe('update() merges every option group (bug #13)', () => {
  afterEach(() => {
    TimepickerUI.destroyAll();
    document.body.innerHTML = '';
  });

  it('updates range, timezone, wheel and clearBehavior and keeps their other defaults', () => {
    const input = document.createElement('input');
    document.body.appendChild(input);
    const picker = new TimepickerUI(input);
    picker.create();
    picker.update({
      options: {
        range: { enabled: true },
        timezone: { enabled: true, label: 'Strefa' },
        wheel: { hideFooter: true },
        clearBehavior: { clearInput: false },
      },
    });
    expect(picker.options.range.enabled).toBe(true);
    expect(picker.options.range.fromLabel).toBe('From');
    expect(picker.options.timezone.label).toBe('Strefa');
    expect(picker.options.wheel.hideFooter).toBe(true);
    expect(picker.options.clearBehavior.clearInput).toBe(false);
  });
});
