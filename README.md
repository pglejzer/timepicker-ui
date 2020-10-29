# timepicker-ui

<a href="https://npmcharts.com/compare/timepicker-ui?minimal=true"></a> <img src="https://img.shields.io/npm/dw/timepicker-ui" alt="downloads"></a>
<a href="https://img.shields.io/npm/l/timepicker-ui"><img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License"></a>


timepicker-ui is an easy library with timepicker. Fully wrote with pure JavaScript. This library is based on Material Design from Google.

  - Free
  - Easy to use
  - Easy to customize

___

  ### Installation

Install timepicer-ui in your project.

#### Yarn

```bash
$ yarn add timepicker-ui 
```

#### NPM

```bash
$ npm installl timepicker-ui
```

___

### Usage


#### ES Modules

In your project you have to import timepicker from package to your JavaScript file.

```javascript
import { Timepicker } from 'timepicker-ui';
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
const newTimepicker = new TimepickerUI(DOMElement, options)
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
const wrapper = document.querySelector('.default-class');
const initTimepicker = new TimepickerUI(test);
```

___

### Options

You can set options by JavaScript or by data-attribute which `attribute` is a key option. Data-attributes will be overridden by JavaScript options.

___

### Future Plans

- keyboard accesibilty 
- max/min time options
- 24h time mode clock face
- keyboard icon functionality

If you have more good ideas please let me know in [issue](https://github.com/q448x/timepicker-ui/issues). I will try to add more useful features.


___

### License

MIT