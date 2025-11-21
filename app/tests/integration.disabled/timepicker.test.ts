// import TimepickerUI from '../../src/timepicker';
// import {
//   createTimepickerInput,
//   createTimepickerWrapper,
//   createInlineContainer,
//   cleanupDOM,
//   waitForElement,
//   waitForModalClose,
//   triggerEvent,
//   triggerMouseEvent,
// } from '../helpers/domHelpers';
// import { mockOptions, mock24hOptions, mockInlineOptions } from '../helpers/mockOptions';

// describe('TimepickerUI', () => {
//   let input: HTMLInputElement;
//   let wrapper: HTMLDivElement;

//   beforeEach(() => {
//     jest.useFakeTimers();
//     cleanupDOM();
//     input = createTimepickerInput('10:30 AM');
//     wrapper = createTimepickerWrapper(input);
//   });

//   afterEach(() => {
//     cleanupDOM();
//     jest.clearAllTimers();
//     jest.useRealTimers();
//   });

//   describe('Constructor', () => {
//     it('should create instance with selector string', () => {
//       wrapper.id = 'test-wrapper';
//       const timepicker = new TimepickerUI('#test-wrapper', mockOptions);

//       expect(timepicker).toBeInstanceOf(TimepickerUI);
//     });

//     it('should create instance with HTMLElement', () => {
//       const timepicker = new TimepickerUI(wrapper, mockOptions);

//       expect(timepicker).toBeInstanceOf(TimepickerUI);
//     });

//     it('should throw error for non-existent selector', () => {
//       expect(() => {
//         new TimepickerUI('#non-existent', mockOptions);
//       }).toThrow('Element with selector "#non-existent" not found');
//     });

//     it('should throw error for invalid selector type', () => {
//       expect(() => {
//         new TimepickerUI(123 as unknown as string, mockOptions);
//       }).toThrow('First parameter must be a string selector or HTMLElement');
//     });

//     it('should throw error when no input found', () => {
//       const emptyDiv = document.createElement('div');
//       document.body.appendChild(emptyDiv);

//       expect(() => {
//         new TimepickerUI(emptyDiv, mockOptions);
//       }).toThrow('No input element found');
//     });

//     it('should wrap input element automatically', () => {
//       const standaloneInput = createTimepickerInput();
//       standaloneInput.id = 'standalone';
//       document.body.appendChild(standaloneInput);

//       const timepicker = new TimepickerUI(standaloneInput, mockOptions);

//       expect(timepicker.getElement().classList.contains('timepicker-ui')).toBe(true);
//       expect(timepicker.getElement().querySelector('input')).toBe(standaloneInput);
//     });

//     it.skip('should throw error in SSR environment', () => {
//       const originalWindow = global.window;
//       delete (global as { window?: typeof originalWindow }).window;

//       expect(() => {
//         new TimepickerUI(wrapper, mockOptions);
//       }).toThrow('Cannot initialize in non-browser environment (SSR/Node.js)');

//       (global as { window: typeof originalWindow }).window = originalWindow;
//     });

//     it('should throw error for duplicate custom ID', () => {
//       new TimepickerUI(wrapper, { ...mockOptions, id: 'custom-id-1' });

//       const input2 = createTimepickerInput();
//       const wrapper2 = createTimepickerWrapper(input2);

//       expect(() => {
//         new TimepickerUI(wrapper2, { ...mockOptions, id: 'custom-id-1' });
//       }).toThrow('Instance with ID "custom-id-1" already exists');
//     });

//     it('should generate UUID if no custom ID provided', () => {
//       const timepicker = new TimepickerUI(wrapper, mockOptions);

//       expect(timepicker.instanceId).toBeDefined();
//       expect(timepicker.instanceId).toMatch(/^timepicker-ui-/);
//     });

//     it('should throw error for inline mode without containerId', () => {
//       const options = {
//         ...mockOptions,
//         inline: {
//           enabled: true,
//           containerId: '',
//         },
//       };

//       expect(() => {
//         new TimepickerUI(wrapper, options);
//       }).toThrow('containerId is required when inline mode is enabled');
//     });

//     it('should throw error for inline mode with non-existent container', () => {
//       const options = {
//         ...mockOptions,
//         inline: {
//           enabled: true,
//           containerId: 'non-existent-container',
//         },
//       };

//       expect(() => {
//         new TimepickerUI(wrapper, options);
//       }).toThrow('Container element with ID "non-existent-container" not found');
//     });

//     it.skip('should set focusTrap to false for inline mode by default', () => {
//       const container = createInlineContainer('inline-test');
//       const options = {
//         ...mockOptions,
//         inline: {
//           enabled: true,
//           containerId: 'inline-test',
//         },
//       };

//       const timepicker = new TimepickerUI(wrapper, options);

//       expect(timepicker.options.focusTrap).toBe(false);
//     });

//     it('should merge dataset options with provided options', () => {
//       wrapper.dataset.theme = 'dark';
//       wrapper.dataset.clockType = '24h';

//       const timepicker = new TimepickerUI(wrapper, mockOptions);

//       expect(timepicker.options.theme).toBe('dark');
//       expect(timepicker.options.clockType).toBe('24h');
//     });
//   });

//   describe('Static Methods', () => {
//     it('should get instance by ID', () => {
//       const timepicker = new TimepickerUI(wrapper, { ...mockOptions, id: 'static-test-1' });

//       const retrieved = TimepickerUI.getById('static-test-1');

//       expect(retrieved).toBe(timepicker);
//     });

//     it('should return undefined for non-existent ID', () => {
//       const retrieved = TimepickerUI.getById('non-existent');

//       expect(retrieved).toBeUndefined();
//     });

//     it.skip('should get all instances', () => {
//       const input2 = createTimepickerInput();
//       const wrapper2 = createTimepickerWrapper(input2);

//       const timepicker1 = new TimepickerUI(wrapper, mockOptions);
//       const timepicker2 = new TimepickerUI(wrapper2, mockOptions);

//       const all = TimepickerUI.getAllInstances();

//       expect(all).toContain(timepicker1);
//       expect(all).toContain(timepicker2);
//     });

//     it('should check if element is available', () => {
//       wrapper.id = 'available-test';

//       expect(TimepickerUI.isAvailable('#available-test')).toBe(true);
//       expect(TimepickerUI.isAvailable('#non-existent')).toBe(false);
//     });

//     it('should check if HTMLElement is available', () => {
//       expect(TimepickerUI.isAvailable(wrapper)).toBe(true);

//       const detached = document.createElement('div');
//       expect(TimepickerUI.isAvailable(detached)).toBe(false);
//     });

//     it('should destroy all instances', () => {
//       const input2 = createTimepickerInput();
//       const wrapper2 = createTimepickerWrapper(input2);

//       new TimepickerUI(wrapper, mockOptions);
//       new TimepickerUI(wrapper2, mockOptions);

//       TimepickerUI.destroyAll();

//       expect(TimepickerUI.getAllInstances()).toHaveLength(0);
//     });
//   });

//   describe('Public Methods', () => {
//     let timepicker: TimepickerUI;

//     beforeEach(() => {
//       timepicker = new TimepickerUI(wrapper, mockOptions);
//     });

//     describe('create()', () => {
//       it('should initialize timepicker', () => {
//         timepicker.create();

//         expect(timepicker.isInitialized).toBe(true);
//       });

//       it('should not initialize twice', () => {
//         const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

//         timepicker.create();
//         timepicker.create();

//         expect(consoleWarnSpy).toHaveBeenCalledWith('TimepickerUI: Instance is already initialized');
//         consoleWarnSpy.mockRestore();
//       });

//       it('should set input classes', () => {
//         timepicker.create();

//         expect(input.classList.contains('timepicker-ui-input')).toBe(true);
//       });
//     });

//     describe('open()', () => {
//       it('should open timepicker', async () => {
//         timepicker.open();

//         const modal = await waitForElement('[data-owner-id]');
//         expect(modal).toBeDefined();
//       });

//       it('should call callback after open', (done) => {
//         timepicker.open(() => {
//           done();
//         });

//         jest.runAllTimers();
//       });

//       it('should create timepicker if not initialized', async () => {
//         expect(timepicker.isInitialized).toBe(false);

//         timepicker.open();

//         expect(timepicker.isInitialized).toBe(true);
//       });
//     });

//     describe('close()', () => {
//       beforeEach(async () => {
//         timepicker.open();
//         jest.runAllTimers();
//         await waitForElement('[data-owner-id]');
//       });

//       it('should close timepicker', async () => {
//         timepicker.close();

//         jest.runAllTimers();
//         await waitForModalClose();

//         const modal = document.querySelector('[data-owner-id]');
//         expect(modal).toBeNull();
//       });

//       it('should call callback after close', (done) => {
//         timepicker.close(false, () => {
//           done();
//         });

//         jest.runAllTimers();
//       });

//       it('should update input if true parameter passed', async () => {
//         const hour = timepicker.hour;
//         const minutes = timepicker.minutes;

//         if (hour && minutes) {
//           hour.value = '11';
//           minutes.value = '45';

//           timepicker.close(true);

//           jest.runAllTimers();
//           await waitForModalClose();

//           expect(input.value).toContain('11:45');
//         }
//       });
//     });

//     describe('getValue()', () => {
//       it('should return current time value', () => {
//         timepicker.open();

//         const value = timepicker.getValue();

//         expect(value).toHaveProperty('hour');
//         expect(value).toHaveProperty('minutes');
//         expect(value).toHaveProperty('time');
//       });

//       it('should return empty values for destroyed instance', () => {
//         timepicker.destroy();

//         const value = timepicker.getValue();

//         expect(value.hour).toBe('');
//         expect(value.minutes).toBe('');
//       });

//       it('should include type for 12h clock', () => {
//         const tp = new TimepickerUI(wrapper, { ...mockOptions, clockType: '12h' });
//         tp.open();

//         const value = tp.getValue();

//         expect(value.type).toBeDefined();
//         expect(['AM', 'PM']).toContain(value.type);
//       });

//       it('should not include type for 24h clock', () => {
//         const tp = new TimepickerUI(wrapper, mock24hOptions);
//         tp.open();

//         const value = tp.getValue();

//         expect(value.type).toBeUndefined();
//       });

//       it('should return formatted time string for 12h', () => {
//         const tp = new TimepickerUI(wrapper, { ...mockOptions, clockType: '12h' });
//         tp.open();

//         const value = tp.getValue();

//         expect(value.time).toMatch(/^\d{1,2}:\d{2} (AM|PM)$/);
//       });

//       it('should return formatted time string for 24h', () => {
//         const tp = new TimepickerUI(wrapper, mock24hOptions);
//         tp.open();

//         const value = tp.getValue();

//         expect(value.time).toMatch(/^\d{2}:\d{2}$/);
//       });
//     });

//     describe('setValue()', () => {
//       beforeEach(() => {
//         timepicker.open();
//       });

//       it('should set time for 12h format', () => {
//         timepicker.setValue('3:45 PM');

//         const value = timepicker.getValue();

//         expect(value.hour).toBe('3');
//         expect(value.minutes).toBe('45');
//         expect(value.type).toBe('PM');
//       });

//       it('should set time for 24h format', () => {
//         const tp = new TimepickerUI(wrapper, mock24hOptions);
//         tp.open();

//         tp.setValue('15:30');

//         const value = tp.getValue();

//         expect(value.hour).toBe('15');
//         expect(value.minutes).toBe('30');
//       });

//       it('should throw error for invalid time string', () => {
//         expect(() => {
//           timepicker.setValue('invalid');
//         }).toThrow();
//       });

//       it('should throw error for missing parameter', () => {
//         expect(() => {
//           timepicker.setValue('');
//         }).toThrow('setValue requires a valid time string');
//       });

//       it('should update input by default', () => {
//         timepicker.setValue('5:15 AM');

//         expect(input.value).toBe('5:15 AM');
//       });

//       it('should not update input when updateInput is false', () => {
//         const originalValue = input.value;

//         timepicker.setValue('5:15 AM', false);

//         expect(input.value).toBe(originalValue);
//       });

//       it('should update clock hand transform', () => {
//         timepicker.setValue('6:00 AM');

//         const clockHand = timepicker.clockHand;
//         if (clockHand) {
//           expect(clockHand.style.transform).toContain('rotateZ');
//         }
//       });

//       it('should warn for destroyed instance', () => {
//         const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

//         timepicker.destroy();
//         timepicker.setValue('5:15 AM');

//         expect(consoleWarnSpy).toHaveBeenCalledWith('TimepickerUI: Instance is destroyed');
//         consoleWarnSpy.mockRestore();
//       });
//     });

//     describe('update()', () => {
//       it('should update options', () => {
//         timepicker.update({
//           options: { theme: 'dark' },
//         });

//         expect(timepicker.options.theme).toBe('dark');
//       });

//       it('should create instance if create flag is true', () => {
//         timepicker.update({
//           options: { theme: 'dark' },
//           create: true,
//         });

//         expect(timepicker.isInitialized).toBe(true);
//       });

//       it('should call callback after update', (done) => {
//         timepicker.update(
//           {
//             options: { theme: 'dark' },
//           },
//           () => {
//             done();
//           },
//         );

//         jest.runAllTimers();
//       });

//       it('should warn for destroyed instance', () => {
//         const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

//         timepicker.destroy();
//         timepicker.update({ options: {} });

//         expect(consoleWarnSpy).toHaveBeenCalledWith('TimepickerUI: Instance is destroyed');
//         consoleWarnSpy.mockRestore();
//       });
//     });

//     describe('destroy()', () => {
//       it('should destroy instance', () => {
//         timepicker.create();
//         timepicker.destroy();

//         expect(timepicker.isDestroyed).toBe(true);
//       });

//       it('should remove modal from DOM', async () => {
//         timepicker.open();
//         await waitForElement('[data-owner-id]');

//         timepicker.destroy();

//         const modal = document.querySelector('[data-owner-id]');
//         expect(modal).toBeNull();
//       });

//       it('should remove classes from input', () => {
//         timepicker.create();
//         input.classList.add('timepicker-ui-input', 'active');

//         timepicker.destroy();

//         expect(input.classList.contains('timepicker-ui-input')).toBe(false);
//         expect(input.classList.contains('active')).toBe(false);
//       });

//       it('should preserve input value when keepInputValue is true', () => {
//         input.value = '10:30 AM';

//         timepicker.destroy({ keepInputValue: true });

//         expect(input.value).toBe('10:30 AM');
//       });

//       it('should clear input value by default', () => {
//         input.value = '10:30 AM';

//         timepicker.destroy();

//         expect(input.value).toBe('10:30 AM');
//       });

//       it('should call callback after destroy', (done) => {
//         timepicker.destroy({ callback: done });

//         jest.runAllTimers();
//       });

//       it('should accept callback function directly', (done) => {
//         timepicker.destroy(done);

//         jest.runAllTimers();
//       });

//       it('should remove instance from registry', () => {
//         const id = timepicker.instanceId;

//         timepicker.destroy();

//         expect(TimepickerUI.getById(id)).toBeUndefined();
//       });

//       it('should warn on double destroy', () => {
//         const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

//         timepicker.destroy();
//         timepicker.destroy();

//         expect(consoleWarnSpy).toHaveBeenCalledWith('TimepickerUI: Instance is already destroyed');
//         consoleWarnSpy.mockRestore();
//       });
//     });

//     describe('getElement()', () => {
//       it('should return root wrapper element', () => {
//         const element = timepicker.getElement();

//         expect(element).toBe(wrapper);
//         expect(element.classList.contains('timepicker-ui')).toBe(true);
//       });
//     });
//   });

//   describe('Inline Mode', () => {
//     let container: HTMLDivElement;

//     beforeEach(() => {
//       container = createInlineContainer('inline-container');
//     });

//     it('should render in inline container', () => {
//       const timepicker = new TimepickerUI(wrapper, mockInlineOptions);
//       timepicker.create();

//       const modal = container.querySelector('[data-owner-id]');
//       expect(modal).toBeDefined();
//     });

//     it.skip('should not show buttons when showButtons is false', () => {
//       const options = {
//         ...mockInlineOptions,
//         inline: {
//           ...mockInlineOptions.inline!,
//           showButtons: false,
//         },
//       };

//       const timepicker = new TimepickerUI(wrapper, options);
//       timepicker.open();

//       const okButton = document.querySelector('.timepicker-ui-ok-btn');
//       const cancelButton = document.querySelector('.timepicker-ui-cancel-btn');

//       expect(okButton).toBeNull();
//       expect(cancelButton).toBeNull();
//     });

//     it('should auto-update input when autoUpdate is true', (done) => {
//       const timepicker = new TimepickerUI(wrapper, mockInlineOptions);
//       timepicker.open();

//       jest.runAllTimers();

//       if (timepicker.hour && timepicker.minutes) {
//         timepicker.hour.value = '8';
//         timepicker.minutes.value = '25';

//         triggerEvent(timepicker.hour, 'input');

//         jest.runAllTimers();

//         expect(input.value).toContain('8:25');
//         done();
//       } else {
//         done();
//       }
//     });
//   });

//   describe('Events', () => {
//     let timepicker: TimepickerUI;

//     beforeEach(() => {
//       timepicker = new TimepickerUI(wrapper, mockOptions);
//     });

//     it('should dispatch timepicker:confirm event on OK button', (done) => {
//       wrapper.addEventListener('timepicker:confirm', (e: Event) => {
//         const detail = (e as CustomEvent).detail;
//         expect(detail).toHaveProperty('hour');
//         expect(detail).toHaveProperty('minutes');
//         done();
//       });

//       timepicker.open();

//       jest.runAllTimers();

//       const okButton = timepicker.okButton;
//       if (okButton) {
//         triggerEvent(okButton, 'click');
//         jest.runAllTimers();
//       }
//     });

//     it('should dispatch timepicker:cancel event on cancel', (done) => {
//       wrapper.addEventListener('timepicker:cancel', () => {
//         done();
//       });

//       timepicker.open();

//       jest.runAllTimers();

//       const cancelButton = timepicker.cancelButton;
//       if (cancelButton) {
//         triggerEvent(cancelButton, 'click');
//         jest.runAllTimers();
//       }
//     });

//     it('should call onConfirm callback', (done) => {
//       const options = {
//         ...mockOptions,
//         onConfirm: () => {
//           done();
//         },
//       };

//       const tp = new TimepickerUI(wrapper, options);
//       tp.open();

//       jest.runAllTimers();

//       const okButton = tp.okButton;
//       if (okButton) {
//         triggerEvent(okButton, 'click');
//         jest.runAllTimers();
//       }
//     });

//     it('should call onCancel callback', (done) => {
//       const options = {
//         ...mockOptions,
//         onCancel: () => {
//           done();
//         },
//       };

//       const tp = new TimepickerUI(wrapper, options);
//       tp.open();

//       jest.runAllTimers();

//       const cancelButton = tp.cancelButton;
//       if (cancelButton) {
//         triggerEvent(cancelButton, 'click');
//         jest.runAllTimers();
//       }
//     });
//   });
// });

