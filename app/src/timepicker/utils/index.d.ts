import { optionTypes } from './types';
declare const toType: (obj: null | undefined | string | number) => string;
declare const isElement: (obj: string | any[] | any) => string;
declare const typeCheckConfig: (componentName: string, config: {
    [x: string]: any;
}, configTypes: {
    [x: string]: any;
}) => void;
declare const getConfig: (options: optionTypes, defaultOptions: Record<string, unknown>) => Record<string, unknown>;
declare const getScrollbarWidth: () => number;
declare const getRadians: (el: number) => number;
declare const getClickTouchPosition: (event: {
    preventDefault?: any;
    type?: any;
    target?: any;
    clientX?: any;
    clientY?: any;
    touches?: any;
}, object: HTMLElement, isMobile?: boolean) => Record<string, unknown>;
declare const getMathDegIncrement: (degrees: number, num: number) => number;
declare const hasClass: (el: HTMLElement, selector: string) => boolean;
declare const getInputValue: (el: HTMLInputElement) => Record<string, string>;
declare const createNewEvent: (el: Element, eventName: string, value: {
    hour?: string | null;
    minutes?: string | null;
    type?: string | null;
    degreesHours?: number;
    degreesMinutes?: number;
    hourNotAccepted?: string | null;
    minutesNotAccepted?: string | null;
    eventType?: any;
    test?: string;
}) => void;
declare const getBrowser: () => boolean;
export { toType, isElement, typeCheckConfig, getConfig, getScrollbarWidth, getRadians, getClickTouchPosition, getInputValue, createNewEvent, getBrowser, hasClass, getMathDegIncrement, };
