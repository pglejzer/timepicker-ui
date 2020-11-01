!(function (e, i) {
  'object' == typeof exports && 'undefined' != typeof module
    ? i(exports)
    : 'function' == typeof define && define.amd
    ? define(['exports'], i)
    : i(((e = 'undefined' != typeof globalThis ? globalThis : e || self).TimepickerUI = {}));
})(this, function (e) {
  'use strict';
  function i(e, i, t) {
    return (
      i in e
        ? Object.defineProperty(e, i, { value: t, enumerable: !0, configurable: !0, writable: !0 })
        : (e[i] = t),
      e
    );
  }
  function t(e, i) {
    void 0 === i && (i = {});
    var t = i.insertAt;
    if (e && 'undefined' != typeof document) {
      var n = document.head || document.getElementsByTagName('head')[0],
        r = document.createElement('style');
      (r.type = 'text/css'),
        'top' === t && n.firstChild ? n.insertBefore(r, n.firstChild) : n.appendChild(r),
        r.styleSheet ? (r.styleSheet.cssText = e) : r.appendChild(document.createTextNode(e));
    }
  }
  t(
    ".timepicker-ui-normalize {\n  box-sizing: content-box !important; }\n\n.timepicker-ui-modal {\n  font-family: 'Roboto', sans-serif;\n  position: fixed;\n  opacity: 0;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  background-color: rgba(156, 155, 155, 0.6);\n  z-index: 5000; }\n  .timepicker-ui-modal.removed {\n    top: auto;\n    bottom: auto;\n    left: auto;\n    right: auto;\n    background-color: transparent; }\n\n.timepicker-ui-wrapper, .timepicker-ui-wrapper.mobile {\n  position: fixed;\n  z-index: 5001;\n  width: 328px;\n  height: 500px;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  background-color: #fff;\n  border-radius: 4px;\n  box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 5px 8px 0px rgba(0, 0, 0, 0.14), 0px 1px 14px 0px rgba(0, 0, 0, 0.12);\n  display: flex;\n  flex-direction: column; }\n\n@media screen and (min-width: 320px) and (max-width: 825px) and (orientation: landscape) {\n  .timepicker-ui-wrapper {\n    flex-direction: row;\n    height: 360px;\n    width: 584px; } }\n\n@media screen and (max-width: 330px) and (orientation: portrait) {\n  .timepicker-ui-wrapper {\n    width: 315px; } }\n\n.timepicker-ui-wrapper.mobile {\n  height: 218px; }\n  @media screen and (max-width: 330px) {\n    .timepicker-ui-wrapper.mobile {\n      width: 315px; } }\n\n.timepicker-ui-header, .timepicker-ui-header.mobile {\n  padding-top: 52px;\n  padding-bottom: 36px;\n  padding-right: 24px;\n  padding-left: 24px;\n  height: 104px;\n  display: flex;\n  flex-direction: row;\n  justify-content: center;\n  align-items: center;\n  position: relative; }\n\n.timepicker-ui-header.mobile {\n  padding-bottom: 0; }\n\n@media screen and (min-width: 320px) and (max-width: 825px) and (orientation: landscape) {\n  .timepicker-ui-header {\n    height: auto;\n    flex-direction: column; } }\n\n.timepicker-ui-select-time, .timepicker-ui-select-time.mobile {\n  text-transform: uppercase;\n  position: absolute;\n  top: calc(28px - 0.75rem);\n  left: 24px;\n  font-size: 0.75rem;\n  color: #a9a9a9; }\n\n.timepicker-ui-body {\n  height: 256px;\n  padding-right: 36px;\n  padding-left: 36px; }\n  @media screen and (min-width: 320px) and (max-width: 825px) and (orientation: landscape) {\n    .timepicker-ui-body {\n      padding-right: 0;\n      padding-left: 0;\n      display: flex;\n      align-items: center;\n      justify-content: center;\n      margin-top: 23px; } }\n\n@media screen and (min-width: 320px) and (max-width: 825px) and (orientation: landscape) {\n  .timepicker-ui-wrapper-landspace {\n    display: flex;\n    flex-direction: column;\n    width: 100%; } }\n\n.timepicker-ui-footer, .timepicker-ui-footer-mobile {\n  height: 76px;\n  display: flex;\n  justify-content: space-between;\n  margin-bottom: 4px; }\n\n@media screen and (min-width: 320px) and (max-width: 825px) and (orientation: landscape) {\n  .timepicker-ui-footer {\n    justify-content: flex-end; } }\n\n.timepicker-ui-clock-face {\n  background-color: #e0e0e0;\n  height: 100%;\n  width: 100%;\n  border-radius: 100%;\n  position: relative; }\n  @media screen and (min-width: 320px) and (max-width: 825px) and (orientation: landscape) {\n    .timepicker-ui-clock-face {\n      height: 256px;\n      width: 256px;\n      top: 15px; } }\n\n.timepicker-ui-dot {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  user-select: none;\n  touch-action: none;\n  transform: translate(-50%, -50%);\n  background-color: #6200ee;\n  height: 8px;\n  width: 8px;\n  border-radius: 100%; }\n\n.timepicker-ui-hour-time-12, .timepicker-ui-minutes-time {\n  position: absolute;\n  width: 32px;\n  height: 32px;\n  text-align: center;\n  cursor: pointer;\n  font-size: 1.1rem;\n  display: flex;\n  justify-content: center;\n  align-items: center; }\n  .timepicker-ui-hour-time-12 span, .timepicker-ui-minutes-time span {\n    touch-action: none;\n    user-select: none; }\n\n.timepicker-ui-wrapper-time, .timepicker-ui-wrapper-time.mobile {\n  display: flex;\n  margin-right: 10px; }\n\n@media screen and (min-width: 320px) and (max-width: 825px) and (orientation: landscape) {\n  .timepicker-ui-wrapper-time {\n    margin-right: 0; } }\n\n.timepicker-ui-wrapper-time.mobile {\n  position: relative; }\n\n.timepicker-ui-hour, .timepicker-ui-minutes, .timepicker-ui-hour.mobile, .timepicker-ui-minutes.mobile {\n  width: calc(96px - 24px);\n  height: calc(80px - 24px);\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  font-size: 3.2rem;\n  background-color: #e4e4e4;\n  border-radius: 7px;\n  cursor: pointer;\n  transition: all 0.3s ease;\n  outline: none;\n  border: 2px solid transparent;\n  padding: 10px; }\n  .timepicker-ui-hour:hover, .timepicker-ui-hour.active, .timepicker-ui-minutes:hover, .timepicker-ui-minutes.active, .timepicker-ui-hour.mobile:hover, .timepicker-ui-hour.mobile.active, .timepicker-ui-minutes.mobile:hover, .timepicker-ui-minutes.mobile.active {\n    color: #6200ee;\n    background-color: #ece0fd; }\n\n.timepicker-ui-hour.mobile, .timepicker-ui-minutes.mobile {\n  height: calc(70px - 24px); }\n  .timepicker-ui-hour.mobile[contenteditable='true']:focus, .timepicker-ui-hour.mobile[contenteditable='true']:active, .timepicker-ui-minutes.mobile[contenteditable='true']:focus, .timepicker-ui-minutes.mobile[contenteditable='true']:active {\n    border: 2px solid #6200ee;\n    outline-color: #6200ee;\n    user-select: all; }\n\n.timepicker-ui-dots, .timepicker-ui-dots.mobile {\n  padding-left: 5px;\n  padding-right: 5px;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  font-size: 3.6rem;\n  user-select: none;\n  touch-action: none; }\n\n.timepicker-ui-wrapper-type-time, .timepicker-ui-wrapper-type-time.mobile {\n  display: flex;\n  flex-direction: column;\n  height: 80px;\n  justify-content: center;\n  align-items: center;\n  font-size: 1rem;\n  font-weight: 500;\n  color: #787878; }\n\n@media screen and (min-width: 320px) and (max-width: 825px) and (orientation: landscape) {\n  .timepicker-ui-wrapper-type-time {\n    flex-direction: row;\n    width: 100%; } }\n\n.timepicker-ui-wrapper-type-time.mobile {\n  height: 70px; }\n\n.timepicker-ui-am, .timepicker-ui-pm, .timepicker-ui-am.mobile, .timepicker-ui-pm.mobile {\n  height: calc(40px - 2px);\n  width: calc(52px - 2px);\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  border: 2px solid #d6d6d6;\n  transition: all 0.3s ease;\n  cursor: pointer; }\n  .timepicker-ui-am:hover, .timepicker-ui-am.active, .timepicker-ui-pm:hover, .timepicker-ui-pm.active, .timepicker-ui-am.mobile:hover, .timepicker-ui-am.mobile.active, .timepicker-ui-pm.mobile:hover, .timepicker-ui-pm.mobile.active {\n    color: #6200ee;\n    background-color: #ece0fd; }\n\n@media screen and (min-width: 320px) and (max-width: 825px) and (orientation: landscape) {\n  .timepicker-ui-am, .timepicker-ui-pm {\n    width: 100%; } }\n\n.timepicker-ui-am, .timepicker-ui-am.mobile {\n  border-top-left-radius: 7px;\n  border-top-right-radius: 7px;\n  border-bottom-width: calc(0.75px / 2); }\n\n.timepicker-ui-am.mobile {\n  border-bottom-left-radius: 0; }\n\n@media screen and (min-width: 320px) and (max-width: 825px) and (orientation: landscape) {\n  .timepicker-ui-am {\n    border-top-left-radius: 7px;\n    border-bottom-left-radius: 7px;\n    border-top-right-radius: 0;\n    border-top-width: 1.5px;\n    border-right-width: calc(0.75px / 2); } }\n\n.timepicker-ui-pm, .timepicker-ui-pm.mobile {\n  border-bottom-left-radius: 7px;\n  border-bottom-right-radius: 7px;\n  border-top-width: calc(0.75px / 2); }\n\n.timepicker-ui-pm.mobile {\n  border-top-right-radius: 0; }\n\n@media screen and (min-width: 320px) and (max-width: 825px) and (orientation: landscape) {\n  .timepicker-ui-pm {\n    border-bottom-right-radius: 7px;\n    border-top-right-radius: 7px;\n    border-bottom-left-radius: 0;\n    border-bottom-width: 1.5px;\n    border-left-width: calc(0.75px / 2); } }\n\n.timepicker-ui-cancel-btn, .timepicker-ui-ok-btn, .timepicker-ui-cancel-btn.mobile, .timepicker-ui-ok.btn-mobile {\n  color: #6200ee;\n  text-transform: uppercase;\n  border-radius: 7px;\n  background-color: transparent;\n  text-align: center;\n  font-size: 0.95rem;\n  padding-top: 9px;\n  padding-bottom: 9px;\n  font-weight: 500;\n  transition: all 0.3s ease;\n  cursor: pointer;\n  outline: none; }\n  .timepicker-ui-cancel-btn:hover, .timepicker-ui-ok-btn:hover, .timepicker-ui-cancel-btn.mobile:hover, .timepicker-ui-ok.btn-mobile:hover {\n    background-color: #d6d6d6; }\n\n.timepicker-ui-cancel-btn, .timepicker-ui-cancel-btn.mobile {\n  width: 72px;\n  margin-right: 4px; }\n\n.timepicker-ui-ok-btn, .timepicker-ui-ok-btn.mobile {\n  width: 64px;\n  margin-left: 4px; }\n\n.timepicker-ui-wrapper-btn, .timepicker-ui-keyboard-icon, .timepicker-ui-wrapper-btn-mobile, .timepicker-ui-keyboard-icon-mobile {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  outline: none; }\n\n.timepicker-ui-keyboard-icon-wrapper, .timepicker-ui-keyboard-icon-wrapper.mobile {\n  width: 44px;\n  height: 44px;\n  position: relative;\n  bottom: -28px;\n  left: 12px;\n  transition: all 0.3s ease; }\n  .timepicker-ui-keyboard-icon-wrapper:hover .timepicker-ui-keyboard-icon,\n  .timepicker-ui-keyboard-icon-wrapper:hover .timepicker-ui-keyboard-icon.mobile, .timepicker-ui-keyboard-icon-wrapper.mobile:hover .timepicker-ui-keyboard-icon,\n  .timepicker-ui-keyboard-icon-wrapper.mobile:hover .timepicker-ui-keyboard-icon.mobile {\n    background-color: #d6d6d6;\n    border-radius: 7px; }\n\n.timepicker-ui-keyboard-icon, .timepicker-ui-keyboard-icon.mobile {\n  padding: 12px;\n  cursor: pointer;\n  transition: all 0.3s ease;\n  color: #4e545a;\n  height: 20px; }\n  .timepicker-ui-keyboard-icon:hover, .timepicker-ui-keyboard-icon.mobile:hover {\n    color: #6200ee; }\n\n@media screen and (min-width: 320px) and (max-width: 825px) and (orientation: landscape) {\n  .timepicker-ui-keyboard-icon-wrapper, .timepicker-ui-keyboard-icon-wrapper.mobile {\n    position: absolute;\n    bottom: 8px; } }\n\n.timepicker-ui-wrapper-btn, .timepicker-ui-wrapper-btn.mobile {\n  margin-right: 8px;\n  position: relative;\n  bottom: -14px; }\n\n.timepicker-ui-hour-text, .timepicker-ui-minute-text, .timepicker-ui-hour-text.mobile, .timepicker-ui-minute-text.mobile {\n  position: absolute;\n  bottom: -22px;\n  font-size: 0.8rem;\n  color: #a9a9a9; }\n\n.timepicker-ui-minute-text, .timepicker-ui-minute-text.mobile {\n  left: 120px; }\n\n.timepicker-ui-clock-hand {\n  position: absolute;\n  background-color: #6200ee;\n  bottom: 50%;\n  height: 40.5%;\n  left: calc(50% - 1px);\n  transform-origin: center bottom 0;\n  width: 2px; }\n\n.timepicker-ui-circle-hand {\n  position: absolute;\n  top: -21px;\n  left: -21px;\n  width: 4px;\n  border: 20px solid #6200ee;\n  height: 4px;\n  box-sizing: content-box;\n  border-radius: 100%;\n  transition: all 0.2s ease; }\n  .timepicker-ui-circle-hand.small-circle {\n    top: -13px;\n    left: -13px;\n    border-width: 12px; }\n\n@media screen and (min-width: 320px) and (max-width: 820px) and (orientation: landscape) {\n  .timepicker-ui-circle-hand {\n    top: -17.8px; } }\n\n.timepicker-ui-value-tips.active {\n  color: #fff; }\n\n.timepicker-ui-clock-animation {\n  animation: clockanimation 350ms linear; }\n\n.timepicker-ui-open-element.disabled {\n  pointer-events: none;\n  touch-action: none;\n  user-select: none; }\n\n.timepicker-ui-tips-animation {\n  transition: transform 400ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, height 400ms cubic-bezier(0.4, 0, 0.2, 1) 0ms; }\n\n.opacity {\n  transition: opacity 0.15s linear; }\n  .opacity.show {\n    opacity: 1; }\n\n.invalid-value {\n  border-color: #d50000 !important;\n  color: #d50000 !important; }\n  .invalid-value:hover, .invalid-value:focus, .invalid-value:active {\n    border-color: #d50000 !important;\n    color: #d50000 !important; }\n\n@keyframes clockanimation {\n  0% {\n    opacity: 0;\n    transform: scale(0.8); }\n  to {\n    opacity: 1;\n    transform: scale(1); } }\n"
  );
  t(
    ":export {\n  cranepurple800: #5c1349;\n  cranepurple900: #4e0d3a;\n  cranepurple700: #71135c;\n  cranered400: #f7363e;\n  white: #fff;\n  purple: #6200ee; }\n\n.timepicker-ui-wrapper.crane-straight, .timepicker-ui-wrapper.mobile.crane-straight {\n  border-radius: 0;\n  background-color: #4e0d3a;\n  color: #fff; }\n  .timepicker-ui-wrapper.crane-straight.radius, .timepicker-ui-wrapper.mobile.crane-straight.radius {\n    border-radius: 20px; }\n\n.timepicker-ui-select-time.crane-straight, .timepicker-ui-select-time.mobile.crane-straight {\n  color: #e5e5e5; }\n\n.timepicker-ui-clock-face.crane-straight, .timepicker-ui-clock-face.mobile.crane-straight {\n  background-color: #71135c; }\n\n.timepicker-ui-dot.crane-straight, .timepicker-ui-dot.mobile.crane-straight {\n  background-color: #f7363e; }\n\n.timepicker-ui-hour.crane-straight, .timepicker-ui-minutes.crane-straight, .timepicker-ui-hour.mobile.crane-straight, .timepicker-ui-minutes.mobile.crane-straight {\n  background-color: #71135c;\n  border-radius: 0;\n  color: #fff; }\n  .timepicker-ui-hour.crane-straight.radius, .timepicker-ui-minutes.crane-straight.radius, .timepicker-ui-hour.mobile.crane-straight.radius, .timepicker-ui-minutes.mobile.crane-straight.radius {\n    border-radius: 20px; }\n  .timepicker-ui-hour.crane-straight:hover, .timepicker-ui-hour.crane-straight.active, .timepicker-ui-minutes.crane-straight:hover, .timepicker-ui-minutes.crane-straight.active, .timepicker-ui-hour.mobile.crane-straight:hover, .timepicker-ui-hour.mobile.crane-straight.active, .timepicker-ui-minutes.mobile.crane-straight:hover, .timepicker-ui-minutes.mobile.crane-straight.active {\n    background-color: #f7363e; }\n\n.timepicker-ui-hour.mobile.crane-straight[contenteditable='true']:focus, .timepicker-ui-hour.mobile.crane-straight[contenteditable='true']:active, .timepicker-ui-minutes.mobile.crane-straight[contenteditable='true']:focus, .timepicker-ui-minutes.mobile.crane-straight[contenteditable='true']:active {\n  border-color: #fff;\n  outline-color: #fff; }\n\n.timepicker-ui-dots.crane-straight, .timepicker-ui-dots.mobile.crane-straight {\n  color: #fff; }\n\n.timepicker-ui-wrapper-type-time.crane-straight, .timepicker-ui-wrapper-type-time.mobile.crane-straight {\n  color: #fff; }\n\n.timepicker-ui-am.crane-straight, .timepicker-ui-pm.crane-straight, .timepicker-ui-am.mobile.crane-straight, .timepicker-ui-pm.mobile.crane-straight {\n  border: 2px solid transparent;\n  border-radius: 0;\n  background-color: #71135c; }\n\n.timepicker-ui-am:hover.crane-straight, .timepicker-ui-am.active.crane-straight, .timepicker-ui-pm:hover.crane-straight, .timepicker-ui-pm.active.crane-straight, .timepicker-ui-am.mobile:hover.crane-straight, .timepicker-ui-am.mobile.active.crane-straight, .timepicker-ui-pm.mobile:hover.crane-straight, .timepicker-ui-pm.mobile.active.crane-straight {\n  color: #fff;\n  background-color: #f7363e; }\n\n.timepicker-ui-am.crane-straight.radius {\n  border-top-left-radius: 20px;\n  border-top-right-radius: 20px; }\n\n.timepicker-ui-pm.crane-straight.radius {\n  border-bottom-left-radius: 20px;\n  border-bottom-right-radius: 20px; }\n\n@media screen and (min-width: 320px) and (max-width: 767px) and (orientation: landscape) {\n  .timepicker-ui-am.crane-straight.radius {\n    border-bottom-left-radius: 20px;\n    border-bottom-right-radius: 20px; } }\n\n@media screen and (min-width: 320px) and (max-width: 767px) and (orientation: landscape) {\n  .timepicker-ui-pm.crane-straight.radius {\n    border-top-left-radius: 20px;\n    border-top-right-radius: 20px; } }\n\n@media screen and (min-width: 320px) and (max-width: 767px) and (orientation: landscape) {\n  .timepicker-ui-am.mobile.crane-straight.radius {\n    border-bottom-left-radius: 0px;\n    border-bottom-right-radius: 0px; } }\n\n@media screen and (min-width: 320px) and (max-width: 767px) and (orientation: landscape) {\n  .timepicker-ui-pm.mobile.crane-straight.radius {\n    border-top-left-radius: 0px;\n    border-top-right-radius: 0px; } }\n\n.timepicker-ui-cancel-btn.crane-straight, .timepicker-ui-ok-btn.crane-straight, .timepicker-ui-cancel-btn.mobile.crane-straight, .timepicker-ui-ok-btn.mobile.crane-straight {\n  color: #fff;\n  border-radius: 0px; }\n  .timepicker-ui-cancel-btn.crane-straight.radius, .timepicker-ui-ok-btn.crane-straight.radius, .timepicker-ui-cancel-btn.mobile.crane-straight.radius, .timepicker-ui-ok-btn.mobile.crane-straight.radius {\n    border-radius: 13px; }\n\n.timepicker-ui-cancel-btn:hover.crane-straight, .timepicker-ui-ok-btn:hover.crane-straight, .timepicker-ui-cancel-btn.mobile:hover.crane-straight, .timepicker-ui-ok-btn.mobile:hover.crane-straight {\n  background-color: #f7363e; }\n\n.timepicker-ui-keyboard-icon-wrapper.crane-straight, .timepicker-ui-keyboard-icon-wrapper.mobile.crane-straight {\n  color: #fff; }\n  .timepicker-ui-keyboard-icon-wrapper.crane-straight.radius, .timepicker-ui-keyboard-icon-wrapper.mobile.crane-straight.radius {\n    border-radius: 20px; }\n\n.timepicker-ui-keyboard-icon-wrapper.crane-straight:hover .timepicker-ui-keyboard-icon,\n.timepicker-ui-keyboard-icon-wrapper.crane-straight:hover .timepicker-ui-keyboard-icon.mobile, .timepicker-ui-keyboard-icon-wrapper.mobile.crane-straight:hover .timepicker-ui-keyboard-icon,\n.timepicker-ui-keyboard-icon-wrapper.mobile.crane-straight:hover .timepicker-ui-keyboard-icon.mobile {\n  background-color: #f7363e;\n  color: #fff;\n  border-radius: 0; }\n\n.timepicker-ui-keyboard-icon-wrapper.crane-straight.radius:hover .timepicker-ui-keyboard-icon,\n.timepicker-ui-keyboard-icon-wrapper.crane-straight.radius:hover .timepicker-ui-keyboard-icon.mobile, .timepicker-ui-keyboard-icon-wrapper.mobile.crane-straight.radius:hover .timepicker-ui-keyboard-icon,\n.timepicker-ui-keyboard-icon-wrapper.mobile.crane-straight.radius:hover .timepicker-ui-keyboard-icon.mobile {\n  border-radius: 14px; }\n\n.timepicker-ui-keyboard-icon.crane-straight:hover, .timepicker-ui-keyboard-icon.mobile.crane-straight:hover {\n  color: #fff; }\n  .timepicker-ui-keyboard-icon.crane-straight:hover.radius, .timepicker-ui-keyboard-icon.mobile.crane-straight:hover.radius {\n    border-radius: 20px; }\n\n.timepicker-ui-clock-hand.crane-straight {\n  background-color: #f7363e; }\n\n.timepicker-ui-circle-hand.crane-straight {\n  border-color: #f7363e; }\n\n.timepicker-ui-value-tips.crane-straight {\n  color: #fff; }\n"
  );
  var n =
    ':export {\n  cranepurple800: #5c1349;\n  cranepurple900: #4e0d3a;\n  cranepurple700: #71135c;\n  cranered400: #f7363e;\n  white: #fff;\n  purple: #6200ee; }\n';
  t(n);
  const r = (e, i, t, n) => {
      const r = { ...i, ...e };
      return (
        ((e, i, t) => {
          Object.keys(t).forEach((n) => {
            const r = t[n],
              o = i[n],
              s =
                o && ((a = o)[0] || a).nodeType
                  ? 'element'
                  : ((e) =>
                      null == e
                        ? '' + e
                        : {}.toString
                            .call(e)
                            .match(/\s([a-z]+)/i)[1]
                            .toLowerCase())(o);
            var a;
            if (!new RegExp(r).test(s))
              throw new Error(
                e.toUpperCase() +
                  ': ' +
                  `Option "${n}" provided type "${s}" ` +
                  `but expected type "${r}".`
              );
          });
        })(n, r, t),
        r
      );
    },
    o = ({ clientX: e, clientY: i, touches: t }, n, r = !1) => {
      const { left: o, top: s } = n.getBoundingClientRect();
      let a = {};
      return (
        r
          ? r && Object.keys(t).length > 0 && (a = { x: t[0].clientX - o, y: t[0].clientY - s })
          : (a = { x: e - o, y: i - s }),
        a
      );
    },
    s = (e, i) => Math.round(e / i) * i,
    a = (e, i) => e.classList.contains(i),
    c = ({ value: e }) => {
      if ('' === e) return;
      const [i, t] = e.split(' '),
        [n, r] = i.split(':');
      let o = Number(r);
      const s = Number(n);
      return s > 12 || o > 59 || 0 === s || ('AM' !== t && 'PM' !== t)
        ? void 0
        : (o < 10 ? (o = '0' + o) : 0 === o && (o = '00'),
          { hour: s < 10 ? '0' + s : s.toString(), minutes: o.toString(), type: t });
    },
    l = (e, i, t) => {
      const n = new CustomEvent(i, { detail: t });
      e.dispatchEvent(n);
    },
    m = () =>
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    u = ['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'],
    p = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'],
    d = {
      amLabel: 'AM',
      appendModalSelector: '',
      backdrop: !0,
      cancelLabel: 'CANCEL',
      enableScrollbar: !1,
      enableSwitchIcon: !1,
      enterTimeLabel: 'Enter Time',
      hourMobileLabel: 'Hour',
      iconTemplate: '<i class="material-icons timepicker-ui-keyboard-icon">keyboard</i>',
      iconTemplateMobile: '<i class="material-icons timepicker-ui-keyboard-icon">schedule</i>',
      incrementHours: 1,
      incrementMinutes: 1,
      inputTemplate: '',
      minuteMobileLabel: 'Minute',
      mobile: !1,
      okLabel: 'OK',
      pmLabel: 'PM',
      selectTimeLabel: 'Select Time',
      switchToMinutesAfterSelectHour: !1,
      theme: 'basic',
    },
    h = {
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
    },
    k = 'timepicker-ui',
    b = 'mousedown mouseup mousemove mouseleave mouseover'.concat(' touchstart touchmove touchend'),
    g = 'active';
  (e.TimepickerUI = class {
    constructor(e, t) {
      i(this, 'init', () => {
        this._setTimepickerClassToElement(),
          this._setInputClassToInputElement(),
          this._setDataOpenToInputIfDosentExistInWrapper(),
          this._setScrollbarOrNot(),
          this._setClassTopOpenElement(),
          this._handleOpenOnClick();
      }),
        i(this, 'open', () => {
          this.init(), this._eventsBundle();
        }),
        i(this, 'close', () => {
          (this._isMouseMove = !1),
            b
              .split(' ')
              .map((e) => document.removeEventListener(e, this.mutliEventsMoveHandler, !1)),
            document.removeEventListener('mousedown', this.eventsClickMobileHandler),
            document.removeEventListener('touchstart', this.eventsClickMobileHandler),
            this._removeAnimationToClose(),
            this.openElement.classList.remove('disabled'),
            setTimeout(() => {
              this.modalElement.remove();
            }, 300);
        }),
        i(this, '_handleOpenOnClick', () => {
          this.openElement.addEventListener('click', () => this._eventsBundle());
        }),
        i(this, '_handleCancelButton', () => {
          this.cancelButton.addEventListener('click', () => {
            const e = c(this.input);
            l(this._element, 'cancel', {
              ...e,
              hourNotAccepted: this.hour.textContent,
              minutesNotAccepted: this.minutes.textContent,
              type: this.AM.textContent,
              degreesHours: this._degreesHours,
              degreesMinutes: this._degreesMinutes,
            }),
              this.close();
          });
        }),
        i(this, '_handleOkButton', () => {
          this.okButton.addEventListener('click', () => {
            const e = this._handleValueAndCheck(this.hour.textContent, 'hour'),
              i = this._handleValueAndCheck(this.minutes.textContent, 'minutes');
            !1 !== e && !1 !== i
              ? ((this.input.value = `${this.hour.textContent}:${this.minutes.textContent} ${this.activeTypeMode.textContent}`),
                l(this._element, 'accept', {
                  hour: this.hour.textContent,
                  minutes: this.minutes.textContent,
                  type: this.AM.textContent,
                }),
                this.close())
              : i || this.minutes.classList.add('invalid-value');
          });
        }),
        i(this, '_handleBackdropClick', () => {
          this.modalElement.addEventListener('click', (e) => {
            if (!a(e.target, 'timepicker-ui-modal')) return;
            const i = c(this.input);
            l(this._element, 'cancel', {
              ...i,
              hourNotAccepted: this.hour.textContent,
              minutesNotAccepted: this.minutes.textContent,
              type: this.AM.textContent,
              degreesHours: this._degreesHours,
              degreesMinutes: this._degreesMinutes,
            }),
              this.close();
          });
        }),
        i(this, '_setBgColorToCirleWithHourTips', () => {
          null !== this.minutesTips ||
            this._options.mobile ||
            ('crane-straight' === this._options.theme
              ? (this.circle.style.backgroundColor = n.cranered400)
              : (this.circle.style.backgroundColor = n.purple));
        }),
        i(this, '_setBgColorToCircleWithMinutesTips', () => {
          p.includes(this.minutes.textContent) &&
            ('crane-straight' === this._options.theme
              ? (this.circle.style.backgroundColor = n.cranered400)
              : (this.circle.style.backgroundColor = n.purple),
            this.circle.classList.remove('small-circle'));
        }),
        i(this, '_removeBgColorToCirleWithMinutesTips', () => {
          p.includes(this.minutes.textContent) ||
            ((this.circle.style.backgroundColor = ''), this.circle.classList.add('small-circle'));
        }),
        i(this, '_setTimepickerClassToElement', () => {
          this._element.classList.add(k);
        }),
        i(this, '_setClassActiveToHourOnOpen', () => {
          this._options.mobile || this._isMobileView || this.hour.classList.add(g);
        }),
        i(this, '_setMinutesToClock', (e) => {
          null !== this.clockFace && this._setTransformToCircleWithSwitchesMinutes(e),
            (this.tipsWrapper.innerHTML = ''),
            this._removeBgColorToCirleWithMinutesTips(),
            this._setNumbersToClockFace(p, 'timepicker-ui-minutes-time'),
            this._toggleClassActiveToValueTips(e);
        }),
        i(this, '_setHoursToClock', (e) => {
          null !== this.clockFace &&
            (this._setTransformToCircleWithSwitchesHour(e),
            (this.tipsWrapper.innerHTML = ''),
            this._setBgColorToCirleWithHourTips(),
            this._setNumbersToClockFace(),
            this._toggleClassActiveToValueTips(e));
        }),
        i(this, '_setTransformToCircleWithSwitchesHour', (e) => {
          const i = Number(e),
            t = i > 12 ? 30 * i - 360 : 30 * i;
          this.clockHand.style.transform = `rotateZ(${t}deg)`;
        }),
        i(this, '_setTransformToCircleWithSwitchesMinutes', (e) => {
          this.clockHand.style.transform = `rotateZ(${6 * Number(e)}deg)`;
        }),
        i(this, '_handleAmClick', () => {
          this.AM.addEventListener('click', (e) => {
            const { target: i } = e;
            i.classList.add(g),
              this.PM.classList.remove(g),
              l(this._element, 'selectamtypemode', {
                hour: this.hour.textContent,
                minutes: this.minutes.textContent,
                type: this.AM.textContent,
                degreesHours: this._degreesHours,
                degreesMinutes: this._degreesMinutes,
              });
          });
        }),
        i(this, '_handlePmClick', () => {
          this.PM.addEventListener('click', (e) => {
            const { target: i } = e;
            i.classList.add(g),
              this.AM.classList.remove(g),
              l(this._element, 'selectpmtypemode', {
                hour: this.hour.textContent,
                minutes: this.minutes.textContent,
                type: this.AM.textContent,
                degreesHours: this._degreesHours,
                degreesMinutes: this._degreesMinutes,
              });
          });
        }),
        i(this, '_handleAnimationClock', () => {
          setTimeout(() => {
            this.clockFace.classList.add('timepicker-ui-clock-animation'),
              setTimeout(() => {
                this.clockFace.classList.remove('timepicker-ui-clock-animation');
              }, 600);
          }, 150);
        }),
        i(this, '_handleHourClick', () => {
          this.hour.addEventListener('click', (e) => {
            const { target: i } = e;
            null !== this.clockFace && this._handleAnimationSwitchTipsMode(),
              this._setHoursToClock(i.textContent),
              i.classList.add(g),
              this.minutes.classList.remove(g),
              l(this._element, 'selecthourmode', {
                hour: this.hour.textContent,
                minutes: this.minutes.textContent,
                type: this.AM.textContent,
                degreesHours: this._degreesHours,
                degreesMinutes: this._degreesMinutes,
              }),
              null !== this.clockFace && this.circle.classList.remove('small-circle');
          });
        }),
        i(this, '_handleMinutesClick', () => {
          this.minutes.addEventListener('click', (e) => {
            const { target: i } = e;
            null !== this.clockFace && this._handleAnimationSwitchTipsMode(),
              null !== this.clockFace && this._setMinutesToClock(i.textContent),
              i.classList.add(g),
              this.hour.classList.remove(g),
              l(this._element, 'selectminutemode', {
                hour: this.hour.textContent,
                minutes: this.minutes.textContent,
                type: this.AM.textContent,
                degreesHours: this._degreesHours,
                degreesMinutes: this._degreesMinutes,
              });
          });
        }),
        i(this, '_handleEventToMoveHand', (e) => {
          m() || e.preventDefault();
          const { type: i, target: t } = e,
            {
              incrementMinutes: n,
              incrementHours: r,
              switchToMinutesAfterSelectHour: u,
            } = this._options,
            { x: p, y: d } = o(e, this.clockFace),
            h = this.clockFace.offsetWidth / 2;
          let k = Math.atan2(d - h, p - h);
          if (m()) {
            const i = o(e, this.clockFace, !0);
            k = Math.atan2(i.y - h, i.x - h);
          }
          if ('mouseup' === i || 'touchend' === i)
            return (this._isMouseMove = !1), void (u && this.minutes.click());
          if (
            (('mousedown' !== i && 'mousemove' !== i && 'touchmove' !== i && 'touchmove' !== i) ||
              ('mousedown' !== i && 'touchstart' !== i && 'touchmove' !== i) ||
              ((a(t, 'timepicker-ui-clock-face') ||
                a(t, 'timepicker-ui-circle-hand') ||
                a(t, 'timepicker-ui-hour-time-12') ||
                a(t, 'timepicker-ui-minutes-time') ||
                a(t, 'timepicker-ui-clock-hand') ||
                a(t, 'timepicker-ui-value-tips')) &&
                (this._isMouseMove = !0)),
            this._isMouseMove)
          ) {
            if (null !== this.minutesTips) {
              let e,
                i = Math.trunc((180 * k) / Math.PI) + 90;
              5 === n ? (i = s(i, 30)) : 10 === n ? (i = s(i, 60)) : 15 === n && (i = s(i, 90)),
                i < 0
                  ? ((e = Math.round(360 + i / 6) % 60), (i = 360 + 6 * Math.round(i / 6)))
                  : ((e = Math.round(i / 6) % 60), (i = 6 * Math.round(i / 6))),
                (this.minutes.innerText = e >= 10 ? e : '0' + e),
                (this.clockHand.style.transform = `rotateZ(${i}deg)`),
                (this._degreesMinutes = i),
                this._toggleClassActiveToValueTips(this.minutes.textContent),
                this._removeBgColorToCirleWithMinutesTips(),
                this._setBgColorToCircleWithMinutesTips();
            }
            if (null !== this.hourTips) {
              let e,
                i = Math.trunc((180 * k) / Math.PI) + 90;
              (i = s(i, 30)),
                2 === r ? (i = s(i, 60)) : 3 === r && (i = s(i, 90)),
                (this.clockHand.style.transform = `rotateZ(${i}deg)`),
                (this._degreesHours = i),
                i < 0
                  ? ((e = Math.round(360 + i / 30) % 12), (i = 360 + i))
                  : ((e = Math.round(i / 30) % 12), (0 === e || e > 12) && (e = 12)),
                (this.hour.innerText = e > 9 ? e : '0' + e),
                this._toggleClassActiveToValueTips(e);
            }
            l(this._element, 'update', {
              ...c(this.input),
              degreesHours: this._degreesHours,
              degreesMinutes: this._degreesMinutes,
              eventType: i,
            });
          }
        }),
        i(this, '_toggleClassActiveToValueTips', (e) => {
          const i = [...this.allValueTips].find((i) => Number(i.innerText) === Number(e));
          [...this.allValueTips].forEach((e) => e.classList.remove('active')),
            void 0 !== i && i.classList.add('active');
        }),
        i(this, '_handleMoveHand', () => {
          this._options.mobile ||
            this._isMobileView ||
            b.split(' ').map((e) => document.addEventListener(e, this.mutliEventsMoveHandler, !1));
        }),
        i(this, '_setModalTemplate', () => {
          const { appendModalSelector: e } = this._options;
          if ('' === e) document.body.insertAdjacentHTML('afterend', this.modalTemplate);
          else {
            document.querySelector(e).insertAdjacentHTML('beforeend', this.modalTemplate);
          }
        }),
        i(this, '_setScrollbarOrNot', () => {
          const { enableScrollbar: e } = this._options;
          e ||
            ((document.body.style.overflowY = 'hidden'),
            (document.body.style.paddingRight =
              (() => {
                const e = document.createElement('div');
                (e.className = 'timepicker-ui-measure'), document.body.appendChild(e);
                const i = e.getBoundingClientRect().width - e.clientWidth;
                return document.body.removeChild(e), i;
              })() + 'px'));
        }),
        i(this, '_setNumbersToClockFace', (e = u, i = 'timepicker-ui-hour-time-12') => {
          const t = 360 / e.length,
            n = (this.clockFace.offsetWidth - 32) / 2,
            r = (this.clockFace.offsetHeight - 32) / 2,
            o = n - 9;
          e.forEach((e, s) => {
            const a = ((e) => e * (Math.PI / 180))(s * t),
              c = document.createElement('span'),
              l = document.createElement('span');
            (l.innerHTML = e),
              l.classList.add('timepicker-ui-value-tips'),
              c.classList.add(i),
              'crane-straight' === this._options.theme &&
                (c.classList.add('crane-straight'), l.classList.add('crane-straight')),
              (c.style.left = n + Math.sin(a) * o - c.offsetWidth + 'px'),
              (c.style.bottom = r + Math.cos(a) * o - c.offsetHeight + 'px'),
              c.appendChild(l),
              this.tipsWrapper.appendChild(c);
          });
        }),
        i(this, '_handlerClickPmAm', async ({ target: e }) => {
          const i = this.modalElement.querySelectorAll('[contenteditable]'),
            t = this._handleValueAndCheck(this.hour.textContent, 'hour'),
            n = this._handleValueAndCheck(this.minutes.textContent, 'minutes');
          a(this.modalElement, 'mobile') &&
            (a(e, 'timepicker-ui-hour') || a(e, 'timepicker-ui-minutes')
              ? ((!1 !== t && !1 !== n) ||
                  (n || this.minutes.classList.add('invalid-value'),
                  t || this.hour.classList.add('invalid-value')),
                (e.contentEditable = !0))
              : (i.forEach((e) => {
                  (e.contentEditable = !1), e.classList.remove('active');
                }),
                !0 === t &&
                  !0 === n &&
                  (n && this.minutes.classList.remove('invalid-value'),
                  t && this.hour.classList.remove('invalid-value'))));
        }),
        (this._element = e),
        (this._options = r(t, d, h, k)),
        (this._isMouseMove = !1),
        (this._degreesHours = 30 * Number(c(this.input).hour)),
        (this._degreesMinutes = 6 * Number(c(this.input).minutes)),
        (this._isMobileView = !1),
        (this._isDesktopView = !0),
        (this.mutliEventsMove = (e) => this._handleEventToMoveHand(e)),
        (this.mutliEventsMoveHandler = this.mutliEventsMove.bind(this)),
        (this.eventsClickMobile = (e) => this._handlerClickPmAm(e)),
        (this.eventsClickMobileHandler = this.eventsClickMobile.bind(this)),
        this._options.mobile && (this._isMobileView = !0);
    }
    static get NAME() {
      return k;
    }
    get modalTemplate() {
      return this._options.mobile && this._isMobileView
        ? (({
            enterTimeLabel: e,
            amLabel: i,
            pmLabel: t,
            cancelLabel: n,
            okLabel: r,
            iconTemplateMobile: o,
            minuteMobileLabel: s,
            hourMobileLabel: a,
            enableSwitchIcon: c,
          }) =>
            `\n  <div class="timepicker-ui-modal normalize mobile" role="dialog">\n    <div class="timepicker-ui-wrapper mobile">\n      <div class="timepicker-ui-header mobile">\n        <div class="timepicker-ui-select-time mobile">${e}</div>\n        <div class="timepicker-ui-wrapper-time mobile">\n          <div class="timepicker-ui-hour mobile" contenteditable="false">12</div>  \n          <div class="timepicker-ui-hour-text mobile">${a}</div>\n          <div class="timepicker-ui-dots mobile">:</div>  \n          <div class="timepicker-ui-minute-text mobile">${s}</div>\n          <div class="timepicker-ui-minutes mobile" contenteditable="false">00</div>   \n        </div>\n      <div class="timepicker-ui-wrapper-type-time mobile">\n        <div class="timepicker-ui-type-mode timepicker-ui-am mobile" data-type="AM">${i}</div>    \n        <div class="timepicker-ui-type-mode timepicker-ui-pm mobile" data-type="PM">${t}</div>    \n      </div>\n      </div>\n      <div class="timepicker-ui-footer mobile" data-view="mobile">\n\n      ${
              c
                ? `\n      <div class="timepicker-ui-keyboard-icon-wrapper mobile" role="button" aria-pressed="false" data-view="desktop">\n      ${o}\n      </div>`
                : ''
            }\n      <div class="timepicker-ui-wrapper-btn mobile">\n        <div class="timepicker-ui-cancel-btn mobile" role="button" aria-pressed="false">${n}</div>\n        <div class="timepicker-ui-ok-btn mobile" role="button" aria-pressed="false">${r}</div>\n      </div>\n      </div>\n    </div>  \n  </div>`)(
            this._options
          )
        : (({
            iconTemplate: e,
            selectTimeLabel: i,
            amLabel: t,
            pmLabel: n,
            cancelLabel: r,
            okLabel: o,
            enableSwitchIcon: s,
          }) =>
            `\n  <div class="timepicker-ui-modal normalize" role="dialog">\n    <div class="timepicker-ui-wrapper ">\n      <div class="timepicker-ui-header">\n        <div class="timepicker-ui-select-time">${i}</div>\n        <div class="timepicker-ui-wrapper-time">\n          <div class="timepicker-ui-hour" role="button">05</div>  \n          <div class="timepicker-ui-dots">:</div>    \n          <div class="timepicker-ui-minutes" role="button">00</div>   \n        </div>\n      <div class="timepicker-ui-wrapper-type-time">\n        <div class="timepicker-ui-type-mode timepicker-ui-am" role="button" data-type="AM">${t}</div>    \n        <div class="timepicker-ui-type-mode timepicker-ui-pm" role="button" data-type="PM">${n}</div>    \n      </div>\n      </div>\n      <div class="timepicker-ui-wrapper-landspace">\n        <div class="timepicker-ui-body">\n          <div class="timepicker-ui-clock-face">\n            <div class="timepicker-ui-dot"></div>\n            <div class="timepicker-ui-clock-hand">\n              <div class="timepicker-ui-circle-hand"></div>\n            </div>\n            <div class="timepicker-ui-tips-wrapper"></div>\n          </div>\n        </div>\n        <div class="timepicker-ui-footer">\n        ${
              s
                ? `\n      <div class="timepicker-ui-keyboard-icon-wrapper" role="button" aria-pressed="false" data-view="desktop">\n        ${e}\n      </div>`
                : ''
            }\n \n        <div class="timepicker-ui-wrapper-btn">\n          <div class="timepicker-ui-cancel-btn" role="button" aria-pressed="false">${r}</div>\n          <div class="timepicker-ui-ok-btn" role="button" aria-pressed="false">${o}</div>\n        </div>\n        </div>\n      </div>\n    </div>  \n  </div>`)(
            this._options
          );
    }
    get modalElement() {
      return document.querySelector('.timepicker-ui-modal');
    }
    get clockFace() {
      return document.querySelector('.timepicker-ui-clock-face');
    }
    get input() {
      return this._element.querySelector('input');
    }
    get clockHand() {
      return document.querySelector('.timepicker-ui-clock-hand');
    }
    get circle() {
      return document.querySelector('.timepicker-ui-circle-hand');
    }
    get tipsWrapper() {
      return document.querySelector('.timepicker-ui-tips-wrapper');
    }
    get minutes() {
      return document.querySelector('.timepicker-ui-minutes');
    }
    get hour() {
      return document.querySelector('.timepicker-ui-hour');
    }
    get AM() {
      return document.querySelector('.timepicker-ui-am');
    }
    get PM() {
      return document.querySelector('.timepicker-ui-pm');
    }
    get minutesTips() {
      return document.querySelector('.timepicker-ui-minutes-time');
    }
    get hourTips() {
      return document.querySelector('.timepicker-ui-hour-time-12');
    }
    get allValueTips() {
      return document.querySelectorAll('.timepicker-ui-value-tips');
    }
    get button() {
      return document.querySelector('.timepicker-ui-button');
    }
    get openElementData() {
      const e = this._element.querySelector('[data-open]');
      return e ? Object.values(e.dataset)[0] : null;
    }
    get openElement() {
      return this._element.querySelector(`[data-open='${this.openElementData}']`);
    }
    get cancelButton() {
      return document.querySelector('.timepicker-ui-cancel-btn');
    }
    get okButton() {
      return document.querySelector('.timepicker-ui-ok-btn');
    }
    get activeTypeMode() {
      return document.querySelector('.timepicker-ui-type-mode.active');
    }
    get keyboardClockIcon() {
      return document.querySelector('.timepicker-ui-keyboard-icon');
    }
    get keyboardIconWrapper() {
      return new Promise((e) => {
        e(document.querySelector('.timepicker-ui-keyboard-icon-wrapper'));
      });
    }
    get footer() {
      return document.querySelector('.timepicker-ui-footer');
    }
    _setTheme() {
      const e = this.modalElement.querySelectorAll('div');
      'crane-straight' === this._options.theme
        ? [...e].forEach((e) => e.classList.add('crane-straight'))
        : 'crane-radius' === this._options.theme &&
          [...e].forEach((e) => e.classList.add('crane-straight', 'radius'));
    }
    _setInputClassToInputElement() {
      const e = this._element.querySelector('input');
      a(e, 'timepicker-ui-input') || e.classList.add('timepicker-ui-input');
    }
    _setDataOpenToInputIfDosentExistInWrapper() {
      const e = this._element.querySelector('input');
      null === this.openElementData && e.setAttribute('data-open', 'timepicker-ui-input');
    }
    _setClassTopOpenElement() {
      this.openElement.classList.add('timepicker-ui-open-element');
    }
    _removeBackdrop() {
      this._options.backdrop ||
        (this.modalElement.classList.add('removed'), this.openElement.classList.add('disabled'));
    }
    _setNormalizeClass() {
      const e = this.modalElement.querySelectorAll('div');
      this.modalElement.classList.add('timepicker-ui-normalize'),
        e.forEach((e) => e.classList.add('timepicker-ui-normalize'));
    }
    _setFlexEndToFooterIfNoKeyboardIcon() {
      this._options.enableSwitchIcon || (this.footer.style.justifyContent = 'flex-end');
    }
    _eventsBundle() {
      this._setModalTemplate(),
        this._setNormalizeClass(),
        this._removeBackdrop(),
        this._setClassActiveToHourOnOpen(),
        this._setBgColorToCirleWithHourTips(),
        null !== this.clockFace && this._setNumbersToClockFace(),
        this._setFlexEndToFooterIfNoKeyboardIcon(),
        setTimeout(() => {
          this._setTheme();
        }, 0),
        this._setAnimationToOpen(),
        this._getInputValueOnOpenAndSet(),
        this._toggleClassActiveToValueTips(this.hour.textContent),
        null !== this.clockFace &&
          (this._setTransformToCircleWithSwitchesHour(this.hour.textContent),
          this._handleAnimationClock()),
        this._handleMinutesClick(),
        this._handleHourClick(),
        this._handleAmClick(),
        this._handlePmClick(),
        this._handleMoveHand(),
        this._handleCancelButton(),
        this._handleOkButton(),
        this._handleBackdropClick(),
        this._handleIconChangeView(),
        this._handleClickOnHourMobile(this.hour),
        this._handleClickOnHourMobile(this.minute);
    }
    _getInputValueOnOpenAndSet() {
      const e = c(this.input);
      if (void 0 === e)
        return (
          (this.hour.innerText = '12'),
          (this.minutes.innerText = '00'),
          this.AM.classList.add('active'),
          void l(this._element, 'show', {
            hour: this.hour.textContent,
            minutes: this.minutes.textContent,
            type: this.AM.textContent,
            degreesHours: this._degreesHours,
            degreesMinutes: this._degreesMinutes,
          })
        );
      const { hour: i, minutes: t, type: n } = e,
        r = document.querySelector(`[data-type="${n}"]`);
      (this.hour.innerText = i),
        (this.minutes.innerText = t),
        r.classList.add('active'),
        l(this._element, 'show', {
          ...e,
          type: this.AM.textContent,
          degreesHours: this._degreesHours,
          degreesMinutes: this._degreesMinutes,
        });
    }
    _handleAnimationSwitchTipsMode() {
      this.clockHand.classList.add('timepicker-ui-tips-animation'),
        setTimeout(() => {
          this.clockHand.classList.remove('timepicker-ui-tips-animation');
        }, 401);
    }
    _setAnimationToOpen() {
      this.modalElement.classList.add('opacity'),
        setTimeout(() => {
          this.modalElement.classList.add('show');
        }, 150);
    }
    _removeAnimationToClose() {
      setTimeout(() => {
        this.modalElement.classList.remove('show');
      }, 150);
    }
    _handleValueAndCheck(e, i) {
      const t = Number(e);
      return 'hour' === i ? t > 0 && t <= 12 : 'minutes' === i ? t >= 0 && t <= 59 : void 0;
    }
    async _handleIconChangeView() {
      const e = async () => {
        if (a(this.modalElement, 'mobile')) {
          const e = this._handleValueAndCheck(this.hour.textContent, 'hour'),
            i = this._handleValueAndCheck(this.minutes.textContent, 'minutes');
          if (!1 === e || !1 === i)
            return (
              i || this.minutes.classList.add('invalid-value'),
              void (e || this.hour.classList.add('invalid-value'))
            );
          !0 === e &&
            !0 === i &&
            (i && this.minutes.classList.remove('invalid-value'),
            e && this.hour.classList.remove('invalid-value')),
            this.close(),
            (this._isMobileView = !1),
            (this._options.mobile = !1),
            (this._isDesktopView = !0);
          const t = this.hour.textContent,
            n = this.minutes.textContent,
            r = this.activeTypeMode.textContent;
          setTimeout(() => {
            this._eventsBundle(),
              (this._isMobileView = !0),
              (this._options.mobile = !0),
              (this._isDesktopView = !1),
              (this.hour.textContent = t),
              (this.minutes.textContent = n);
            const e = document.querySelectorAll('.timepicker-ui-type-mode');
            e.forEach((e) => e.classList.remove('active'));
            [...e].find((e) => e.textContent === r).classList.add('active'),
              this._setTransformToCircleWithSwitchesHour(this.hour.textContent),
              this._toggleClassActiveToValueTips(this.hour.textContent);
          }, 300);
        } else {
          this.close(),
            (this._isMobileView = !0),
            (this._options.mobile = !0),
            (this._isDesktopView = !1);
          const e = this.hour.textContent,
            i = this.minutes.textContent,
            t = this.activeTypeMode.textContent;
          setTimeout(() => {
            this._eventsBundle(),
              (this._isMobileView = !1),
              (this._options.mobile = !1),
              (this._isDesktopView = !0),
              (this.hour.textContent = e),
              (this.minutes.textContent = i);
            const n = document.querySelectorAll('.timepicker-ui-type-mode');
            n.forEach((e) => e.classList.remove('active'));
            [...n].find((e) => e.textContent === t).classList.add('active');
          }, 300);
        }
      };
      this._options.enableSwitchIcon &&
        (this.keyboardClockIcon.addEventListener('touchdown', (i) => e()),
        this.keyboardClockIcon.addEventListener('mousedown', (i) => e()));
    }
    _handleClickOnHourMobile() {
      this._options.mobile &&
        this._isMobileView &&
        (document.addEventListener('mousedown', this.eventsClickMobileHandler),
        document.addEventListener('touchstart', this.eventsClickMobileHandler));
    }
  }),
    Object.defineProperty(e, '__esModule', { value: !0 });
});
