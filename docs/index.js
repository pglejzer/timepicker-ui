/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Timepicker": () => /* reexport safe */ _timepicker__WEBPACK_IMPORTED_MODULE_0__.default
/* harmony export */ });
/* harmony import */ var _timepicker__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);



/***/ }),
/* 1 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _styles_main_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6);
/* harmony import */ var _templates__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7);
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }




var DEFAULT_OPTIONS = {
  appendModalSelector: '',
  backdrop: true,
  enableScrollbar: false,
  mobile: false,
  inputTemplate: '',
  incrementMinutes: 1,
  incrementHours: 1,
  switchToMinutesAfterSelectOur: false
};
var DEFAULT_TYPE = {
  appendModalSelector: 'string',
  backdrop: 'boolean',
  enableScrollbar: 'boolean',
  mobile: 'boolean',
  inputTemplate: 'string',
  incrementMinutes: 'number',
  incrementHours: 'number',
  switchToMinutesAfterSelectOur: 'boolean'
};
var NAME = 'timepicker-ui';
var MOUSE_EVENTS = 'mousedown mouseup mousemove mouseleave mouseover';
var TOUCH_EVENTS = 'touchstart touchmove touchend';
var ALL_EVENTS = MOUSE_EVENTS.concat(" ".concat(TOUCH_EVENTS));
var SELECTOR_ACTIVE = 'active';

var Timepicker = /*#__PURE__*/function () {
  function Timepicker(_element, options) {
    var _this = this;

    _classCallCheck(this, Timepicker);

    _defineProperty(this, "init", function () {
      _this._setTimepickerClassToElement();

      _this._setScrollbarOrNot();

      _this._handleOpenOnClick();
    });

    _defineProperty(this, "open", function () {
      _this.init();
    });

    _defineProperty(this, "close", function () {
      _this._isMouseMove = false;
      document.removeEventListener('mousemove', _this._handleMoveHand);
      document.removeEventListener('mousemove', _this._handleEventToMoveHand);
      window.removeEventListener('mousemove', _this._handleMoveHand);
      window.removeEventListener('mousemove', _this._handleEventToMoveHand);

      _this._element.removeEventListener('mousemove', _this._handleMoveHand);

      _this._element.removeEventListener('mousemove', _this._handleEventToMoveHand);

      _this.modalElement.removeEventListener('mousemove', _this._handleMoveHand);

      _this.modalElement.removeEventListener('mousemove', _this._handleEventToMoveHand);

      _this.modalElement.remove();
    });

    _defineProperty(this, "_handleOpenOnClick", function () {
      _this.openElement.addEventListener('click', function () {
        if (_this._options.backdrop) _this._setModalTemplate();

        _this._setClassActiveToHourOnOpen();

        _this._setBgColorToCirleWithHourTips();

        if (!_this._options.mobile) _this._setNumbersToClockFace();

        _this._toggleClassActiveToValueTips(_this.hour.textContent);

        _this._setTransformToCircleWithSwitchesHour(_this.hour.textContent);

        _this._handleAnimationClock();

        _this._handleMinutesClick();

        _this._handleHourClick();

        _this._handleAmClick();

        _this._handlePmClick();

        _this._handleMoveHand();

        _this._handleCancelButton();
      });
    });

    _defineProperty(this, "_handleCancelButton", function () {
      var dcc = document.querySelector('.timepicker-ui-cancel-btn');
      dcc.addEventListener('click', function (event) {
        _this.close();
      });
    });

    _defineProperty(this, "_setBgColorToCirleWithHourTips", function () {
      if (_this.minutesTips !== null) return;
      _this.circle.style.backgroundColor = '#6200EE';
    });

    _defineProperty(this, "_setBgColorToCircleWithMinutesTips", function () {
      if (_templates__WEBPACK_IMPORTED_MODULE_2__.numberOfMinutes.includes(_this.minutes.textContent)) {
        _this.circle.style.backgroundColor = '#6200EE';

        _this.circle.classList.remove('small-circle');
      }
    });

    _defineProperty(this, "_removeBgColorToCirleWithMinutesTips", function () {
      if (_templates__WEBPACK_IMPORTED_MODULE_2__.numberOfMinutes.includes(_this.minutes.textContent)) return;
      _this.circle.style.backgroundColor = '';

      _this.circle.classList.add('small-circle');
    });

    _defineProperty(this, "_setTimepickerClassToElement", function () {
      _this._element.classList.add(NAME);
    });

    _defineProperty(this, "_setClassActiveToHourOnOpen", function () {
      _this.hour.classList.add(SELECTOR_ACTIVE);
    });

    _defineProperty(this, "_setMinutesToClock", function (value) {
      _this.tipsWrapper.innerHTML = '';

      _this._removeBgColorToCirleWithMinutesTips();

      _this._setNumbersToClockFace(_templates__WEBPACK_IMPORTED_MODULE_2__.numberOfMinutes, 'timepicker-ui-minutes-time');

      _this._toggleClassActiveToValueTips(value);

      _this._setTransformToCircleWithSwitchesMinutes(value);
    });

    _defineProperty(this, "_setHoursToClock", function (value) {
      _this.tipsWrapper.innerHTML = '';

      _this._setBgColorToCirleWithHourTips();

      _this._setNumbersToClockFace();

      _this._toggleClassActiveToValueTips(value);

      _this._setTransformToCircleWithSwitchesHour(value);
    });

    _defineProperty(this, "_setTransformToCircleWithSwitchesHour", function (val) {
      var value = Number(val);
      var degrees = value > 12 ? value * 30 - 360 : value * 30;
      _this.clockHand.style.transform = "rotateZ(".concat(degrees, "deg)");
    });

    _defineProperty(this, "_setTransformToCircleWithSwitchesMinutes", function (val) {
      _this.clockHand.style.transform = "rotateZ(".concat(Number(val) * 6, "deg)");
    });

    _defineProperty(this, "_handleAmClick", function () {
      _this.AM.addEventListener('click', function (ev) {
        var target = ev.target;
        target.classList.add(SELECTOR_ACTIVE);

        _this.PM.classList.remove(SELECTOR_ACTIVE);
      });
    });

    _defineProperty(this, "_handlePmClick", function () {
      _this.PM.addEventListener('click', function (ev) {
        var target = ev.target;
        target.classList.add(SELECTOR_ACTIVE);

        _this.AM.classList.remove(SELECTOR_ACTIVE);
      });
    });

    _defineProperty(this, "_handleAnimationClock", function () {
      setTimeout(function () {
        _this.clockFace.classList.add('timepicker-ui-clock-animation');

        setTimeout(function () {
          _this.clockFace.classList.remove('timepicker-ui-clock-animation');
        }, 600);
      }, 150);
    });

    _defineProperty(this, "_handleHourClick", function () {
      _this.hour.addEventListener('click', function (ev) {
        var target = ev.target;

        _this._setHoursToClock(target.textContent);

        target.classList.add(SELECTOR_ACTIVE);

        _this.minutes.classList.remove(SELECTOR_ACTIVE);

        _this.circle.classList.remove('small-circle');
      });
    });

    _defineProperty(this, "_handleMinutesClick", function () {
      _this.minutes.addEventListener('click', function (ev) {
        var target = ev.target;

        _this._setMinutesToClock(target.textContent);

        target.classList.add(SELECTOR_ACTIVE);

        _this.hour.classList.remove(SELECTOR_ACTIVE);
      });
    });

    _defineProperty(this, "_handleEventToMoveHand", function (event) {
      event.preventDefault();
      var type = event.type,
          target = event.target;
      var _this$_options = _this._options,
          incrementMinutes = _this$_options.incrementMinutes,
          incrementHours = _this$_options.incrementHours,
          switchToMinutesAfterSelectOur = _this$_options.switchToMinutesAfterSelectOur;

      var _clickOrTouchPosition = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.clickOrTouchPosition)(event, _this.clockFace),
          x = _clickOrTouchPosition.x,
          y = _clickOrTouchPosition.y;

      var clockFaceRadius = _this.clockFace.offsetWidth / 2;
      var rtangens = Math.atan2(y - clockFaceRadius, x - clockFaceRadius);

      if (type === 'mouseup' || type === 'touchend') {
        _this._isMouseMove = false;
        if (switchToMinutesAfterSelectOur) _this.minutes.click();
        return;
      }

      if (type === 'mousedown' || type === 'mousemove' || type === 'touchmove' || type === 'touchmove') {
        if (type === 'mousedown' || type === 'touchstart' || type === 'touchmove') {
          if ((0,_utils__WEBPACK_IMPORTED_MODULE_1__.hasClass)(target, 'timepicker-ui-clock-face') || (0,_utils__WEBPACK_IMPORTED_MODULE_1__.hasClass)(target, 'timepicker-ui-circle-hand') || (0,_utils__WEBPACK_IMPORTED_MODULE_1__.hasClass)(target, 'timepicker-ui-hour-time-12') || (0,_utils__WEBPACK_IMPORTED_MODULE_1__.hasClass)(target, 'timepicker-ui-minutes-time') || (0,_utils__WEBPACK_IMPORTED_MODULE_1__.hasClass)(target, 'timepicker-ui-clock-hand') || (0,_utils__WEBPACK_IMPORTED_MODULE_1__.hasClass)(target, 'timepicker-ui-value-tips')) {
            _this._isMouseMove = true;
          }
        }
      }

      if (!_this._isMouseMove) return;

      if (_this.minutesTips !== null) {
        var degrees = Math.trunc(rtangens * 180 / Math.PI) + 90;

        if (incrementMinutes === 5) {
          degrees = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.mathDegreesIncrement)(degrees, 30);
        } else if (incrementMinutes === 10) {
          degrees = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.mathDegreesIncrement)(degrees, 60);
        } else if (incrementMinutes === 15) {
          degrees = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.mathDegreesIncrement)(degrees, 60);
        }

        var minute;

        if (degrees < 0) {
          minute = Math.round(360 + degrees / 6) % 60;
          degrees = 360 + Math.round(degrees / 6) * 6;
        } else {
          minute = Math.round(degrees / 6) % 60;
          degrees = Math.round(degrees / 6) * 6;
        }

        _this.minutes.innerText = minute >= 10 ? minute : "0".concat(minute);
        _this.clockHand.style.transform = "rotateZ(".concat(degrees, "deg)");

        _this._toggleClassActiveToValueTips(_this.minutes.textContent);

        _this._removeBgColorToCirleWithMinutesTips();

        _this._setBgColorToCircleWithMinutesTips();
      }

      if (_this.hourTips !== null) {
        var _degrees = Math.trunc(rtangens * 180 / Math.PI) + 90;

        _degrees = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.mathDegreesIncrement)(_degrees, 30);

        if (incrementHours === 2) {
          _degrees = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.mathDegreesIncrement)(_degrees, 60);
        } else if (incrementHours === 3) {
          _degrees = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.mathDegreesIncrement)(_degrees, 90);
        }

        _this.clockHand.style.transform = "rotateZ(".concat(_degrees, "deg)");
        var hour;

        if (_degrees < 0) {
          hour = Math.round(360 + _degrees / 30) % 12;
          _degrees = 360 + _degrees;
        } else {
          hour = Math.round(_degrees / 30) % 12;

          if (hour === 0 || hour > 12) {
            hour = 12;
          }
        }

        _this.hour.innerText = hour > 9 ? hour : "0".concat(hour);

        _this._toggleClassActiveToValueTips(hour);
      }
    });

    _defineProperty(this, "_handleMoveHand", function () {
      (0,_utils__WEBPACK_IMPORTED_MODULE_1__.addListenerMulti)(document, ALL_EVENTS, function (event) {
        return _this._handleEventToMoveHand(event);
      });
    });

    _defineProperty(this, "_toggleClassActiveToValueTips", function (value) {
      var element = _toConsumableArray(_this.allValueTips).find(function (tip) {
        return Number(tip.innerText) === Number(value);
      });

      _toConsumableArray(_this.allValueTips).forEach(function (element) {
        return element.classList.remove('active');
      });

      if (element === undefined) return;
      element.classList.add('active');
    });

    _defineProperty(this, "_setModalTemplate", function () {
      var appendModalSelector = _this._options.appendModalSelector;

      if (appendModalSelector === '') {
        document.body.insertAdjacentHTML('afterend', _this.modalTemplate);
      } else {
        var element = document.querySelector(appendModalSelector);
        element.insertAdjacentHTML('beforeend', _this.modalTemplate);
      }
    });

    _defineProperty(this, "_setScrollbarOrNot", function () {
      var enableScrollbar = _this._options.enableScrollbar;

      if (!enableScrollbar) {
        document.body.style.overflowY = 'hidden';
        document.body.style.paddingRight = "".concat((0,_utils__WEBPACK_IMPORTED_MODULE_1__.getScrollbarWidth)(), "px");
      }
    });

    _defineProperty(this, "_setNumbersToClockFace", function () {
      var array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : _templates__WEBPACK_IMPORTED_MODULE_2__.numberOfHours12;
      var classToAdd = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'timepicker-ui-hour-time-12';
      var el = 360 / array.length;
      var clockWidth = (_this.clockFace.offsetWidth - 32) / 2;
      var clockHeight = (_this.clockFace.offsetHeight - 32) / 2;
      var radius = clockWidth - 9;
      array.forEach(function (num, index) {
        var angle = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.getRadians)(index * el);
        var span = document.createElement('span');
        var spanTips = document.createElement('span');
        spanTips.innerHTML = num;
        spanTips.classList.add('timepicker-ui-value-tips');
        span.classList.add(classToAdd);
        span.style.left = "".concat(clockWidth + Math.sin(angle) * radius - span.offsetWidth, "px");
        span.style.bottom = "".concat(clockHeight + Math.cos(angle) * radius - span.offsetHeight, "px");
        span.appendChild(spanTips);

        _this.tipsWrapper.appendChild(span);
      });
    });

    this._element = _element;
    this._options = (0,_utils__WEBPACK_IMPORTED_MODULE_1__.getConfig)(options, DEFAULT_OPTIONS, DEFAULT_TYPE, NAME);
    this._isMouseMove = false;
    this.init();
  } // getters


  _createClass(Timepicker, [{
    key: "modalTemplate",
    get: function get() {
      if (!this._options.mobile) {
        return (0,_templates__WEBPACK_IMPORTED_MODULE_2__.getModalTemplate)();
      } else {
        return (0,_templates__WEBPACK_IMPORTED_MODULE_2__.getMobileModalTemplate)();
      }
    }
  }, {
    key: "modalElement",
    get: function get() {
      return document.querySelector('.timepicker-ui-modal');
    }
  }, {
    key: "clockFace",
    get: function get() {
      return document.querySelector('.timepicker-ui-clock-face');
    }
  }, {
    key: "input",
    get: function get() {
      return document.querySelector('.timepicker-ui-input');
    }
  }, {
    key: "clockHand",
    get: function get() {
      return document.querySelector('.timepicker-ui-clock-hand');
    }
  }, {
    key: "circle",
    get: function get() {
      return document.querySelector('.timepicker-ui-circle-hand');
    }
  }, {
    key: "tipsWrapper",
    get: function get() {
      return document.querySelector('.timepicker-ui-tips-wrapper');
    }
  }, {
    key: "minutes",
    get: function get() {
      return document.querySelector('.timepicker-ui-minutes');
    }
  }, {
    key: "hour",
    get: function get() {
      return document.querySelector('.timepicker-ui-hour');
    }
  }, {
    key: "AM",
    get: function get() {
      return document.querySelector('.timepicker-ui-am');
    }
  }, {
    key: "PM",
    get: function get() {
      return document.querySelector('.timepicker-ui-pm');
    }
  }, {
    key: "minutesTips",
    get: function get() {
      return document.querySelector('.timepicker-ui-minutes-time');
    }
  }, {
    key: "hourTips",
    get: function get() {
      return document.querySelector('.timepicker-ui-hour-time-12');
    }
  }, {
    key: "allValueTips",
    get: function get() {
      return document.querySelectorAll('.timepicker-ui-value-tips');
    }
  }, {
    key: "button",
    get: function get() {
      return document.querySelector('.timepicker-ui-button');
    }
  }, {
    key: "openElementData",
    get: function get() {
      return Object.values(this._element.querySelector('[data-open]').dataset)[0];
    }
  }, {
    key: "openElement",
    get: function get() {
      return this._element.querySelector("[data-open='".concat(this.openElementData, "']"));
    }
  }, {
    key: "cancelButton",
    get: function get() {
      return document.querySelector('.timepicker-ui-cancel-btn');
    }
  }, {
    key: "okButton",
    get: function get() {
      return document.querySelector('.timepicker-ui-ok-btn');
    } // public

  }], [{
    key: "NAME",
    get: function get() {
      return NAME;
    }
  }]);

  return Timepicker;
}();

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Timepicker);
var test = document.querySelector('.test');
var btn = document.querySelector('.test-btn');
var xd = new Timepicker(test);

/***/ }),
/* 2 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_main_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_main_scss__WEBPACK_IMPORTED_MODULE_1__.default, options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_main_scss__WEBPACK_IMPORTED_MODULE_1__.default.locals || {});

/***/ }),
/* 3 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



var isOldIE = function isOldIE() {
  var memo;
  return function memorize() {
    if (typeof memo === 'undefined') {
      // Test for IE <= 9 as proposed by Browserhacks
      // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
      // Tests for existence of standard globals is to allow style-loader
      // to operate correctly into non-standard environments
      // @see https://github.com/webpack-contrib/style-loader/issues/177
      memo = Boolean(window && document && document.all && !window.atob);
    }

    return memo;
  };
}();

var getTarget = function getTarget() {
  var memo = {};
  return function memorize(target) {
    if (typeof memo[target] === 'undefined') {
      var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

      if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
        try {
          // This will throw an exception if access to iframe is blocked
          // due to cross-origin restrictions
          styleTarget = styleTarget.contentDocument.head;
        } catch (e) {
          // istanbul ignore next
          styleTarget = null;
        }
      }

      memo[target] = styleTarget;
    }

    return memo[target];
  };
}();

var stylesInDom = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDom.length; i++) {
    if (stylesInDom[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var index = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3]
    };

    if (index !== -1) {
      stylesInDom[index].references++;
      stylesInDom[index].updater(obj);
    } else {
      stylesInDom.push({
        identifier: identifier,
        updater: addStyle(obj, options),
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function insertStyleElement(options) {
  var style = document.createElement('style');
  var attributes = options.attributes || {};

  if (typeof attributes.nonce === 'undefined') {
    var nonce =  true ? __webpack_require__.nc : 0;

    if (nonce) {
      attributes.nonce = nonce;
    }
  }

  Object.keys(attributes).forEach(function (key) {
    style.setAttribute(key, attributes[key]);
  });

  if (typeof options.insert === 'function') {
    options.insert(style);
  } else {
    var target = getTarget(options.insert || 'head');

    if (!target) {
      throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
    }

    target.appendChild(style);
  }

  return style;
}

function removeStyleElement(style) {
  // istanbul ignore if
  if (style.parentNode === null) {
    return false;
  }

  style.parentNode.removeChild(style);
}
/* istanbul ignore next  */


var replaceText = function replaceText() {
  var textStore = [];
  return function replace(index, replacement) {
    textStore[index] = replacement;
    return textStore.filter(Boolean).join('\n');
  };
}();

function applyToSingletonTag(style, index, remove, obj) {
  var css = remove ? '' : obj.media ? "@media ".concat(obj.media, " {").concat(obj.css, "}") : obj.css; // For old IE

  /* istanbul ignore if  */

  if (style.styleSheet) {
    style.styleSheet.cssText = replaceText(index, css);
  } else {
    var cssNode = document.createTextNode(css);
    var childNodes = style.childNodes;

    if (childNodes[index]) {
      style.removeChild(childNodes[index]);
    }

    if (childNodes.length) {
      style.insertBefore(cssNode, childNodes[index]);
    } else {
      style.appendChild(cssNode);
    }
  }
}

function applyToTag(style, options, obj) {
  var css = obj.css;
  var media = obj.media;
  var sourceMap = obj.sourceMap;

  if (media) {
    style.setAttribute('media', media);
  } else {
    style.removeAttribute('media');
  }

  if (sourceMap && typeof btoa !== 'undefined') {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    while (style.firstChild) {
      style.removeChild(style.firstChild);
    }

    style.appendChild(document.createTextNode(css));
  }
}

var singleton = null;
var singletonCounter = 0;

function addStyle(obj, options) {
  var style;
  var update;
  var remove;

  if (options.singleton) {
    var styleIndex = singletonCounter++;
    style = singleton || (singleton = insertStyleElement(options));
    update = applyToSingletonTag.bind(null, style, styleIndex, false);
    remove = applyToSingletonTag.bind(null, style, styleIndex, true);
  } else {
    style = insertStyleElement(options);
    update = applyToTag.bind(null, style, options);

    remove = function remove() {
      removeStyleElement(style);
    };
  }

  update(obj);
  return function updateStyle(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
        return;
      }

      update(obj = newObj);
    } else {
      remove();
    }
  };
}

module.exports = function (list, options) {
  options = options || {}; // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
  // tags it will allow on a page

  if (!options.singleton && typeof options.singleton !== 'boolean') {
    options.singleton = isOldIE();
  }

  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    if (Object.prototype.toString.call(newList) !== '[object Array]') {
      return;
    }

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDom[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDom[_index].references === 0) {
        stylesInDom[_index].updater();

        stylesInDom.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),
/* 4 */
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
___CSS_LOADER_EXPORT___.push([module.id, "@import url(https://fonts.googleapis.com/css2?family=Roboto:wght@100;300;400;500;700;900&display=swap);"]);
// Module
___CSS_LOADER_EXPORT___.push([module.id, "* {\n  margin: 0;\n  padding: 0;\n  font-family: 'Roboto', sans-serif; }\n\nbody {\n  height: 1000px; }\n\n.timepicker-ui-modal {\n  position: fixed;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  background-color: rgba(156, 155, 155, 0.6);\n  z-index: 5000; }\n\n.timepicker-ui-wrapper, .timepicker-ui-wrapper-mobile {\n  position: fixed;\n  z-index: 5001;\n  width: 328px;\n  height: 500px;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  background-color: #fff;\n  border-radius: 4px;\n  box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 5px 8px 0px rgba(0, 0, 0, 0.14), 0px 1px 14px 0px rgba(0, 0, 0, 0.12);\n  display: flex;\n  flex-direction: column; }\n\n@media screen and (min-width: 320px) and (max-width: 767px) and (orientation: landscape) {\n  .timepicker-ui-wrapper {\n    flex-direction: row;\n    height: 328px;\n    width: 500px; } }\n\n@media screen and (max-width: 330px) and (orientation: portrait) {\n  .timepicker-ui-wrapper {\n    width: 315px; } }\n\n@media screen and (max-width: 330px) {\n  .timepicker-ui-wrapper-mobile {\n    width: 315px; } }\n\n.timepicker-ui-wrapper-mobile {\n  height: 218px; }\n\n.timepicker-ui-header, .timepicker-ui-header-mobile {\n  padding-top: 52px;\n  padding-bottom: 36px;\n  padding-right: 24px;\n  padding-left: 24px;\n  height: 104px;\n  display: flex;\n  flex-direction: row;\n  justify-content: center;\n  align-items: center;\n  position: relative; }\n\n.timepicker-ui-header-mobile {\n  padding-bottom: 0; }\n\n@media screen and (min-width: 320px) and (max-width: 767px) and (orientation: landscape) {\n  .timepicker-ui-header {\n    height: auto;\n    flex-direction: column; } }\n\n.timepicker-ui-select-time, .timepicker-ui-select-time-mobile {\n  text-transform: uppercase;\n  position: absolute;\n  top: calc(28px - .75rem);\n  left: 24px;\n  font-size: .75rem;\n  color: #A9A9A9; }\n\n.timepicker-ui-body, .timepicker-ui-body-mobile {\n  height: 256px;\n  padding-right: 36px;\n  padding-left: 36px; }\n\n@media screen and (min-width: 320px) and (max-width: 767px) and (orientation: landscape) {\n  .timepicker-ui-body {\n    padding-right: 0;\n    padding-left: 0;\n    display: flex;\n    align-items: center;\n    justify-content: center; } }\n\n@media screen and (min-width: 320px) and (max-width: 767px) and (orientation: landscape) {\n  .timepicker-ui-wrapper-landspace {\n    display: flex;\n    flex-direction: column;\n    width: 100%; } }\n\n.timepicker-ui-footer, .timepicker-ui-footer-mobile {\n  height: 76px;\n  display: flex;\n  justify-content: space-between; }\n\n@media screen and (min-width: 320px) and (max-width: 767px) and (orientation: landscape) {\n  .timepicker-ui-footer {\n    justify-content: flex-end; } }\n\n.timepicker-ui-clock-face, .timepicker-ui-clock-face-mobile {\n  background-color: #E0E0E0;\n  height: 100%;\n  width: 100%;\n  border-radius: 100%;\n  position: relative; }\n\n@media screen and (min-width: 320px) and (max-width: 767px) and (orientation: landscape) {\n  .timepicker-ui-clock-face {\n    height: 220px;\n    width: 220px;\n    top: 15px; } }\n\n.timepicker-ui-dot, .timepicker-ui-dot-mobile {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  user-select: none;\n  touch-action: none;\n  transform: translate(-50%, -50%);\n  background-color: #6200EE;\n  height: 8px;\n  width: 8px;\n  border-radius: 100%; }\n\n.timepicker-ui-hour-time-12, .timepicker-ui-hour-time-12-mobile, .timepicker-ui-minutes-time, .timepicker-ui-minutes-time-mobile {\n  position: absolute;\n  width: 32px;\n  height: 32px;\n  text-align: center;\n  cursor: pointer;\n  font-size: 1.1rem;\n  display: flex;\n  justify-content: center;\n  align-items: center; }\n  .timepicker-ui-hour-time-12 span, .timepicker-ui-hour-time-12-mobile span, .timepicker-ui-minutes-time span, .timepicker-ui-minutes-time-mobile span {\n    touch-action: none;\n    user-select: none; }\n\n.timepicker-ui-wrapper-time, .timepicker-ui-wrapper-time-mobile {\n  display: flex;\n  margin-right: 10px; }\n\n@media screen and (min-width: 320px) and (max-width: 767px) and (orientation: landscape) {\n  .timepicker-ui-wrapper-time {\n    margin-right: 0; } }\n\n.timepicker-ui-wrapper-time-mobile {\n  position: relative; }\n\n.timepicker-ui-hour, .timepicker-ui-minutes, .timepicker-ui-hour-mobile, .timepicker-ui-minutes-mobile {\n  width: 96px;\n  height: 80px;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  font-size: 3.6rem;\n  background-color: #E4E4E4;\n  border-radius: 7px;\n  cursor: pointer;\n  transition: all .3s ease; }\n  .timepicker-ui-hour:hover, .timepicker-ui-hour.active, .timepicker-ui-minutes:hover, .timepicker-ui-minutes.active, .timepicker-ui-hour-mobile:hover, .timepicker-ui-hour-mobile.active, .timepicker-ui-minutes-mobile:hover, .timepicker-ui-minutes-mobile.active {\n    color: #6200EE;\n    background-color: #ECE0FD; }\n\n.timepicker-ui-hour-mobile, .timepicker-ui-minutes-mobile {\n  height: 70px; }\n\n.timepicker-ui-dots, .timepicker-ui-dots-mobile {\n  padding-left: 5px;\n  padding-right: 5px;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  font-size: 3.6rem;\n  user-select: none;\n  touch-action: none; }\n\n.timepicker-ui-wrapper-type-time, .timepicker-ui-wrapper-type-time-mobile {\n  display: flex;\n  flex-direction: column;\n  height: 80px;\n  justify-content: center;\n  align-items: center;\n  font-size: 1rem;\n  font-weight: 500;\n  color: #787878; }\n\n@media screen and (min-width: 320px) and (max-width: 767px) and (orientation: landscape) {\n  .timepicker-ui-wrapper-type-time {\n    flex-direction: row;\n    width: 100%; } }\n\n.timepicker-ui-wrapper-type-time-mobile {\n  height: 70px; }\n\n.timepicker-ui-am, .timepicker-ui-pm, .timepicker-ui-am-mobile, .timepicker-ui-pm-mobile {\n  height: calc(40px - 2px);\n  width: calc(52px - 2px);\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  border: 2px solid #D6D6D6;\n  transition: all .3s ease;\n  cursor: pointer; }\n  .timepicker-ui-am:hover, .timepicker-ui-am.active, .timepicker-ui-pm:hover, .timepicker-ui-pm.active, .timepicker-ui-am-mobile:hover, .timepicker-ui-am-mobile.active, .timepicker-ui-pm-mobile:hover, .timepicker-ui-pm-mobile.active {\n    color: #6200EE;\n    background-color: #ECE0FD; }\n\n@media screen and (min-width: 320px) and (max-width: 767px) and (orientation: landscape) {\n  .timepicker-ui-am, .timepicker-ui-pm {\n    width: 100%; } }\n\n.timepicker-ui-am, .timepicker-ui-am-mobile {\n  border-top-left-radius: 7px;\n  border-top-right-radius: 7px;\n  border-bottom-width: calc(0.75px / 2); }\n\n@media screen and (min-width: 320px) and (max-width: 767px) and (orientation: landscape) {\n  .timepicker-ui-am {\n    border-top-left-radius: 7px;\n    border-bottom-left-radius: 7px;\n    border-top-right-radius: 0;\n    border-top-width: 1.5px;\n    border-right-width: calc(0.75px / 2); } }\n\n.timepicker-ui-pm, .timepicker-ui-pm-mobile {\n  border-bottom-left-radius: 7px;\n  border-bottom-right-radius: 7px;\n  border-top-width: calc(0.75px / 2); }\n\n@media screen and (min-width: 320px) and (max-width: 767px) and (orientation: landscape) {\n  .timepicker-ui-pm {\n    border-bottom-right-radius: 7px;\n    border-top-right-radius: 7px;\n    border-bottom-left-radius: 0;\n    border-bottom-width: 1.5px;\n    border-left-width: calc(0.75px / 2); } }\n\n.timepicker-ui-cancel-btn, .timepicker-ui-ok-btn, .timepicker-ui-cancel-btn-mobile, .timepicker-ui-ok-btn-mobile {\n  color: #6200EE;\n  text-transform: uppercase;\n  border-radius: 7px;\n  background-color: transparent;\n  text-align: center;\n  font-size: .95rem;\n  padding-top: 9px;\n  padding-bottom: 9px;\n  font-weight: 500;\n  transition: all .3s ease;\n  cursor: pointer;\n  outline: none; }\n  .timepicker-ui-cancel-btn:hover, .timepicker-ui-ok-btn:hover, .timepicker-ui-cancel-btn-mobile:hover, .timepicker-ui-ok-btn-mobile:hover {\n    background-color: #D6D6D6; }\n\n.timepicker-ui-cancel-btn, .timepicker-ui-cancel-btn-mobile {\n  width: 72px;\n  margin-right: 4px; }\n\n.timepicker-ui-ok-btn, .timepicker-ui-ok-btn-mobile {\n  width: 64px;\n  margin-left: 4px; }\n\n.timepicker-ui-wrapper-btn, .timepicker-ui-keyboard-icon, .timepicker-ui-wrapper-btn-mobile, .timepicker-ui-keyboard-icon-mobile {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  outline: none; }\n\n.timepicker-ui-keyboard-icon-wrapper, .timepicker-ui-keyboard-icon-wrapper-mobile {\n  width: 44px;\n  height: 44px;\n  position: relative;\n  bottom: -28px;\n  left: 12px;\n  transition: all .3s ease; }\n  .timepicker-ui-keyboard-icon-wrapper:hover .timepicker-ui-keyboard-icon,\n  .timepicker-ui-keyboard-icon-wrapper:hover .timepicker-ui-keyboard-icon-mobile, .timepicker-ui-keyboard-icon-wrapper-mobile:hover .timepicker-ui-keyboard-icon,\n  .timepicker-ui-keyboard-icon-wrapper-mobile:hover .timepicker-ui-keyboard-icon-mobile {\n    background-color: #D6D6D6;\n    border-radius: 7px; }\n\n@media screen and (min-width: 320px) and (max-width: 767px) and (orientation: landscape) {\n  .timepicker-ui-keyboard-icon-wrapper {\n    position: absolute;\n    bottom: 0; } }\n\n.timepicker-ui-keyboard-icon, .timepicker-ui-keyboard-icon-mobile {\n  padding: 12px;\n  cursor: pointer;\n  transition: all .3s ease; }\n  .timepicker-ui-keyboard-icon:hover, .timepicker-ui-keyboard-icon-mobile:hover {\n    color: #6200EE; }\n\n.timepicker-ui-wrapper-btn, .timepicker-ui-wrapper-btn-mobile {\n  margin-right: 8px;\n  position: relative;\n  bottom: -14px; }\n\n.timepicker-ui-hour-text, .timepicker-ui-minute-text, .timepicker-ui-hour-text-mobile, .timepicker-ui-minute-text-mobile {\n  position: absolute;\n  bottom: -22px;\n  font-size: .8rem;\n  color: #A9A9A9; }\n\n.timepicker-ui-minute-text, .timepicker-ui-minute-text-mobile {\n  left: 120px; }\n\n.timepicker-ui-clock-hand {\n  position: absolute;\n  background-color: #6200EE;\n  bottom: 50%;\n  height: 40.5%;\n  left: calc(50% - 1px);\n  transform-origin: center bottom 0;\n  width: 2px; }\n\n.timepicker-ui-circle-hand {\n  position: absolute;\n  top: -21px;\n  left: -21px;\n  width: 4px;\n  border: 20px solid #6200EE;\n  height: 4px;\n  box-sizing: content-box;\n  border-radius: 100%;\n  transition: all .2s ease; }\n  .timepicker-ui-circle-hand.small-circle {\n    top: -13px;\n    left: -13px;\n    border-width: 12px; }\n\n.timepicker-ui-value-tips.active {\n  color: #fff; }\n\n.timepicker-ui-clock-animation {\n  animation: show-up-clock 350ms linear; }\n\n@keyframes show-up-clock {\n  0% {\n    opacity: 0;\n    transform: scale(0.7); }\n  to {\n    opacity: 1;\n    transform: scale(1); } }\n", ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),
/* 5 */
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join('');
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === 'string') {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, '']];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),
/* 6 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getConfig": () => /* binding */ getConfig,
/* harmony export */   "toType": () => /* binding */ toType,
/* harmony export */   "isElement": () => /* binding */ isElement,
/* harmony export */   "typeCheckConfig": () => /* binding */ typeCheckConfig,
/* harmony export */   "getScrollbarWidth": () => /* binding */ getScrollbarWidth,
/* harmony export */   "getRadians": () => /* binding */ getRadians,
/* harmony export */   "addListenerMulti": () => /* binding */ addListenerMulti,
/* harmony export */   "removeListenerMulti": () => /* binding */ removeListenerMulti,
/* harmony export */   "clickOrTouchPosition": () => /* binding */ clickOrTouchPosition,
/* harmony export */   "mathDegreesIncrement": () => /* binding */ mathDegreesIncrement,
/* harmony export */   "hasClass": () => /* binding */ hasClass,
/* harmony export */   "offMulti": () => /* binding */ offMulti,
/* harmony export */   "off": () => /* binding */ off
/* harmony export */ });
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var getConfig = function getConfig(options, defaultOptions, defaultType, name) {
  var config = _objectSpread(_objectSpread({}, defaultOptions), options);

  typeCheckConfig(name, config, defaultType);
  return config;
};
var stripNameRegex = /\..*/;
var stripUidRegex = /::\d+$/;
var eventRegistry = {}; // Events storage

var uidEvent = 1;
var customEvents = {
  mouseenter: 'mouseover',
  mouseleave: 'mouseout'
};
var nativeEvents = ['click', 'dblclick', 'mouseup', 'mousedown', 'contextmenu', 'mousewheel', 'DOMMouseScroll', 'mouseover', 'mouseout', 'mousemove', 'selectstart', 'selectend', 'keydown', 'keypress', 'keyup', 'orientationchange', 'touchstart', 'touchmove', 'touchend', 'touchcancel', 'pointerdown', 'pointermove', 'pointerup', 'pointerleave', 'pointercancel', 'gesturestart', 'gesturechange', 'gestureend', 'focus', 'blur', 'change', 'reset', 'select', 'submit', 'focusin', 'focusout', 'load', 'unload', 'beforeunload', 'resize', 'move', 'DOMContentLoaded', 'readystatechange', 'error', 'abort', 'scroll'];
var toType = function toType(obj) {
  if (obj === null || obj === undefined) {
    return "".concat(obj);
  }

  return {}.toString.call(obj).match(/\s([a-z]+)/i)[1].toLowerCase();
};
var isElement = function isElement(obj) {
  return (obj[0] || obj).nodeType;
};
var typeCheckConfig = function typeCheckConfig(componentName, config, configTypes) {
  Object.keys(configTypes).forEach(function (property) {
    var expectedTypes = configTypes[property];
    var value = config[property];
    var valueType = value && isElement(value) ? 'element' : toType(value);

    if (!new RegExp(expectedTypes).test(valueType)) {
      throw new Error("".concat(componentName.toUpperCase(), ": ") + "Option \"".concat(property, "\" provided type \"").concat(valueType, "\" ") + "but expected type \"".concat(expectedTypes, "\"."));
    }
  });
};
var getScrollbarWidth = function getScrollbarWidth() {
  var scrollDiv = document.createElement('div');
  scrollDiv.className = 'timepicker-ui-measure';
  document.body.appendChild(scrollDiv);
  var scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
  document.body.removeChild(scrollDiv);
  return scrollbarWidth;
};
var getRadians = function getRadians(el) {
  return el * (Math.PI / 180);
};
var addListenerMulti = function addListenerMulti(element, eventNames, listener) {
  var events = eventNames.split(' ');

  for (var i = 0, iLen = events.length; i < iLen; i++) {
    element.addEventListener(events[i], listener, false);
  }
};
var removeListenerMulti = function removeListenerMulti(element, eventNames, listener) {
  var events = eventNames.split(' ');

  for (var i = 0, iLen = events.length; i < iLen; i++) {
    element.removeEventListener(events[i], listener, false);
  }
};
var clickOrTouchPosition = function clickOrTouchPosition(_ref, object) {
  var clientX = _ref.clientX,
      clientY = _ref.clientY,
      touches = _ref.touches;
  var isMobile = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  var _object$getBoundingCl = object.getBoundingClientRect(),
      left = _object$getBoundingCl.left,
      top = _object$getBoundingCl.top;

  var obj = {};

  if (!isMobile) {
    obj = {
      x: clientX - left,
      y: clientY - top
    };
  } else if (isMobile && Object.keys(touches).length > 0) {
    obj = {
      x: touches[0].clientX - left,
      y: touches[0].clientY - top
    };
  }

  return obj;
};
var mathDegreesIncrement = function mathDegreesIncrement(degrees, num) {
  return Math.round(degrees / num) * num;
};
var hasClass = function hasClass(element, selector) {
  return element.classList.contains(selector);
};

function normalizeParams(originalTypeEvent, handler, delegationFn) {
  var delegation = typeof handler === 'string';
  var originalHandler = delegation ? delegationFn : handler; // allow to get the native events from namespaced events ('click.bs.button' --> 'click')

  var typeEvent = originalTypeEvent.replace(stripNameRegex, '');
  var custom = customEvents[typeEvent];

  if (custom) {
    typeEvent = custom;
  }

  var isNative = nativeEvents.indexOf(typeEvent) > -1;

  if (!isNative) {
    typeEvent = originalTypeEvent;
  }

  return [delegation, originalHandler, typeEvent];
}

var offMulti = function offMulti(element, originalTypeEvent, handler, delegationFn) {
  var events = originalTypeEvent.split(' ');

  for (var i = 0; i < events.length; i++) {
    off(element, events[i], handler, delegationFn);
  }
};
var off = function off(element, originalTypeEvent, handler, delegationFn) {
  if (typeof originalTypeEvent !== 'string' || !element) {
    return;
  }

  var _normalizeParams = normalizeParams(originalTypeEvent, handler, delegationFn),
      _normalizeParams2 = _slicedToArray(_normalizeParams, 3),
      delegation = _normalizeParams2[0],
      originalHandler = _normalizeParams2[1],
      typeEvent = _normalizeParams2[2];

  var inNamespace = typeEvent !== originalTypeEvent;
  var events = getEvent(element);
  var isNamespace = originalTypeEvent.charAt(0) === '.';

  if (typeof originalHandler !== 'undefined') {
    // Simplest case: handler is passed, remove that listener ONLY.
    if (!events || !events[typeEvent]) {
      return;
    }

    removeHandler(element, events, typeEvent, originalHandler, delegation ? handler : null);
    return;
  }

  if (isNamespace) {
    Object.keys(events).forEach(function (elementEvent) {
      removeNamespacedHandlers(element, events, elementEvent, originalTypeEvent.slice(1));
    });
  }

  var storeElementEvent = events[typeEvent] || {};
  Object.keys(storeElementEvent).forEach(function (keyHandlers) {
    var handlerKey = keyHandlers.replace(stripUidRegex, '');

    if (!inNamespace || originalTypeEvent.indexOf(handlerKey) > -1) {
      var event = storeElementEvent[keyHandlers];
      removeHandler(element, events, typeEvent, event.originalHandler, event.delegationSelector);
    }
  });
};

function getEvent(element) {
  var uid = getUidEvent(element);
  element.uidEvent = uid;
  eventRegistry[uid] = eventRegistry[uid] || {};
  return eventRegistry[uid];
}

function getUidEvent(element, uid) {
  return uid && "".concat(uid, "::").concat(uidEvent++) || element.uidEvent || uidEvent++;
}

function removeHandler(element, events, typeEvent, handler, delegationSelector) {
  var fn = findHandler(events[typeEvent], handler, delegationSelector);

  if (!fn) {
    return;
  }

  element.removeEventListener(typeEvent, fn, Boolean(delegationSelector));
  delete events[typeEvent][fn.uidEvent];
}

function findHandler(events, handler) {
  var delegationSelector = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var uidEventList = Object.keys(events);

  for (var i = 0, len = uidEventList.length; i < len; i++) {
    var event = events[uidEventList[i]];

    if (event.originalHandler === handler && event.delegationSelector === delegationSelector) {
      return event;
    }
  }

  return null;
}

function removeNamespacedHandlers(element, events, typeEvent, namespace) {
  var storeElementEvent = events[typeEvent] || {};
  Object.keys(storeElementEvent).forEach(function (handlerKey) {
    if (handlerKey.indexOf(namespace) > -1) {
      var event = storeElementEvent[handlerKey];
      removeHandler(element, events, typeEvent, event.originalHandler, event.delegationSelector);
    }
  });
}

/***/ }),
/* 7 */
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "numberOfHours24": () => /* binding */ numberOfHours24,
/* harmony export */   "numberOfHours12": () => /* binding */ numberOfHours12,
/* harmony export */   "numberOfMinutes": () => /* binding */ numberOfMinutes,
/* harmony export */   "getModalTemplate": () => /* binding */ getModalTemplate,
/* harmony export */   "getMobileModalTemplate": () => /* binding */ getMobileModalTemplate
/* harmony export */ });
var numberOfHours24 = ['00', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'];
var numberOfHours12 = ['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
var numberOfMinutes = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];
var getModalTemplate = function getModalTemplate() {
  return "\n  <div class=\"timepicker-ui-modal\" role=\"dialog\">\n    <div class=\"timepicker-ui-wrapper\">\n      <div class=\"timepicker-ui-header\">\n        <div class=\"timepicker-ui-select-time\">select time</div>\n        <div class=\"timepicker-ui-wrapper-time\">\n          <div class=\"timepicker-ui-hour\" role=\"button\">05</div>  \n          <div class=\"timepicker-ui-dots\">:</div>    \n          <div class=\"timepicker-ui-minutes\" role=\"button\">00</div>   \n        </div>\n      <div class=\"timepicker-ui-wrapper-type-time\">\n        <div class=\"timepicker-ui-am\" role=\"button\">AM</div>    \n        <div class=\"timepicker-ui-pm\" role=\"button\">PM</div>    \n      </div>\n      </div>\n      <div class=\"timepicker-ui-wrapper-landspace\">\n        <div class=\"timepicker-ui-body\">\n          <div class=\"timepicker-ui-clock-face\">\n            <div class=\"timepicker-ui-dot\"></div>\n            <div class=\"timepicker-ui-clock-hand\">\n              <div class=\"timepicker-ui-circle-hand\"></div>\n            </div>\n            <div class=\"timepicker-ui-tips-wrapper\"></div>\n          </div>\n        </div>\n        <div class=\"timepicker-ui-footer\">\n        <div class=\"timepicker-ui-keyboard-icon-wrapper\" role=\"button\" aria-pressed=\"false\">\n          <i class=\"far fa-keyboard timepicker-ui-keyboard-icon\"></i>\n        </div>\n        <div class=\"timepicker-ui-wrapper-btn\">\n          <div class=\"timepicker-ui-cancel-btn\" role=\"button\" aria-pressed=\"false\">cancel</div>\n          <div class=\"timepicker-ui-ok-btn\" role=\"button\" aria-pressed=\"false\">ok</div>\n        </div>\n        </div>\n      </div>\n    </div>  \n  </div>";
};
var getMobileModalTemplate = function getMobileModalTemplate() {
  return "\n  <div class=\"timepicker-ui-modal\" role=\"dialog\">\n    <div class=\"timepicker-ui-wrapper-mobile\">\n      <div class=\"timepicker-ui-header-mobile\">\n        <div class=\"timepicker-ui-select-time-mobile\">enter time</div>\n        <div class=\"timepicker-ui-wrapper-time-mobile\">\n          <div class=\"timepicker-ui-hour-mobile\">12</div>  \n          <div class=\"timepicker-ui-hour-text\">Hour</div>\n          <div class=\"timepicker-ui-dots-mobile\">:</div>  \n          <div class=\"timepicker-ui-minute-text\">Minute</div>\n          <div class=\"timepicker-ui-minutes-mobile\">00</div>   \n        </div>\n      <div class=\"timepicker-ui-wrapper-type-time-mobile\">\n        <div class=\"timepicker-ui-am-mobile\">AM</div>    \n        <div class=\"timepicker-ui-pm-mobile\">PM</div>    \n      </div>\n      </div>\n      <div class=\"timepicker-ui-footer-mobile\">\n      <div class=\"timepicker-ui-keyboard-icon-wrapper-mobile\" role=\"button\" aria-pressed=\"false\">\n        <i class=\"far fa-keyboard timepicker-ui-keyboard-icon-mobile\"></i>\n      </div>\n      <div class=\"timepicker-ui-wrapper-btn-mobile\">\n        <div class=\"timepicker-ui-cancel-btn-mobile\" role=\"button\" aria-pressed=\"false\">cancel</div>\n        <div class=\"timepicker-ui-ok-btn-mobile\" role=\"button\" aria-pressed=\"false\">ok</div>\n      </div>\n      </div>\n    </div>  \n  </div>";
};

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => module['default'] :
/******/ 				() => module;
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__(0);
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;