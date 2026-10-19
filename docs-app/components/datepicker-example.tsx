"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import type { DatepickerOptions } from "@pglejzer/datepicker-ui";
import demo from "@/components/demo-controls.module.css";
import { Figure } from "@/components/figure";
import { CalendarIcon } from "@/components/icons";
import { DATEPICKER_THEMES, isDatepickerTheme, type DatepickerThemeName } from "@/lib/datepicker";
import { useDatepicker } from "@/lib/use-datepicker";
import styles from "./datepicker-example.module.css";

export type DatepickerExampleProps = {
  code: string;
  language?: string;
  options?: DatepickerOptions;
  display?: "field" | "inline";
  caption?: ReactNode;
  label?: string;
  themeControl?: boolean;
  endInput?: boolean;
  toggleButton?: boolean;
  inputLabel?: string;
  inputPlaceholder?: string;
  message?: ReactNode;
  showCode?: boolean;
  dir?: "ltr" | "rtl";
};

type Preview = "field" | "inline";

const PREVIEWS: ReadonlyArray<{ value: Preview; label: string }> = [
  { value: "field", label: "Field" },
  { value: "inline", label: "Inline" },
];

const NO_OPTIONS: DatepickerOptions = {};

export function DatepickerExample({
  code,
  language = "typescript",
  options = NO_OPTIONS,
  display = "field",
  caption,
  label,
  themeControl = false,
  endInput = false,
  toggleButton = false,
  inputLabel = "Date",
  inputPlaceholder = "Select date",
  message,
  showCode = true,
  dir,
}:DatepickerExampleProps) {
  const inputId = useId();
  const endId = `${inputId}-end`;
  const messageId = `${inputId}-message`;
  const hasMessage = message !== undefined;
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [preview, setPreview] = useState<Preview>(display);
  const [theme, setTheme] = useState<DatepickerThemeName | undefined>(undefined);
  const [value, setValue] = useState("");
  const ownInline = options.ui?.inline?.enabled === true;
  const switchable = !endInput && !toggleButton && !ownInline;
  const inline = ownInline || (switchable && preview === "inline");
  const rendering: Preview = inline ? "inline" : "field";
  const explicitTheme = options.ui?.theme;

  useDatepicker({
    inputRef,
    containerRef: inline ? containerRef : undefined,
    endInputRef: endInput && !inline ? endRef : undefined,
    toggleRef: toggleButton && !inline ? toggleRef : undefined,
    options,
    theme,
    onValue: setValue,
  });

  const chooseTheme = (next: string) => {
    if (isDatepickerTheme(next)) setTheme(next);
  };

  const controls =
    themeControl || switchable ? (
      <>
        {themeControl && (
          <label className={styles.select}>
            <span className="sr-only">Theme</span>
            <select
              value={theme ?? explicitTheme ?? "basic"}
              onChange={(event) => chooseTheme(event.target.value)}
            >
              {DATEPICKER_THEMES.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>
        )}
        {switchable && (
          <span role="group" aria-label="Preview" className={styles.switch}>
            {PREVIEWS.map((item) => (
              <button
                key={item.value}
                type="button"
                className={styles.toggle}
                aria-pressed={preview === item.value}
                onClick={() => setPreview(item.value)}
              >
                {item.label}
              </button>
            ))}
          </span>
        )}
      </>
    ) : undefined;

  return (
    <Figure
      caption={caption}
      label={label}
      code={showCode ? code : undefined}
      language={language}
      controls={controls}
      status={value ? <output>{value}</output> : undefined}
    >
      <div key={rendering} className={styles.stage} data-display={rendering} dir={dir}>
        {inline ? (
          <>
            <input ref={inputRef} type="text" className="sr-only" tabIndex={-1} aria-hidden="true" />
            <div ref={containerRef} className={styles.inlineHost} />
          </>
        ) : (
          <div className={styles.field}>
            <label htmlFor={inputId} className={demo.label}>
              {endInput ? "Start date" : inputLabel}
            </label>
            <div className={styles.row}>
              <input
                ref={inputRef}
                id={inputId}
                type="text"
                placeholder={inputPlaceholder}
                className={demo.input}
                aria-describedby={hasMessage ? messageId : undefined}
              />
              {toggleButton && (
                <button ref={toggleRef} type="button" className={styles.iconButton} aria-label="Choose date">
                  <CalendarIcon size={18} />
                </button>
              )}
            </div>
            {endInput && (
              <>
                <label htmlFor={endId} className={demo.label}>
                  End date
                </label>
                <input ref={endRef} id={endId} type="text" placeholder={inputPlaceholder} className={demo.input} />
              </>
            )}
            {hasMessage && (
              <div id={messageId} className={styles.message}>
                {message}
              </div>
            )}
          </div>
        )}
      </div>
    </Figure>
  );
}
