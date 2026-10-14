# /verify — scenarios

How to run: SKILL.md → "Running a scenario". Notation:
- `M` = `body > .tp-ui-modal.show` (the open picker; never the inline one). `__tp` resolves a leading `M`.
- `DO` = call in both phases (compare `→ EXPECT` only in after). `CHECK` = after phase only.
  `KEY` = real key press. `SHOT <name> root=<sel> ignore=<sel>` = screenshot + fingerprint (both phases).
- A scenario opens each picker once. Scenarios that use different pickers and the same viewport
  may share one page load; navigate fresh for a viewport change, a probe log, or when the before
  phase runs on a base older than 4.5.0 (re-opening a picker there accumulates listeners).
- Expectations encode the library's real behaviour as read from the code, not the demo's prose.
- Modal shots always use `ignore=.timepicker-announcer`.
- Known console noise on the library demo: `favicon.ico` 404 (only visible via MCP console lists).

## Library demo — common header

`page: lib` · `path: /` · ready: `DO ready('#basic-picker.tp-ui-input', { shiki: true })` · `vp: d` unless stated.

## @smoke

### lib/smoke-clock
1. DO `open('#basic-picker')` → EXPECT `ok: true`
2. SHOT `open` root=`M`
3. DO `tip('3')` → EXPECT `hour: '03'`, `minutesActive: true`
4. DO `tip('30')` → EXPECT `minutes: '30'`
5. DO `click('M .tp-ui-ok-btn')` → EXPECT `ok: true`
6. DO `waitClosed()` → EXPECT `closed: true`
7. CHECK `value('#basic-picker')` → EXPECT `value: '03:30 PM'`

### lib/smoke-wheel
1. DO `open('#wheel-basic')` → EXPECT `ok: true`, `wheelHours: '10'`
2. SHOT `open` root=`M`
3. DO `focus('M .tp-ui-wheel-hours')` → EXPECT `ok: true`
4. KEY `ArrowDown`
5. CHECK `state()` → EXPECT `wheelHours: '11'`, `hour: '11'`
6. DO `click('M .tp-ui-ok-btn')`; DO `waitClosed()` → EXPECT `closed: true`
7. CHECK `value('#wheel-basic')` → EXPECT `value: '11:30 PM'`

### lib/smoke-compact
1. DO `open('#compact-wheel-24h')` → EXPECT `ok: true`, `wheelHours: '17'`
2. SHOT `open` root=`M`
3. DO `focus('M .tp-ui-wheel-hours')`; KEY `ArrowUp`
4. CHECK `state()` → EXPECT `wheelHours: '16'`
5. DO `click('M .tp-ui-ok-btn')`; DO `waitClosed()` → EXPECT `closed: true`
6. CHECK `value('#compact-wheel-24h')` → EXPECT `value: '16:15'`

## @clock

### lib/clock-12h
1. DO `open('#basic-picker')` → EXPECT `ok: true`, `hour: '10'`, `minutes: '30'`, `ampm: 'PM'`, `hourActive: true`
2. SHOT `hours` root=`M`
3. DO `tip('3')` → EXPECT `hour: '03'`, `minutesActive: true`
4. SHOT `minutes` root=`M`
5. DO `tip('45')` → EXPECT `minutes: '45'`
6. DO `click('M .tp-ui-am')` → EXPECT `ok: true`; CHECK `state()` → EXPECT `ampm: 'AM'`
7. DO `click('M .tp-ui-ok-btn')`; DO `waitClosed()` → EXPECT `closed: true`
8. CHECK `value('#basic-picker')` → EXPECT `value: '03:45 AM'`

### lib/clock-24h
1. DO `open('#format-24h-picker')` → EXPECT `ok: true`, `hour: '15'`, `minutes: '45'`
2. SHOT `hours` root=`M`
3. DO `tip('21')` → EXPECT `hour: '21'`, `minutesActive: true`
4. SHOT `minutes` root=`M`
5. DO `tip('10')` → EXPECT `minutes: '10'`
6. DO `click('M .tp-ui-ok-btn')`; DO `waitClosed()` → EXPECT `closed: true`
7. CHECK `value('#format-24h-picker')` → EXPECT `value: '21:10'`

### lib/clock-keys
1. DO `open('#basic-picker')` → EXPECT `ok: true`
2. DO `focus('M .tp-ui-hour')` → EXPECT `ok: true`
3. KEY `ArrowUp`; CHECK `state()` → EXPECT `hour: '11'`
4. KEY `PageUp`; CHECK `state()` → EXPECT `hour: '12'`
5. DO `click('M .tp-ui-cancel-btn')`; DO `waitClosed()` → EXPECT `closed: true`
6. CHECK `value('#basic-picker')` → EXPECT `value: '10:30 PM'`

## @wheel

### lib/wheel-modal
1. DO `open('#wheel-24h')` → EXPECT `ok: true`, `wheelMinutes: '45'`
2. SHOT `open` root=`M`
3. DO `focus('M .tp-ui-wheel-minutes')`; KEY `ArrowDown`; KEY `ArrowDown`
4. CHECK `state()` → EXPECT `wheelMinutes: '47'`, `minutes: '47'`
5. DO `click('M .tp-ui-ok-btn')`; DO `waitClosed()` → EXPECT `closed: true`
6. CHECK `value('#wheel-24h')` → EXPECT `value: '14:47'`

### lib/wheel-popover
1. DO `open('#popover-bottom')` → EXPECT `ok: true`, `popover: true`, `placement: 'bottom'`
2. SHOT `open` root=`M`
3. DO `focus('M .tp-ui-wheel-hours')`; KEY `ArrowUp`
4. CHECK `state()` → EXPECT `wheelHours: '01'`
5. DO `click('M .tp-ui-ok-btn')`; DO `waitClosed()` → EXPECT `closed: true`
6. CHECK `value('#popover-bottom')` → EXPECT `value: '01:45 PM'`

### lib/wheel-outside
1. DO `open('#popover-auto')` → EXPECT `ok: true`, `popover: true`
2. DO `outside()`; DO `waitClosed()` → EXPECT `closed: true`
3. CHECK `value('#popover-auto')` → EXPECT `value: '09:30 AM'`

### lib/wheel-mobile
- vp: m
1. DO `open('#wheel-basic')` → EXPECT `ok: true`
2. SHOT `open` root=`M`
3. DO `click('M .tp-ui-cancel-btn')`; DO `waitClosed()`

## @range

### lib/range-24h
1. DO `open('#range-picker-24h')` → EXPECT `ok: true`, `rangeActive: 'from'`, `rangeToDisabled: true`, `okDisabled: true`
2. SHOT `from` root=`M`
3. DO `tip('9')` → EXPECT `hour: '09'`
4. DO `tip('00')` → EXPECT `rangeFrom: '09:00'`, `rangeActive: 'to'`
5. SHOT `to` root=`M`
6. DO `tip('17')` → EXPECT `hour: '17'`
7. DO `tip('30')` → EXPECT `rangeTo: '17:30'`, `okDisabled: false`
8. DO `click('M .tp-ui-ok-btn')`; DO `waitClosed()` → EXPECT `closed: true`
9. CHECK `value('#range-picker-24h')` → EXPECT `value: '09:00 - 17:30'`

## @timezone

### lib/tz-mouse
1. DO `open('#timezone-world-picker')` → EXPECT `ok: true`, `tzExpanded: 'false'`
2. DO `click('M .tp-ui-timezone-dropdown')` → EXPECT `ok: true`; CHECK `state()` → EXPECT `tzExpanded: 'true'`
3. SHOT `dropdown` root=`M`
4. CHECK `text('M .tp-ui-timezone-menu .tp-ui-timezone-option:nth-child(3)')` → remember it as `<opt>`
5. DO `click('M .tp-ui-timezone-menu .tp-ui-timezone-option:nth-child(3)')` → EXPECT `ok: true`
6. CHECK `state()` → EXPECT `tzExpanded: 'false'`, `tzSelected: <opt>`
7. DO `click('M .tp-ui-ok-btn')`; DO `waitClosed()` → EXPECT `closed: true`
8. CHECK `value('#timezone-world-picker')` → EXPECT `value: '09:00'`

### lib/tz-keys
1. DO `open('#timezone-picker')` → EXPECT `ok: true`, `tzSelected: 'Timezone...'`
2. DO `focus('M .tp-ui-timezone-dropdown')`; KEY `ArrowDown`
3. CHECK `state()` → EXPECT `tzExpanded: 'true'`
4. KEY `ArrowDown`; KEY `Enter`
5. CHECK `state()` → EXPECT `tzExpanded: 'false'`, `tzSelected` not `'Timezone...'` and not empty
6. DO `click('M .tp-ui-cancel-btn')`; DO `waitClosed()` → EXPECT `closed: true`

## @keyboard

### lib/kb-trap
1. DO `focus('#basic-picker')`; KEY `Enter`
2. DO `waitOpen()` → EXPECT `open: true`
3. CHECK `state()` → EXPECT `focusInModal: true`
4. DO `focus('M .tp-ui-ok-btn')`; KEY `Tab`
5. CHECK `state()` → EXPECT `focusInModal: true`
6. DO `focus('M .tp-ui-hour')`; KEY `Shift+Tab`
7. CHECK `state()` → EXPECT `focusInModal: true`
8. KEY `Escape`; DO `waitClosed()` → EXPECT `closed: true`
9. CHECK `value('#basic-picker')` → EXPECT `value: '10:30 PM'`

### lib/kb-return-focus
1. DO `focus('#editable-picker')`; KEY `Enter`
2. DO `waitOpen()` → EXPECT `open: true`
3. KEY `Escape`; DO `waitClosed()` → EXPECT `closed: true`
4. CHECK `state()` → EXPECT `active` starts with `input#editable-picker`

## @modal

### lib/modal-cancel
1. DO `open('#basic-picker')` → EXPECT `ok: true`, `htmlOverflowY: 'hidden'` (the scroll lock is on `<html>`; `<body>` is locked too only when it scrolls itself)
2. SHOT `open` root=`M`
3. DO `tip('5')` → EXPECT `hour: '05'`
4. DO `click('M .tp-ui-cancel-btn')`; DO `waitClosed()` → EXPECT `closed: true`
5. DO `wait(500)`
6. CHECK `state('#basic-picker')` → EXPECT `inputValue: '10:30 PM'`, no `htmlOverflowY` and no `bodyOverflowY` key (released)

### lib/close-final
A close is final from its first moment: no second event, no change after OK, no open during the fade.
Each check uses its own probe picker (`probe()` builds one from the demo's TimepickerUI class and logs
`show, open, confirm, cancel, update, select:am, select:pm, error`).
1. DO `probe('cf1', '10:00 AM')`; DO `open('#cf1')` → EXPECT `ok: true`; DO `clearLog('cf1')`
2. DO `clickTwice('M .tp-ui-ok-btn')`; DO `waitClosed()` → EXPECT `closed: true`
3. CHECK `log('cf1')` → EXPECT `log: 'confirm'`
4. DO `probe('cf2', '10:00 AM')`; DO `open('#cf2')`; DO `clearLog('cf2')`; DO `clickTwice('M .tp-ui-cancel-btn')`; DO `waitClosed()`
5. CHECK `log('cf2')` → EXPECT `log: 'cancel'`
6. DO `probe('cf3', '10:00 AM')`; DO `open('#cf3')`; DO `clearLog('cf3')`; KEY `Escape`; KEY `Escape`; DO `waitClosed()`
7. CHECK `log('cf3')` → EXPECT `log: 'cancel'`
8. DO `probe('cf4', '10:00 AM')`; DO `open('#cf4')`; DO `clearLog('cf4')`;
   DO `clickThen('M .tp-ui-ok-btn', 'body > .tp-ui-modal .tp-ui-pm')`; DO `waitClosed()`
9. CHECK `log('cf4')` → EXPECT `log: 'confirm'`; CHECK `value('#cf4')` → EXPECT `value: '10:00 AM'`
10. DO `probe('cf5', '10:00 AM')`; DO `open('#cf5')`; DO `focus('M .tp-ui-hour')`; KEY `ArrowUp`
11. CHECK `getValue('cf5')` → EXPECT `time: '11:00 AM'` (shown selection while open)
12. DO `click('M .tp-ui-cancel-btn')`; CHECK `getValue('cf5')` → EXPECT `time: '10:00 AM'` (input value while closing); DO `waitClosed()`
13. DO `probe('cf6', '10:00 AM')`; DO `open('#cf6')`; then in ONE evaluate: dispatch an Escape `keydown` on `M`,
    `wait(50)`, `clearLog('cf6')`, `focus('#cf6')`, dispatch an Enter `keydown` on `#cf6`, `wait(80)` (the close
    takes `TIMINGS.MODAL_EXIT`, 150 ms; separate tool calls are slower than that)
14. CHECK `log('cf6')` → EXPECT `log: ''` (no `show` while the old modal fades); CHECK `modalCount()` → EXPECT `count` ≤ 1
15. DO `waitClosed()`; DO `wait(200)`; DO `clearLog('cf6')`; DO `focus('#cf6')`; KEY `Enter`; DO `waitOpen()` → EXPECT `open: true`
16. CHECK `log('cf6')` → EXPECT one `show` and one `open`, nothing else; KEY `Escape`; DO `waitClosed()`

### lib/modal-backdrop
1. DO `open('#theme-basic')` → EXPECT `ok: true`
2. DO `backdrop()` → EXPECT `ok: true`
3. DO `waitClosed()` → EXPECT `closed: true`
4. CHECK `value('#theme-basic')` → EXPECT `value: '10:00 PM'`

### lib/modal-mobile
- vp: m
1. DO `open('#basic-picker')` → EXPECT `ok: true`
2. SHOT `open` root=`M`
3. DO `click('M .tp-ui-cancel-btn')`; DO `waitClosed()`

## @disabled

### lib/disabled-hours
1. DO `open('#disabled-hours')` → EXPECT `ok: true`, `hour: '08'`, `disabledTips` contains `1`, `2`, `3`, `22`, `23`
2. SHOT `hours` root=`M`
3. DO `tip('10')` → EXPECT `hour: '10'`, `minutesActive: true`
4. DO `click('M .tp-ui-cancel-btn')`; DO `waitClosed()`

### lib/disabled-click
A rejected (disabled) hour click must not switch to the minutes view. On a base older than 4.5.0 this
scenario fails; report it there as `broken-on-base`, never as a regression.
1. DO `open('#disabled-hours')` → EXPECT `ok: true`
2. DO `tip('2')` → EXPECT `hour: '08'` (value ignored), `hourActive: true` (still on the hours view)
3. DO `click('M .tp-ui-cancel-btn')`; DO `waitClosed()`

### lib/disabled-interval
1. DO `open('#disabled-interval')` → EXPECT `ok: true`, `disabledTips` contains `12`, `13`, `14`, `15`, `16`, `17`
2. SHOT `hours` root=`M`
3. DO `click('M .tp-ui-cancel-btn')`; DO `waitClosed()`

## @clear

### lib/clear
1. DO `open('#clear-button-picker')` → EXPECT `ok: true`
2. DO `tip('4')` → EXPECT `hour: '04'`
3. DO `click('M .tp-ui-clear-btn')` → EXPECT `ok: true`
4. CHECK `state('#clear-button-picker')` → EXPECT `hour: '12'`, `minutes: '00'`, `okDisabled: true`, `clearDisabled: true`, no `inputValue` key (input emptied)
5. SHOT `cleared` root=`M`
6. DO `click('M .tp-ui-cancel-btn')`; DO `waitClosed()` → EXPECT `closed: true`
7. CHECK `value('#clear-button-picker')` → EXPECT `value: ''`

## @mobile

### lib/mobile
- vp: m
1. DO `open('#mobile-picker')` → EXPECT `ok: true`, `title: 'Enter Time'`, `hourReadonly: false`, `modalClass` contains `mobile`
2. SHOT `keyboard` root=`M`
3. DO `type('M .tp-ui-hour', '7')` → EXPECT `value: '07'`
4. DO `click('M .tp-ui-keyboard-icon-wrapper')` → EXPECT `ok: true`; DO `wait(500)`
5. SHOT `clock` root=`M`
6. DO `click('M .tp-ui-ok-btn')`; DO `waitClosed()` → EXPECT `closed: true`
7. CHECK `value('#mobile-picker')` → EXPECT `value: '07:30'`

## @api

### lib/api
- ready: `DO ready('#getvalue-button', { shiki: true })`
1. DO `click('#getvalue-button')` → EXPECT `ok: true`
2. CHECK `text('#getvalue-output')` → EXPECT contains `"time": "14:30"`
3. DO `click('#setvalue-button')` → EXPECT `ok: true`
4. CHECK `value('#getvalue-demo-picker')` → EXPECT `value: '18:45'`; CHECK `text('#getvalue-output')` → EXPECT contains `Value set to 18:45`
5. DO `click('#open-check-button')`; DO `waitText('#getvalue-output', 'Opened and closed', 5000)` → EXPECT `ok: true`
6. DO `waitClosed()` → EXPECT `closed: true`
7. DO `click('#destroy-button')` → EXPECT `ok: true`
8. DO `open('input#destroy-example')` → EXPECT `ok: false`

## @themes

### lib/themes
For each `(theme, picker)`: DO `open(picker)` → EXPECT `ok: true`, `theme: <theme>`; SHOT `<theme>` root=`M`;
DO `click('M .tp-ui-cancel-btn')`; DO `waitClosed()`.

| theme | picker |
|---|---|
| basic | `#theme-basic` |
| m2 | `#theme-m2` |
| crane-straight | `#theme-crane-straight` |
| crane | `#theme-crane-radius` |
| m3-green | `#theme-m3` |
| dark | `#theme-dark` |
| glassmorphic | `#theme-glassmorphic` |
| pastel | `#theme-pastel` |
| ai | `#theme-ai` |
| cyberpunk | `#theme-cyberpunk` |
| blueprint | `#blueprint-light` |
| blueprint-dark | `#blueprint-dark-24h` |

### lib/themes-mobile
- vp: m
For each picker `#basic-picker`, `#wheel-basic`, `#compact-wheel-12h`: DO `open(picker)` → EXPECT `ok: true`;
SHOT `<picker without #>` root=`M`; DO `click('M .tp-ui-cancel-btn')`; DO `waitClosed()`.

## @theme:<X>

### lib/theme-<X>
Picker = row `<X>` of the `lib/themes` table; wheel picker = `#wheel-theme-<X>` (not for blueprint / blueprint-dark).
1. DO `reveal(picker)`; SHOT `closed` root=`.tp-ui:has(> <picker>)`
2. DO `open(picker)` → EXPECT `ok: true`, `theme: '<X>'`; SHOT `open` root=`M`
3. DO `click('M .tp-ui-cancel-btn')`; DO `waitClosed()`
4. (if a wheel picker exists) DO `open('#wheel-theme-<X>')` → EXPECT `ok: true`; SHOT `wheel` root=`M`; DO `click('M .tp-ui-cancel-btn')`; DO `waitClosed()`

## Theme variants (style rule)

### lib/variants-<tag>
For each picker of the tag's row: DO `open(picker)` → EXPECT `ok: true`; SHOT `<picker without #>` root=`M`;
DO `click('M .tp-ui-cancel-btn')`; DO `waitClosed()`.

| Tag | basic | dark | m3-green |
|---|---|---|---|
| `@clock`, `@modal`, `@smoke` | `#theme-basic` | `#theme-dark` | `#theme-m3` |
| `@wheel` | `#wheel-theme-basic`, `#compact-theme-basic` | `#wheel-theme-dark`, `#compact-theme-dark` | `#wheel-theme-m3-green`, `#compact-theme-m3-green` |
| `@range` | `#range-basic` | `#range-dark` | `#range-m3` |
| `@timezone` | `#timezone-basic` | `#timezone-dark` | `#timezone-m3` |

## @seconds

Demo section `#seconds` (`app/docs/partials/seconds.html`, `app/docs/examples/seconds.ts`). Inputs are
`#seconds-<example id>`; theme inputs are `#seconds-theme-<theme>-<variant>`. `vp: l` = `844x390x1,mobile,touch`.
Needs `state()` fields `seconds`, `secondsActive`, `wheelSeconds` (helpers.js).

### lib/seconds-clock-24h
1. DO `open('#seconds-clock-24h')` → EXPECT `ok: true`, `hour: '14'`, `minutes: '30'`, `seconds: '45'`, `hourActive: true`, `modalClass` contains `tp-ui-has-seconds`
2. SHOT `hours` root=`M`
3. DO `tip('21')` → EXPECT `hour: '21'`, `minutesActive: true`
4. DO `tip('10')` → EXPECT `minutes: '10'`, `secondsActive: true`
5. SHOT `seconds` root=`M`
6. DO `tip('25')` → EXPECT `seconds: '25'`
7. DO `click('M .tp-ui-ok-btn')`; DO `waitClosed()` → EXPECT `closed: true`
8. CHECK `value('#seconds-clock-24h')` → EXPECT `value: '21:10:25'`

### lib/seconds-clock-12h
1. DO `open('#seconds-clock-12h')` → EXPECT `ok: true`, `hour: '02'`, `minutes: '30'`, `seconds: '15'`, `ampm: 'PM'`
2. SHOT `open` root=`M`
3. DO `tip('4')`; DO `tip('45')`; DO `tip('30')` → EXPECT `seconds: '30'`
4. DO `click('M .tp-ui-am')`; DO `click('M .tp-ui-ok-btn')`; DO `waitClosed()` → EXPECT `closed: true`
5. CHECK `value('#seconds-clock-12h')` → EXPECT `value: '04:45:30 AM'`

### lib/seconds-keys
1. DO `open('#seconds-step-5')` → EXPECT `ok: true`, `seconds: '05'`
2. DO `focus('M .tp-ui-seconds')`; KEY `ArrowUp` → CHECK `state()` → EXPECT `seconds: '10'`
3. SHOT `focus` root=`M` (one focus ring on the seconds field)
4. DO `click('M .tp-ui-cancel-btn')`; DO `waitClosed()`
5. CHECK `value('#seconds-step-5')` → EXPECT `value: '08:00:05'` (the demo does not set `focusInputAfterClose`, so focus is not checked)

### lib/seconds-disabled-keys
1. DO `open('#seconds-disabled-24h')` → EXPECT `ok: true`, `seconds: '45'`
2. DO `type('M .tp-ui-seconds', '29')`; KEY `ArrowUp` → CHECK `state()` → EXPECT `seconds: '31'` (:30 skipped)
3. DO `click('M .tp-ui-seconds')` → CHECK `state()` → EXPECT `disabledTips` contains `00`, `30`
4. DO `click('M .tp-ui-cancel-btn')`; DO `waitClosed()`

### lib/seconds-wheel
1. DO `open('#seconds-wheel-24h')` → EXPECT `ok: true`, `wheelSeconds: '45'`
2. SHOT `open` root=`M`
3. DO `focus('M .tp-ui-wheel-seconds')`; KEY `ArrowDown` → CHECK `state()` → EXPECT `wheelSeconds: '46'`, `seconds: '46'`
4. DO `click('M .tp-ui-ok-btn')`; DO `waitClosed()`
5. CHECK `value('#seconds-wheel-24h')` → EXPECT `value: '14:30:46'`

### lib/seconds-popover
1. DO `open('#seconds-popover-12h')` → EXPECT `ok: true`, `popover: true`
2. SHOT `open` root=`M` (four columns fit; the ring may clip 2–3.5px, accepted)
3. DO `outside()`; DO `waitClosed()` → EXPECT `closed: true`

### lib/seconds-clear
1. DO `open('#seconds-clear')` → EXPECT `ok: true`
2. DO `click('M .tp-ui-clear-btn')` → CHECK `state('#seconds-clear')` → EXPECT `hour: '12'`, `minutes: '00'`, `seconds: '00'`, `okDisabled: true`
3. DO `click('M .tp-ui-cancel-btn')`; DO `waitClosed()` → CHECK `value('#seconds-clear')` → EXPECT `value: ''`

### lib/seconds-range
1. DO `open('#seconds-range-24h')` → EXPECT `ok: true`, `rangeActive: 'from'`, `okDisabled: true`
2. SHOT `from` root=`M`
3. Fill From (To stays disabled until hour, minutes and seconds are set): DO `focus('M .tp-ui-hour')`; KEY `ArrowUp`;
   DO `focus('M .tp-ui-minutes')`; KEY `ArrowUp`; DO `focus('M .tp-ui-seconds')`; KEY `ArrowUp`;
   DO `click('M .tp-ui-range-to')` → CHECK `state()` → EXPECT `rangeActive: 'to'`, `rangeFrom` has no `--`
4. Fill To the same way, hour first with KEY `ArrowUp` twice (To later than From) → CHECK `state()` → EXPECT `okDisabled: false`
5. DO `click('M .tp-ui-cancel-btn')`; DO `waitClosed()`

### lib/seconds-mobile
- vp: m
1. DO `open('#seconds-mobile-12h')` → EXPECT `ok: true`, `modalClass` contains `mobile`
2. SHOT `keyboard` root=`M`
3. DO `type('M .tp-ui-seconds', '07')` → EXPECT `value: '07'`
4. DO `click('M .tp-ui-ok-btn')`; DO `waitClosed()` → CHECK `value('#seconds-mobile-12h')` → EXPECT `value: '02:30:07 PM'`

### lib/seconds-landscape
- vp: l
1. DO `open('#seconds-mobile-24h-switch')` → EXPECT `ok: true`
2. SHOT `landscape` root=`M`
3. Switch the viewport to `vp: m`; DO `wait(500)`; SHOT `portrait` root=`M`
4. Switch back to `vp: l`; DO `wait(500)`; SHOT `landscape-again` root=`M`
5. DO `click('M .tp-ui-cancel-btn')`; DO `waitClosed()`

### lib/seconds-themes
For each theme of the `lib/themes` table: DO `open('#seconds-theme-<theme>-clock-24h')` → EXPECT `ok: true`,
`theme: <theme>`; SHOT `<theme>` root=`M`; DO `focus('M .tp-ui-seconds')`; SHOT `<theme>-focus` root=`M`;
DO `click('M .tp-ui-cancel-btn')`; DO `waitClosed()`.

### lib/seconds-inline
1. DO `reveal('#seconds-inline-wheel-no-buttons')`; SHOT `wheel-no-buttons` root=`#seconds-inline-wheel-no-buttons-container` (no empty footer band under the wheel)
2. DO `focus('#seconds-inline-wheel-no-buttons-container .tp-ui-wheel-seconds')`; KEY `ArrowDown`
3. CHECK `value('#seconds-inline-wheel-no-buttons')` → EXPECT `value: '14:30:46'` (autoUpdate)
4. DO `reveal('#seconds-inline-wheel-no-buttons-seconds-off')`; SHOT `wheel-no-buttons-off` root=`#seconds-inline-wheel-no-buttons-off-container`
5. DO `reveal('#seconds-inline-wheel')`; SHOT `wheel-buttons` root=`#seconds-inline-wheel-container`

## docs-app — one scenario per selected route

### docs/<route>
`page: docs` · `path: <route>` · `vp: d` (key routes also once with `vp: m`, shot names suffixed by the vp)
- hide: `footer, section[aria-labelledby="star-callout-heading"], nextjs-portal { visibility: hidden !important; }`
- ignore (all docs SHOTs): `footer, section[aria-labelledby="star-callout-heading"], nextjs-portal`

1. DO `ready('main', { extraWait: 800 })` → EXPECT `ready: true`
2. Picker routes (`/`, `/examples/**`, `/react/examples/**`): DO `ready('input.tp-ui-input', { timeout: 60000 })` → EXPECT `ready: true`
3. DO `hide('<hide css>')`; DO `top()`
4. SHOT `page` root=`main` ignore=`<ignore>` (skip for `/examples/advanced/external-api`)
5. Picker routes except external-api: DO `open('input.tp-ui-input')` → EXPECT `ok: true`; SHOT `modal` root=`M`;
   DO `click('M .tp-ui-cancel-btn')`; DO `waitClosed()` → EXPECT `closed: true`
6. CHECK `errors()` → EXPECT no entries other than ones mentioning `vercel` (dev analytics noise)
