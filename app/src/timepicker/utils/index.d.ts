import { optionTypes } from './types';
declare const toType: (obj: null | undefined | string | number) => string;
declare const isElement: (obj: string | any[] | any) => string;
declare const typeCheckConfig: (componentName: string, config: {
    [x: string]: any;
}, configTypes: {
    [x: string]: any;
}) => void;
declare const getConfig: (options?: optionTypes | undefined, defaultOptions?: Record<string, unknown> | undefined) => Record<string, unknown>;
declare const getScrollbarWidth: () => number;
declare const getRadians: (el: number) => number;
declare const getClickTouchPosition: (event: {
    preventDefault?: any;
    type?: any;
    target?: any;
    clientX?: any;
    clientY?: any;
    touches?: any;
}, object: HTMLElement, isMobile?: boolean) => Record<string, unknown> | boolean;
declare const getMathDegIncrement: (degrees: number, num: number) => number;
declare const hasClass: (el: HTMLElement | null, selector: string) => boolean;
declare const getInputValue: (el: HTMLInputElement, clockType?: string | undefined) => any;
declare const createNewEvent: (el: Element, eventName: string, value: {
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
declare const getBrowser: () => boolean;
declare const getIncrementTimes: (degrees: number, type: any, count: number) => number;
export { createNewEvent, getBrowser, getClickTouchPosition, getConfig, getIncrementTimes, getInputValue, getMathDegIncrement, getRadians, getScrollbarWidth, hasClass, isElement, toType, typeCheckConfig, };
