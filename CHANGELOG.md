# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.4.1] - 2022-03-26

### Add

- added new `currentTime` option

### Fix

- fixed landscape on the mobile view

### Update

- updated comments in code to methods/options to show properly descriptions in codes editors

---

## [2.4.0] - 2022-03-22

### Add

- added new update method
- added new destroy method
- added new option `disabledTime` that allows to set to timepicker disabled time

### Update

- updated a methods open, close with new parameters and callbacks

---

## [2.3.0] - 2022-03-05

### Fix

- fixed problem with [switchToMinutesAfterSelectHour](https://github.com/pglejzer/timepicker-ui/issues/13) option
- fixed problem with [update](https://github.com/pglejzer/timepicker-ui/issues/12) event
- fixed problem with [animation](https://github.com/pglejzer/timepicker-ui/issues/11) option name
- fixed problem with [iconTemplete and iconTemplateMobile](https://github.com/pglejzer/timepicker-ui/issues/9) names
- fixed problem with [switching mobile/desktop view](https://github.com/pglejzer/timepicker-ui/issues/9)
- fixed problem to set options with data-attributes

### Change

- changed option name from `selectLabelTime` to `labelTime`

### Add

- added [UMD version](https://github.com/pglejzer/timepicker-ui/issues/8)
- added new options `mobileTimeLabel` to change time label on mobile version

---

## [2.2.3] - 2021-09-26

### Update

- Update README.md and links

---

## [2.2.2] - 2021-09-25

### Fixed

- Fixed hand circle SCSS on the crane mode
- Fixed am/om SCSS on the crane mode

### Update

- Update typings, remove alomost all @ts-ignore and any types.

---

## [2.2.1] - 2021-09-24

### Fixed

- Fixed scss with landscape version
- Fixed class active to hour/minutes

---

## [2.2.0] - 2021-09-23

### Added

- Version 24h
- Input validation

### Update

- Change scss styles
- Update types

---

## [2.1.1] - 2021-01-24

### Fixed

- Fixed problem with transition

---

## [2.1.0] - 2021-01-24

### Added

- Added new option <code>animated</code> to turn on/off animations on picker on start/close.
- Added new option <code>editable</code> to edit hour/minutes on the web mode.
- Added new option <code>preventDefault</code> to turn on/off defaults events to clock face events.

### Change

- Change docs example
- Removed unnecessary option <code>inputTemplate</code> from options types.

### Fixed

- Fixed problem with events on remove

---

## [2.0.2] - 2021-01-21

### Fixed

- Fixed problem with close event.

---

## [2.0.1] - 2021-01-18

### Fixed

- Fixed problem with keyboard icon click on mobile.

---

## [2.0.0] - 2021-01-17

### Changed

- Everything was rewritten to TypeScript

### Fixed

- Fixed problems with move events on mobile.

---

## [1.2.0] - 2020-11-05

### Changed

- Fixed return values of <code>type</code> in the events

### Added

- Added the possibility to have multiple open elements on init

[1.1.0]: https://github.com/olivierlacan/keep-a-changelog/compare/v1.0.0...v1.1.0
