//Thanks for Bootstrap 5 - alpha version
export const getConfig = (options, defaultOptions, defaultType, name) => {
  const config = {
    ...defaultOptions,
    ...options,
  };
  typeCheckConfig(name, config, defaultType);
  return config;
};

const stripNameRegex = /\..*/;
const stripUidRegex = /::\d+$/;
const eventRegistry = {}; // Events storage
let uidEvent = 1;
const customEvents = {
  mouseenter: 'mouseover',
  mouseleave: 'mouseout',
};

//Thanks for Bootstrap 5 - alpha version
export const toType = (obj) => {
  if (obj === null || obj === undefined) {
    return `${obj}`;
  }

  return {}.toString
    .call(obj)
    .match(/\s([a-z]+)/i)[1]
    .toLowerCase();
};

//Thanks for Bootstrap 5 - alpha version
export const isElement = (obj) => (obj[0] || obj).nodeType;

//Thanks for Bootstrap 5 - alpha version
export const typeCheckConfig = (componentName, config, configTypes) => {
  Object.keys(configTypes).forEach((property) => {
    const expectedTypes = configTypes[property];
    const value = config[property];
    const valueType = value && isElement(value) ? 'element' : toType(value);

    if (!new RegExp(expectedTypes).test(valueType)) {
      throw new Error(
        `${componentName.toUpperCase()}: ` +
          `Option "${property}" provided type "${valueType}" ` +
          `but expected type "${expectedTypes}".`
      );
    }
  });
};

//Thanks for Bootstrap 5 - alpha version
export const getScrollbarWidth = () => {
  const scrollDiv = document.createElement('div');
  scrollDiv.className = 'timepicker-ui-measure';
  document.body.appendChild(scrollDiv);
  const scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;

  document.body.removeChild(scrollDiv);
  return scrollbarWidth;
};

export const getRadians = (el) => el * (Math.PI / 180);

export const clickOrTouchPosition = ({ clientX, clientY, touches }, object, isMobile = false) => {
  const { left, top } = object.getBoundingClientRect();
  let obj = {};
  if (!isMobile) {
    obj = {
      x: clientX - left,
      y: clientY - top,
    };
  } else if (isMobile && Object.keys(touches).length > 0) {
    obj = {
      x: touches[0].clientX - left,
      y: touches[0].clientY - top,
    };
  }

  return obj;
};

export const mathDegreesIncrement = (degrees, num) => {
  return Math.round(degrees / num) * num;
};

export const hasClass = (element, selector) => {
  return element.classList.contains(selector);
};

export const getInputValue = ({ value }) => {
  if (value === '') return;

  const [hour, type] = value.split(' ');
  const [hourSplit, minutesSplit] = hour.split(':');

  let min = Number(minutesSplit);
  let hor = Number(hourSplit);

  if (hor > 12 || min > 59 || hor === 0) return;

  if (type !== 'AM' && type !== 'PM') return;

  if (min < 10) {
    min = `0${min}`;
  } else if (min === 0) {
    min = '00';
  }

  return {
    hour: hor < 10 ? `0${hor}` : hor.toString(),
    minutes: min.toString(),
    type,
  };
};

export const createNewEvent = (element, eventName, value) => {
  const ev = new CustomEvent(eventName, { detail: value });

  element.dispatchEvent(ev);
};

export const whichBrowser = () =>
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
