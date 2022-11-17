# timepicker-ui

<a href="https://npmcharts.com/compare/timepicker-ui?minimal=true"><img src="https://img.shields.io/npm/dw/timepicker-ui" alt="downloads"></a>
[![npm version](https://badge.fury.io/js/timepicker-ui.svg)](https://badge.fury.io/js/timepicker-ui)
<a href="https://img.shields.io/npm/l/timepicker-ui"><img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License"></a>

timepicker-ui is an easy library with timepicker. Fully wrote with TypeScript. This library is based on Material Design from Google.

- Free
- Easy to use
- Easy to customize

[Click here to see a demo and examples](https://pglejzer.github.io/timepicker-ui-docs/)

---

### Desktop version

  <img src="https://i.ibb.co/VgR1Kn0/image.png" alt="desktop-version">

### 24h version

<img src="https://i.ibb.co/wpch19P/image.png" alt="desktop-24h">

---

### Landspace version

<img src="https://i.ibb.co/vYfmrc0/image.png" alt="desktop-version">

---

### Mobile version

  <img src="https://i.ibb.co/BZ0Vnyb/image.png" alt="mobile-version">

### Themes

There is 3 available version of theme: crane-straight, crane-radius and m3.

Theme `m3` based on the new Material Design v3. Material Design 3 is still not release in offical version for WEB but you can use it if you want.
There is new version of [Material Design 3](https://m3.material.io/components/time-pickers/overview).
If new version M3 will be released this design will get improve.

#### Desktop

  <img src="https://i.ibb.co/xh2rYN7/image.png" alt="desktop-crane-radius-version">

#### Landspace

  <img src="https://i.ibb.co/KVWRKkk/image.png" alt="desktop-crane-radius-version-mobile">

#### Mobile

  <img src="https://i.ibb.co/TYSML75/image.png" alt="desktop-crane-radius-version-mobile">

### Theme m3

  <img src="https://i.ibb.co/xLjYbNv/image.png" alt="desktop-m3-version">

### Theme m3-mobile

<img src="https://i.ibb.co/Zzm55P6/image.png" alt="desktop-m3-version-mobile">

---

### Installation

Install timepicker-ui in your project.

#### Yarn

```bash
$ yarn add timepicker-ui
```

#### NPM

```bash
$ npm install timepicker-ui
```

This library is using [font Roboto](https://fonts.google.com/specimen/Roboto) and [material-design icons](https://google.github.io/material-design-icons/). Basic options for all icons have been taken from material-icons. If you want to use material-icons you have to add dependencies to your project.

You can alawys change icons to another package if you change options <code>iconTemplate</code> and <code>iconTemplateMobile</code> which contains templates for icons. <code>iconTemplate</code> and <code>iconTemplateMobile</code> requiare default class <code>timepicker-ui-keyboard-icon</code>.

---

### Usage

#### Styles

We provide CSS styles built-in but sometimes if you don't use some normalize/reset CSS styles you have to add `box-sizing: border-box` to your app to display the correct layout.

```CSS
*,
::after,
::before {
    box-sizing: border-box;
}
```

#### ES Modules

In your project you have to import timepicker from package to your JavaScript file.

```javascript
import { TimepickerUI } from "timepicker-ui";
```

#### UMD

In your html file you have put script tag with path to `timepicker-ui.umd.js` file. After installing by npm/yarn you can copy the file from node_modules or add a path to this file.

```html
<script src="timepicker-ui.umd.js"></script>
<script src="node_modules/path/timepicker-ui.umd.js"></script>
<script src="/path/timepicker-ui.umd.js"></script>
```

###### Information

timepicker-ui has to have a wrapper that has an input inside this wrapper. If you will not add class `timepicker-ui` to your wrapper, it will be automatically added during initialization.

#### HTML

```html
<div class="timepicker-ui">
  <input type="text" class="timepicker-ui-input" value="12:00 AM" />
</div>
```

---

timepicker-ui has to be created with a new instance with key `new`. This instance accepts two parameters which first is the wrapper element for timepicker and the second is options that allow customization.

#### JavaScript

```javascript
const DOMElement = document.querySelector(".timepicker-ui");
const options = {};
const newTimepicker = new TimepickerUI(DOMElement, options);
```

By default initialization of timepicker is started when you click on input. If you want to change it you have to add `data-open` attribute with selector inside and this element has to be inside wrapper.

To initalize a timepicker with UMD version you have to init a window object with `tui`.

```js
const DOMElement = document.querySelector(".timepicker-ui");
const options = {};
const newTimepicker = new window.tui.TimepickerUI(DOMElement, options);

newTimepicker.create();
```

#### HTML

```html
<div class="default-class">
  <input type="text" class="timepicker-ui-input" value="12:00 AM" />
  <button class="timepicker-ui-button" data-open="default-class">Open</button>
</div>
```

#### JavaScript

```javascript
const timepicker = document.querySelector(".default-class");
const initTimepicker = new TimepickerUI(timepicker);

timepicker.create();
```

---

### Options

You can set options by JavaScript or by data-attribute which `attribute` is a key option. Data-attributes will be overridden by JavaScript options.

#### HTML

```html
<div
  class="default-class"
  data-am-label="test"
  data-backdrop="false"
  data-ok-label="fine"
>
  <input type="text" class="timepicker-ui-input" value="12:00 AM" />
  <button class="timepicker-ui-button" data-open="default-class">Open</button>
</div>
```

#### JavaScript

```javascript
const timepicker = document.querySelector(".default-class");
const options = { okLabel: "test", amLabel: "test1", backdrop: false };
const initTimepicker = new TimepickerUI(timepicker, options);

timepicker.create();
```

---

### CDNJS

This library is aviable in cdnjs packages. Here is a link to the full description https://cdnjs.com/libraries/timepicker-ui.

You can put script tags in your HTML file and use UMD version, without installation.

```html
<script
  src="https://cdnjs.cloudflare.com/ajax/libs/timepicker-ui/2.3.0/timepicker-ui.umd.js"
  integrity="sha512-a3QUlKZYbhDBhA0b++tX+QjrbEwk1DNTyCR7rzwM34AUx16sNOLDzh4JQhqV5xYLs010+xsnFjrDjz2jx2+qLw=="
  crossorigin="anonymous"
  referrerpolicy="no-referrer"
></script>
```

---

## React integration

It is possible to use this library on the React application. It's necessary to use the useRef hook to attach a dom element and add a custom event handler to this ref.

Link to an example with [React Hooks](https://codesandbox.io/s/modest-swanson-xqzme). <br/>
Link to an example with [React Class Component](https://codesandbox.io/s/vigilant-knuth-cx0yv).

```javascript
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { TimepickerUI } from 'timepicker-ui';

function App(): JSX.Element {
  const tmRef = useRef(null);
  const [inputValue, setInputValue] = useState('12:00 PM');

  const testHandler = useCallback((e: CustomEvent) => {
    setInputValue(`${e.detail.hour}:${e.detail.minutes} ${e.detail.type}`);
  }, []);

  useEffect(() => {
    if (inputValue === "10:00 PM") {
      alert("You selected 10:00 PM");
    }
  }, [inputValue]);

  useEffect(() => {
    const tm = (tmRef.current as unknown) as HTMLDivElement;

    const newPicker = new TimepickerUI(tm, {});
    newPicker.create();

    //@ts-ignore
    tm.addEventListener('accept', testHandler);

    return () => {
      //@ts-ignore
      tm.removeEventListener('accept', testHandler);
    };
  }, [testHandler]);

  return (
    <div className='timepicker-ui' ref={tmRef}>
      <input
        type='test'
        className='timepicker-ui-input'
        defaultValue={inputValue}
      />
    </div>
  );
}

export default App;
```

---

### Vue integration

This library can be used on Vue too. You have to use this.$refs to attach elements on DOM and add a custom event listener to this element.

Link to an example with [Vue 2](https://codesandbox.io/s/ancient-http-59o3w)<br/>
Link to an example with [Vue 3](https://codesandbox.io/s/falling-resonance-s96g6)

```javascript
<template>
  <div class="hello">
    <div class="timepicker-ui" ref="tm">
      <input v-model="inputValue" type="text" class="timepicker-ui-input" />
    </div>
    {{ inputValue }}
  </div>
</template>

<script>
import { TimepickerUI } from "timepicker-ui";

export default {
  name: "HelloWorld",
  data() {
    return {
      inputValue: "10:10 PM",
    };
  },
  mounted() {
    const test = new TimepickerUI(this.$refs.tm, { enableSwitchIcon: true });
    test.create();

    this.$refs.tm.addEventListener("accept", ({ detail }) => {
      this.inputValue = `${detail.hour}:${detail.minutes} ${detail.type}`;
    });
  },
};
</script>
```

---

#### Table with options

<table class="table">
  <thead>
    <tr>
      <th scope="col">Name</th>
      <th scope="col">Default</th>
      <th scope="col">Type</th>
      <th scope="col">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td scope="row">animation</td>
      <td>true</td>
      <td>boolean</td>
      <td>Turn on/off animations on picker on start/close</td>
    </tr>
    <tr>
      <td scope="row">amLabel</td>
      <td>AM</td>
      <td>string</td>
      <td>You can set custom text to am label</td>
    </tr>
    <tr>
      <td scope="row">appendModalSelector</td>
      <td>''</td>
      <td>string</td>
      <td>You can set default selector to append timepicker inside it. Timepicker default append to body</td>
    </tr>
    <tr>
      <td scope="row">backdrop</td>
      <td>true</td>
      <td>boolean</td>
      <td>Turn on/off backdrop</td>
    </tr>
    <tr>
      <td scope="row">cancelLabel</td>
      <td>CANCEL</td>
      <td>string</td>
      <td>You can set custom text to cancel button</td>
    </tr>
    <tr>
      <td scope="row">clockType</td>
      <td>12h</td>
      <td>string</td>
      <td>You can set type of clock, it contains 2 versions: 12h and 24h.</td>
    </tr> 
    <tr>
      <td scope="row">editable</td>
      <td>false</td>
      <td>boolean</td>
      <td>Edit hour/minutes on the web mode.</td>
    </tr> 
    <tr>
      <td scope="row">enableScrollbar</td>
      <td>false</td>
      <td>boolean</td>
      <td>Turn on/off scroll if timepicker is open</td>
    </tr> 
   <tr>
      <td scope="row">enableSwitchIcon</td>
      <td>false</td>
      <td>boolean</td>
      <td>Turn on/off icon to switch desktop/mobile</td>
    </tr> 
    <tr>
      <td scope="row">focusInputAfterCloseModal</td>
      <td>false</td>
      <td>boolean</td>
      <td>Turn on/off focus to input after close modal</td>
    </tr> 
    <tr>
    <td scope="row">focusTrap</td>
      <td>true</td>
      <td>boolean</td>
      <td>Turn off/on focus trap to the picker</td>
    </tr>
    <tr>
      <td scope="row">hourMobileLabel</td>
      <td>Hour</td>
      <td>string</td>
      <td>You can set custom text to hour label on mobile version</td>
    </tr> 
    <tr>
      <td scope="row">incrementHours</td>
      <td>1</td>
      <td>nubmer</td>
      <td>Increment hour by 1, 2, 3 hour</td>
    </tr>  
   <tr>
      <td scope="row">incrementMinutes</td>
      <td>1</td>
      <td>nubmer</td>
      <td>Increment minutes by 1, 5, 10, 15 minutes</td>
    </tr>   
   <tr>
      <td scope="row">minuteMobileLabel</td>
      <td>Minute</td>
      <td>string</td>
      <td>You can set custom text to minute label on mobile version</td>
    </tr>  
    <tr>
      <td scope="row">mobile</td>
      <td>false</td>
      <td>boolean</td>
      <td>Turn on mobile version</td>
    </tr>  
    <tr>
      <td scope="row">mobileTimeLabel</td>
      <td>Enter Time</td>
      <td>string</td>
      <td>You can set custom text to time label on mobile version</td>
    </tr>  
   <tr>
      <td scope="row">okLabel</td>
      <td>OK</td>
      <td>string</td>
      <td>You can set custom text to ok label</td>
    </tr> 
    <tr>
      <td scope="row">pmLabel</td>
      <td>PM</td>
      <td>string</td>
      <td>You can set custom text to pm label</td>
    </tr>  
   <tr>
      <td scope="row">timeLabel</td>
      <td>Select Time</td>
      <td>string</td>
      <td>You can set custom text to time label on desktop version</td>
    </tr>   
    <tr>
      <td scope="row">switchToMinutesAfterSelectHour</td>
      <td>true</td>
      <td>boolean</td>
      <td>Turn on/off switch to minutes by select hour</td>
    </tr>   
    <tr>
      <td scope="row">iconTemplate</td>
       <td>
       &lt;i class="material-icons timepicker-ui-keyboard-icon"> keyboard &lt;/i&gt;
      </td>
       <td>string</td>
      <td>You can set default template to switch desktop.This options is using by default material design icon</td>
    </tr>  
   <tr>
      <td scope="row">iconTemplateMobile</td>
      <td>&lt;i class="material-icons timepicker-ui-keyboard-icon"> schedule  &lt;/i&gt;</td>
      <td>string</td>
      <td>You can set default template to switch mobile. This options is using by default material design icon</td>
    </tr> 
   <tr>
    <td scope="row">theme</td>
      <td>basic</td>
      <td>string</td>
      <td>You can set theme to timepicker. Available options: basic, crane-straight, crane-radius and m3. <br>
      The offical version of Material Design 3 is still not avaialbe for the WEB version. Theme <code>m3</code> has been added based on the design what you can find <a target="_blank" href="https://m3.material.io/components/time-pickers/overview">here</a>. If new version M3 will be released this design will get improve.
      </td>
    </tr>  
    <tr>
      <td scope="row">disabledTime</td>
      <td>undefined</td>
      <td>object</td>
      <td>This option allows 3 keys: <code>hours</code>, <code>minutes</code> and <code>interval</code>. The hours and minutes are arrays which accept strings and numbers to block select hours/minutes. The interval key allow only string with interval values i.e., if you have 24h clockType the string can be 03:00 - 15:00, 01:20 - 05:15, 02:03 - 06:55 etc.. On the other hand if you have 12h clockType the string can be i.e 01:30 PM - 6:30 PM, 02:00 AM - 10:00 AM, 02:30 AM - 10:30 PM. It is important to remember that first hour in the interval option should be less that the second value if you want to block values from AM to PM and if you are using interval with 24h clockType. If the interval key is set, the hours/minutes keys are ignored.
  </td>
    </tr>  
    <tr>
      <td scope="row">currentTime</td>
      <td>undefined</td>
      <td>boolean | object</td>
      <td>
        Set current time to the input and timepicker.<br />
        If this options is set to <code>true</code> it's gonna update picker with toLocaleTimeString() and
        input with value based on your location. The clockType option is forced in that case.<br />
        This option also allows to put object with properties which:<br />
        <ul>
          <li>
            The <code>updateInput</code> key is set to true it's going update input value with the setted time key.
          </li>
          <li>The <code>time</code> key allows to put any valid date to update picker with time. It's converting Date to time.<br>
          If the <code>updateInput</code> is set to <code>false/undefined</code> and the default value from the input not exist, the <code>time</code> key value will be displayed in the picker. <br>
          If the <code>updateInput</code> is set to <code>false/undefined</code> but the default value from the input exist, the <code>time</code> key will be ignored. <br>
          </li>
          <li>The <code>locales</code>key can change language from toLocaleTimeString().</li>
          <li>
            The <code>preventClockType</code> key if is set to <code>true</code> it's force the clockType
            option to set value "12h" or "24h" based on your location with current time and
            <code>locales</code> key value is ignored in that case.<br />
            <code>
              currentTime: { time: new Date(), updateInput: true, locales: "en-US", preventClockType: false };
            </code>
          </li>
        </ul>
      </td>
    </tr>
    <tr>
      <td scope="row">delayHandler</td>
      <td>300</td>
      <td>number</td>
      <td>Set delay to clickable elements like button "OK", "CANCEL" etc. The value has to be set in milliseconds.</td>
    </tr> 
  </tbody>
</table>

---

### Methods

Methods are custom function what can be used to manually change the behavior of timepicker.

#### HTML

```HTML
<div class="timepicker-ui-test">
  <input type="text" class="timepicker-ui-input" value="12:00 AM">
</div>
```

#### JavaScript

```javascript
const timepicker = document.querySelector("timepicker-ui-test");
const init = new TimepickerUI(timepicker);

timepicker.create();
```

#### Table with methods

<table class="table">
  <thead>
    <tr>
      <th scope="col">Name</th>
      <th scope="col">Description</th>
      <th scope="col">Parameters</th>
      <th scope="col">Default</th>
      <th scope="col">Parameters description</th>
    </tr>
  </thead>
  <tbody>
   <tr>
      <td scope="row">create</td>
      <td>The create method init timepicker</td>
      <td align="center">-</td>
      <td align="center">-</td>
      <td align="center">-</td>
    </tr>
    <tr>
      <td scope="row">open</td>
      <td>The open method opens immediately timepicker after init</td>
      <td align="center">(function)</td>
      <td align="center">undefined</td>
      <td>The callback function is tiggered when timepicker is open by this method.  <br/>  <br/>Example: <br/>
      tmInstance.open(()=> console.log('triggered after open'));
      </td>
    </tr>
    <tr>
      <td scope="row">close</td>
      <td>Closure method closes the timepicker</td>
      <td align="center">()(boolean, function)</td>
      <td align="center">undefined</td>
      <td>The first parentheses doesn't have any paremeters. The second parentheses accepts parameters and these parameters are optional in this method and order is any. You can set callback function first or boolean, or just boolean or just callback. If the boolean is set to true the input will be updating with the current value on picker. The callback function start immediately after close, if is invoke. The max parameters length are set to 2
       <br/><br/>
       Examples:  <br/>
       tmInstance.close()(() => console.log('triggered after close')); <br/>
       tmInstance.close()(true, () => console.log('triggered after close')); <br/>
       tmInstance.close()(true);
      </td>
    </tr>
    <tr>
      <td scope="row">update</td>
      <td>The update method</td>
      <td align="center">(object, function)</td>
      <td align="center">({ options: {}, create: boolean }, callback)</td>
      <td>The first parameter is a object with key options which is timepicker options and it will be updated to current instance and is `required` The `create` key wchich if is set to true is starting the create() method after invoke update function and is optional. The `create` option is useful if you are using destroy and update methods together. The callback function is triggered after update method is invoke and this parameter is optional.
      <br/><br/>
       Examples:  <br/>
       tmInstance.update({options:{ amLabel:"test" }}, () => console.log('triggered after update')); <br/>
       tmInstance.update({options:{ amLabel:"test" }, create: true}, () => console.log('triggered after update')); <br/>
       tmInstance.update({options:{ amLabel:"test" }); <br/>
      </td>
    </tr>
    <tr>
      <td scope="row">destroy</td>
      <td>The destroy method destroy actual instance of picker by cloning element.</td>
      <td align="center">(function)</td>
      <td align="center">undefined</td>
      <td>The callback function is started after destroyed method. This parameter is optional.
       <br/><br/>
       Example:  <br/>
       tmInstance.destroy(() => console.log('triggered after destroy')); <br/>
      </td>
    </tr>

  </tbody>
</table>

---

### Events

Events are custom events triggered when you add some event listeners to your timepicker element. If you want to have a property timepicker/input values you have to use <code>detail</code> to the event object.

#### HTML

```HTML
<div class="timepicker-ui-test">
  <input type="text" class="timepicker-ui-input" value="12:00 AM">
</div>
```

#### JavaScript

```javascript
const timepicker = document.querySelector("timepicker-ui-test");
const init = new TimepickerUI(timepicker);

timepicker.create();

timepicker.addEventListener("show", (event) => console.log(event.detail));
```

#### Table with events

<table class="table">
  <thead>
    <tr>
      <th scope="col">Name</th>
      <th scope="col">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td scope="row">show</td>
      <td>The event starts if timepicker is showing up</td>
    </tr>
    <tr>
      <td scope="row">cancel</td>
      <td>The event starts if timepicker is closing</td>
    </tr>
    <tr>
      <td scope="row">accept</td>
      <td>The event starts if timepicker button OK is accepted</td>
    </tr>
     <tr>
      <td scope="row">update</td>
      <td>The event starts if mouse/touch events are triggered on a clock face (multiple events)</td>
    </tr> 
    <tr>
      <td scope="row">selectminutemode</td>
      <td>The event starts if timepicker minute box is clicked</td>
    </tr> 
   <tr>
      <td scope="row">selecthourmode</td>
      <td>The event starts if timepicker hour box is clicked</td>
    </tr> 
    <tr>
      <td scope="row">selectamtypemode</td>
      <td>The event starts if timepicker am box is clicked</td>
    </tr> 
    <tr>
      <td scope="row">selectpmtypemode</td>
      <td>The event starts if timepicker pm box is clicked</td>
    </tr>  
    <tr>
      <td scope="row">geterror</td>
      <td>The event start if value in the input is wrong</td>
    </tr> 
  </tbody>
</table>

---

### Future Plans

- keyboard accesibilty
- max/min time options

If you have more good ideas please let me know in [issue](https://github.com/pglejzer/timepicker-ui/issues). I will try to add more useful features. This project is still develop, if you find some bugs please report on the [issue](https://github.com/pglejzer/timepicker-ui/issues) page.

---

### License

MIT
