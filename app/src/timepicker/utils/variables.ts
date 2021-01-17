const name = 'timepicker-ui';
const mouseEvents = 'mousedown mouseup mousemove mouseleave mouseover';
const touchEvents = 'touchstart touchmove touchend';
const allEvents: string = mouseEvents.concat(` ${touchEvents}`);
const selectorActive = 'active';

// eslint-disable-next-line object-curly-newline
export { name, mouseEvents, touchEvents, allEvents, selectorActive };
