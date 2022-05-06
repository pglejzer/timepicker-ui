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
export declare const initCallback: (callback?: (() => void) | undefined) => void;
export declare const timeConversion: (str?: string) => string;
export declare const debounce: <T extends (...args: any[]) => ReturnType<T>>(callback: T, timeout: number) => (...args: Parameters<T>) => void;
