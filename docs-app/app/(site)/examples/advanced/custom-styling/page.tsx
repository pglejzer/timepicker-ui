"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { TimepickerExample } from "@/components/examples/timepicker-example";
import { Callout } from "@/components/callout";
import styles from "./page.module.css";

const FLUENT_CSS = `.tp-ui-wrapper.tp-fluent {
  --tp-font-family: 'Segoe UI Variable', 'Segoe UI', system-ui, sans-serif;
  --tp-shadow: 0 8px 16px rgba(0, 0, 0, 0.14), 0 0 2px rgba(0, 0, 0, 0.12);
  --tp-border-radius: 8px;
  --tp-radius-sm: 4px;
  --tp-radius-md: 4px;
  --tp-radius-lg: 8px;
  --tp-btn-radius: 4px;

  --tp-bg: #ffffff;
  --tp-surface: #f5f5f5;
  --tp-surface-hover: #f5f5f5;
  --tp-input-bg: #fafafa;
  --tp-text: #242424;
  --tp-text-secondary: #616161;
  --tp-text-type-time: #424242;
  --tp-primary: #0f6cbd;
  --tp-on-primary: #ffffff;
  --tp-primary-container: #ebf3fc;
  --tp-on-primary-container: #115ea3;
  --tp-am-pm-active: #0f6cbd;
  --tp-am-pm-text-selected: #ffffff;
  --tp-am-pm-text-unselected: #616161;
  --tp-border: #d1d1d1;
  --tp-outline: #d1d1d1;
  --tp-focus-ring: #000000;

  --tp-state-focus-opacity: 0;
  --tp-ripple-opacity: 0;
}

.tp-ui-wrapper.tp-fluent .tp-ui-select-time {
  color: var(--tp-text);
  font-size: 14px;
}

.tp-ui-wrapper.tp-fluent :is(.tp-ui-hour, .tp-ui-minutes, .tp-ui-seconds) {
  border: 1px solid var(--tp-border);
  border-bottom-color: #616161;
  background-color: var(--tp-bg);
}

.tp-ui-wrapper.tp-fluent :is(.tp-ui-hour, .tp-ui-minutes, .tp-ui-seconds).active {
  border-bottom-color: var(--tp-primary);
  box-shadow: inset 0 -1px 0 var(--tp-primary);
}

.tp-ui-wrapper.tp-fluent .tp-ui-type-mode {
  font-size: 14px;
}

.tp-ui-wrapper.tp-fluent .tp-ui-wrapper-btn {
  gap: 8px;
}

.tp-ui-wrapper.tp-fluent :is(.tp-ui-ok-btn, .tp-ui-cancel-btn) {
  --tp-state-hover-opacity: 0;
  min-width: 96px;
  margin: 0;
  padding: 5px 12px;
  border: 1px solid var(--tp-border);
  line-height: 20px;
}

.tp-ui-wrapper.tp-fluent .tp-ui-ok-btn {
  border-color: transparent;
  background-color: var(--tp-primary);
  color: var(--tp-on-primary);
}

.tp-ui-wrapper.tp-fluent .tp-ui-ok-btn:hover {
  background-color: #115ea3;
}

.tp-ui-wrapper.tp-fluent .tp-ui-cancel-btn {
  background-color: var(--tp-bg);
  color: var(--tp-text);
}

.tp-ui-wrapper.tp-fluent .tp-ui-cancel-btn:hover {
  border-color: #c7c7c7;
  background-color: var(--tp-surface-hover);
}`;

const CARBON_CSS = `.tp-ui-wrapper.tp-carbon {
  --tp-font-family: 'IBM Plex Sans', system-ui, sans-serif;
  --tp-shadow: none;
  --tp-border-radius: 0;
  --tp-radius-sm: 0;
  --tp-radius-md: 0;
  --tp-radius-lg: 0;
  --tp-btn-radius: 0;
  --tp-size-inline-min-height: 0;

  --tp-bg: #ffffff;
  --tp-surface: #f4f4f4;
  --tp-surface-hover: #e8e8e8;
  --tp-input-bg: #f4f4f4;
  --tp-text: #161616;
  --tp-text-secondary: #525252;
  --tp-text-type-time: #525252;
  --tp-primary: #0f62fe;
  --tp-on-primary: #ffffff;
  --tp-primary-container: #f4f4f4;
  --tp-on-primary-container: #161616;
  --tp-am-pm-active: #161616;
  --tp-am-pm-text-selected: #ffffff;
  --tp-am-pm-text-unselected: #525252;
  --tp-border: #8d8d8d;
  --tp-outline: #c6c6c6;
  --tp-focus-ring: #0f62fe;

  --tp-state-focus-opacity: 0;
  --tp-ripple-opacity: 0;
}

.tp-ui-wrapper.tp-carbon .tp-ui-input-ripple-wrapper {
  --tp-state-hover-opacity: 0;
  --tp-state-pressed-opacity: 0;
}

.tp-ui-wrapper.tp-carbon :is(.tp-ui-hour, .tp-ui-minutes, .tp-ui-seconds) {
  --tp-focus-ring: var(--tp-text);
  border: 0;
  box-shadow: inset 0 -1px 0 var(--tp-border);
  font-weight: 300;
}

.tp-ui-wrapper.tp-carbon :is(.tp-ui-hour, .tp-ui-minutes, .tp-ui-seconds).active {
  box-shadow: inset 0 0 0 2px var(--tp-primary);
}

.tp-ui-wrapper.tp-carbon .tp-ui-wrapper-type-time {
  border: 1px solid #161616;
  border-radius: 4px;
}

.tp-ui-wrapper.tp-carbon .tp-ui-type-mode {
  --tp-state-hover-opacity: 0;
  --tp-outline-width-thick: 2px;
  --tp-shadow-focus-ring: inset 0 0 0 3px #ffffff;
  border: 0;
  font-size: 14px;
}

.tp-ui-wrapper.tp-carbon .tp-ui-am {
  border-radius: 3px 3px 0 0;
}

.tp-ui-wrapper.tp-carbon .tp-ui-pm {
  border-radius: 0 0 3px 3px;
}

.tp-ui-wrapper.tp-carbon .tp-ui-type-mode:not(.active):hover {
  background-color: rgba(141, 141, 141, 0.12);
}

.tp-ui-wrapper.tp-carbon .tp-ui-footer {
  margin: 24px 0 0;
  padding: 0;
}

.tp-ui-wrapper.tp-carbon .tp-ui-wrapper-btn {
  width: 100%;
}

.tp-ui-wrapper.tp-carbon :is(.tp-ui-ok-btn, .tp-ui-cancel-btn) {
  --tp-state-hover-opacity: 0;
  --tp-outline-width-thick: 2px;
  --tp-outline-offset: -2px;
  --tp-shadow-focus-ring: inset 0 0 0 3px #ffffff;
  flex: 0 1 50%;
  height: 64px;
  margin: 0;
  padding: 14px 64px 32px 16px;
  color: var(--tp-on-primary);
  font-weight: 400;
  line-height: 18px;
  text-align: left;
}

.tp-ui-wrapper.tp-carbon .tp-ui-cancel-btn {
  background-color: #393939;
}

.tp-ui-wrapper.tp-carbon .tp-ui-cancel-btn:hover {
  background-color: #474747;
}

.tp-ui--inline .tp-ui-wrapper.tp-carbon .tp-ui-cancel-btn {
  margin-right: -8px;
}

.tp-ui-wrapper.tp-carbon .tp-ui-ok-btn {
  background-color: var(--tp-primary);
}

.tp-ui-wrapper.tp-carbon .tp-ui-ok-btn:hover {
  background-color: #0050e6;
}`;

const STRIPE_CSS = `.tp-ui-wrapper.tp-stripe {
  --tp-font-family: system-ui, -apple-system, sans-serif;
  --tp-shadow: 0 13px 27px -5px rgba(50, 50, 93, 0.25), 0 8px 16px -8px rgba(0, 0, 0, 0.3);
  --tp-border-radius: 12px;
  --tp-radius-sm: 8px;
  --tp-radius-md: 8px;
  --tp-radius-lg: 12px;
  --tp-btn-radius: 999px;

  --tp-bg: #ffffff;
  --tp-surface: #f6f9fc;
  --tp-surface-hover: #e3e8ee;
  --tp-input-bg: #f6f9fc;
  --tp-text: #0a2540;
  --tp-text-secondary: #425466;
  --tp-text-type-time: #425466;
  --tp-primary: #635bff;
  --tp-on-primary: #ffffff;
  --tp-primary-container: #e9e8ff;
  --tp-on-primary-container: #2e2a8c;
  --tp-am-pm-active: #635bff;
  --tp-am-pm-text-selected: #ffffff;
  --tp-am-pm-text-unselected: #425466;
  --tp-border: #e3e8ee;
  --tp-outline: #e3e8ee;
  --tp-focus-ring: #635bff;

  --tp-state-focus-opacity: 0;
  --tp-ripple-opacity: 0;
}

.tp-ui-wrapper.tp-stripe .tp-ui-input-ripple-wrapper {
  border-radius: 8px;
}

.tp-ui-wrapper.tp-stripe :is(.tp-ui-hour, .tp-ui-minutes, .tp-ui-seconds) {
  border: 1px solid #e0e6eb;
  border-radius: 8px;
  color: var(--tp-text);
}

.tp-ui-wrapper.tp-stripe :is(.tp-ui-hour, .tp-ui-minutes, .tp-ui-seconds).active {
  border-color: var(--tp-primary);
  background-color: var(--tp-bg);
  box-shadow: inset 0 0 0 1px var(--tp-primary);
  color: var(--tp-primary);
}

.tp-ui-wrapper.tp-stripe .tp-ui-wrapper-type-time {
  gap: 6px;
}

.tp-ui-wrapper.tp-stripe .tp-ui-type-mode {
  border: 1px solid var(--tp-border);
  border-radius: 999px;
  background-color: var(--tp-input-bg);
  font-size: 14px;
}

.tp-ui-wrapper.tp-stripe .tp-ui-type-mode.active {
  border-color: var(--tp-am-pm-active);
  background-color: var(--tp-am-pm-active);
}

.tp-ui-wrapper.tp-stripe .tp-ui-wrapper-btn {
  gap: 8px;
}

.tp-ui-wrapper.tp-stripe :is(.tp-ui-ok-btn, .tp-ui-cancel-btn) {
  --tp-state-hover-opacity: 0;
  margin: 0;
  padding: 8px 18px;
  line-height: 20px;
}

.tp-ui-wrapper.tp-stripe .tp-ui-ok-btn {
  background-color: var(--tp-primary);
  color: var(--tp-on-primary);
}

.tp-ui-wrapper.tp-stripe .tp-ui-ok-btn:hover {
  background-color: var(--tp-text);
}

.tp-ui-wrapper.tp-stripe .tp-ui-cancel-btn:hover {
  color: var(--tp-text);
}`;

const GITHUB_CSS = `.tp-ui-wrapper.tp-github {
  --tp-font-family: -apple-system, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif;
  --tp-shadow: 0 0 0 1px #d1d9e040, 0 6px 12px -3px #25292e0a, 0 6px 18px 0 #25292e1f;
  --tp-border-radius: 12px;
  --tp-radius-sm: 6px;
  --tp-radius-md: 6px;
  --tp-radius-lg: 12px;
  --tp-btn-radius: 6px;

  --tp-bg: #ffffff;
  --tp-surface: #f6f8fa;
  --tp-surface-hover: #818b981f;
  --tp-input-bg: #f6f8fa;
  --tp-text: #1f2328;
  --tp-text-secondary: #59636e;
  --tp-text-type-time: #59636e;
  --tp-primary: #0969da;
  --tp-on-primary: #ffffff;
  --tp-primary-container: #ddf4ff;
  --tp-on-primary-container: #0550ae;
  --tp-am-pm-active: #0969da;
  --tp-am-pm-text-selected: #ffffff;
  --tp-am-pm-text-unselected: #59636e;
  --tp-border: #d1d9e0;
  --tp-outline: #d1d9e0;
  --tp-focus-ring: #0969da;

  --tp-state-focus-opacity: 0;
  --tp-ripple-opacity: 0;
}

.tp-ui-wrapper.tp-github :is(.tp-ui-select-time, .tp-ui-type-mode) {
  font-size: 14px;
}

.tp-ui-wrapper.tp-github .tp-ui-input-ripple-wrapper {
  height: 64px;
}

.tp-ui-wrapper.tp-github :is(.tp-ui-hour, .tp-ui-minutes, .tp-ui-seconds) {
  height: 64px;
  border: 1px solid var(--tp-border);
  font-size: 40px;
}

.tp-ui-wrapper.tp-github :is(.tp-ui-hour, .tp-ui-minutes, .tp-ui-seconds).active {
  border-color: var(--tp-primary);
}

.tp-ui-wrapper.tp-github .tp-ui-wrapper-btn {
  gap: 8px;
}

.tp-ui-wrapper.tp-github :is(.tp-ui-ok-btn, .tp-ui-cancel-btn) {
  --tp-state-hover-opacity: 0;
  margin: 0;
  padding: 5px 16px;
  border: 1px solid var(--tp-border);
  line-height: 20px;
}

.tp-ui-wrapper.tp-github .tp-ui-ok-btn {
  border-color: #1f232826;
  background-color: #1f883d;
  color: #ffffff;
}

.tp-ui-wrapper.tp-github .tp-ui-ok-btn:hover {
  background-color: #1c8139;
}

.tp-ui-wrapper.tp-github .tp-ui-cancel-btn {
  background-color: #f6f8fa;
  color: #25292e;
}

.tp-ui-wrapper.tp-github .tp-ui-cancel-btn:hover {
  background-color: #eff2f5;
}`;

const LINEAR_CSS = `.tp-ui-wrapper.tp-linear {
  --tp-font-family: system-ui, -apple-system, sans-serif;
  --tp-shadow: 0 0 0 1px #323338, 0 8px 24px rgba(0, 0, 0, 0.5);
  --tp-border-radius: 12px;
  --tp-radius-sm: 6px;
  --tp-radius-md: 6px;
  --tp-radius-lg: 12px;
  --tp-btn-radius: 6px;

  --tp-bg: #222326;
  --tp-surface: #1b1c1f;
  --tp-surface-hover: #323338;
  --tp-input-bg: #2a2b2f;
  --tp-text: #f4f5f8;
  --tp-text-secondary: #8a8f98;
  --tp-text-type-time: #8a8f98;
  --tp-primary: #5e6ad2;
  --tp-on-primary: #ffffff;
  --tp-primary-container: #2f3250;
  --tp-on-primary-container: #c5c9f5;
  --tp-am-pm-active: #5e6ad2;
  --tp-am-pm-text-selected: #ffffff;
  --tp-am-pm-text-unselected: #8a8f98;
  --tp-border: #323338;
  --tp-outline: #323338;
  --tp-focus-ring: #5e6ad2;
  --tp-btn-text: #7e88db;

  --tp-state-focus-opacity: 0;
  --tp-ripple-opacity: 0;
}

.tp-ui-wrapper.tp-linear .tp-ui-select-time {
  font-size: 11px;
}

.tp-ui-wrapper.tp-linear .tp-ui-input-ripple-wrapper {
  height: 72px;
}

.tp-ui-wrapper.tp-linear :is(.tp-ui-hour, .tp-ui-minutes, .tp-ui-seconds) {
  height: 72px;
  border: 1px solid var(--tp-border);
  font-size: 44px;
}

.tp-ui-wrapper.tp-linear :is(.tp-ui-hour, .tp-ui-minutes, .tp-ui-seconds).active {
  border-color: var(--tp-primary);
}

.tp-ui-wrapper.tp-linear .tp-ui-type-mode {
  --tp-state-hover-opacity: 0;
  font-size: 13px;
}

.tp-ui-wrapper.tp-linear .tp-ui-type-mode:not(.active):hover {
  background-color: #2a2b2f;
  color: var(--tp-text);
}

.tp-ui-wrapper.tp-linear .tp-ui-clock-face {
  box-shadow: inset 0 0 0 1px var(--tp-border);
}

.tp-ui-wrapper.tp-linear .tp-ui-wrapper-btn {
  gap: 8px;
}

.tp-ui-wrapper.tp-linear :is(.tp-ui-ok-btn, .tp-ui-cancel-btn) {
  --tp-state-hover-opacity: 0;
  margin: 0;
  padding: 6px 14px;
  font-size: 13px;
  line-height: 20px;
}

.tp-ui-wrapper.tp-linear .tp-ui-ok-btn {
  background-color: var(--tp-primary);
  color: var(--tp-on-primary);
}

.tp-ui-wrapper.tp-linear .tp-ui-cancel-btn {
  color: var(--tp-text-secondary);
}

.tp-ui-wrapper.tp-linear .tp-ui-cancel-btn:hover {
  background-color: #2a2b2f;
  color: var(--tp-text);
}`;

const DESK_CSS = `.tp-ui-wrapper.tp-desk {
  --tp-font-family: system-ui, -apple-system, sans-serif;
  --tp-shadow: 0 1px 2px rgba(27, 27, 27, 0.08), 0 12px 32px rgba(27, 27, 27, 0.12);
  --tp-border-radius: 16px;
  --tp-radius-md: 16px;
  --tp-size-input: 72px;
  --tp-size-inline-min-height: 0;
  min-width: 312px;

  --tp-bg: #f3efe6;
  --tp-surface: #161616;
  --tp-text: #1b1b1b;
  --tp-text-secondary: #5c5649;
  --tp-primary: #f2b705;
  --tp-on-primary: #161616;
  --tp-on-primary-container: #1b1b1b;
  --tp-am-pm-active: #1b1b1b;
  --tp-am-pm-text-selected: #f3efe6;
  --tp-am-pm-text-unselected: #5c5649;
  --tp-focus-ring: #1b1b1b;

  --tp-state-focus-opacity: 0;
  --tp-ripple-opacity: 0;
}

.tp-ui-wrapper.tp-desk .tp-ui-select-time {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}

.tp-ui-wrapper.tp-desk .tp-ui-header {
  padding-top: 24px;
}

.tp-ui-wrapper.tp-desk :is(.tp-ui-input-wrapper, .tp-ui-input-ripple-wrapper) {
  border-radius: 0;
}

.tp-ui-wrapper.tp-desk .tp-ui-input-ripple-wrapper {
  --tp-state-hover-opacity: 0;
  --tp-state-pressed-opacity: 0;
  height: 64px;
}

.tp-ui-wrapper.tp-desk :is(.tp-ui-hour, .tp-ui-minutes, .tp-ui-seconds) {
  height: 64px;
  padding: 0;
  border: 0;
  border-radius: 0;
  background-color: transparent;
  color: #6b655a;
  font-size: 44px;
}

.tp-ui-wrapper.tp-desk :is(.tp-ui-hour, .tp-ui-minutes, .tp-ui-seconds):hover {
  color: var(--tp-text);
}

.tp-ui-wrapper.tp-desk :is(.tp-ui-hour, .tp-ui-minutes, .tp-ui-seconds).active {
  color: var(--tp-text);
  box-shadow: inset 0 -2px 0 var(--tp-text);
}

.tp-ui-wrapper.tp-desk .tp-ui-wrapper-type-time {
  justify-content: center;
  gap: 4px;
}

.tp-ui-wrapper.tp-desk .tp-ui-type-mode {
  width: auto;
  height: auto;
  padding: 4px 10px;
  border: 0;
  border-radius: 999px;
  font-size: 13px;
}

.tp-ui-wrapper.tp-desk .tp-ui-clock-face {
  --tp-text: #f3efe6;
  --tp-focus-ring: #f2b705;
}

.tp-ui-wrapper.tp-desk .tp-ui-footer {
  justify-content: flex-end;
  padding: 16px 24px 24px;
}

.tp-ui-wrapper.tp-desk .tp-ui-wrapper-btn {
  gap: 8px;
}

.tp-ui-wrapper.tp-desk :is(.tp-ui-ok-btn, .tp-ui-cancel-btn) {
  --tp-state-hover-opacity: 0;
  margin: 0;
}

.tp-ui-wrapper.tp-desk .tp-ui-ok-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  padding: 0;
  border-radius: 50%;
  background-color: var(--tp-text);
  color: var(--tp-bg);
}

.tp-ui-wrapper.tp-desk .tp-ui-ok-btn:hover {
  background-color: #3a3a3a;
}

.tp-ui-wrapper.tp-desk .tp-ui-cancel-btn {
  color: var(--tp-text-secondary);
}

.tp-ui-wrapper.tp-desk .tp-ui-cancel-btn:hover {
  color: var(--tp-text);
}`;

const LOUD_CSS = `.tp-ui-wrapper.tp-loud {
  --tp-font-family: system-ui, -apple-system, sans-serif;
  --tp-shadow: none;
  --tp-border-radius: 8px;
  --tp-radius-md: 8px;
  --tp-btn-radius: 8px;

  --tp-bg: #fff8e7;
  --tp-surface: #ffffff;
  --tp-surface-hover: #fff1c2;
  --tp-input-bg: #ffffff;
  --tp-text: #111111;
  --tp-text-secondary: #111111;
  --tp-primary: #111111;
  --tp-on-primary: #111111;
  --tp-primary-container: #ffd23f;
  --tp-on-primary-container: #111111;
  --tp-am-pm-active: #ff7aa8;
  --tp-am-pm-text-selected: #111111;
  --tp-am-pm-text-unselected: #111111;
  --tp-border: #111111;
  --tp-focus-ring: #111111;

  --tp-state-hover-opacity: 0;
  --tp-state-focus-opacity: 0;
  --tp-ripple-opacity: 0;

  border: 2px solid var(--tp-border);
  filter: drop-shadow(6px 6px 0 var(--tp-border));
}

.tp-ui-wrapper.tp-loud :is(.tp-ui-input-wrapper, .tp-ui-input-ripple-wrapper) {
  overflow: visible;
}

.tp-ui-wrapper.tp-loud :is(.tp-ui-hour, .tp-ui-minutes, .tp-ui-seconds) {
  border: 2px solid var(--tp-border);
}

.tp-ui-wrapper.tp-loud :is(.tp-ui-hour, .tp-ui-minutes, .tp-ui-seconds).active {
  box-shadow: 4px 4px 0 var(--tp-border);
}

.tp-ui-wrapper.tp-loud .tp-ui-wrapper-type-time {
  gap: 6px;
}

.tp-ui-wrapper.tp-loud .tp-ui-type-mode {
  border: 2px solid var(--tp-border);
  border-radius: 8px;
  background-color: var(--tp-input-bg);
  font-size: 14px;
}

.tp-ui-wrapper.tp-loud .tp-ui-type-mode:not(.active):hover {
  background-color: var(--tp-surface-hover);
}

.tp-ui-wrapper.tp-loud .tp-ui-type-mode.active {
  background-color: var(--tp-am-pm-active);
  box-shadow: 3px 3px 0 var(--tp-border);
}

.tp-ui-wrapper.tp-loud :is(.tp-ui-hour, .tp-ui-minutes, .tp-ui-seconds):focus-visible,
.tp-ui-wrapper.tp-loud :is(.tp-ui-type-mode, .tp-ui-clock-face):focus-visible {
  outline-offset: -7px;
}

.tp-ui-wrapper.tp-loud .tp-ui-clock-face {
  box-shadow: inset 0 0 0 2px var(--tp-border);
}

.tp-ui-wrapper.tp-loud .tp-ui-circle-hand {
  border: 2px solid var(--tp-border);
  background-color: var(--tp-primary-container);
}

.tp-ui-wrapper.tp-loud .tp-ui-footer {
  justify-content: flex-end;
}

.tp-ui-wrapper.tp-loud .tp-ui-wrapper-btn {
  gap: 8px;
}

.tp-ui-wrapper.tp-loud :is(.tp-ui-ok-btn, .tp-ui-cancel-btn) {
  margin: 0;
  padding: 8px 18px;
  border: 2px solid var(--tp-border);
  box-shadow: 3px 3px 0 var(--tp-border);
  color: var(--tp-text);
  line-height: 20px;
}

.tp-ui-wrapper.tp-loud .tp-ui-ok-btn {
  background-color: var(--tp-primary-container);
}

.tp-ui-wrapper.tp-loud .tp-ui-cancel-btn {
  background-color: #ffffff;
}

.tp-ui-wrapper.tp-loud :is(.tp-ui-ok-btn, .tp-ui-cancel-btn):hover {
  box-shadow: 4px 4px 0 var(--tp-border);
  transform: translate(-1px, -1px);
}

.tp-ui-wrapper.tp-loud :is(.tp-ui-ok-btn, .tp-ui-cancel-btn):active {
  box-shadow: none;
  transform: translate(3px, 3px);
}

@media (prefers-reduced-motion: no-preference) {
  .tp-ui-wrapper.tp-loud :is(.tp-ui-ok-btn, .tp-ui-cancel-btn) {
    transition:
      transform 100ms ease,
      box-shadow 100ms ease;
  }
}`;

const BARE_CSS = `.tp-ui-wrapper.tp-bare {
  --tp-font-family: system-ui, -apple-system, sans-serif;
  --tp-shadow: 0 0 0 1px #e5e5e5, 0 8px 24px rgba(0, 0, 0, 0.06);
  --tp-border-radius: 12px;
  --tp-radius-md: 12px;
  --tp-size-inline-min-height: 0;

  --tp-bg: #ffffff;
  --tp-surface: transparent;
  --tp-text: #111111;
  --tp-text-secondary: #6b6b6b;
  --tp-primary: #c2410c;
  --tp-on-primary: #ffffff;
  --tp-on-primary-container: #111111;
  --tp-am-pm-active: transparent;
  --tp-am-pm-text-selected: #c2410c;
  --tp-am-pm-text-unselected: #6b6b6b;
  --tp-border: #d4d4d4;
  --tp-focus-ring: #c2410c;

  --tp-state-focus-opacity: 0;
  --tp-ripple-opacity: 0;
}

.tp-ui-wrapper.tp-bare .tp-ui-select-time {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}

.tp-ui-wrapper.tp-bare .tp-ui-header {
  padding-top: 24px;
}

.tp-ui-wrapper.tp-bare :is(.tp-ui-input-wrapper, .tp-ui-input-ripple-wrapper) {
  border-radius: 0;
}

.tp-ui-wrapper.tp-bare .tp-ui-input-ripple-wrapper {
  --tp-state-hover-opacity: 0;
  --tp-state-pressed-opacity: 0;
}

.tp-ui-wrapper.tp-bare :is(.tp-ui-hour, .tp-ui-minutes, .tp-ui-seconds) {
  padding: 0;
  border: 0;
  border-radius: 0;
  background-color: transparent;
  color: var(--tp-text-secondary);
  font-size: 64px;
  font-weight: 300;
}

.tp-ui-wrapper.tp-bare :is(.tp-ui-hour, .tp-ui-minutes, .tp-ui-seconds):hover {
  color: var(--tp-text);
}

.tp-ui-wrapper.tp-bare :is(.tp-ui-hour, .tp-ui-minutes, .tp-ui-seconds).active {
  color: var(--tp-text);
  box-shadow: inset 0 -2px 0 var(--tp-primary);
}

.tp-ui-wrapper.tp-bare .tp-ui-wrapper-type-time {
  flex-direction: column;
  justify-content: center;
  gap: 4px;
}

.tp-ui-wrapper.tp-bare .tp-ui-type-mode {
  --tp-state-hover-opacity: 0;
  width: auto;
  height: auto;
  padding: 6px 8px;
  border: 0;
  border-radius: 4px;
  font-size: 14px;
}

.tp-ui-wrapper.tp-bare .tp-ui-type-mode:not(.active):hover {
  color: var(--tp-text);
}

.tp-ui-wrapper.tp-bare .tp-ui-type-mode.active {
  text-decoration-line: underline;
  text-decoration-thickness: 2px;
  text-underline-offset: 4px;
}

.tp-ui-wrapper.tp-bare .tp-ui-clock-face {
  --tp-text: var(--tp-text-secondary);
  box-shadow: inset 0 0 0 1px var(--tp-border);
}

.tp-ui-wrapper.tp-bare .tp-ui-clock-hand {
  left: calc(50% - 0.5px);
  width: 1px;
}

.tp-ui-wrapper.tp-bare .tp-ui-footer {
  margin: 24px 0 0;
  padding: 0;
  border-top: 1px solid #e5e5e5;
}

.tp-ui-wrapper.tp-bare .tp-ui-wrapper-btn {
  width: 100%;
}

.tp-ui-wrapper.tp-bare :is(.tp-ui-ok-btn, .tp-ui-cancel-btn) {
  --tp-state-hover-opacity: 0;
  --tp-outline-offset: -3px;
  flex: 1;
  height: 48px;
  margin: 0;
  padding: 0 16px;
  border-radius: 0;
  line-height: 48px;
}

.tp-ui-wrapper.tp-bare .tp-ui-cancel-btn {
  border-bottom-left-radius: 12px;
  color: var(--tp-text);
}

.tp-ui-wrapper.tp-bare .tp-ui-ok-btn {
  border-bottom-right-radius: 12px;
  color: var(--tp-primary);
}

.tp-ui-wrapper.tp-bare :is(.tp-ui-ok-btn, .tp-ui-cancel-btn):hover {
  background-color: #f5f5f5;
}`;

export default function CustomStylingPage() {
  return (
    <div>
      <PageHeader
        title="Custom Styling"
        description="Customize the timepicker appearance using CSS custom properties and your own styles"
      />

      <Callout title="CSS Custom Properties">
        Timepicker-UI uses CSS custom properties (CSS variables) that you can
        override to match your brand colors and design system. Version 3.2.0
        added Material Design 3 ripple effects and expanded the color system
        with container colors.
      </Callout>

      <Section
        title="Match your site's design"
        description={
          <>
            This picker uses the same paper, ink and type as these docs. One
            class passed through <code>ui.cssClass</code> sets the
            picker&apos;s custom properties.
          </>
        }
      >
        <div className={styles.inkDemo}>
          <TimepickerExample
            code={`import { TimepickerUI } from 'timepicker-ui';

const input = document.querySelector('#timepicker');
new TimepickerUI(input, { ui: { cssClass: 'tp-ink' } }).create();

// CSS:
.tp-ui-wrapper.tp-ink {
  --tp-font-family: 'Atkinson Hyperlegible Next', system-ui, sans-serif;
  --tp-shadow: none;
  --tp-border-radius: 2px;
  --tp-radius-sm: 2px;
  --tp-radius-md: 2px;
  --tp-radius-lg: 2px;

  --tp-bg: #ffffff;
  --tp-surface: #f3f3f3;
  --tp-surface-hover: #e2e2e2;
  --tp-input-bg: #f6f6f6;
  --tp-text: #0d0d0d;
  --tp-text-secondary: #6b6b6b;
  --tp-text-type-time: #474747;
  --tp-primary: #0d0d0d;
  --tp-on-primary: #ffffff;
  --tp-primary-container: #0d0d0d;
  --tp-on-primary-container: #ffffff;
  --tp-am-pm-active: #0d0d0d;
  --tp-am-pm-text-selected: #ffffff;
  --tp-am-pm-text-unselected: #474747;
  --tp-border: #6b6b6b;
  --tp-outline: #6b6b6b;
  --tp-focus-ring: #0d0d0d;
}

@media (prefers-color-scheme: dark) {
  .tp-ui-wrapper.tp-ink {
    --tp-bg: #111111;
    --tp-surface: #1a1a1a;
    --tp-surface-hover: #2b2b2b;
    --tp-input-bg: #181818;
    --tp-text: #ececec;
    --tp-text-secondary: #8c8c8c;
    --tp-text-type-time: #b8b8b8;
    --tp-primary: #ececec;
    --tp-on-primary: #111111;
    --tp-primary-container: #ececec;
    --tp-on-primary-container: #111111;
    --tp-am-pm-active: #ececec;
    --tp-am-pm-text-selected: #111111;
    --tp-am-pm-text-unselected: #b8b8b8;
    --tp-border: #8c8c8c;
    --tp-outline: #8c8c8c;
    --tp-focus-ring: #ececec;
  }
}`}
            options={{
              ui: { cssClass: "tp-ink" },
            }}
          />
        </div>
      </Section>

      <Section
        title="Inspired by popular design systems"
        description={
          <>
            Each picker below gets one class through <code>ui.cssClass</code>,
            and the library adds it to <code>.tp-ui-wrapper</code>. A rule on{" "}
            <code>{".tp-ui-wrapper.<class>"}</code> sets the colors, corners and
            type of a well-known design system, so you can copy the CSS and
            adapt it. The <code>tp-ui-*</code> class names are stable, so you
            can restyle any part of the picker, including its layout and
            shapes. The values approximate each system&apos;s public design
            tokens. These are not official themes.
          </>
        }
      >
        <h3>Microsoft Fluent</h3>
        <p>
          The time fields look like Fluent inputs: the active one gets a 2px
          blue bottom stroke instead of a fill. OK is a filled primary button
          and Cancel an outlined secondary button.
        </p>
        <TimepickerExample
          code={`import { TimepickerUI } from 'timepicker-ui';

const input = document.querySelector('#timepicker');
new TimepickerUI(input, { ui: { cssClass: 'tp-fluent' } }).create();

// CSS:
${FLUENT_CSS}`}
          options={{
            ui: { theme: "basic", cssClass: "tp-fluent" },
          }}
        />

        <h3>IBM Carbon</h3>
        <p>
          Square corners on the panel, fields and buttons. The time fields are
          grey Carbon inputs with a bottom border, and a 2px blue border marks
          the active one. AM/PM is
          a content switcher, and Cancel and OK fill the footer edge to edge as
          64px buttons with the label at the top left, like a Carbon modal.
        </p>
        <TimepickerExample
          code={`import { TimepickerUI } from 'timepicker-ui';

const input = document.querySelector('#timepicker');
new TimepickerUI(input, { ui: { cssClass: 'tp-carbon' } }).create();

// CSS:
${CARBON_CSS}`}
          options={{
            ui: { theme: "basic", cssClass: "tp-carbon" },
          }}
        />

        <h3>Stripe</h3>
        <p>
          Time fields look like Stripe form inputs: a light border, and a
          blurple ring on the active field. AM/PM and OK are pills, and Cancel
          is a text link that darkens on hover.
        </p>
        <TimepickerExample
          code={`import { TimepickerUI } from 'timepicker-ui';

const input = document.querySelector('#timepicker');
new TimepickerUI(input, { ui: { cssClass: 'tp-stripe' } }).create();

// CSS:
${STRIPE_CSS}`}
          options={{
            ui: { theme: "basic", cssClass: "tp-stripe" },
          }}
        />

        <h3>GitHub</h3>
        <p>
          A compact picker with smaller digits and 14px text. OK and Cancel
          copy Primer&apos;s green primary button and grey default button.
        </p>
        <TimepickerExample
          code={`import { TimepickerUI } from 'timepicker-ui';

const input = document.querySelector('#timepicker');
new TimepickerUI(input, { ui: { cssClass: 'tp-github' } }).create();

// CSS:
${GITHUB_CSS}`}
          options={{
            ui: { theme: "basic", cssClass: "tp-github" },
          }}
        />

        <h3>Linear</h3>
        <p>
          Linear&apos;s Nordic Gray and Mercury White with an indigo accent,
          set on top of the built-in <code>dark</code> theme. The label and
          digits are smaller, 1px borders outline the fields and the clock
          face, and OK is a filled indigo button.
        </p>
        <TimepickerExample
          code={`import { TimepickerUI } from 'timepicker-ui';

const input = document.querySelector('#timepicker');
new TimepickerUI(input, { ui: { theme: 'dark', cssClass: 'tp-linear' } }).create();

// CSS:
${LINEAR_CSS}`}
          options={{
            ui: { theme: "dark", cssClass: "tp-linear" },
          }}
        />
      </Section>

      <Section
        title="Restyle the whole picker"
        description={
          <>
            Each example starts from a request and changes layout, shapes and
            proportions with plain CSS on the <code>tp-ui-*</code> classes,
            scoped to one class from <code>ui.cssClass</code>.
          </>
        }
      >
        <h3>A desk clock</h3>
        <p>
          Someone wants the picker to look like the clock on their desk. The
          label is hidden visually but stays available to screen readers, the
          time fields lose their boxes, and the black dial gets one yellow
          hand. OK reads Set through <code>labels.ok</code> and is a round
          button.
        </p>
        <TimepickerExample
          code={`import { TimepickerUI } from 'timepicker-ui';

const input = document.querySelector('#timepicker');
new TimepickerUI(input, { ui: { cssClass: 'tp-desk' }, labels: { ok: 'Set' } }).create();

// CSS:
${DESK_CSS}`}
          options={{
            ui: { theme: "basic", cssClass: "tp-desk" },
            labels: { ok: "Set" },
          }}
        />

        <h3>A loud brand</h3>
        <p>
          For a bold brand, the picker gets thick black borders and hard
          offset shadows for a neubrutalist look. The active field and OK are
          yellow, the active AM/PM is pink, and the buttons press in when you
          click them.
        </p>
        <TimepickerExample
          code={`import { TimepickerUI } from 'timepicker-ui';

const input = document.querySelector('#timepicker');
new TimepickerUI(input, { ui: { cssClass: 'tp-loud' } }).create();

// CSS:
${LOUD_CSS}`}
          options={{
            ui: { theme: "basic", cssClass: "tp-loud" },
          }}
          sceneTone="light"
        />

        <h3>Just the time</h3>
        <p>
          When only the time matters, the label is hidden visually and the
          fields have no boxes, just large light digits with an underline on
          the active one. AM/PM is small text, the clock face is a thin ring,
          and the buttons span the full width.
        </p>
        <TimepickerExample
          code={`import { TimepickerUI } from 'timepicker-ui';

const input = document.querySelector('#timepicker');
new TimepickerUI(input, { ui: { cssClass: 'tp-bare' } }).create();

// CSS:
${BARE_CSS}`}
          options={{
            ui: { theme: "basic", cssClass: "tp-bare" },
          }}
        />
      </Section>

      <style>
        {[
          FLUENT_CSS,
          CARBON_CSS,
          STRIPE_CSS,
          GITHUB_CSS,
          LINEAR_CSS,
          DESK_CSS,
          LOUD_CSS,
          BARE_CSS,
        ].join("\n")}
      </style>
    </div>
  );
}
