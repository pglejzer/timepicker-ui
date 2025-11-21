// import {
//   createDisabledTime,
//   checkDisabledHoursAndMinutes,
//   checkedDisabledValuesInterval,
// } from '../../../src/utils/time/disable';
// import type { OptionTypes } from '../../../src/types/types';

// describe('utils/time/disable', () => {
//   describe('createDisabledTime', () => {
//     it('should return undefined for empty options', () => {
//       const result = createDisabledTime({} as OptionTypes);
//       expect(result).toBeUndefined();
//     });

//     it('should return undefined when disabledTime is not an object', () => {
//       const options = { disabledTime: [] as unknown as OptionTypes['disabledTime'] } as OptionTypes;
//       const result = createDisabledTime(options);
//       expect(result).toBeUndefined();
//     });

//     it('should handle disabled hours for 12h clock', () => {
//       const options: OptionTypes = {
//         clockType: '12h',
//         disabledTime: {
//           hours: [1, 2, 3],
//         },
//       };
//       const result = createDisabledTime(options);

//       expect(result).toBeDefined();
//       expect(result?.value.hours).toEqual(['1', '2', '3']);
//     });

//     it('should handle disabled minutes', () => {
//       const options: OptionTypes = {
//         clockType: '12h',
//         disabledTime: {
//           minutes: [5, 15, 30, 45],
//         },
//       };
//       const result = createDisabledTime(options);

//       expect(result).toBeDefined();
//       expect(result?.value.minutes).toContain('05');
//       expect(result?.value.minutes).toContain('15');
//       expect(result?.value.minutes).toContain('30');
//       expect(result?.value.minutes).toContain('45');
//     });

//     it('should throw error for invalid 12h hour value', () => {
//       const options: OptionTypes = {
//         clockType: '12h',
//         disabledTime: {
//           hours: [13],
//         },
//       };

//       expect(() => createDisabledTime(options)).toThrow('The disabled hours value has to be less than 13');
//     });

//     it('should throw error for invalid 24h hour value', () => {
//       const options: OptionTypes = {
//         clockType: '24h',
//         disabledTime: {
//           hours: [25],
//         },
//       };

//       expect(() => createDisabledTime(options)).toThrow('The disabled hours value has to be less than 24');
//     });

//     it('should throw error for invalid minutes value', () => {
//       const options: OptionTypes = {
//         clockType: '12h',
//         disabledTime: {
//           minutes: [60],
//         },
//       };

//       expect(() => createDisabledTime(options)).toThrow('The disabled minutes value has to be less than 60');
//     });

//     describe('interval handling', () => {
//       it.skip('should handle single 12h interval', () => {
//         const options: OptionTypes = {
//           clockType: '12h',
//           disabledTime: {
//             interval: '10:00 AM - 12:00 PM',
//           },
//         };

//         const result = createDisabledTime(options);

//         expect(result).toBeDefined();
//         expect(result?.value.isInterval).toBe(true);
//         expect(result?.value.rangeArrHour).toBeDefined();
//       });

//       it('should handle multiple 12h intervals', () => {
//         const options: OptionTypes = {
//           clockType: '12h',
//           disabledTime: {
//             interval: ['9:00 AM - 10:00 AM', '2:00 PM - 4:00 PM'],
//           },
//         };

//         const result = createDisabledTime(options);

//         expect(result).toBeDefined();
//         expect(result?.value.isInterval).toBe(true);
//         expect(result?.value.intervals).toHaveLength(2);
//       });

//       it('should handle single 24h interval', () => {
//         const options: OptionTypes = {
//           clockType: '24h',
//           disabledTime: {
//             interval: '10:00 - 14:00',
//           },
//         };

//         const result = createDisabledTime(options);

//         expect(result).toBeDefined();
//         expect(result?.value.isInterval).toBe(true);
//       });

//       it('should throw error for overlapping intervals', () => {
//         const options: OptionTypes = {
//           clockType: '12h',
//           disabledTime: {
//             interval: ['9:00 AM - 11:00 AM', '10:00 AM - 12:00 PM'],
//           },
//         };

//         expect(() => createDisabledTime(options)).toThrow('Overlapping time intervals detected');
//       });

//       it('should throw error when clockType is missing for intervals', () => {
//         const options: OptionTypes = {
//           disabledTime: {
//             interval: '10:00 AM - 12:00 PM',
//           },
//         };

//         expect(() => createDisabledTime(options)).toThrow(
//           'clockType is required when using disabledTime.interval',
//         );
//       });

//       it('should handle intervals with start minutes', () => {
//         const options: OptionTypes = {
//           clockType: '12h',
//           disabledTime: {
//             interval: '10:30 AM - 12:00 PM',
//           },
//         };

//         const result = createDisabledTime(options);

//         expect(result).toBeDefined();
//         expect(result?.value.startMinutes).toBeDefined();
//       });

//       it('should handle intervals with end minutes', () => {
//         const options: OptionTypes = {
//           clockType: '12h',
//           disabledTime: {
//             interval: '10:00 AM - 11:45 PM',
//           },
//         };

//         const result = createDisabledTime(options);

//         expect(result).toBeDefined();
//         expect(result?.value.endMinutes).toBeDefined();
//       });

//       it('should handle AM to PM intervals', () => {
//         const options: OptionTypes = {
//           clockType: '12h',
//           disabledTime: {
//             interval: '10:00 AM - 2:00 PM',
//           },
//         };

//         const result = createDisabledTime(options);

//         expect(result).toBeDefined();
//         expect(result?.value.startType).toBe('AM');
//         expect(result?.value.endType).toBe('PM');
//         expect(result?.value.amHours).toBeDefined();
//         expect(result?.value.pmHours).toBeDefined();
//       });
//     });

//     it('should pad single digit hours', () => {
//       const options: OptionTypes = {
//         clockType: '24h',
//         disabledTime: {
//           hours: [0, 1, 2, 3],
//         },
//       };

//       const result = createDisabledTime(options);

//       expect(result?.value.hours).toContain('00');
//       expect(result?.value.hours).toContain('1');
//       expect(result?.value.hours).toContain('2');
//       expect(result?.value.hours).toContain('3');
//     });
//   });

//   describe('checkDisabledHoursAndMinutes', () => {
//     it('should return undefined for undefined value', () => {
//       const result = checkDisabledHoursAndMinutes(undefined, 'hour');
//       expect(result).toBeUndefined();
//     });

//     it('should validate hour against disabled array', () => {
//       const result = checkDisabledHoursAndMinutes('10', 'hour', '12h', [1, 2, 3]);
//       expect(result).toBe(true);
//     });

//     it('should invalidate disabled hour', () => {
//       const result = checkDisabledHoursAndMinutes('2', 'hour', '12h', [1, 2, 3]);
//       expect(result).toBe(false);
//     });

//     it('should validate minutes against disabled array', () => {
//       const result = checkDisabledHoursAndMinutes('45', 'minutes', '12h', [15, 30]);
//       expect(result).toBe(true);
//     });

//     it('should invalidate disabled minutes', () => {
//       const result = checkDisabledHoursAndMinutes('30', 'minutes', '12h', [15, 30]);
//       expect(result).toBe(false);
//     });

//     it('should handle array of values', () => {
//       const result = checkDisabledHoursAndMinutes([1, 2, 3], 'hour', '12h');
//       expect(result).toBe(true);
//     });

//     it('should detect invalid values in array', () => {
//       const result = checkDisabledHoursAndMinutes([1, 2, 25], 'hour', '24h');
//       expect(result).toBe(false);
//     });

//     it('should handle numeric input', () => {
//       const result = checkDisabledHoursAndMinutes(10, 'hour', '12h', [1, 2, 3]);
//       expect(result).toBe(true);
//     });
//   });

//   describe('checkedDisabledValuesInterval', () => {
//     it('should return false for missing parameters', () => {
//       expect(checkedDisabledValuesInterval()).toBe(false);
//       expect(checkedDisabledValuesInterval('10')).toBe(false);
//       expect(checkedDisabledValuesInterval('10', '30')).toBe(false);
//     });

//     it('should detect time within 12h interval', () => {
//       const result = checkedDisabledValuesInterval('10', '30', 'AM', '9:00 AM - 11:00 AM', '12h');

//       expect(result).toBe(false);
//     });

//     it('should detect time outside 12h interval', () => {
//       const result = checkedDisabledValuesInterval('2', '00', 'PM', '9:00 AM - 11:00 AM', '12h');

//       expect(result).toBe(true);
//     });

//     it('should detect time within 24h interval', () => {
//       const result = checkedDisabledValuesInterval('10', '30', undefined, '09:00 - 11:00', '24h');

//       expect(result).toBe(false);
//     });

//     it('should detect time outside 24h interval', () => {
//       const result = checkedDisabledValuesInterval('14', '00', undefined, '09:00 - 11:00', '24h');

//       expect(result).toBe(true);
//     });

//     it('should handle multiple intervals', () => {
//       const intervals = ['9:00 AM - 11:00 AM', '2:00 PM - 4:00 PM'];

//       const result1 = checkedDisabledValuesInterval('10', '00', 'AM', intervals, '12h');
//       expect(result1).toBe(false);

//       const result2 = checkedDisabledValuesInterval('3', '00', 'PM', intervals, '12h');
//       expect(result2).toBe(false);

//       const result3 = checkedDisabledValuesInterval('12', '00', 'PM', intervals, '12h');
//       expect(result3).toBe(true);
//     });

//     it('should handle boundary times correctly', () => {
//       const interval = '10:00 AM - 12:00 PM';

//       const atStart = checkedDisabledValuesInterval('10', '00', 'AM', interval, '12h');
//       expect(atStart).toBe(false);

//       const atEnd = checkedDisabledValuesInterval('12', '00', 'PM', interval, '12h');
//       expect(atEnd).toBe(false);
//     });

//     it('should warn for invalid 12h format in 24h mode', () => {
//       const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

//       checkedDisabledValuesInterval('10', '30', 'AM', '10:00 AM - 12:00 PM', '24h');

//       expect(consoleWarnSpy).toHaveBeenCalled();
//       consoleWarnSpy.mockRestore();
//     });

//     it('should warn for invalid 24h format in 12h mode', () => {
//       const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

//       checkedDisabledValuesInterval('10', '30', 'AM', '10:00 - 12:00', '12h');

//       expect(consoleWarnSpy).toHaveBeenCalled();
//       consoleWarnSpy.mockRestore();
//     });
//   });
// });
