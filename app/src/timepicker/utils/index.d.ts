import { OptionTypes } from './types';
export declare const toType: (obj: null | undefined | string | number) => string;
export declare const isElement: (obj: string | any[] | any) => string;
export declare const typeCheckConfig: (componentName: string, config: {
    [x: string]: any;
}, configTypes: {
    [x: string]: any;
}) => void;
export declare const getConfig: (options?: OptionTypes | undefined, defaultOptions?: Record<string, unknown> | undefined) => Record<string, unknown>;
export declare const getScrollbarWidth: () => number;
export declare const getRadians: (el: number) => number;
export declare const getClickTouchPosition: (event: TouchEvent, object: HTMLElement, isMobile?: boolean) => {
    x: number;
    y: number;
} | undefined;
export declare const getMathDegIncrement: (degrees: number, num: number) => number;
export declare const hasClass: (el: HTMLElement | null | Element, selector: string) => boolean;
export declare const getInputValue: (el: HTMLInputElement, clockType?: string | undefined) => {
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
export declare const createNewEvent: (el: Element, eventName: string, value: {
    hour?: string | null;
    minutes?: string | null;
    type?: string | null;
    degreesHours?: number | null;
    degreesMinutes?: number | null;
    hourNotAccepted?: string | null;
    minutesNotAccepted?: string | null;
    eventType?: any;
    test?: string;
    error?: string;
    currentHour?: string | number;
    currentMin?: string | number;
    currentType?: string;
    currentLength?: string | number;
}) => void;
export declare const getBrowser: () => boolean;
export declare const getIncrementTimes: (degrees: number, type: any, count: number) => number;
export declare const createObjectFromData: (obj: OptionTypes) => any;
export declare const range: (start?: string | number | undefined, stop?: string | number | undefined) => number[];
export declare const reverseRange: (start?: string | number | undefined, stop?: string | number | undefined) => number[];
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
export declare const initCallback: (callback?: (() => void) | undefined) => void;
export declare const handleValueAndCheck: (val: string | number | null, type: 'hour' | 'minutes', clockType?: OptionTypes['clockType']) => undefined | boolean;
export declare const checkDisabledHoursAndMinutes: (value: (string | number)[] | string | number | undefined, type: 'hour' | 'minutes', clockType?: OptionTypes['clockType'], arrValue?: (string | number)[] | undefined) => boolean | undefined;
export declare const timeConversion: (str?: string) => string;
export declare const checkedDisabledValuesInterval: (hour?: any, minutes?: any, type?: any, interval?: any) => boolean;
