/******/ (() => {
  // webpackBootstrap
  /******/ var __webpack_modules__ = [
    /* 0 */
    /***/ (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      'use strict';
      __webpack_require__.r(__webpack_exports__);
      /* harmony export */ __webpack_require__.d(__webpack_exports__, {
        /* harmony export */ TimepickerUI: () => /* binding */ TimepickerUI,
        /* harmony export */
      });
      /* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
        1
      );
      /* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
        _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__
      );
      /* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
        3
      );
      /* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(
        _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__
      );
      /* harmony import */ var _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
        4
      );
      /* harmony import */ var _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/ __webpack_require__.n(
        _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_2__
      );
      /* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
        10
      );
      /* harmony import */ var _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/ __webpack_require__.n(
        _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_3__
      );
      /* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
        11
      );
      /* harmony import */ var _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/ __webpack_require__.n(
        _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4__
      );
      /* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(
        12
      );
      /* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/ __webpack_require__.n(
        _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5__
      );
      /* harmony import */ var _styles_main_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(
        13
      );
      /* harmony import */ var _styles_theme_scss__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(
        17
      );
      /* harmony import */ var _styles_variables_scss__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(
        19
      );
      /* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(21);
      /* harmony import */ var _templates__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(26);

      function ownKeys(object, enumerableOnly) {
        var keys = Object.keys(object);
        if (Object.getOwnPropertySymbols) {
          var symbols = Object.getOwnPropertySymbols(object);
          if (enumerableOnly)
            symbols = symbols.filter(function (sym) {
              return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
          keys.push.apply(keys, symbols);
        }
        return keys;
      }

      function _objectSpread(target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i] != null ? arguments[i] : {};
          if (i % 2) {
            ownKeys(Object(source), true).forEach(function (key) {
              _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5___default()(
                target,
                key,
                source[key]
              );
            });
          } else if (Object.getOwnPropertyDescriptors) {
            Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
          } else {
            ownKeys(Object(source)).forEach(function (key) {
              Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
            });
          }
        }
        return target;
      }

      var DEFAULT_OPTIONS = {
        amLabel: 'AM',
        appendModalSelector: '',
        backdrop: true,
        cancelLabel: 'CANCEL',
        enableScrollbar: false,
        enableSwitchIcon: false,
        enterTimeLabel: 'Enter Time',
        hourMobileLabel: 'Hour',
        iconTemplate: '<i class="material-icons timepicker-ui-keyboard-icon">keyboard</i>',
        iconTemplateMobile: '<i class="material-icons timepicker-ui-keyboard-icon">schedule</i>',
        incrementHours: 1,
        incrementMinutes: 1,
        inputTemplate: '',
        minuteMobileLabel: 'Minute',
        mobile: false,
        okLabel: 'OK',
        pmLabel: 'PM',
        selectTimeLabel: 'Select Time',
        switchToMinutesAfterSelectHour: false,
        theme: 'basic',
      };
      var DEFAULT_TYPE = {
        amLabel: 'string',
        appendModalSelector: 'string',
        backdrop: 'boolean',
        cancelLabel: 'string',
        enableScrollbar: 'boolean',
        hourMobileLabel: 'string',
        incrementHours: 'number',
        incrementMinutes: 'number',
        inputTemplate: 'string',
        minuteMobileLabel: 'string',
        mobile: 'boolean',
        okLabel: 'string',
        pmLabel: 'string',
        selectTimeLabel: 'string',
        switchToMinutesAfterSelectHour: 'boolean',
        iconTemplate: 'string',
        iconTemplateMobile: 'string',
        theme: 'string',
        enableSwitchIcon: 'boolean',
      };
      var NAME = 'timepicker-ui';
      var MOUSE_EVENTS = 'mousedown mouseup mousemove mouseleave mouseover';
      var TOUCH_EVENTS = 'touchstart touchmove touchend';
      var ALL_EVENTS = MOUSE_EVENTS.concat(' '.concat(TOUCH_EVENTS));
      var SELECTOR_ACTIVE = 'active';

      var TimepickerUI = /*#__PURE__*/ (function () {
        function TimepickerUI(_element, options) {
          var _this = this;

          _babel_runtime_helpers_classCallCheck__WEBPACK_IMPORTED_MODULE_3___default()(
            this,
            TimepickerUI
          );

          _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5___default()(
            this,
            'init',
            function () {
              _this._setTimepickerClassToElement();

              _this._setInputClassToInputElement();

              _this._setDataOpenToInputIfDosentExistInWrapper();

              _this._setScrollbarOrNot();

              _this._setClassTopOpenElement();

              _this._handleOpenOnClick();
            }
          );

          _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5___default()(
            this,
            'open',
            function () {
              _this.init();

              _this._eventsBundle();
            }
          );

          _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5___default()(
            this,
            'close',
            function () {
              _this._isMouseMove = false;
              ALL_EVENTS.split(' ').map(function (event) {
                return document.removeEventListener(event, _this.mutliEventsMoveHandler, false);
              });
              document.removeEventListener('mousedown', _this.eventsClickMobileHandler);
              document.removeEventListener('touchstart', _this.eventsClickMobileHandler);

              _this._removeAnimationToClose();

              _this.openElement.classList.remove('disabled');

              setTimeout(function () {
                _this.modalElement.remove();
              }, 300);
            }
          );

          _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5___default()(
            this,
            '_handleOpenOnClick',
            function () {
              _this.openElement.addEventListener('click', function () {
                return _this._eventsBundle();
              });
            }
          );

          _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5___default()(
            this,
            '_handleCancelButton',
            function () {
              _this.cancelButton.addEventListener('click', function () {
                var value = (0, _utils__WEBPACK_IMPORTED_MODULE_9__.getInputValue)(_this.input);
                (0, _utils__WEBPACK_IMPORTED_MODULE_9__.createNewEvent)(
                  _this._element,
                  'cancel',
                  _objectSpread(
                    _objectSpread({}, value),
                    {},
                    {
                      hourNotAccepted: _this.hour.textContent,
                      minutesNotAccepted: _this.minutes.textContent,
                      type: _this.AM.textContent,
                      degreesHours: _this._degreesHours,
                      degreesMinutes: _this._degreesMinutes,
                    }
                  )
                );

                _this.close();
              });
            }
          );

          _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5___default()(
            this,
            '_handleOkButton',
            function () {
              _this.okButton.addEventListener('click', function () {
                var validHours = _this._handleValueAndCheck(_this.hour.textContent, 'hour');

                var validMinutes = _this._handleValueAndCheck(_this.minutes.textContent, 'minutes');

                if (validHours === false || validMinutes === false) {
                  if (!validMinutes) {
                    _this.minutes.classList.add('invalid-value');
                  }

                  return;
                }

                _this.input.value = ''
                  .concat(_this.hour.textContent, ':')
                  .concat(_this.minutes.textContent, ' ')
                  .concat(_this.activeTypeMode.textContent);
                (0, _utils__WEBPACK_IMPORTED_MODULE_9__.createNewEvent)(_this._element, 'accept', {
                  hour: _this.hour.textContent,
                  minutes: _this.minutes.textContent,
                  type: _this.AM.textContent,
                });

                _this.close();
              });
            }
          );

          _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5___default()(
            this,
            '_handleBackdropClick',
            function () {
              _this.modalElement.addEventListener('click', function (event) {
                if (
                  !(0, _utils__WEBPACK_IMPORTED_MODULE_9__.hasClass)(
                    event.target,
                    'timepicker-ui-modal'
                  )
                )
                  return;
                var value = (0, _utils__WEBPACK_IMPORTED_MODULE_9__.getInputValue)(_this.input);
                (0, _utils__WEBPACK_IMPORTED_MODULE_9__.createNewEvent)(
                  _this._element,
                  'cancel',
                  _objectSpread(
                    _objectSpread({}, value),
                    {},
                    {
                      hourNotAccepted: _this.hour.textContent,
                      minutesNotAccepted: _this.minutes.textContent,
                      type: _this.AM.textContent,
                      degreesHours: _this._degreesHours,
                      degreesMinutes: _this._degreesMinutes,
                    }
                  )
                );

                _this.close();
              });
            }
          );

          _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5___default()(
            this,
            '_setBgColorToCirleWithHourTips',
            function () {
              if (_this.minutesTips !== null || _this._options.mobile) return;

              if (_this._options.theme === 'crane-straight') {
                _this.circle.style.backgroundColor =
                  _styles_variables_scss__WEBPACK_IMPORTED_MODULE_8__.default.cranered400;
              } else {
                _this.circle.style.backgroundColor =
                  _styles_variables_scss__WEBPACK_IMPORTED_MODULE_8__.default.purple;
              }
            }
          );

          _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5___default()(
            this,
            '_setBgColorToCircleWithMinutesTips',
            function () {
              if (
                _templates__WEBPACK_IMPORTED_MODULE_10__.numberOfMinutes.includes(
                  _this.minutes.textContent
                )
              ) {
                if (_this._options.theme === 'crane-straight') {
                  _this.circle.style.backgroundColor =
                    _styles_variables_scss__WEBPACK_IMPORTED_MODULE_8__.default.cranered400;
                } else {
                  _this.circle.style.backgroundColor =
                    _styles_variables_scss__WEBPACK_IMPORTED_MODULE_8__.default.purple;
                }

                _this.circle.classList.remove('small-circle');
              }
            }
          );

          _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5___default()(
            this,
            '_removeBgColorToCirleWithMinutesTips',
            function () {
              if (
                _templates__WEBPACK_IMPORTED_MODULE_10__.numberOfMinutes.includes(
                  _this.minutes.textContent
                )
              )
                return;
              _this.circle.style.backgroundColor = '';

              _this.circle.classList.add('small-circle');
            }
          );

          _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5___default()(
            this,
            '_setTimepickerClassToElement',
            function () {
              _this._element.classList.add(NAME);
            }
          );

          _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5___default()(
            this,
            '_setClassActiveToHourOnOpen',
            function () {
              if (_this._options.mobile || _this._isMobileView) return;

              _this.hour.classList.add(SELECTOR_ACTIVE);
            }
          );

          _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5___default()(
            this,
            '_setMinutesToClock',
            function (value) {
              if (_this.clockFace !== null) _this._setTransformToCircleWithSwitchesMinutes(value);
              _this.tipsWrapper.innerHTML = '';

              _this._removeBgColorToCirleWithMinutesTips();

              _this._setNumbersToClockFace(
                _templates__WEBPACK_IMPORTED_MODULE_10__.numberOfMinutes,
                'timepicker-ui-minutes-time'
              );

              _this._toggleClassActiveToValueTips(value);
            }
          );

          _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5___default()(
            this,
            '_setHoursToClock',
            function (value) {
              if (_this.clockFace !== null) {
                _this._setTransformToCircleWithSwitchesHour(value);

                _this.tipsWrapper.innerHTML = '';

                _this._setBgColorToCirleWithHourTips();

                _this._setNumbersToClockFace();

                _this._toggleClassActiveToValueTips(value);
              }
            }
          );

          _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5___default()(
            this,
            '_setTransformToCircleWithSwitchesHour',
            function (val) {
              var value = Number(val);
              var degrees = value > 12 ? value * 30 - 360 : value * 30;
              _this.clockHand.style.transform = 'rotateZ('.concat(degrees, 'deg)');
            }
          );

          _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5___default()(
            this,
            '_setTransformToCircleWithSwitchesMinutes',
            function (val) {
              _this.clockHand.style.transform = 'rotateZ('.concat(Number(val) * 6, 'deg)');
            }
          );

          _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5___default()(
            this,
            '_handleAmClick',
            function () {
              _this.AM.addEventListener('click', function (ev) {
                var target = ev.target;
                target.classList.add(SELECTOR_ACTIVE);

                _this.PM.classList.remove(SELECTOR_ACTIVE);

                (0,
                _utils__WEBPACK_IMPORTED_MODULE_9__.createNewEvent)(_this._element, 'selectamtypemode', {
                  hour: _this.hour.textContent,
                  minutes: _this.minutes.textContent,
                  type: _this.AM.textContent,
                  degreesHours: _this._degreesHours,
                  degreesMinutes: _this._degreesMinutes,
                });
              });
            }
          );

          _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5___default()(
            this,
            '_handlePmClick',
            function () {
              _this.PM.addEventListener('click', function (ev) {
                var target = ev.target;
                target.classList.add(SELECTOR_ACTIVE);

                _this.AM.classList.remove(SELECTOR_ACTIVE);

                (0,
                _utils__WEBPACK_IMPORTED_MODULE_9__.createNewEvent)(_this._element, 'selectpmtypemode', {
                  hour: _this.hour.textContent,
                  minutes: _this.minutes.textContent,
                  type: _this.AM.textContent,
                  degreesHours: _this._degreesHours,
                  degreesMinutes: _this._degreesMinutes,
                });
              });
            }
          );

          _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5___default()(
            this,
            '_handleAnimationClock',
            function () {
              setTimeout(function () {
                _this.clockFace.classList.add('timepicker-ui-clock-animation');

                setTimeout(function () {
                  _this.clockFace.classList.remove('timepicker-ui-clock-animation');
                }, 600);
              }, 150);
            }
          );

          _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5___default()(
            this,
            '_handleHourClick',
            function () {
              _this.hour.addEventListener('click', function (ev) {
                var target = ev.target;
                if (_this.clockFace !== null) _this._handleAnimationSwitchTipsMode();

                _this._setHoursToClock(target.textContent);

                target.classList.add(SELECTOR_ACTIVE);

                _this.minutes.classList.remove(SELECTOR_ACTIVE);

                (0,
                _utils__WEBPACK_IMPORTED_MODULE_9__.createNewEvent)(_this._element, 'selecthourmode', {
                  hour: _this.hour.textContent,
                  minutes: _this.minutes.textContent,
                  type: _this.AM.textContent,
                  degreesHours: _this._degreesHours,
                  degreesMinutes: _this._degreesMinutes,
                });
                if (_this.clockFace !== null) _this.circle.classList.remove('small-circle');
              });
            }
          );

          _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5___default()(
            this,
            '_handleMinutesClick',
            function () {
              _this.minutes.addEventListener('click', function (ev) {
                var target = ev.target;
                if (_this.clockFace !== null) _this._handleAnimationSwitchTipsMode();
                if (_this.clockFace !== null) _this._setMinutesToClock(target.textContent);
                target.classList.add(SELECTOR_ACTIVE);

                _this.hour.classList.remove(SELECTOR_ACTIVE);

                (0,
                _utils__WEBPACK_IMPORTED_MODULE_9__.createNewEvent)(_this._element, 'selectminutemode', {
                  hour: _this.hour.textContent,
                  minutes: _this.minutes.textContent,
                  type: _this.AM.textContent,
                  degreesHours: _this._degreesHours,
                  degreesMinutes: _this._degreesMinutes,
                });
              });
            }
          );

          _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5___default()(
            this,
            '_handleEventToMoveHand',
            function (event) {
              if (!(0, _utils__WEBPACK_IMPORTED_MODULE_9__.whichBrowser)()) event.preventDefault();
              var type = event.type,
                target = event.target;
              var _this$_options = _this._options,
                incrementMinutes = _this$_options.incrementMinutes,
                incrementHours = _this$_options.incrementHours,
                switchToMinutesAfterSelectHour = _this$_options.switchToMinutesAfterSelectHour;

              var _clickOrTouchPosition = (0,
                _utils__WEBPACK_IMPORTED_MODULE_9__.clickOrTouchPosition)(event, _this.clockFace),
                x = _clickOrTouchPosition.x,
                y = _clickOrTouchPosition.y;

              var clockFaceRadius = _this.clockFace.offsetWidth / 2;
              var rtangens = Math.atan2(y - clockFaceRadius, x - clockFaceRadius);

              if ((0, _utils__WEBPACK_IMPORTED_MODULE_9__.whichBrowser)()) {
                var touchClick = (0, _utils__WEBPACK_IMPORTED_MODULE_9__.clickOrTouchPosition)(
                  event,
                  _this.clockFace,
                  true
                );
                rtangens = Math.atan2(
                  touchClick.y - clockFaceRadius,
                  touchClick.x - clockFaceRadius
                );
              }

              if (type === 'mouseup' || type === 'touchend') {
                _this._isMouseMove = false;
                if (switchToMinutesAfterSelectHour) _this.minutes.click();
                return;
              }

              if (
                type === 'mousedown' ||
                type === 'mousemove' ||
                type === 'touchmove' ||
                type === 'touchmove'
              ) {
                if (type === 'mousedown' || type === 'touchstart' || type === 'touchmove') {
                  if (
                    (0, _utils__WEBPACK_IMPORTED_MODULE_9__.hasClass)(
                      target,
                      'timepicker-ui-clock-face'
                    ) ||
                    (0, _utils__WEBPACK_IMPORTED_MODULE_9__.hasClass)(
                      target,
                      'timepicker-ui-circle-hand'
                    ) ||
                    (0, _utils__WEBPACK_IMPORTED_MODULE_9__.hasClass)(
                      target,
                      'timepicker-ui-hour-time-12'
                    ) ||
                    (0, _utils__WEBPACK_IMPORTED_MODULE_9__.hasClass)(
                      target,
                      'timepicker-ui-minutes-time'
                    ) ||
                    (0, _utils__WEBPACK_IMPORTED_MODULE_9__.hasClass)(
                      target,
                      'timepicker-ui-clock-hand'
                    ) ||
                    (0, _utils__WEBPACK_IMPORTED_MODULE_9__.hasClass)(
                      target,
                      'timepicker-ui-value-tips'
                    )
                  ) {
                    _this._isMouseMove = true;
                  }
                }
              }

              if (!_this._isMouseMove) return;

              if (_this.minutesTips !== null) {
                var degrees = Math.trunc((rtangens * 180) / Math.PI) + 90;

                if (incrementMinutes === 5) {
                  degrees = (0, _utils__WEBPACK_IMPORTED_MODULE_9__.mathDegreesIncrement)(
                    degrees,
                    30
                  );
                } else if (incrementMinutes === 10) {
                  degrees = (0, _utils__WEBPACK_IMPORTED_MODULE_9__.mathDegreesIncrement)(
                    degrees,
                    60
                  );
                } else if (incrementMinutes === 15) {
                  degrees = (0, _utils__WEBPACK_IMPORTED_MODULE_9__.mathDegreesIncrement)(
                    degrees,
                    90
                  );
                }

                var minute;

                if (degrees < 0) {
                  minute = Math.round(360 + degrees / 6) % 60;
                  degrees = 360 + Math.round(degrees / 6) * 6;
                } else {
                  minute = Math.round(degrees / 6) % 60;
                  degrees = Math.round(degrees / 6) * 6;
                }

                _this.minutes.innerText = minute >= 10 ? minute : '0'.concat(minute);
                _this.clockHand.style.transform = 'rotateZ('.concat(degrees, 'deg)');
                _this._degreesMinutes = degrees;

                _this._toggleClassActiveToValueTips(_this.minutes.textContent);

                _this._removeBgColorToCirleWithMinutesTips();

                _this._setBgColorToCircleWithMinutesTips();
              }

              if (_this.hourTips !== null) {
                var _degrees = Math.trunc((rtangens * 180) / Math.PI) + 90;

                _degrees = (0, _utils__WEBPACK_IMPORTED_MODULE_9__.mathDegreesIncrement)(
                  _degrees,
                  30
                );

                if (incrementHours === 2) {
                  _degrees = (0, _utils__WEBPACK_IMPORTED_MODULE_9__.mathDegreesIncrement)(
                    _degrees,
                    60
                  );
                } else if (incrementHours === 3) {
                  _degrees = (0, _utils__WEBPACK_IMPORTED_MODULE_9__.mathDegreesIncrement)(
                    _degrees,
                    90
                  );
                }

                _this.clockHand.style.transform = 'rotateZ('.concat(_degrees, 'deg)');
                _this._degreesHours = _degrees;
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

                _this.hour.innerText = hour > 9 ? hour : '0'.concat(hour);

                _this._toggleClassActiveToValueTips(hour);
              }

              (0, _utils__WEBPACK_IMPORTED_MODULE_9__.createNewEvent)(
                _this._element,
                'update',
                _objectSpread(
                  _objectSpread(
                    {},
                    (0, _utils__WEBPACK_IMPORTED_MODULE_9__.getInputValue)(_this.input)
                  ),
                  {},
                  {
                    degreesHours: _this._degreesHours,
                    degreesMinutes: _this._degreesMinutes,
                    eventType: type,
                  }
                )
              );
            }
          );

          _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5___default()(
            this,
            '_toggleClassActiveToValueTips',
            function (value) {
              var element = _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_2___default()(
                _this.allValueTips
              ).find(function (tip) {
                return Number(tip.innerText) === Number(value);
              });

              _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_2___default()(
                _this.allValueTips
              ).forEach(function (el) {
                return el.classList.remove('active');
              });

              if (element === undefined) return;
              element.classList.add('active');
            }
          );

          _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5___default()(
            this,
            '_handleMoveHand',
            function () {
              if (_this._options.mobile || _this._isMobileView) return;
              ALL_EVENTS.split(' ').map(function (event) {
                return document.addEventListener(event, _this.mutliEventsMoveHandler, false);
              });
            }
          );

          _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5___default()(
            this,
            '_setModalTemplate',
            function () {
              var appendModalSelector = _this._options.appendModalSelector;

              if (appendModalSelector === '') {
                document.body.insertAdjacentHTML('afterend', _this.modalTemplate);
              } else {
                var element = document.querySelector(appendModalSelector);
                element.insertAdjacentHTML('beforeend', _this.modalTemplate);
              }
            }
          );

          _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5___default()(
            this,
            '_setScrollbarOrNot',
            function () {
              var enableScrollbar = _this._options.enableScrollbar;

              if (!enableScrollbar) {
                document.body.style.overflowY = 'hidden';
                document.body.style.paddingRight = ''.concat(
                  (0, _utils__WEBPACK_IMPORTED_MODULE_9__.getScrollbarWidth)(),
                  'px'
                );
              }
            }
          );

          _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5___default()(
            this,
            '_setNumbersToClockFace',
            function () {
              var array =
                arguments.length > 0 && arguments[0] !== undefined
                  ? arguments[0]
                  : _templates__WEBPACK_IMPORTED_MODULE_10__.numberOfHours12;
              var classToAdd =
                arguments.length > 1 && arguments[1] !== undefined
                  ? arguments[1]
                  : 'timepicker-ui-hour-time-12';
              var el = 360 / array.length;
              var clockWidth = (_this.clockFace.offsetWidth - 32) / 2;
              var clockHeight = (_this.clockFace.offsetHeight - 32) / 2;
              var radius = clockWidth - 9;
              array.forEach(function (num, index) {
                var angle = (0, _utils__WEBPACK_IMPORTED_MODULE_9__.getRadians)(index * el);
                var span = document.createElement('span');
                var spanTips = document.createElement('span');
                spanTips.innerHTML = num;
                spanTips.classList.add('timepicker-ui-value-tips');
                span.classList.add(classToAdd);

                if (_this._options.theme === 'crane-straight') {
                  span.classList.add('crane-straight');
                  spanTips.classList.add('crane-straight');
                }

                span.style.left = ''.concat(
                  clockWidth + Math.sin(angle) * radius - span.offsetWidth,
                  'px'
                );
                span.style.bottom = ''.concat(
                  clockHeight + Math.cos(angle) * radius - span.offsetHeight,
                  'px'
                );
                span.appendChild(spanTips);

                _this.tipsWrapper.appendChild(span);
              });
            }
          );

          _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_5___default()(
            this,
            '_handlerClickPmAm',
            /*#__PURE__*/ (function () {
              var _ref2 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()(
                /*#__PURE__*/ _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(
                  function _callee(_ref) {
                    var target, allTrue, validHours, validMinutes;
                    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(
                      function _callee$(_context) {
                        while (1) {
                          switch ((_context.prev = _context.next)) {
                            case 0:
                              target = _ref.target;
                              allTrue = _this.modalElement.querySelectorAll('[contenteditable]');
                              validHours = _this._handleValueAndCheck(
                                _this.hour.textContent,
                                'hour'
                              );
                              validMinutes = _this._handleValueAndCheck(
                                _this.minutes.textContent,
                                'minutes'
                              );

                              if (
                                (0, _utils__WEBPACK_IMPORTED_MODULE_9__.hasClass)(
                                  _this.modalElement,
                                  'mobile'
                                )
                              ) {
                                _context.next = 6;
                                break;
                              }

                              return _context.abrupt('return');

                            case 6:
                              if (
                                !(0, _utils__WEBPACK_IMPORTED_MODULE_9__.hasClass)(
                                  target,
                                  'timepicker-ui-hour'
                                ) &&
                                !(0, _utils__WEBPACK_IMPORTED_MODULE_9__.hasClass)(
                                  target,
                                  'timepicker-ui-minutes'
                                )
                              ) {
                                allTrue.forEach(function (el) {
                                  el.contentEditable = false;
                                  el.classList.remove('active');
                                });

                                if (validHours === true && validMinutes === true) {
                                  if (validMinutes) {
                                    _this.minutes.classList.remove('invalid-value');
                                  }

                                  if (validHours) {
                                    _this.hour.classList.remove('invalid-value');
                                  }
                                }
                              } else {
                                if (validHours === false || validMinutes === false) {
                                  if (!validMinutes) {
                                    _this.minutes.classList.add('invalid-value');
                                  }

                                  if (!validHours) {
                                    _this.hour.classList.add('invalid-value');
                                  }
                                }

                                target.contentEditable = true;
                              }

                            case 7:
                            case 'end':
                              return _context.stop();
                          }
                        }
                      },
                      _callee
                    );
                  }
                )
              );

              return function (_x) {
                return _ref2.apply(this, arguments);
              };
            })()
          );

          this._element = _element;
          this._options = (0, _utils__WEBPACK_IMPORTED_MODULE_9__.getConfig)(
            options,
            DEFAULT_OPTIONS,
            DEFAULT_TYPE,
            NAME
          );
          this._isMouseMove = false;
          this._degreesHours =
            Number((0, _utils__WEBPACK_IMPORTED_MODULE_9__.getInputValue)(this.input).hour) * 30;
          this._degreesMinutes =
            Number((0, _utils__WEBPACK_IMPORTED_MODULE_9__.getInputValue)(this.input).minutes) * 6;
          this._isMobileView = false;
          this._isDesktopView = true;

          this.mutliEventsMove = function (event) {
            return _this._handleEventToMoveHand(event);
          };

          this.mutliEventsMoveHandler = this.mutliEventsMove.bind(this);

          this.eventsClickMobile = function (event) {
            return _this._handlerClickPmAm(event);
          };

          this.eventsClickMobileHandler = this.eventsClickMobile.bind(this);

          if (this._options.mobile) {
            this._isMobileView = true;
          }
        } // getters

        _babel_runtime_helpers_createClass__WEBPACK_IMPORTED_MODULE_4___default()(
          TimepickerUI,
          [
            {
              key: '_setTheme',
              value: function _setTheme() {
                var allDiv = this.modalElement.querySelectorAll('div');

                if (this._options.theme === 'crane-straight') {
                  _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_2___default()(
                    allDiv
                  ).forEach(function (div) {
                    return div.classList.add('crane-straight');
                  });
                } else if (this._options.theme === 'crane-radius') {
                  _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_2___default()(
                    allDiv
                  ).forEach(function (div) {
                    return div.classList.add('crane-straight', 'radius');
                  });
                }
              },
            },
            {
              key: '_setInputClassToInputElement',
              // private
              value: function _setInputClassToInputElement() {
                var input = this._element.querySelector('input');

                if (
                  !(0, _utils__WEBPACK_IMPORTED_MODULE_9__.hasClass)(input, 'timepicker-ui-input')
                ) {
                  input.classList.add('timepicker-ui-input');
                }
              },
            },
            {
              key: '_setDataOpenToInputIfDosentExistInWrapper',
              value: function _setDataOpenToInputIfDosentExistInWrapper() {
                var input = this._element.querySelector('input');

                if (this.openElementData === null) {
                  input.setAttribute('data-open', 'timepicker-ui-input');
                }
              },
            },
            {
              key: '_setClassTopOpenElement',
              value: function _setClassTopOpenElement() {
                this.openElement.classList.add('timepicker-ui-open-element');
              },
            },
            {
              key: '_removeBackdrop',
              value: function _removeBackdrop() {
                if (this._options.backdrop) return;
                this.modalElement.classList.add('removed');
                this.openElement.classList.add('disabled');
              },
            },
            {
              key: '_setNormalizeClass',
              value: function _setNormalizeClass() {
                var allElement = this.modalElement.querySelectorAll('div');
                this.modalElement.classList.add('timepicker-ui-normalize');
                allElement.forEach(function (div) {
                  return div.classList.add('timepicker-ui-normalize');
                });
              },
            },
            {
              key: '_setFlexEndToFooterIfNoKeyboardIcon',
              value: function _setFlexEndToFooterIfNoKeyboardIcon() {
                if (!this._options.enableSwitchIcon) {
                  this.footer.style.justifyContent = 'flex-end';
                }
              },
            },
            {
              key: '_eventsBundle',
              value: function _eventsBundle() {
                var _this2 = this;

                this._setModalTemplate();

                this._setNormalizeClass();

                this._removeBackdrop();

                this._setClassActiveToHourOnOpen();

                this._setBgColorToCirleWithHourTips();

                if (this.clockFace !== null) {
                  this._setNumbersToClockFace();
                }

                if (this.clockFace === null) {
                  this._setFlexEndToFooterIfNoKeyboardIcon();
                }

                setTimeout(function () {
                  _this2._setTheme();
                }, 0);

                this._setAnimationToOpen();

                this._getInputValueOnOpenAndSet();

                this._toggleClassActiveToValueTips(this.hour.textContent);

                if (this.clockFace !== null) {
                  this._setTransformToCircleWithSwitchesHour(this.hour.textContent);

                  this._handleAnimationClock();
                }

                this._handleMinutesClick();

                this._handleHourClick();

                this._handleAmClick();

                this._handlePmClick();

                this._handleMoveHand();

                this._handleCancelButton();

                this._handleOkButton();

                this._handleBackdropClick();

                this._handleIconChangeView();

                this._handleClickOnHourMobile(this.hour);

                this._handleClickOnHourMobile(this.minute);
              },
            },
            {
              key: '_getInputValueOnOpenAndSet',
              value: function _getInputValueOnOpenAndSet() {
                var value = (0, _utils__WEBPACK_IMPORTED_MODULE_9__.getInputValue)(this.input);

                if (value === undefined) {
                  this.hour.innerText = '12';
                  this.minutes.innerText = '00';
                  this.AM.classList.add('active');
                  (0, _utils__WEBPACK_IMPORTED_MODULE_9__.createNewEvent)(this._element, 'show', {
                    hour: this.hour.textContent,
                    minutes: this.minutes.textContent,
                    type: this.AM.textContent,
                    degreesHours: this._degreesHours,
                    degreesMinutes: this._degreesMinutes,
                  });
                  return;
                }

                var hour = value.hour,
                  minutes = value.minutes,
                  type = value.type;
                var typeMode = document.querySelector('[data-type="'.concat(type, '"]'));
                this.hour.innerText = hour;
                this.minutes.innerText = minutes;
                typeMode.classList.add('active');
                (0, _utils__WEBPACK_IMPORTED_MODULE_9__.createNewEvent)(
                  this._element,
                  'show',
                  _objectSpread(
                    _objectSpread({}, value),
                    {},
                    {
                      type: this.AM.textContent,
                      degreesHours: this._degreesHours,
                      degreesMinutes: this._degreesMinutes,
                    }
                  )
                );
              },
            },
            {
              key: '_handleAnimationSwitchTipsMode',
              value: function _handleAnimationSwitchTipsMode() {
                var _this3 = this;

                this.clockHand.classList.add('timepicker-ui-tips-animation');
                setTimeout(function () {
                  _this3.clockHand.classList.remove('timepicker-ui-tips-animation');
                }, 401);
              },
            },
            {
              key: '_setAnimationToOpen',
              value: function _setAnimationToOpen() {
                var _this4 = this;

                this.modalElement.classList.add('opacity');
                setTimeout(function () {
                  _this4.modalElement.classList.add('show');
                }, 150);
              },
            },
            {
              key: '_removeAnimationToClose',
              value: function _removeAnimationToClose() {
                var _this5 = this;

                setTimeout(function () {
                  _this5.modalElement.classList.remove('show');
                }, 150);
              },
            },
            {
              key: '_handleValueAndCheck',
              value: function _handleValueAndCheck(val, type) {
                var value = Number(val);

                if (type === 'hour') {
                  if (value > 0 && value <= 12) {
                    return true; // eslint-disable-next-line no-else-return
                  } else {
                    return false;
                  }
                }

                if (type === 'minutes') {
                  if (value >= 0 && value <= 59) {
                    return true; // eslint-disable-next-line no-else-return
                  } else {
                    return false;
                  }
                }
              },
            },
            {
              key: '_handleIconChangeView',
              value: (function () {
                var _handleIconChangeView2 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()(
                  /*#__PURE__*/ _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(
                    function _callee3() {
                      var _this6 = this;

                      var handlerViewChange;
                      return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(
                        function _callee3$(_context3) {
                          while (1) {
                            switch ((_context3.prev = _context3.next)) {
                              case 0:
                                handlerViewChange = /*#__PURE__*/ (function () {
                                  var _ref3 = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()(
                                    /*#__PURE__*/ _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().mark(
                                      function _callee2() {
                                        var beforeHourContent,
                                          beforeMinutesContent,
                                          beforeTypeModeContent,
                                          validHours,
                                          validMinutes,
                                          _beforeHourContent,
                                          _beforeMinutesContent,
                                          _beforeTypeModeContent;

                                        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default().wrap(
                                          function _callee2$(_context2) {
                                            while (1) {
                                              switch ((_context2.prev = _context2.next)) {
                                                case 0:
                                                  if (
                                                    (0,
                                                    _utils__WEBPACK_IMPORTED_MODULE_9__.hasClass)(
                                                      _this6.modalElement,
                                                      'mobile'
                                                    )
                                                  ) {
                                                    _context2.next = 11;
                                                    break;
                                                  }

                                                  _this6.close();

                                                  _this6._isMobileView = true;
                                                  _this6._options.mobile = true;
                                                  _this6._isDesktopView = false;
                                                  beforeHourContent = _this6.hour.textContent;
                                                  beforeMinutesContent = _this6.minutes.textContent;
                                                  beforeTypeModeContent =
                                                    _this6.activeTypeMode.textContent;
                                                  setTimeout(function () {
                                                    _this6._eventsBundle();

                                                    _this6._isMobileView = false;
                                                    _this6._options.mobile = false;
                                                    _this6._isDesktopView = true;
                                                    _this6.hour.textContent = beforeHourContent;
                                                    _this6.minutes.textContent = beforeMinutesContent;
                                                    var typeMode = document.querySelectorAll(
                                                      '.timepicker-ui-type-mode'
                                                    );
                                                    typeMode.forEach(function (type) {
                                                      return type.classList.remove('active');
                                                    });

                                                    var nowActiveType = _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_2___default()(
                                                      typeMode
                                                    ).find(function (type) {
                                                      return (
                                                        type.textContent === beforeTypeModeContent
                                                      );
                                                    });

                                                    nowActiveType.classList.add('active');
                                                  }, 300);
                                                  _context2.next = 26;
                                                  break;

                                                case 11:
                                                  validHours = _this6._handleValueAndCheck(
                                                    _this6.hour.textContent,
                                                    'hour'
                                                  );
                                                  validMinutes = _this6._handleValueAndCheck(
                                                    _this6.minutes.textContent,
                                                    'minutes'
                                                  );

                                                  if (
                                                    !(
                                                      validHours === false || validMinutes === false
                                                    )
                                                  ) {
                                                    _context2.next = 17;
                                                    break;
                                                  }

                                                  if (!validMinutes) {
                                                    _this6.minutes.classList.add('invalid-value');
                                                  }

                                                  if (!validHours) {
                                                    _this6.hour.classList.add('invalid-value');
                                                  }

                                                  return _context2.abrupt('return');

                                                case 17:
                                                  if (
                                                    validHours === true &&
                                                    validMinutes === true
                                                  ) {
                                                    if (validMinutes) {
                                                      _this6.minutes.classList.remove(
                                                        'invalid-value'
                                                      );
                                                    }

                                                    if (validHours) {
                                                      _this6.hour.classList.remove('invalid-value');
                                                    }
                                                  }

                                                  _this6.close();

                                                  _this6._isMobileView = false;
                                                  _this6._options.mobile = false;
                                                  _this6._isDesktopView = true;
                                                  _beforeHourContent = _this6.hour.textContent;
                                                  _beforeMinutesContent =
                                                    _this6.minutes.textContent;
                                                  _beforeTypeModeContent =
                                                    _this6.activeTypeMode.textContent;
                                                  setTimeout(function () {
                                                    _this6._eventsBundle();

                                                    _this6._isMobileView = true;
                                                    _this6._options.mobile = true;
                                                    _this6._isDesktopView = false;
                                                    _this6.hour.textContent = _beforeHourContent;
                                                    _this6.minutes.textContent = _beforeMinutesContent;
                                                    var typeMode = document.querySelectorAll(
                                                      '.timepicker-ui-type-mode'
                                                    );
                                                    typeMode.forEach(function (type) {
                                                      return type.classList.remove('active');
                                                    });

                                                    var nowActiveType = _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_2___default()(
                                                      typeMode
                                                    ).find(function (type) {
                                                      return (
                                                        type.textContent === _beforeTypeModeContent
                                                      );
                                                    });

                                                    nowActiveType.classList.add('active');

                                                    _this6._setTransformToCircleWithSwitchesHour(
                                                      _this6.hour.textContent
                                                    );

                                                    _this6._toggleClassActiveToValueTips(
                                                      _this6.hour.textContent
                                                    );
                                                  }, 300);

                                                case 26:
                                                case 'end':
                                                  return _context2.stop();
                                              }
                                            }
                                          },
                                          _callee2
                                        );
                                      }
                                    )
                                  );

                                  return function handlerViewChange() {
                                    return _ref3.apply(this, arguments);
                                  };
                                })();

                                if (this._options.enableSwitchIcon) {
                                  this.keyboardClockIcon.addEventListener('touchdown', function (
                                    event
                                  ) {
                                    return handlerViewChange(event);
                                  });
                                  this.keyboardClockIcon.addEventListener('mousedown', function (
                                    event
                                  ) {
                                    return handlerViewChange(event);
                                  });
                                }

                              case 2:
                              case 'end':
                                return _context3.stop();
                            }
                          }
                        },
                        _callee3,
                        this
                      );
                    }
                  )
                );

                function _handleIconChangeView() {
                  return _handleIconChangeView2.apply(this, arguments);
                }

                return _handleIconChangeView;
              })(), // Mobile version
            },
            {
              key: '_handleClickOnHourMobile',
              value: function _handleClickOnHourMobile() {
                if (!this._options.mobile || !this._isMobileView) return;
                document.addEventListener('mousedown', this.eventsClickMobileHandler);
                document.addEventListener('touchstart', this.eventsClickMobileHandler);
              },
            },
            {
              key: 'modalTemplate',
              get: function get() {
                if (!this._options.mobile || !this._isMobileView) {
                  return (0, _templates__WEBPACK_IMPORTED_MODULE_10__.getModalTemplate)(
                    this._options
                  );
                }

                return (0, _templates__WEBPACK_IMPORTED_MODULE_10__.getMobileModalTemplate)(
                  this._options
                );
              },
            },
            {
              key: 'modalElement',
              get: function get() {
                return document.querySelector('.timepicker-ui-modal');
              },
            },
            {
              key: 'clockFace',
              get: function get() {
                return document.querySelector('.timepicker-ui-clock-face');
              },
            },
            {
              key: 'input',
              get: function get() {
                return this._element.querySelector('input');
              },
            },
            {
              key: 'clockHand',
              get: function get() {
                return document.querySelector('.timepicker-ui-clock-hand');
              },
            },
            {
              key: 'circle',
              get: function get() {
                return document.querySelector('.timepicker-ui-circle-hand');
              },
            },
            {
              key: 'tipsWrapper',
              get: function get() {
                return document.querySelector('.timepicker-ui-tips-wrapper');
              },
            },
            {
              key: 'minutes',
              get: function get() {
                return document.querySelector('.timepicker-ui-minutes');
              },
            },
            {
              key: 'hour',
              get: function get() {
                return document.querySelector('.timepicker-ui-hour');
              },
            },
            {
              key: 'AM',
              get: function get() {
                return document.querySelector('.timepicker-ui-am');
              },
            },
            {
              key: 'PM',
              get: function get() {
                return document.querySelector('.timepicker-ui-pm');
              },
            },
            {
              key: 'minutesTips',
              get: function get() {
                return document.querySelector('.timepicker-ui-minutes-time');
              },
            },
            {
              key: 'hourTips',
              get: function get() {
                return document.querySelector('.timepicker-ui-hour-time-12');
              },
            },
            {
              key: 'allValueTips',
              get: function get() {
                return document.querySelectorAll('.timepicker-ui-value-tips');
              },
            },
            {
              key: 'button',
              get: function get() {
                return document.querySelector('.timepicker-ui-button');
              },
            },
            {
              key: 'openElementData',
              get: function get() {
                var data = this._element.querySelector('[data-open]');

                if (data) {
                  return Object.values(data.dataset)[0]; // eslint-disable-next-line no-else-return
                } else {
                  return null;
                }
              },
            },
            {
              key: 'openElement',
              get: function get() {
                return this._element.querySelector(
                  "[data-open='".concat(this.openElementData, "']")
                );
              },
            },
            {
              key: 'cancelButton',
              get: function get() {
                return document.querySelector('.timepicker-ui-cancel-btn');
              },
            },
            {
              key: 'okButton',
              get: function get() {
                return document.querySelector('.timepicker-ui-ok-btn');
              },
            },
            {
              key: 'activeTypeMode',
              get: function get() {
                return document.querySelector('.timepicker-ui-type-mode.active');
              },
            },
            {
              key: 'keyboardClockIcon',
              get: function get() {
                return document.querySelector('.timepicker-ui-keyboard-icon');
              },
            },
            {
              key: 'keyboardIconWrapper',
              get: function get() {
                return new Promise(function (resolve) {
                  resolve(document.querySelector('.timepicker-ui-keyboard-icon-wrapper'));
                });
              },
            },
            {
              key: 'footer',
              get: function get() {
                return document.querySelector('.timepicker-ui-footer');
              }, // public
            },
          ],
          [
            {
              key: 'NAME',
              get: function get() {
                return NAME;
              },
            },
          ]
        );

        return TimepickerUI;
      })();

      // Auto init

      (function () {
        var timepickerUiClass = document.querySelectorAll('.timepicker-ui');
        if (timepickerUiClass.length < 0) return;

        _babel_runtime_helpers_toConsumableArray__WEBPACK_IMPORTED_MODULE_2___default()(
          timepickerUiClass
        ).forEach(function (picker) {
          return new TimepickerUI(picker, {
            enableSwitchIcon: true,
          }).init();
        });
      })();

      /***/
    },
    /* 1 */
    /***/ (module, __unused_webpack_exports, __webpack_require__) => {
      module.exports = __webpack_require__(2);

      /***/
    },
    /* 2 */
    /***/ (module) => {
      /**
       * Copyright (c) 2014-present, Facebook, Inc.
       *
       * This source code is licensed under the MIT license found in the
       * LICENSE file in the root directory of this source tree.
       */

      var runtime = (function (exports) {
        'use strict';

        var Op = Object.prototype;
        var hasOwn = Op.hasOwnProperty;
        var undefined; // More compressible than void 0.
        var $Symbol = typeof Symbol === 'function' ? Symbol : {};
        var iteratorSymbol = $Symbol.iterator || '@@iterator';
        var asyncIteratorSymbol = $Symbol.asyncIterator || '@@asyncIterator';
        var toStringTagSymbol = $Symbol.toStringTag || '@@toStringTag';

        function define(obj, key, value) {
          Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true,
          });
          return obj[key];
        }
        try {
          // IE 8 has a broken Object.defineProperty that only works on DOM objects.
          define({}, '');
        } catch (err) {
          define = function (obj, key, value) {
            return (obj[key] = value);
          };
        }

        function wrap(innerFn, outerFn, self, tryLocsList) {
          // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
          var protoGenerator =
            outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
          var generator = Object.create(protoGenerator.prototype);
          var context = new Context(tryLocsList || []);

          // The ._invoke method unifies the implementations of the .next,
          // .throw, and .return methods.
          generator._invoke = makeInvokeMethod(innerFn, self, context);

          return generator;
        }
        exports.wrap = wrap;

        // Try/catch helper to minimize deoptimizations. Returns a completion
        // record like context.tryEntries[i].completion. This interface could
        // have been (and was previously) designed to take a closure to be
        // invoked without arguments, but in all the cases we care about we
        // already have an existing method we want to call, so there's no need
        // to create a new function object. We can even get away with assuming
        // the method takes exactly one argument, since that happens to be true
        // in every case, so we don't have to touch the arguments object. The
        // only additional allocation required is the completion record, which
        // has a stable shape and so hopefully should be cheap to allocate.
        function tryCatch(fn, obj, arg) {
          try {
            return { type: 'normal', arg: fn.call(obj, arg) };
          } catch (err) {
            return { type: 'throw', arg: err };
          }
        }

        var GenStateSuspendedStart = 'suspendedStart';
        var GenStateSuspendedYield = 'suspendedYield';
        var GenStateExecuting = 'executing';
        var GenStateCompleted = 'completed';

        // Returning this object from the innerFn has the same effect as
        // breaking out of the dispatch switch statement.
        var ContinueSentinel = {};

        // Dummy constructor functions that we use as the .constructor and
        // .constructor.prototype properties for functions that return Generator
        // objects. For full spec compliance, you may wish to configure your
        // minifier not to mangle the names of these two functions.
        function Generator() {}
        function GeneratorFunction() {}
        function GeneratorFunctionPrototype() {}

        // This is a polyfill for %IteratorPrototype% for environments that
        // don't natively support it.
        var IteratorPrototype = {};
        IteratorPrototype[iteratorSymbol] = function () {
          return this;
        };

        var getProto = Object.getPrototypeOf;
        var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
        if (
          NativeIteratorPrototype &&
          NativeIteratorPrototype !== Op &&
          hasOwn.call(NativeIteratorPrototype, iteratorSymbol)
        ) {
          // This environment has a native %IteratorPrototype%; use it instead
          // of the polyfill.
          IteratorPrototype = NativeIteratorPrototype;
        }

        var Gp = (GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(
          IteratorPrototype
        ));
        GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
        GeneratorFunctionPrototype.constructor = GeneratorFunction;
        GeneratorFunction.displayName = define(GeneratorFunctionPrototype, toStringTagSymbol, 'GeneratorFunction');

        // Helper for defining the .next, .throw, and .return methods of the
        // Iterator interface in terms of a single ._invoke method.
        function defineIteratorMethods(prototype) {
          ['next', 'throw', 'return'].forEach(function (method) {
            define(prototype, method, function (arg) {
              return this._invoke(method, arg);
            });
          });
        }

        exports.isGeneratorFunction = function (genFun) {
          var ctor = typeof genFun === 'function' && genFun.constructor;
          return ctor
            ? ctor === GeneratorFunction ||
                // For the native GeneratorFunction constructor, the best we can
                // do is to check its .name property.
                (ctor.displayName || ctor.name) === 'GeneratorFunction'
            : false;
        };

        exports.mark = function (genFun) {
          if (Object.setPrototypeOf) {
            Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
          } else {
            genFun.__proto__ = GeneratorFunctionPrototype;
            define(genFun, toStringTagSymbol, 'GeneratorFunction');
          }
          genFun.prototype = Object.create(Gp);
          return genFun;
        };

        // Within the body of any async function, `await x` is transformed to
        // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
        // `hasOwn.call(value, "__await")` to determine if the yielded value is
        // meant to be awaited.
        exports.awrap = function (arg) {
          return { __await: arg };
        };

        function AsyncIterator(generator, PromiseImpl) {
          function invoke(method, arg, resolve, reject) {
            var record = tryCatch(generator[method], generator, arg);
            if (record.type === 'throw') {
              reject(record.arg);
            } else {
              var result = record.arg;
              var value = result.value;
              if (value && typeof value === 'object' && hasOwn.call(value, '__await')) {
                return PromiseImpl.resolve(value.__await).then(
                  function (value) {
                    invoke('next', value, resolve, reject);
                  },
                  function (err) {
                    invoke('throw', err, resolve, reject);
                  }
                );
              }

              return PromiseImpl.resolve(value).then(
                function (unwrapped) {
                  // When a yielded Promise is resolved, its final value becomes
                  // the .value of the Promise<{value,done}> result for the
                  // current iteration.
                  result.value = unwrapped;
                  resolve(result);
                },
                function (error) {
                  // If a rejected Promise was yielded, throw the rejection back
                  // into the async generator function so it can be handled there.
                  return invoke('throw', error, resolve, reject);
                }
              );
            }
          }

          var previousPromise;

          function enqueue(method, arg) {
            function callInvokeWithMethodAndArg() {
              return new PromiseImpl(function (resolve, reject) {
                invoke(method, arg, resolve, reject);
              });
            }

            return (previousPromise =
              // If enqueue has been called before, then we want to wait until
              // all previous Promises have been resolved before calling invoke,
              // so that results are always delivered in the correct order. If
              // enqueue has not been called before, then it is important to
              // call invoke immediately, without waiting on a callback to fire,
              // so that the async generator function has the opportunity to do
              // any necessary setup in a predictable way. This predictability
              // is why the Promise constructor synchronously invokes its
              // executor callback, and why async functions synchronously
              // execute code before the first await. Since we implement simple
              // async functions in terms of async generators, it is especially
              // important to get this right, even though it requires care.
              previousPromise
                ? previousPromise.then(
                    callInvokeWithMethodAndArg,
                    // Avoid propagating failures to Promises returned by later
                    // invocations of the iterator.
                    callInvokeWithMethodAndArg
                  )
                : callInvokeWithMethodAndArg());
          }

          // Define the unified helper method that is used to implement .next,
          // .throw, and .return (see defineIteratorMethods).
          this._invoke = enqueue;
        }

        defineIteratorMethods(AsyncIterator.prototype);
        AsyncIterator.prototype[asyncIteratorSymbol] = function () {
          return this;
        };
        exports.AsyncIterator = AsyncIterator;

        // Note that simple async functions are implemented on top of
        // AsyncIterator objects; they just return a Promise for the value of
        // the final result produced by the iterator.
        exports.async = function (innerFn, outerFn, self, tryLocsList, PromiseImpl) {
          if (PromiseImpl === void 0) PromiseImpl = Promise;

          var iter = new AsyncIterator(wrap(innerFn, outerFn, self, tryLocsList), PromiseImpl);

          return exports.isGeneratorFunction(outerFn)
            ? iter // If outerFn is a generator, return the full iterator.
            : iter.next().then(function (result) {
                return result.done ? result.value : iter.next();
              });
        };

        function makeInvokeMethod(innerFn, self, context) {
          var state = GenStateSuspendedStart;

          return function invoke(method, arg) {
            if (state === GenStateExecuting) {
              throw new Error('Generator is already running');
            }

            if (state === GenStateCompleted) {
              if (method === 'throw') {
                throw arg;
              }

              // Be forgiving, per 25.3.3.3.3 of the spec:
              // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
              return doneResult();
            }

            context.method = method;
            context.arg = arg;

            while (true) {
              var delegate = context.delegate;
              if (delegate) {
                var delegateResult = maybeInvokeDelegate(delegate, context);
                if (delegateResult) {
                  if (delegateResult === ContinueSentinel) continue;
                  return delegateResult;
                }
              }

              if (context.method === 'next') {
                // Setting context._sent for legacy support of Babel's
                // function.sent implementation.
                context.sent = context._sent = context.arg;
              } else if (context.method === 'throw') {
                if (state === GenStateSuspendedStart) {
                  state = GenStateCompleted;
                  throw context.arg;
                }

                context.dispatchException(context.arg);
              } else if (context.method === 'return') {
                context.abrupt('return', context.arg);
              }

              state = GenStateExecuting;

              var record = tryCatch(innerFn, self, context);
              if (record.type === 'normal') {
                // If an exception is thrown from innerFn, we leave state ===
                // GenStateExecuting and loop back for another invocation.
                state = context.done ? GenStateCompleted : GenStateSuspendedYield;

                if (record.arg === ContinueSentinel) {
                  continue;
                }

                return {
                  value: record.arg,
                  done: context.done,
                };
              } else if (record.type === 'throw') {
                state = GenStateCompleted;
                // Dispatch the exception by looping back around to the
                // context.dispatchException(context.arg) call above.
                context.method = 'throw';
                context.arg = record.arg;
              }
            }
          };
        }

        // Call delegate.iterator[context.method](context.arg) and handle the
        // result, either by returning a { value, done } result from the
        // delegate iterator, or by modifying context.method and context.arg,
        // setting context.delegate to null, and returning the ContinueSentinel.
        function maybeInvokeDelegate(delegate, context) {
          var method = delegate.iterator[context.method];
          if (method === undefined) {
            // A .throw or .return when the delegate iterator has no .throw
            // method always terminates the yield* loop.
            context.delegate = null;

            if (context.method === 'throw') {
              // Note: ["return"] must be used for ES3 parsing compatibility.
              if (delegate.iterator['return']) {
                // If the delegate iterator has a return method, give it a
                // chance to clean up.
                context.method = 'return';
                context.arg = undefined;
                maybeInvokeDelegate(delegate, context);

                if (context.method === 'throw') {
                  // If maybeInvokeDelegate(context) changed context.method from
                  // "return" to "throw", let that override the TypeError below.
                  return ContinueSentinel;
                }
              }

              context.method = 'throw';
              context.arg = new TypeError("The iterator does not provide a 'throw' method");
            }

            return ContinueSentinel;
          }

          var record = tryCatch(method, delegate.iterator, context.arg);

          if (record.type === 'throw') {
            context.method = 'throw';
            context.arg = record.arg;
            context.delegate = null;
            return ContinueSentinel;
          }

          var info = record.arg;

          if (!info) {
            context.method = 'throw';
            context.arg = new TypeError('iterator result is not an object');
            context.delegate = null;
            return ContinueSentinel;
          }

          if (info.done) {
            // Assign the result of the finished delegate to the temporary
            // variable specified by delegate.resultName (see delegateYield).
            context[delegate.resultName] = info.value;

            // Resume execution at the desired location (see delegateYield).
            context.next = delegate.nextLoc;

            // If context.method was "throw" but the delegate handled the
            // exception, let the outer generator proceed normally. If
            // context.method was "next", forget context.arg since it has been
            // "consumed" by the delegate iterator. If context.method was
            // "return", allow the original .return call to continue in the
            // outer generator.
            if (context.method !== 'return') {
              context.method = 'next';
              context.arg = undefined;
            }
          } else {
            // Re-yield the result returned by the delegate method.
            return info;
          }

          // The delegate iterator is finished, so forget it and continue with
          // the outer generator.
          context.delegate = null;
          return ContinueSentinel;
        }

        // Define Generator.prototype.{next,throw,return} in terms of the
        // unified ._invoke helper method.
        defineIteratorMethods(Gp);

        define(Gp, toStringTagSymbol, 'Generator');

        // A Generator should always return itself as the iterator object when the
        // @@iterator function is called on it. Some browsers' implementations of the
        // iterator prototype chain incorrectly implement this, causing the Generator
        // object to not be returned from this call. This ensures that doesn't happen.
        // See https://github.com/facebook/regenerator/issues/274 for more details.
        Gp[iteratorSymbol] = function () {
          return this;
        };

        Gp.toString = function () {
          return '[object Generator]';
        };

        function pushTryEntry(locs) {
          var entry = { tryLoc: locs[0] };

          if (1 in locs) {
            entry.catchLoc = locs[1];
          }

          if (2 in locs) {
            entry.finallyLoc = locs[2];
            entry.afterLoc = locs[3];
          }

          this.tryEntries.push(entry);
        }

        function resetTryEntry(entry) {
          var record = entry.completion || {};
          record.type = 'normal';
          delete record.arg;
          entry.completion = record;
        }

        function Context(tryLocsList) {
          // The root entry object (effectively a try statement without a catch
          // or a finally block) gives us a place to store values thrown from
          // locations where there is no enclosing try statement.
          this.tryEntries = [{ tryLoc: 'root' }];
          tryLocsList.forEach(pushTryEntry, this);
          this.reset(true);
        }

        exports.keys = function (object) {
          var keys = [];
          for (var key in object) {
            keys.push(key);
          }
          keys.reverse();

          // Rather than returning an object with a next method, we keep
          // things simple and return the next function itself.
          return function next() {
            while (keys.length) {
              var key = keys.pop();
              if (key in object) {
                next.value = key;
                next.done = false;
                return next;
              }
            }

            // To avoid creating an additional object, we just hang the .value
            // and .done properties off the next function object itself. This
            // also ensures that the minifier will not anonymize the function.
            next.done = true;
            return next;
          };
        };

        function values(iterable) {
          if (iterable) {
            var iteratorMethod = iterable[iteratorSymbol];
            if (iteratorMethod) {
              return iteratorMethod.call(iterable);
            }

            if (typeof iterable.next === 'function') {
              return iterable;
            }

            if (!isNaN(iterable.length)) {
              var i = -1,
                next = function next() {
                  while (++i < iterable.length) {
                    if (hasOwn.call(iterable, i)) {
                      next.value = iterable[i];
                      next.done = false;
                      return next;
                    }
                  }

                  next.value = undefined;
                  next.done = true;

                  return next;
                };

              return (next.next = next);
            }
          }

          // Return an iterator with no values.
          return { next: doneResult };
        }
        exports.values = values;

        function doneResult() {
          return { value: undefined, done: true };
        }

        Context.prototype = {
          constructor: Context,

          reset: function (skipTempReset) {
            this.prev = 0;
            this.next = 0;
            // Resetting context._sent for legacy support of Babel's
            // function.sent implementation.
            this.sent = this._sent = undefined;
            this.done = false;
            this.delegate = null;

            this.method = 'next';
            this.arg = undefined;

            this.tryEntries.forEach(resetTryEntry);

            if (!skipTempReset) {
              for (var name in this) {
                // Not sure about the optimal order of these conditions:
                if (name.charAt(0) === 't' && hasOwn.call(this, name) && !isNaN(+name.slice(1))) {
                  this[name] = undefined;
                }
              }
            }
          },

          stop: function () {
            this.done = true;

            var rootEntry = this.tryEntries[0];
            var rootRecord = rootEntry.completion;
            if (rootRecord.type === 'throw') {
              throw rootRecord.arg;
            }

            return this.rval;
          },

          dispatchException: function (exception) {
            if (this.done) {
              throw exception;
            }

            var context = this;
            function handle(loc, caught) {
              record.type = 'throw';
              record.arg = exception;
              context.next = loc;

              if (caught) {
                // If the dispatched exception was caught by a catch block,
                // then let that catch block handle the exception normally.
                context.method = 'next';
                context.arg = undefined;
              }

              return !!caught;
            }

            for (var i = this.tryEntries.length - 1; i >= 0; --i) {
              var entry = this.tryEntries[i];
              var record = entry.completion;

              if (entry.tryLoc === 'root') {
                // Exception thrown outside of any try block that could handle
                // it, so set the completion value of the entire function to
                // throw the exception.
                return handle('end');
              }

              if (entry.tryLoc <= this.prev) {
                var hasCatch = hasOwn.call(entry, 'catchLoc');
                var hasFinally = hasOwn.call(entry, 'finallyLoc');

                if (hasCatch && hasFinally) {
                  if (this.prev < entry.catchLoc) {
                    return handle(entry.catchLoc, true);
                  } else if (this.prev < entry.finallyLoc) {
                    return handle(entry.finallyLoc);
                  }
                } else if (hasCatch) {
                  if (this.prev < entry.catchLoc) {
                    return handle(entry.catchLoc, true);
                  }
                } else if (hasFinally) {
                  if (this.prev < entry.finallyLoc) {
                    return handle(entry.finallyLoc);
                  }
                } else {
                  throw new Error('try statement without catch or finally');
                }
              }
            }
          },

          abrupt: function (type, arg) {
            for (var i = this.tryEntries.length - 1; i >= 0; --i) {
              var entry = this.tryEntries[i];
              if (
                entry.tryLoc <= this.prev &&
                hasOwn.call(entry, 'finallyLoc') &&
                this.prev < entry.finallyLoc
              ) {
                var finallyEntry = entry;
                break;
              }
            }

            if (
              finallyEntry &&
              (type === 'break' || type === 'continue') &&
              finallyEntry.tryLoc <= arg &&
              arg <= finallyEntry.finallyLoc
            ) {
              // Ignore the finally entry if control is not jumping to a
              // location outside the try/catch block.
              finallyEntry = null;
            }

            var record = finallyEntry ? finallyEntry.completion : {};
            record.type = type;
            record.arg = arg;

            if (finallyEntry) {
              this.method = 'next';
              this.next = finallyEntry.finallyLoc;
              return ContinueSentinel;
            }

            return this.complete(record);
          },

          complete: function (record, afterLoc) {
            if (record.type === 'throw') {
              throw record.arg;
            }

            if (record.type === 'break' || record.type === 'continue') {
              this.next = record.arg;
            } else if (record.type === 'return') {
              this.rval = this.arg = record.arg;
              this.method = 'return';
              this.next = 'end';
            } else if (record.type === 'normal' && afterLoc) {
              this.next = afterLoc;
            }

            return ContinueSentinel;
          },

          finish: function (finallyLoc) {
            for (var i = this.tryEntries.length - 1; i >= 0; --i) {
              var entry = this.tryEntries[i];
              if (entry.finallyLoc === finallyLoc) {
                this.complete(entry.completion, entry.afterLoc);
                resetTryEntry(entry);
                return ContinueSentinel;
              }
            }
          },

          catch: function (tryLoc) {
            for (var i = this.tryEntries.length - 1; i >= 0; --i) {
              var entry = this.tryEntries[i];
              if (entry.tryLoc === tryLoc) {
                var record = entry.completion;
                if (record.type === 'throw') {
                  var thrown = record.arg;
                  resetTryEntry(entry);
                }
                return thrown;
              }
            }

            // The context.catch method must only be called with a location
            // argument that corresponds to a known catch block.
            throw new Error('illegal catch attempt');
          },

          delegateYield: function (iterable, resultName, nextLoc) {
            this.delegate = {
              iterator: values(iterable),
              resultName: resultName,
              nextLoc: nextLoc,
            };

            if (this.method === 'next') {
              // Deliberately forget the last sent value so that we don't
              // accidentally pass it on to the delegate.
              this.arg = undefined;
            }

            return ContinueSentinel;
          },
        };

        // Regardless of whether this script is executing as a CommonJS module
        // or not, return the runtime object so that we can declare the variable
        // regeneratorRuntime in the outer scope, which allows this module to be
        // injected easily by `bin/regenerator --include-runtime script.js`.
        return exports;
      })(
        // If this script is executing as a CommonJS module, use module.exports
        // as the regeneratorRuntime namespace. Otherwise create a new empty
        // object. Either way, the resulting object will be used to initialize
        // the regeneratorRuntime variable at the top of this file.
        true ? module.exports : 0
      );

      try {
        regeneratorRuntime = runtime;
      } catch (accidentalStrictMode) {
        // This module should not be running in strict mode, so the above
        // assignment should always work unless something is misconfigured. Just
        // in case runtime.js accidentally runs in strict mode, we can escape
        // strict mode using a global Function call. This could conceivably fail
        // if a Content Security Policy forbids using Function, but in that case
        // the proper solution is to fix the accidental strict mode problem. If
        // you've misconfigured your bundler to force strict mode and applied a
        // CSP to forbid Function, and you're not willing to fix either of those
        // problems, please detail your unique predicament in a GitHub issue.
        Function('r', 'regeneratorRuntime = r')(runtime);
      }

      /***/
    },
    /* 3 */
    /***/ (module) => {
      function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          Promise.resolve(value).then(_next, _throw);
        }
      }

      function _asyncToGenerator(fn) {
        return function () {
          var self = this,
            args = arguments;
          return new Promise(function (resolve, reject) {
            var gen = fn.apply(self, args);

            function _next(value) {
              asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'next', value);
            }

            function _throw(err) {
              asyncGeneratorStep(gen, resolve, reject, _next, _throw, 'throw', err);
            }

            _next(undefined);
          });
        };
      }

      module.exports = _asyncToGenerator;

      /***/
    },
    /* 4 */
    /***/ (module, __unused_webpack_exports, __webpack_require__) => {
      var arrayWithoutHoles = __webpack_require__(5);

      var iterableToArray = __webpack_require__(7);

      var unsupportedIterableToArray = __webpack_require__(8);

      var nonIterableSpread = __webpack_require__(9);

      function _toConsumableArray(arr) {
        return (
          arrayWithoutHoles(arr) ||
          iterableToArray(arr) ||
          unsupportedIterableToArray(arr) ||
          nonIterableSpread()
        );
      }

      module.exports = _toConsumableArray;

      /***/
    },
    /* 5 */
    /***/ (module, __unused_webpack_exports, __webpack_require__) => {
      var arrayLikeToArray = __webpack_require__(6);

      function _arrayWithoutHoles(arr) {
        if (Array.isArray(arr)) return arrayLikeToArray(arr);
      }

      module.exports = _arrayWithoutHoles;

      /***/
    },
    /* 6 */
    /***/ (module) => {
      function _arrayLikeToArray(arr, len) {
        if (len == null || len > arr.length) len = arr.length;

        for (var i = 0, arr2 = new Array(len); i < len; i++) {
          arr2[i] = arr[i];
        }

        return arr2;
      }

      module.exports = _arrayLikeToArray;

      /***/
    },
    /* 7 */
    /***/ (module) => {
      function _iterableToArray(iter) {
        if (typeof Symbol !== 'undefined' && Symbol.iterator in Object(iter))
          return Array.from(iter);
      }

      module.exports = _iterableToArray;

      /***/
    },
    /* 8 */
    /***/ (module, __unused_webpack_exports, __webpack_require__) => {
      var arrayLikeToArray = __webpack_require__(6);

      function _unsupportedIterableToArray(o, minLen) {
        if (!o) return;
        if (typeof o === 'string') return arrayLikeToArray(o, minLen);
        var n = Object.prototype.toString.call(o).slice(8, -1);
        if (n === 'Object' && o.constructor) n = o.constructor.name;
        if (n === 'Map' || n === 'Set') return Array.from(o);
        if (n === 'Arguments' || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
          return arrayLikeToArray(o, minLen);
      }

      module.exports = _unsupportedIterableToArray;

      /***/
    },
    /* 9 */
    /***/ (module) => {
      function _nonIterableSpread() {
        throw new TypeError(
          'Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'
        );
      }

      module.exports = _nonIterableSpread;

      /***/
    },
    /* 10 */
    /***/ (module) => {
      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError('Cannot call a class as a function');
        }
      }

      module.exports = _classCallCheck;

      /***/
    },
    /* 11 */
    /***/ (module) => {
      function _defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
          var descriptor = props[i];
          descriptor.enumerable = descriptor.enumerable || false;
          descriptor.configurable = true;
          if ('value' in descriptor) descriptor.writable = true;
          Object.defineProperty(target, descriptor.key, descriptor);
        }
      }

      function _createClass(Constructor, protoProps, staticProps) {
        if (protoProps) _defineProperties(Constructor.prototype, protoProps);
        if (staticProps) _defineProperties(Constructor, staticProps);
        return Constructor;
      }

      module.exports = _createClass;

      /***/
    },
    /* 12 */
    /***/ (module) => {
      function _defineProperty(obj, key, value) {
        if (key in obj) {
          Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true,
          });
        } else {
          obj[key] = value;
        }

        return obj;
      }

      module.exports = _defineProperty;

      /***/
    },
    /* 13 */
    /***/ (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      'use strict';
      __webpack_require__.r(__webpack_exports__);
      /* harmony export */ __webpack_require__.d(__webpack_exports__, {
        /* harmony export */ default: () => __WEBPACK_DEFAULT_EXPORT__,
        /* harmony export */
      });
      /* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
        14
      );
      /* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
        _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__
      );
      /* harmony import */ var _node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_0_use_1_node_modules_sass_loader_dist_cjs_js_main_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
        15
      );

      var options = {};

      options.insert = 'head';
      options.singleton = false;

      var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(
        _node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_0_use_1_node_modules_sass_loader_dist_cjs_js_main_scss__WEBPACK_IMPORTED_MODULE_1__.default,
        options
      );

      /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ =
        _node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_0_use_1_node_modules_sass_loader_dist_cjs_js_main_scss__WEBPACK_IMPORTED_MODULE_1__
          .default.locals || {};

      /***/
    },
    /* 14 */
    /***/ (module, __unused_webpack_exports, __webpack_require__) => {
      'use strict';

      var isOldIE = (function isOldIE() {
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
      })();

      var getTarget = (function getTarget() {
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
      })();

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
          var identifier = ''.concat(id, ' ').concat(count);
          idCountMap[id] = count + 1;
          var index = getIndexByIdentifier(identifier);
          var obj = {
            css: item[1],
            media: item[2],
            sourceMap: item[3],
          };

          if (index !== -1) {
            stylesInDom[index].references++;
            stylesInDom[index].updater(obj);
          } else {
            stylesInDom.push({
              identifier: identifier,
              updater: addStyle(obj, options),
              references: 1,
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
          var nonce = true ? __webpack_require__.nc : 0;

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
            throw new Error(
              "Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid."
            );
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

      var replaceText = (function replaceText() {
        var textStore = [];
        return function replace(index, replacement) {
          textStore[index] = replacement;
          return textStore.filter(Boolean).join('\n');
        };
      })();

      function applyToSingletonTag(style, index, remove, obj) {
        var css = remove
          ? ''
          : obj.media
          ? '@media '.concat(obj.media, ' {').concat(obj.css, '}')
          : obj.css; // For old IE

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
          css += '\n/*# sourceMappingURL=data:application/json;base64,'.concat(
            btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))),
            ' */'
          );
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
            if (
              newObj.css === obj.css &&
              newObj.media === obj.media &&
              newObj.sourceMap === obj.sourceMap
            ) {
              return;
            }

            update((obj = newObj));
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

      /***/
    },
    /* 15 */
    /***/ (module, __webpack_exports__, __webpack_require__) => {
      'use strict';
      __webpack_require__.r(__webpack_exports__);
      /* harmony export */ __webpack_require__.d(__webpack_exports__, {
        /* harmony export */ default: () => __WEBPACK_DEFAULT_EXPORT__,
        /* harmony export */
      });
      /* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
        16
      );
      /* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
        _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__
      );
      // Imports

      var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(
        function (i) {
          return i[1];
        }
      );
      // Module
      ___CSS_LOADER_EXPORT___.push([
        module.id,
        ".timepicker-ui-normalize {\n  box-sizing: content-box !important; }\n\n.timepicker-ui-modal {\n  font-family: 'Roboto', sans-serif;\n  position: fixed;\n  opacity: 0;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  background-color: rgba(156, 155, 155, 0.6);\n  z-index: 5000; }\n  .timepicker-ui-modal.removed {\n    top: auto;\n    bottom: auto;\n    left: auto;\n    right: auto;\n    background-color: transparent; }\n\n.timepicker-ui-wrapper, .timepicker-ui-wrapper.mobile {\n  position: fixed;\n  z-index: 5001;\n  width: 328px;\n  height: 500px;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  background-color: #fff;\n  border-radius: 4px;\n  box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 5px 8px 0px rgba(0, 0, 0, 0.14), 0px 1px 14px 0px rgba(0, 0, 0, 0.12);\n  display: flex;\n  flex-direction: column; }\n\n@media screen and (min-width: 320px) and (max-width: 825px) and (orientation: landscape) {\n  .timepicker-ui-wrapper {\n    flex-direction: row;\n    height: 360px;\n    width: 584px; } }\n\n@media screen and (max-width: 330px) and (orientation: portrait) {\n  .timepicker-ui-wrapper {\n    width: 315px; } }\n\n.timepicker-ui-wrapper.mobile {\n  height: 218px; }\n  @media screen and (max-width: 330px) {\n    .timepicker-ui-wrapper.mobile {\n      width: 315px; } }\n\n.timepicker-ui-header, .timepicker-ui-header.mobile {\n  padding-top: 52px;\n  padding-bottom: 36px;\n  padding-right: 24px;\n  padding-left: 24px;\n  height: 104px;\n  display: flex;\n  flex-direction: row;\n  justify-content: center;\n  align-items: center;\n  position: relative; }\n\n.timepicker-ui-header.mobile {\n  padding-bottom: 0; }\n\n@media screen and (min-width: 320px) and (max-width: 825px) and (orientation: landscape) {\n  .timepicker-ui-header {\n    height: auto;\n    flex-direction: column; } }\n\n.timepicker-ui-select-time, .timepicker-ui-select-time.mobile {\n  text-transform: uppercase;\n  position: absolute;\n  top: calc(28px - 0.75rem);\n  left: 24px;\n  font-size: 0.75rem;\n  color: #a9a9a9; }\n\n.timepicker-ui-body {\n  height: 256px;\n  padding-right: 36px;\n  padding-left: 36px; }\n  @media screen and (min-width: 320px) and (max-width: 825px) and (orientation: landscape) {\n    .timepicker-ui-body {\n      padding-right: 0;\n      padding-left: 0;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      margin-top: 23px; } }\n\n@media screen and (min-width: 320px) and (max-width: 825px) and (orientation: landscape) {\n  .timepicker-ui-wrapper-landspace {\n    display: flex;\n    flex-direction: column;\n    width: 100%; } }\n\n.timepicker-ui-footer, .timepicker-ui-footer-mobile {\n  height: 76px;\n  display: flex;\n  justify-content: space-between;\n  margin-bottom: 4px; }\n\n@media screen and (min-width: 320px) and (max-width: 825px) and (orientation: landscape) {\n  .timepicker-ui-footer {\n    justify-content: flex-end; } }\n\n.timepicker-ui-clock-face {\n  background-color: #e0e0e0;\n  height: 100%;\n  width: 100%;\n  border-radius: 100%;\n  position: relative; }\n  @media screen and (min-width: 320px) and (max-width: 825px) and (orientation: landscape) {\n    .timepicker-ui-clock-face {\n      height: 256px;\n      width: 256px;\n      top: 15px; } }\n\n.timepicker-ui-dot {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  user-select: none;\n  touch-action: none;\n  transform: translate(-50%, -50%);\n  background-color: #6200ee;\n  height: 8px;\n  width: 8px;\n  border-radius: 100%; }\n\n.timepicker-ui-hour-time-12, .timepicker-ui-minutes-time {\n  position: absolute;\n  width: 32px;\n  height: 32px;\n  text-align: center;\n  cursor: pointer;\n  font-size: 1.1rem;\n  display: flex;\n  justify-content: center;\n  align-items: center; }\n  .timepicker-ui-hour-time-12 span, .timepicker-ui-minutes-time span {\n    touch-action: none;\n    user-select: none; }\n\n.timepicker-ui-wrapper-time, .timepicker-ui-wrapper-time.mobile {\n  display: flex;\n  margin-right: 10px; }\n\n@media screen and (min-width: 320px) and (max-width: 825px) and (orientation: landscape) {\n  .timepicker-ui-wrapper-time {\n    margin-right: 0; } }\n\n.timepicker-ui-wrapper-time.mobile {\n  position: relative; }\n\n.timepicker-ui-hour, .timepicker-ui-minutes, .timepicker-ui-hour.mobile, .timepicker-ui-minutes.mobile {\n  width: calc(96px - 24px);\n  height: calc(80px - 24px);\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  font-size: 3.2rem;\n  background-color: #e4e4e4;\n  border-radius: 7px;\n  cursor: pointer;\n  transition: all 0.3s ease;\n  outline: none;\n  border: 2px solid transparent;\n  padding: 10px; }\n  .timepicker-ui-hour:hover, .timepicker-ui-hour.active, .timepicker-ui-minutes:hover, .timepicker-ui-minutes.active, .timepicker-ui-hour.mobile:hover, .timepicker-ui-hour.mobile.active, .timepicker-ui-minutes.mobile:hover, .timepicker-ui-minutes.mobile.active {\n    color: #6200ee;\n    background-color: #ece0fd; }\n\n.timepicker-ui-hour.mobile, .timepicker-ui-minutes.mobile {\n  height: calc(70px - 24px); }\n  .timepicker-ui-hour.mobile[contenteditable='true']:focus, .timepicker-ui-hour.mobile[contenteditable='true']:active, .timepicker-ui-minutes.mobile[contenteditable='true']:focus, .timepicker-ui-minutes.mobile[contenteditable='true']:active {\n    border: 2px solid #6200ee;\n    outline-color: #6200ee;\n    user-select: all; }\n\n.timepicker-ui-dots, .timepicker-ui-dots.mobile {\n  padding-left: 5px;\n  padding-right: 5px;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  font-size: 3.6rem;\n  user-select: none;\n  touch-action: none; }\n\n.timepicker-ui-wrapper-type-time, .timepicker-ui-wrapper-type-time.mobile {\n  display: flex;\n  flex-direction: column;\n  height: 80px;\n  justify-content: center;\n  align-items: center;\n  font-size: 1rem;\n  font-weight: 500;\n  color: #787878; }\n\n@media screen and (min-width: 320px) and (max-width: 825px) and (orientation: landscape) {\n  .timepicker-ui-wrapper-type-time {\n    flex-direction: row;\n    width: 100%; } }\n\n.timepicker-ui-wrapper-type-time.mobile {\n  height: 70px; }\n\n.timepicker-ui-am, .timepicker-ui-pm, .timepicker-ui-am.mobile, .timepicker-ui-pm.mobile {\n  height: calc(40px - 2px);\n  width: calc(52px - 2px);\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  border: 2px solid #d6d6d6;\n  transition: all 0.3s ease;\n  cursor: pointer; }\n  .timepicker-ui-am:hover, .timepicker-ui-am.active, .timepicker-ui-pm:hover, .timepicker-ui-pm.active, .timepicker-ui-am.mobile:hover, .timepicker-ui-am.mobile.active, .timepicker-ui-pm.mobile:hover, .timepicker-ui-pm.mobile.active {\n    color: #6200ee;\n    background-color: #ece0fd; }\n\n@media screen and (min-width: 320px) and (max-width: 825px) and (orientation: landscape) {\n  .timepicker-ui-am, .timepicker-ui-pm {\n    width: 100%; } }\n\n.timepicker-ui-am, .timepicker-ui-am.mobile {\n  border-top-left-radius: 7px;\n  border-top-right-radius: 7px;\n  border-bottom-width: calc(0.75px / 2); }\n\n.timepicker-ui-am.mobile {\n  border-bottom-left-radius: 0; }\n\n@media screen and (min-width: 320px) and (max-width: 825px) and (orientation: landscape) {\n  .timepicker-ui-am {\n    border-top-left-radius: 7px;\n    border-bottom-left-radius: 7px;\n    border-top-right-radius: 0;\n    border-top-width: 1.5px;\n    border-right-width: calc(0.75px / 2); } }\n\n.timepicker-ui-pm, .timepicker-ui-pm.mobile {\n  border-bottom-left-radius: 7px;\n  border-bottom-right-radius: 7px;\n  border-top-width: calc(0.75px / 2); }\n\n.timepicker-ui-pm.mobile {\n  border-top-right-radius: 0; }\n\n@media screen and (min-width: 320px) and (max-width: 825px) and (orientation: landscape) {\n  .timepicker-ui-pm {\n    border-bottom-right-radius: 7px;\n    border-top-right-radius: 7px;\n    border-bottom-left-radius: 0;\n    border-bottom-width: 1.5px;\n    border-left-width: calc(0.75px / 2); } }\n\n.timepicker-ui-cancel-btn, .timepicker-ui-ok-btn, .timepicker-ui-cancel-btn.mobile, .timepicker-ui-ok.btn-mobile {\n  color: #6200ee;\n  text-transform: uppercase;\n  border-radius: 7px;\n  background-color: transparent;\n  text-align: center;\n  font-size: 0.95rem;\n  padding-top: 9px;\n  padding-bottom: 9px;\n  font-weight: 500;\n  transition: all 0.3s ease;\n  cursor: pointer;\n  outline: none; }\n  .timepicker-ui-cancel-btn:hover, .timepicker-ui-ok-btn:hover, .timepicker-ui-cancel-btn.mobile:hover, .timepicker-ui-ok.btn-mobile:hover {\n    background-color: #d6d6d6; }\n\n.timepicker-ui-cancel-btn, .timepicker-ui-cancel-btn.mobile {\n  width: 72px;\n  margin-right: 4px; }\n\n.timepicker-ui-ok-btn, .timepicker-ui-ok-btn.mobile {\n  width: 64px;\n  margin-left: 4px; }\n\n.timepicker-ui-wrapper-btn, .timepicker-ui-keyboard-icon, .timepicker-ui-wrapper-btn-mobile, .timepicker-ui-keyboard-icon-mobile {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  outline: none; }\n\n.timepicker-ui-keyboard-icon-wrapper, .timepicker-ui-keyboard-icon-wrapper.mobile {\n  width: 44px;\n  height: 44px;\n  position: relative;\n  bottom: -28px;\n  left: 12px;\n  transition: all 0.3s ease; }\n  .timepicker-ui-keyboard-icon-wrapper:hover .timepicker-ui-keyboard-icon,\n  .timepicker-ui-keyboard-icon-wrapper:hover .timepicker-ui-keyboard-icon.mobile, .timepicker-ui-keyboard-icon-wrapper.mobile:hover .timepicker-ui-keyboard-icon,\n  .timepicker-ui-keyboard-icon-wrapper.mobile:hover .timepicker-ui-keyboard-icon.mobile {\n    background-color: #d6d6d6;\n    border-radius: 7px; }\n\n.timepicker-ui-keyboard-icon, .timepicker-ui-keyboard-icon.mobile {\n  padding: 12px;\n  cursor: pointer;\n  transition: all 0.3s ease;\n  color: #4e545a;\n  height: 20px; }\n  .timepicker-ui-keyboard-icon:hover, .timepicker-ui-keyboard-icon.mobile:hover {\n    color: #6200ee; }\n\n@media screen and (min-width: 320px) and (max-width: 825px) and (orientation: landscape) {\n  .timepicker-ui-keyboard-icon-wrapper, .timepicker-ui-keyboard-icon-wrapper.mobile {\n    position: absolute;\n    bottom: 8px; } }\n\n.timepicker-ui-wrapper-btn, .timepicker-ui-wrapper-btn.mobile {\n  margin-right: 8px;\n  position: relative;\n  bottom: -14px; }\n\n.timepicker-ui-hour-text, .timepicker-ui-minute-text, .timepicker-ui-hour-text.mobile, .timepicker-ui-minute-text.mobile {\n  position: absolute;\n  bottom: -22px;\n  font-size: 0.8rem;\n  color: #a9a9a9; }\n\n.timepicker-ui-minute-text, .timepicker-ui-minute-text.mobile {\n  left: 120px; }\n\n.timepicker-ui-clock-hand {\n  position: absolute;\n  background-color: #6200ee;\n  bottom: 50%;\n  height: 40.5%;\n  left: calc(50% - 1px);\n  transform-origin: center bottom 0;\n  width: 2px; }\n\n.timepicker-ui-circle-hand {\n  position: absolute;\n  top: -21px;\n  left: -21px;\n  width: 4px;\n  border: 20px solid #6200ee;\n  height: 4px;\n  box-sizing: content-box;\n  border-radius: 100%;\n  transition: all 0.2s ease; }\n  .timepicker-ui-circle-hand.small-circle {\n    top: -13px;\n    left: -13px;\n    border-width: 12px; }\n\n@media screen and (min-width: 320px) and (max-width: 820px) and (orientation: landscape) {\n  .timepicker-ui-circle-hand {\n    top: -17.8px; } }\n\n.timepicker-ui-value-tips.active {\n  color: #fff; }\n\n.timepicker-ui-clock-animation {\n  animation: clockanimation 350ms linear; }\n\n.timepicker-ui-open-element.disabled {\n  pointer-events: none;\n  touch-action: none;\n  user-select: none; }\n\n.timepicker-ui-tips-animation {\n  transition: transform 400ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, height 400ms cubic-bezier(0.4, 0, 0.2, 1) 0ms; }\n\n.opacity {\n  transition: opacity 0.15s linear; }\n  .opacity.show {\n    opacity: 1; }\n\n.invalid-value {\n  border-color: #d50000 !important;\n  color: #d50000 !important; }\n  .invalid-value:hover, .invalid-value:focus, .invalid-value:active {\n    border-color: #d50000 !important;\n    color: #d50000 !important; }\n\n@keyframes clockanimation {\n  0% {\n    opacity: 0;\n    transform: scale(0.8); }\n  to {\n    opacity: 1;\n    transform: scale(1); } }\n",
        '',
      ]);
      // Exports
      /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ___CSS_LOADER_EXPORT___;

      /***/
    },
    /* 16 */
    /***/ (module) => {
      'use strict';

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
              return '@media '.concat(item[2], ' {').concat(content, '}');
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
                item[2] = ''.concat(mediaQuery, ' and ').concat(item[2]);
              }
            }

            list.push(item);
          }
        };

        return list;
      };

      /***/
    },
    /* 17 */
    /***/ (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      'use strict';
      __webpack_require__.r(__webpack_exports__);
      /* harmony export */ __webpack_require__.d(__webpack_exports__, {
        /* harmony export */ default: () => __WEBPACK_DEFAULT_EXPORT__,
        /* harmony export */
      });
      /* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
        14
      );
      /* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
        _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__
      );
      /* harmony import */ var _node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_0_use_1_node_modules_sass_loader_dist_cjs_js_theme_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
        18
      );

      var options = {};

      options.insert = 'head';
      options.singleton = false;

      var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(
        _node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_0_use_1_node_modules_sass_loader_dist_cjs_js_theme_scss__WEBPACK_IMPORTED_MODULE_1__.default,
        options
      );

      /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ =
        _node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_0_use_1_node_modules_sass_loader_dist_cjs_js_theme_scss__WEBPACK_IMPORTED_MODULE_1__
          .default.locals || {};

      /***/
    },
    /* 18 */
    /***/ (module, __webpack_exports__, __webpack_require__) => {
      'use strict';
      __webpack_require__.r(__webpack_exports__);
      /* harmony export */ __webpack_require__.d(__webpack_exports__, {
        /* harmony export */ default: () => __WEBPACK_DEFAULT_EXPORT__,
        /* harmony export */
      });
      /* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
        16
      );
      /* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
        _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__
      );
      // Imports

      var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(
        function (i) {
          return i[1];
        }
      );
      // Module
      ___CSS_LOADER_EXPORT___.push([
        module.id,
        ".timepicker-ui-wrapper.crane-straight, .timepicker-ui-wrapper.mobile.crane-straight {\n  border-radius: 0;\n  background-color: #4e0d3a;\n  color: #fff; }\n  .timepicker-ui-wrapper.crane-straight.radius, .timepicker-ui-wrapper.mobile.crane-straight.radius {\n    border-radius: 20px; }\n\n.timepicker-ui-select-time.crane-straight, .timepicker-ui-select-time.mobile.crane-straight {\n  color: #e5e5e5; }\n\n.timepicker-ui-clock-face.crane-straight, .timepicker-ui-clock-face.mobile.crane-straight {\n  background-color: #71135c; }\n\n.timepicker-ui-dot.crane-straight, .timepicker-ui-dot.mobile.crane-straight {\n  background-color: #f7363e; }\n\n.timepicker-ui-hour.crane-straight, .timepicker-ui-minutes.crane-straight, .timepicker-ui-hour.mobile.crane-straight, .timepicker-ui-minutes.mobile.crane-straight {\n  background-color: #71135c;\n  border-radius: 0;\n  color: #fff; }\n  .timepicker-ui-hour.crane-straight.radius, .timepicker-ui-minutes.crane-straight.radius, .timepicker-ui-hour.mobile.crane-straight.radius, .timepicker-ui-minutes.mobile.crane-straight.radius {\n    border-radius: 20px; }\n  .timepicker-ui-hour.crane-straight:hover, .timepicker-ui-hour.crane-straight.active, .timepicker-ui-minutes.crane-straight:hover, .timepicker-ui-minutes.crane-straight.active, .timepicker-ui-hour.mobile.crane-straight:hover, .timepicker-ui-hour.mobile.crane-straight.active, .timepicker-ui-minutes.mobile.crane-straight:hover, .timepicker-ui-minutes.mobile.crane-straight.active {\n    background-color: #f7363e; }\n\n.timepicker-ui-hour.mobile.crane-straight[contenteditable='true']:focus, .timepicker-ui-hour.mobile.crane-straight[contenteditable='true']:active, .timepicker-ui-minutes.mobile.crane-straight[contenteditable='true']:focus, .timepicker-ui-minutes.mobile.crane-straight[contenteditable='true']:active {\n  border-color: #fff;\n  outline-color: #fff; }\n\n.timepicker-ui-dots.crane-straight, .timepicker-ui-dots.mobile.crane-straight {\n  color: #fff; }\n\n.timepicker-ui-wrapper-type-time.crane-straight, .timepicker-ui-wrapper-type-time.mobile.crane-straight {\n  color: #fff; }\n\n.timepicker-ui-am.crane-straight, .timepicker-ui-pm.crane-straight, .timepicker-ui-am.mobile.crane-straight, .timepicker-ui-pm.mobile.crane-straight {\n  border: 2px solid transparent;\n  border-radius: 0;\n  background-color: #71135c; }\n\n.timepicker-ui-am:hover.crane-straight, .timepicker-ui-am.active.crane-straight, .timepicker-ui-pm:hover.crane-straight, .timepicker-ui-pm.active.crane-straight, .timepicker-ui-am.mobile:hover.crane-straight, .timepicker-ui-am.mobile.active.crane-straight, .timepicker-ui-pm.mobile:hover.crane-straight, .timepicker-ui-pm.mobile.active.crane-straight {\n  color: #fff;\n  background-color: #f7363e; }\n\n.timepicker-ui-am.crane-straight.radius {\n  border-top-left-radius: 20px;\n  border-top-right-radius: 20px; }\n\n.timepicker-ui-pm.crane-straight.radius {\n  border-bottom-left-radius: 20px;\n  border-bottom-right-radius: 20px; }\n\n@media screen and (min-width: 320px) and (max-width: 767px) and (orientation: landscape) {\n  .timepicker-ui-am.crane-straight.radius {\n    border-bottom-left-radius: 20px;\n    border-bottom-right-radius: 20px; } }\n\n@media screen and (min-width: 320px) and (max-width: 767px) and (orientation: landscape) {\n  .timepicker-ui-pm.crane-straight.radius {\n    border-top-left-radius: 20px;\n    border-top-right-radius: 20px; } }\n\n@media screen and (min-width: 320px) and (max-width: 767px) and (orientation: landscape) {\n  .timepicker-ui-am.mobile.crane-straight.radius {\n    border-bottom-left-radius: 0px;\n    border-bottom-right-radius: 0px; } }\n\n@media screen and (min-width: 320px) and (max-width: 767px) and (orientation: landscape) {\n  .timepicker-ui-pm.mobile.crane-straight.radius {\n    border-top-left-radius: 0px;\n    border-top-right-radius: 0px; } }\n\n.timepicker-ui-cancel-btn.crane-straight, .timepicker-ui-ok-btn.crane-straight, .timepicker-ui-cancel-btn.mobile.crane-straight, .timepicker-ui-ok-btn.mobile.crane-straight {\n  color: #fff;\n  border-radius: 0px; }\n  .timepicker-ui-cancel-btn.crane-straight.radius, .timepicker-ui-ok-btn.crane-straight.radius, .timepicker-ui-cancel-btn.mobile.crane-straight.radius, .timepicker-ui-ok-btn.mobile.crane-straight.radius {\n    border-radius: 13px; }\n\n.timepicker-ui-cancel-btn:hover.crane-straight, .timepicker-ui-ok-btn:hover.crane-straight, .timepicker-ui-cancel-btn.mobile:hover.crane-straight, .timepicker-ui-ok-btn.mobile:hover.crane-straight {\n  background-color: #f7363e; }\n\n.timepicker-ui-keyboard-icon-wrapper.crane-straight, .timepicker-ui-keyboard-icon-wrapper.mobile.crane-straight {\n  color: #fff; }\n  .timepicker-ui-keyboard-icon-wrapper.crane-straight.radius, .timepicker-ui-keyboard-icon-wrapper.mobile.crane-straight.radius {\n    border-radius: 20px; }\n\n.timepicker-ui-keyboard-icon-wrapper.crane-straight:hover .timepicker-ui-keyboard-icon,\n.timepicker-ui-keyboard-icon-wrapper.crane-straight:hover .timepicker-ui-keyboard-icon.mobile, .timepicker-ui-keyboard-icon-wrapper.mobile.crane-straight:hover .timepicker-ui-keyboard-icon,\n.timepicker-ui-keyboard-icon-wrapper.mobile.crane-straight:hover .timepicker-ui-keyboard-icon.mobile {\n  background-color: #f7363e;\n  color: #fff;\n  border-radius: 0; }\n\n.timepicker-ui-keyboard-icon-wrapper.crane-straight.radius:hover .timepicker-ui-keyboard-icon,\n.timepicker-ui-keyboard-icon-wrapper.crane-straight.radius:hover .timepicker-ui-keyboard-icon.mobile, .timepicker-ui-keyboard-icon-wrapper.mobile.crane-straight.radius:hover .timepicker-ui-keyboard-icon,\n.timepicker-ui-keyboard-icon-wrapper.mobile.crane-straight.radius:hover .timepicker-ui-keyboard-icon.mobile {\n  border-radius: 14px; }\n\n.timepicker-ui-keyboard-icon.crane-straight:hover, .timepicker-ui-keyboard-icon.mobile.crane-straight:hover {\n  color: #fff; }\n  .timepicker-ui-keyboard-icon.crane-straight:hover.radius, .timepicker-ui-keyboard-icon.mobile.crane-straight:hover.radius {\n    border-radius: 20px; }\n\n.timepicker-ui-clock-hand.crane-straight {\n  background-color: #f7363e; }\n\n.timepicker-ui-circle-hand.crane-straight {\n  border-color: #f7363e; }\n\n.timepicker-ui-value-tips.crane-straight {\n  color: #fff; }\n",
        '',
      ]);
      // Exports
      ___CSS_LOADER_EXPORT___.locals = {
        cranepurple800: '#5c1349',
        cranepurple900: '#4e0d3a',
        cranepurple700: '#71135c',
        cranered400: '#f7363e',
        white: '#fff',
        purple: '#6200ee',
      };
      /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ___CSS_LOADER_EXPORT___;

      /***/
    },
    /* 19 */
    /***/ (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      'use strict';
      __webpack_require__.r(__webpack_exports__);
      /* harmony export */ __webpack_require__.d(__webpack_exports__, {
        /* harmony export */ default: () => __WEBPACK_DEFAULT_EXPORT__,
        /* harmony export */
      });
      /* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
        14
      );
      /* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
        _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__
      );
      /* harmony import */ var _node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_0_use_1_node_modules_sass_loader_dist_cjs_js_variables_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
        20
      );

      var options = {};

      options.insert = 'head';
      options.singleton = false;

      var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(
        _node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_0_use_1_node_modules_sass_loader_dist_cjs_js_variables_scss__WEBPACK_IMPORTED_MODULE_1__.default,
        options
      );

      /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ =
        _node_modules_css_loader_dist_cjs_js_ruleSet_1_rules_0_use_1_node_modules_sass_loader_dist_cjs_js_variables_scss__WEBPACK_IMPORTED_MODULE_1__
          .default.locals || {};

      /***/
    },
    /* 20 */
    /***/ (module, __webpack_exports__, __webpack_require__) => {
      'use strict';
      __webpack_require__.r(__webpack_exports__);
      /* harmony export */ __webpack_require__.d(__webpack_exports__, {
        /* harmony export */ default: () => __WEBPACK_DEFAULT_EXPORT__,
        /* harmony export */
      });
      /* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
        16
      );
      /* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
        _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__
      );
      // Imports

      var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(
        function (i) {
          return i[1];
        }
      );
      // Module
      ___CSS_LOADER_EXPORT___.push([module.id, '\n', '']);
      // Exports
      ___CSS_LOADER_EXPORT___.locals = {
        cranepurple800: '#5c1349',
        cranepurple900: '#4e0d3a',
        cranepurple700: '#71135c',
        cranered400: '#f7363e',
        white: '#fff',
        purple: '#6200ee',
      };
      /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ___CSS_LOADER_EXPORT___;

      /***/
    },
    /* 21 */
    /***/ (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      'use strict';
      __webpack_require__.r(__webpack_exports__);
      /* harmony export */ __webpack_require__.d(__webpack_exports__, {
        /* harmony export */ toType: () => /* binding */ toType,
        /* harmony export */ isElement: () => /* binding */ isElement,
        /* harmony export */ typeCheckConfig: () => /* binding */ typeCheckConfig,
        /* harmony export */ getConfig: () => /* binding */ getConfig,
        /* harmony export */ getScrollbarWidth: () => /* binding */ getScrollbarWidth,
        /* harmony export */ getRadians: () => /* binding */ getRadians,
        /* harmony export */ clickOrTouchPosition: () => /* binding */ clickOrTouchPosition,
        /* harmony export */ mathDegreesIncrement: () => /* binding */ mathDegreesIncrement,
        /* harmony export */ hasClass: () => /* binding */ hasClass,
        /* harmony export */ getInputValue: () => /* binding */ getInputValue,
        /* harmony export */ createNewEvent: () => /* binding */ createNewEvent,
        /* harmony export */ whichBrowser: () => /* binding */ whichBrowser,
        /* harmony export */
      });
      /* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
        22
      );
      /* harmony import */ var _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/ __webpack_require__.n(
        _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0__
      );
      /* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
        12
      );
      /* harmony import */ var _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/ __webpack_require__.n(
        _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1__
      );

      function ownKeys(object, enumerableOnly) {
        var keys = Object.keys(object);
        if (Object.getOwnPropertySymbols) {
          var symbols = Object.getOwnPropertySymbols(object);
          if (enumerableOnly)
            symbols = symbols.filter(function (sym) {
              return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
          keys.push.apply(keys, symbols);
        }
        return keys;
      }

      function _objectSpread(target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i] != null ? arguments[i] : {};
          if (i % 2) {
            ownKeys(Object(source), true).forEach(function (key) {
              _babel_runtime_helpers_defineProperty__WEBPACK_IMPORTED_MODULE_1___default()(
                target,
                key,
                source[key]
              );
            });
          } else if (Object.getOwnPropertyDescriptors) {
            Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
          } else {
            ownKeys(Object(source)).forEach(function (key) {
              Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
            });
          }
        }
        return target;
      }

      // Thanks for Bootstrap 5 - alpha version
      var toType = function toType(obj) {
        if (obj === null || obj === undefined) {
          return ''.concat(obj);
        }

        return {}.toString
          .call(obj)
          .match(/\s([a-z]+)/i)[1]
          .toLowerCase();
      }; // Thanks for Bootstrap 5 - alpha version

      var isElement = function isElement(obj) {
        return (obj[0] || obj).nodeType;
      }; // Thanks for Bootstrap 5 - alpha version

      var typeCheckConfig = function typeCheckConfig(componentName, config, configTypes) {
        Object.keys(configTypes).forEach(function (property) {
          var expectedTypes = configTypes[property];
          var value = config[property];
          var valueType = value && isElement(value) ? 'element' : toType(value);

          if (!new RegExp(expectedTypes).test(valueType)) {
            throw new Error(
              ''.concat(componentName.toUpperCase(), ': ') +
                'Option "'.concat(property, '" provided type "').concat(valueType, '" ') +
                'but expected type "'.concat(expectedTypes, '".')
            );
          }
        });
      }; // Thanks for Bootstrap 5 - alpha version

      var getConfig = function getConfig(options, defaultOptions, defaultType, name) {
        var config = _objectSpread(_objectSpread({}, defaultOptions), options);

        typeCheckConfig(name, config, defaultType);
        return config;
      }; // Thanks for Bootstrap 5 - alpha version

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
      var mathDegreesIncrement = function mathDegreesIncrement(degrees, num) {
        return Math.round(degrees / num) * num;
      };
      var hasClass = function hasClass(element, selector) {
        return element.classList.contains(selector);
      };
      var getInputValue = function getInputValue(_ref2) {
        var value = _ref2.value;
        if (value === '') return;

        var _value$split = value.split(' '),
          _value$split2 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default()(
            _value$split,
            2
          ),
          hour = _value$split2[0],
          type = _value$split2[1];

        var _hour$split = hour.split(':'),
          _hour$split2 = _babel_runtime_helpers_slicedToArray__WEBPACK_IMPORTED_MODULE_0___default()(
            _hour$split,
            2
          ),
          hourSplit = _hour$split2[0],
          minutesSplit = _hour$split2[1];

        var min = Number(minutesSplit);
        var hor = Number(hourSplit);
        if (hor > 12 || min > 59 || hor === 0) return;
        if (type !== 'AM' && type !== 'PM') return;

        if (min < 10) {
          min = '0'.concat(min);
        } else if (min === 0) {
          min = '00';
        }

        return {
          hour: hor < 10 ? '0'.concat(hor) : hor.toString(),
          minutes: min.toString(),
          type: type,
        };
      };
      var createNewEvent = function createNewEvent(element, eventName, value) {
        var ev = new CustomEvent(eventName, {
          detail: value,
        });
        element.dispatchEvent(ev);
      };
      var whichBrowser = function whichBrowser() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      };

      /***/
    },
    /* 22 */
    /***/ (module, __unused_webpack_exports, __webpack_require__) => {
      var arrayWithHoles = __webpack_require__(23);

      var iterableToArrayLimit = __webpack_require__(24);

      var unsupportedIterableToArray = __webpack_require__(8);

      var nonIterableRest = __webpack_require__(25);

      function _slicedToArray(arr, i) {
        return (
          arrayWithHoles(arr) ||
          iterableToArrayLimit(arr, i) ||
          unsupportedIterableToArray(arr, i) ||
          nonIterableRest()
        );
      }

      module.exports = _slicedToArray;

      /***/
    },
    /* 23 */
    /***/ (module) => {
      function _arrayWithHoles(arr) {
        if (Array.isArray(arr)) return arr;
      }

      module.exports = _arrayWithHoles;

      /***/
    },
    /* 24 */
    /***/ (module) => {
      function _iterableToArrayLimit(arr, i) {
        if (typeof Symbol === 'undefined' || !(Symbol.iterator in Object(arr))) return;
        var _arr = [];
        var _n = true;
        var _d = false;
        var _e = undefined;

        try {
          for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
            _arr.push(_s.value);

            if (i && _arr.length === i) break;
          }
        } catch (err) {
          _d = true;
          _e = err;
        } finally {
          try {
            if (!_n && _i['return'] != null) _i['return']();
          } finally {
            if (_d) throw _e;
          }
        }

        return _arr;
      }

      module.exports = _iterableToArrayLimit;

      /***/
    },
    /* 25 */
    /***/ (module) => {
      function _nonIterableRest() {
        throw new TypeError(
          'Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.'
        );
      }

      module.exports = _nonIterableRest;

      /***/
    },
    /* 26 */
    /***/ (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
      'use strict';
      __webpack_require__.r(__webpack_exports__);
      /* harmony export */ __webpack_require__.d(__webpack_exports__, {
        /* harmony export */ numberOfHours24: () => /* binding */ numberOfHours24,
        /* harmony export */ numberOfHours12: () => /* binding */ numberOfHours12,
        /* harmony export */ numberOfMinutes: () => /* binding */ numberOfMinutes,
        /* harmony export */ getModalTemplate: () => /* binding */ getModalTemplate,
        /* harmony export */ getMobileModalTemplate: () => /* binding */ getMobileModalTemplate,
        /* harmony export */
      });
      /* eslint-disable no-undef */

      /* eslint-disable indent */
      var numberOfHours24 = [
        '00',
        '13',
        '14',
        '15',
        '16',
        '17',
        '18',
        '19',
        '20',
        '21',
        '22',
        '23',
        '24',
      ];
      var numberOfHours12 = ['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
      var numberOfMinutes = [
        '00',
        '05',
        '10',
        '15',
        '20',
        '25',
        '30',
        '35',
        '40',
        '45',
        '50',
        '55',
      ];
      var getModalTemplate = function getModalTemplate(_ref) {
        var iconTemplate = _ref.iconTemplate,
          selectTimeLabel = _ref.selectTimeLabel,
          amLabel = _ref.amLabel,
          pmLabel = _ref.pmLabel,
          cancelLabel = _ref.cancelLabel,
          okLabel = _ref.okLabel,
          enableSwitchIcon = _ref.enableSwitchIcon;
        return '\n  <div class="timepicker-ui-modal normalize" role="dialog">\n    <div class="timepicker-ui-wrapper ">\n      <div class="timepicker-ui-header">\n        <div class="timepicker-ui-select-time">'
          .concat(
            selectTimeLabel,
            '</div>\n        <div class="timepicker-ui-wrapper-time">\n          <div class="timepicker-ui-hour" role="button">05</div>  \n          <div class="timepicker-ui-dots">:</div>    \n          <div class="timepicker-ui-minutes" role="button">00</div>   \n        </div>\n      <div class="timepicker-ui-wrapper-type-time">\n        <div class="timepicker-ui-type-mode timepicker-ui-am" role="button" data-type="AM">'
          )
          .concat(
            amLabel,
            '</div>    \n        <div class="timepicker-ui-type-mode timepicker-ui-pm" role="button" data-type="PM">'
          )
          .concat(
            pmLabel,
            '</div>    \n      </div>\n      </div>\n      <div class="timepicker-ui-wrapper-landspace">\n        <div class="timepicker-ui-body">\n          <div class="timepicker-ui-clock-face">\n            <div class="timepicker-ui-dot"></div>\n            <div class="timepicker-ui-clock-hand">\n              <div class="timepicker-ui-circle-hand"></div>\n            </div>\n            <div class="timepicker-ui-tips-wrapper"></div>\n          </div>\n        </div>\n        <div class="timepicker-ui-footer">\n        '
          )
          .concat(
            enableSwitchIcon
              ? '\n      <div class="timepicker-ui-keyboard-icon-wrapper" role="button" aria-pressed="false" data-view="desktop">\n        '.concat(
                  iconTemplate,
                  '\n      </div>'
                )
              : '',
            '\n \n        <div class="timepicker-ui-wrapper-btn">\n          <div class="timepicker-ui-cancel-btn" role="button" aria-pressed="false">'
          )
          .concat(
            cancelLabel,
            '</div>\n          <div class="timepicker-ui-ok-btn" role="button" aria-pressed="false">'
          )
          .concat(
            okLabel,
            '</div>\n        </div>\n        </div>\n      </div>\n    </div>  \n  </div>'
          );
      };
      var getMobileModalTemplate = function getMobileModalTemplate(_ref2) {
        var enterTimeLabel = _ref2.enterTimeLabel,
          amLabel = _ref2.amLabel,
          pmLabel = _ref2.pmLabel,
          cancelLabel = _ref2.cancelLabel,
          okLabel = _ref2.okLabel,
          iconTemplateMobile = _ref2.iconTemplateMobile,
          minuteMobileLabel = _ref2.minuteMobileLabel,
          hourMobileLabel = _ref2.hourMobileLabel,
          enableSwitchIcon = _ref2.enableSwitchIcon;
        return '\n  <div class="timepicker-ui-modal normalize mobile" role="dialog">\n    <div class="timepicker-ui-wrapper mobile">\n      <div class="timepicker-ui-header mobile">\n        <div class="timepicker-ui-select-time mobile">'
          .concat(
            enterTimeLabel,
            '</div>\n        <div class="timepicker-ui-wrapper-time mobile">\n          <div class="timepicker-ui-hour mobile" contenteditable="false">12</div>  \n          <div class="timepicker-ui-hour-text mobile">'
          )
          .concat(
            hourMobileLabel,
            '</div>\n          <div class="timepicker-ui-dots mobile">:</div>  \n          <div class="timepicker-ui-minute-text mobile">'
          )
          .concat(
            minuteMobileLabel,
            '</div>\n          <div class="timepicker-ui-minutes mobile" contenteditable="false">00</div>   \n        </div>\n      <div class="timepicker-ui-wrapper-type-time mobile">\n        <div class="timepicker-ui-type-mode timepicker-ui-am mobile" data-type="AM">'
          )
          .concat(
            amLabel,
            '</div>    \n        <div class="timepicker-ui-type-mode timepicker-ui-pm mobile" data-type="PM">'
          )
          .concat(
            pmLabel,
            '</div>    \n      </div>\n      </div>\n      <div class="timepicker-ui-footer mobile" data-view="mobile">\n\n      '
          )
          .concat(
            enableSwitchIcon
              ? '\n      <div class="timepicker-ui-keyboard-icon-wrapper mobile" role="button" aria-pressed="false" data-view="desktop">\n      '.concat(
                  iconTemplateMobile,
                  '\n      </div>'
                )
              : '',
            '\n      <div class="timepicker-ui-wrapper-btn mobile">\n        <div class="timepicker-ui-cancel-btn mobile" role="button" aria-pressed="false">'
          )
          .concat(
            cancelLabel,
            '</div>\n        <div class="timepicker-ui-ok-btn mobile" role="button" aria-pressed="false">'
          )
          .concat(okLabel, '</div>\n      </div>\n      </div>\n    </div>  \n  </div>');
      };

      /***/
    },
    /******/
  ]; // The module cache
  /************************************************************************/
  /******/ /******/ var __webpack_module_cache__ = {}; // The require function
  /******/
  /******/ /******/ function __webpack_require__(moduleId) {
    /******/ // Check if module is in cache
    /******/ if (__webpack_module_cache__[moduleId]) {
      /******/ return __webpack_module_cache__[moduleId].exports;
      /******/
    } // Create a new module (and put it into the cache)
    /******/ /******/ var module = (__webpack_module_cache__[moduleId] = {
      /******/ id: moduleId, // no module.loaded needed
      /******/ /******/ exports: {},
      /******/
    }); // Execute the module function
    /******/
    /******/ /******/ __webpack_modules__[moduleId](module, module.exports, __webpack_require__); // Return the exports of the module
    /******/
    /******/ /******/ return module.exports;
    /******/
  } /* webpack/runtime/compat get default export */
  /******/
  /************************************************************************/
  /******/ /******/ (() => {
    /******/ // getDefaultExport function for compatibility with non-harmony modules
    /******/ __webpack_require__.n = (module) => {
      /******/ var getter =
        module && module.__esModule ? /******/ () => module['default'] : /******/ () => module;
      /******/ __webpack_require__.d(getter, { a: getter });
      /******/ return getter;
      /******/
    };
    /******/
  })(); /* webpack/runtime/define property getters */
  /******/
  /******/ /******/ (() => {
    /******/ // define getter functions for harmony exports
    /******/ __webpack_require__.d = (exports, definition) => {
      /******/ for (var key in definition) {
        /******/ if (
          __webpack_require__.o(definition, key) &&
          !__webpack_require__.o(exports, key)
        ) {
          /******/ Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
          /******/
        }
        /******/
      }
      /******/
    };
    /******/
  })(); /* webpack/runtime/hasOwnProperty shorthand */
  /******/
  /******/ /******/ (() => {
    /******/ __webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
    /******/
  })(); /* webpack/runtime/make namespace object */
  /******/
  /******/ /******/ (() => {
    /******/ // define __esModule on exports
    /******/ __webpack_require__.r = (exports) => {
      /******/ if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
        /******/ Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
        /******/
      }
      /******/ Object.defineProperty(exports, '__esModule', { value: true });
      /******/
    };
    /******/
  })(); // startup // Load entry module
  /******/
  /************************************************************************/
  /******/ /******/ /******/ __webpack_require__(0);
  /******/ // This entry module used 'exports' so it can't be inlined
  /******/
})();
