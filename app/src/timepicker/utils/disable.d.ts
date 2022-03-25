import { OptionTypes } from './types';
export declare const createDisabledTime: (options: any) => {
    value: {
        removedStartedHour: any;
        removedEndHour: any;
        rangeArrHour: string[];
        isInterval: boolean;
        startMinutes: string[];
        endMinutes: string[];
        endType: string | undefined;
        startType: string | undefined;
        pmHours?: undefined;
        amHours?: undefined;
        removedAmHour?: undefined;
        removedPmHour?: undefined;
        hours?: undefined;
        minutes?: undefined;
    };
} | {
    value: {
        isInterval: boolean;
        endType: string | undefined;
        startType: string | undefined;
        pmHours: string[];
        amHours: string[];
        startMinutes: string[];
        endMinutes: string[];
        removedAmHour: string;
        removedPmHour: string;
        removedStartedHour?: undefined;
        removedEndHour?: undefined;
        rangeArrHour?: undefined;
        hours?: undefined;
        minutes?: undefined;
    };
} | {
    value: {
        hours: any;
        minutes: any;
        removedStartedHour?: undefined;
        removedEndHour?: undefined;
        rangeArrHour?: undefined;
        isInterval?: undefined;
        startMinutes?: undefined;
        endMinutes?: undefined;
        endType?: undefined;
        startType?: undefined;
        pmHours?: undefined;
        amHours?: undefined;
        removedAmHour?: undefined;
        removedPmHour?: undefined;
    };
} | undefined;
export declare const checkDisabledHoursAndMinutes: (value: (string | number)[] | string | number | undefined, type: 'hour' | 'minutes', clockType?: OptionTypes['clockType'], arrValue?: (string | number)[] | undefined) => boolean | undefined;
export declare const checkedDisabledValuesInterval: (hour?: any, minutes?: any, type?: any, interval?: any) => boolean;
