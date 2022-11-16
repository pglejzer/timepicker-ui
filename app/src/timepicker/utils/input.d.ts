import { OptionTypes } from './types';
export declare const getInputValue: (el: HTMLInputElement, clockType?: string | undefined, currentTime?: OptionTypes['currentTime'], updateOptions?: boolean | undefined) => {
    hour: string;
    minutes: string;
    type: string | undefined;
    error?: undefined;
    currentLength?: undefined;
    currentType?: undefined;
    currentHour?: undefined;
    currentMin?: undefined;
} | {
    error: string;
    hour?: undefined;
    minutes?: undefined;
    type?: undefined;
    currentLength?: undefined;
    currentType?: undefined;
    currentHour?: undefined;
    currentMin?: undefined;
} | {
    error: string;
    currentLength: number;
    hour?: undefined;
    minutes?: undefined;
    type?: undefined;
    currentType?: undefined;
    currentHour?: undefined;
    currentMin?: undefined;
} | {
    error: string;
    currentLength: number;
    currentType: string;
    hour?: undefined;
    minutes?: undefined;
    type?: undefined;
    currentHour?: undefined;
    currentMin?: undefined;
} | {
    error: string;
    currentHour: number;
    currentMin: string | number;
    currentType: string;
    hour?: undefined;
    minutes?: undefined;
    type?: undefined;
    currentLength?: undefined;
} | {
    error: string;
    currentHour: number;
    currentMin: string | number;
    hour?: undefined;
    minutes?: undefined;
    type?: undefined;
    currentLength?: undefined;
    currentType?: undefined;
} | {
    hour: string;
    minutes: string;
    type?: undefined;
    error?: undefined;
    currentLength?: undefined;
    currentType?: undefined;
    currentHour?: undefined;
    currentMin?: undefined;
};
export declare const handleValueAndCheck: (val: string | number | null, type: 'hour' | 'minutes', clockType?: OptionTypes['clockType']) => undefined | boolean;
