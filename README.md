# timepicker-ui

<a href="https://npmcharts.com/compare/timepicker-ui?minimal=true"><img src="https://img.shields.io/npm/dw/timepicker-ui" alt="downloads"></a>
<a href="https://img.shields.io/npm/l/timepicker-ui"><img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License"></a>


timepicker-ui is an easy library with timepicker. Fully wrote with pure JavaScript. This library is based on Material Design from Google.

  - Free
  - Easy to use
  - Easy to customize

---
### Desktop version

  <img src="https://i.ibb.co/VgR1Kn0/image.png" alt="desktop-version">

---

### Landspace version

<img src="https://i.ibb.co/vYfmrc0/image.png" alt="desktop-version">

---

### Mobile version

  <img src="https://i.ibb.co/BZ0Vnyb/image.png" alt="mobile-version">

___

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

___

### Usage


#### ES Modules

In your project you have to import timepicker from package to your JavaScript file.

```javascript
import { TimepickerUI } from 'timepicker-ui';
```

#### UMD

In your html file you have put script tag with path to `timepicker-ui.umd.js` file.

```html
<script src="timepicker-ui.umd.js"></script>
```

###### Information

timepicker-ui has to have a wrapper that has an input inside this wrapper. If you will not add class `timepicker-ui` to your wrapper, it will be automatically added during initialization. 

#### HTML

```html
<div class="timepicker-ui">
  <input type="test" class="timepicker-ui-input" value="12:00 AM"> 
</div>
```
---

timepicker-ui has to be created with a new instance with key `new`. This instance accepts two parameters which first is the wrapper element for timepicker and the second is options that allow customization.

#### JavaScript

```javascript
const DOMElement = document.querySelector('.timepicker-ui');
const options = {};
const newTimepicker = new TimepickerUI(DOMElement, options);
```

By default initialization of timepicker is started when you click on input. If you want to change it you have to add `data-open` attribute with selector inside and this element has to be inside wrapper. 

#### HTML

```html
<div class="default-class">
  <input type="test" class="timepicker-ui-input" value="12:00 AM"> 
  <button class="timepicker-ui-button" data-open="default-class">Open</button>
</div>
```

#### JavaScript

```javascript
const timepicker = document.querySelector('.default-class');
const initTimepicker = new TimepickerUI(timepicker);

timepicker.init();
```

___

### Options

You can set options by JavaScript or by data-attribute which `attribute` is a key option. Data-attributes will be overridden by JavaScript options.

#### HTML

```html
<div class="default-class" data-am-label="test" data-backdrop="false" data-ok-label="fine">
  <input type="test" class="timepicker-ui-input" value="12:00 AM"> 
  <button class="timepicker-ui-button" data-open="default-class">Open</button>
</div>
```
#### JavaScript

```javascript
const timepicker = document.querySelector('.default-class');
const options = { okLabel: 'test', amLabel: 'test1', backdrop: false }
const initTimepicker = new TimepickerUI(timepicker, options);


timepicker.init();
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
      <td scope="row">amLabel</td>
      <td>AM</td>
      <td>string</td>
      <td>Set custom text to am label</td>
    </tr>
    <tr>
      <td scope="row">appendModalSelector</td>
      <td>''</td>
      <td>string</td>
      <td>Set default selector to append timepicker inside it. Timepicker default append to body</td>
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
      <td>Set custom text to cancel button</td>
    </tr> 
      <tr>
      <td scope="row">enableScrollbar</td>
      <td>boolean</td>
      <td>false</td>
      <td>Turn on/off scroll if timepicker is open</td>
    </tr> 
   <tr>
      <td scope="row">enableSwitchIcon</td>
      <td>boolean</td>
      <td>false</td>
      <td>Turn on/off icon to switch desktop/mobile</td>
    </tr> 
      <tr>
      <td scope="row">hourMobileLabel</td>
      <td>Hour</td>
      <td>string</td>
      <td>Set custom text to hour label on mobile version</td>
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
      <td>Set custom text to minute label on mobile version</td>
    </tr>  
     <tr>
      <td scope="row">mobile</td>
      <td>false</td>
      <td>boolean</td>
      <td>Turn on mobile version</td>
    </tr>  
     <tr>
      <td scope="row">okLabel</td>
      <td>OK</td>
      <td>string</td>
      <td>Set custom text to ok label</td>
    </tr> 
      <tr>
      <td scope="row">pmLabel</td>
      <td>PM</td>
      <td>string</td>
      <td>Set custom text to pm label</td>
    </tr>  
     <tr>
      <td scope="row">selectTimeLabel</td>
      <td>Select Time</td>
      <td>string</td>
      <td>Set custom text to select time label on desktop version</td>
    </tr>   
    <tr>
      <td scope="row">switchToMinutesAfterSelectHour</td>
      <td>true</td>
      <td>boolean</td>
      <td>Turn on/off switch to minutes by select hour</td>
    </tr>   
    <tr>
      <td scope="row">iconClass</td>
       <td>
       < i class="material-icons timepicker-ui-keyboard-icon"> keyboard < /i >
      </td>
       <td>string</td>
      <td>Set default template to switch desktop.This options is using by default material design icon</td>
    </tr>  
     <tr>
      <td scope="row">iconClassMobile</td>
      <td>       < i class="material-icons timepicker-ui-keyboard-icon"> schedule < /i ></td>
      <td>string</td>
      <td>Set default template to switch mobile. This options is using by default material design icon</td>
    </tr> 
   <tr>
      <td 
      scope="row">theme</td>
      <td>string</td>
      <td>basic</td>
      <td>Set theme to timpicker. Available options: basic, crane-straight, crane-radius</td>
    </tr>  
  </tbody>
</table>

___


### Methods

Methods are custom function what can be used to manually change behaviour of timepicker.


#### HTML
```HTML
<div class="timepicker-ui-test">
  <input type="test" class="timepicker-ui-input" value="12:00 AM"> 
</div>
```

#### JavaScript

```javascript
const timepicker = document.querySelector('timepicker-ui-test')
const init = new TimepickerUI(timepicker)

timepicker.init();
```


#### Table with methods

<table class="table">
  <thead>
    <tr>
      <th scope="col">Name</th>
      <th scope="col">Description</th>
    </tr>
  </thead>
  <tbody>
   <tr>
      <td scope="row">init</td>
      <td>Init method is automatically are inject when you have a wrapper with class <code>timepicker-ui</code>. If not you have to init on your own</td>
    </tr>
    <tr>
      <td scope="row">open</td>
      <td>Open method open immediately timepicker after init</td>
    </tr>
    <tr>
      <td scope="row">close</td>
        <td>Open method close timepicker</td>
    </tr>
  </tbody>
</table>

___

### Events

Events are custom events triggered when you add some event listeners to your timepicker element. If you want have a property timepicker/input values you have to use <code>detail</code> to event object.

#### HTML
```HTML
<div class="timepicker-ui-test">
  <input type="test" class="timepicker-ui-input" value="12:00 AM"> 
</div>
```

#### JavaScript

```javascript
const timepicker = document.querySelector('timepicker-ui-test')
const init = new TimepickerUI(timepicker)

timepicker.init();

timepicker.addEventListener('show', (event)=> console.log(event.detail))
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
      <td>Event starts if timepicker is showing up</td>
    </tr>
    <tr>
      <td scope="row">cancel</td>
      <td>Event start if timepicker is closing</td>
    </tr>
    <tr>
      <td scope="row">accept</td>
      <td>Event starts if timepicker button OK is accpeted</td>
    </tr>
       <tr>
      <td scope="row">update</td>
      <td>Event start if mouse/touch events are triggered on clock face (multiple events)</td>
    </tr> 
      <tr>
      <td scope="row">selectminutemode</td>
      <td>Event start if timepicker minute box is cliked</td>
    </tr> 
   <tr>
      <td scope="row">selecthourmode</td>
      <td>Event starts if timepicker hour box is cliked</td>
    </tr> 
      <tr>
      <td scope="row">selectamtypemode</td>
      <td>Event starts if timepicker am box is cliked</td>
    </tr> 
      <tr>
      <td scope="row">selectamtypemode</td>
      <td>Event starts if timepicker pm box is cliked</td>
    </tr>  
  </tbody>
</table>
    
___

### Future Plans

- validation
- keyboard accesibilty 
- max/min time options
- 24h time mode clock face
- keyboard icon functionality

If you have more good ideas please let me know in [issue](https://github.com/q448x/timepicker-ui/issues). I will try to add more useful features.


___

### License

MIT