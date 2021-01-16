// Thanks for Bootstrap 5 - alpha version
const toType = (obj) => {
  if (obj === null || obj === undefined) {
    return `${obj}`;
  }

  return {}.toString
    .call(obj)
    .match(/\s([a-z]+)/i)[1]
    .toLowerCase();
};

// Thanks for Bootstrap 5 - alpha version
const isElement = (obj) => (obj[0] || obj).nodeType;

// Thanks for Bootstrap 5 - alpha version
const typeCheckConfig = (componentName, config, configTypes) => {
  Object.keys(configTypes).forEach((property) => {
    const expectedTypes = configTypes[property];
    const value = config[property];
    const valueType = value && isElement(value) ? 'el' : toType(value);

    if (!new RegExp(expectedTypes).test(valueType)) {
      throw new Error(
        `${componentName.toUpperCase()}: ` +
          `Option "${property}" provided type "${valueType}" ` +
          `but expected type "${expectedTypes}".`
      );
    }
  });
};

// Thanks for Bootstrap 5 - alpha version
const getConfig = (options, defaultOptions, defaultType, name) => {
  const config = {
    ...defaultOptions,
    ...options,
  };
  typeCheckConfig(name, config, defaultType);
  return config;
};

// Thanks for Bootstrap 5 - alpha version
const getScrollbarWidth = () => {
  const scrollDiv = document.createElement('div');
  scrollDiv.className = 'timepicker-ui-measure';
  document.body.appendChild(scrollDiv);
  const scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;

  document.body.removeChild(scrollDiv);
  return scrollbarWidth;
};

const getRadians = (el) => el * (Math.PI / 180);

const getClickTouchPosition = (event, object, isMobile = false) => {
  const { clientX, clientY, touches } = event;
  const { left, top } = object.getBoundingClientRect();
  let obj = {};

  if (!isMobile) {
    obj = {
      x: clientX - left,
      y: clientY - top,
    };
  } else if (isMobile && touches !== undefined) {
    if (Object.keys(touches).length > 0) {
      const { clientX: clx, clientY: cly } = touches[0];

      obj = {
        x: clx - left,
        y: cly - top,
      };
    }
  }

  if (Object.keys(obj).length === 0 && obj.constructor === Object) return;

  return obj;
};

const getMathDegIncrement = (degrees, num) => Math.round(degrees / num) * num;

const hasClass = (el, selector) => el.classList.contains(selector);

const getInputValue = ({ value }) => {
  if (value === '') return;

  const [hour, type] = value.split(' ');
  const [hourSplit, minutesSplit] = hour.split(':');

  let min = Number(minutesSplit);
  const hor = Number(hourSplit);

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

const createNewEvent = (el, eventName, value) => {
  const ev = new CustomEvent(eventName, { detail: value });

  el.dispatchEvent(ev);
};

const getBrowser = () =>
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

export {
  toType,
  isElement,
  typeCheckConfig,
  getConfig,
  getScrollbarWidth,
  getRadians,
  getClickTouchPosition,
  getInputValue,
  createNewEvent,
  getBrowser,
  hasClass,
  getMathDegIncrement,
};
