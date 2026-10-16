"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import demo from "@/components/demo-controls.module.css";
import { Figure } from "@/components/figure";
import { PickerSkeleton, type PickerMode } from "@/components/picker-skeleton";
import { THEMES, type ThemeName } from "@/lib/site";
import { useTimepicker, type PluginName } from "@/lib/use-timepicker";
import styles from "./timepicker-example.module.css";

type TimepickerExampleProps = {
  code: string;
  options?: Record<string, unknown>;
  inputPlaceholder?: string;
  showCode?: boolean;
  plugins?: PluginName[];
  display?: "inline" | "field";
  caption?: ReactNode;
  label?: string;
  themeControl?: boolean;
  phoneControl?: boolean;
  sceneTone?: "light";
  message?: ReactNode;
  preview?: Preview;
};

type Preview = "inline" | "modal";

const PREVIEWS: ReadonlyArray<{ value: Preview; label: string }> = [
  { value: "inline", label: "Inline" },
  { value: "modal", label: "Modal" },
];

function modeOf(options: Record<string, unknown>): PickerMode {
  const mode = (options.ui as { mode?: string } | undefined)?.mode;
  return mode === "wheel" || mode === "compact-wheel" ? mode : "clock";
}

export function TimepickerExample({
  code,
  options = {},
  inputPlaceholder = "Select time",
  showCode = true,
  plugins = [],
  display = "inline",
  caption,
  label,
  themeControl = false,
  phoneControl = false,
  sceneTone,
  message,
  preview: previewProp,
}: TimepickerExampleProps) {
  const inputId = useId();
  const messageId = `${inputId}-message`;
  const hasMessage = message !== undefined;
  const stageRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<ThemeName | undefined>(undefined);
  const [phone, setPhone] = useState(false);
  const [value, setValue] = useState("");
  const [preview, setPreview] = useState<Preview>("inline");
  const [stageHeight, setStageHeight] = useState<number | undefined>(undefined);
  const [ready, setReady] = useState(false);
  const ownInline = (options.ui as { inline?: { enabled?: boolean } } | undefined)?.inline?.enabled;
  const switchable = display === "inline" && !ownInline;
  const activePreview = previewProp ?? preview;
  const showSwitch = switchable && previewProp === undefined;
  const inline = switchable && activePreview === "inline";
  // The stage is keyed by this value: the library wraps the input in its own element, so React
  // has to replace the whole stage instead of removing the input from it.
  const rendering = inline ? "inline" : "field";
  const mode = modeOf(options);
  const loading = inline && !ready;

  useTimepicker({
    inputRef,
    containerRef: inline ? containerRef : undefined,
    options,
    plugins,
    theme,
    mobile: phone,
    onValue: setValue,
    onReady: () => setReady(true),
  });

  const explicitTheme = (options.ui as { theme?: ThemeName } | undefined)?.theme;

  const choosePreview = (next: Preview) => {
    if (next === preview) return;
    setStageHeight(stageRef.current?.offsetHeight || undefined);
    setPreview(next);
  };

  const controls =
    themeControl || phoneControl || showSwitch ? (
      <>
        {themeControl && (
          <label className={styles.select}>
            <span className="sr-only">Theme</span>
            <select
              value={theme ?? explicitTheme ?? "basic"}
              onChange={(event) => setTheme(event.target.value as ThemeName)}
            >
              {THEMES.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>
        )}
        {phoneControl && (
          <button
            type="button"
            className={styles.toggle}
            aria-pressed={phone}
            onClick={() => setPhone((on) => !on)}
          >
            Phone width
          </button>
        )}
        {showSwitch && (
          <span role="group" aria-label="Preview" className={styles.switch}>
            {PREVIEWS.map((item) => (
              <button
                key={item.value}
                type="button"
                className={styles.toggle}
                aria-pressed={preview === item.value}
                onClick={() => choosePreview(item.value)}
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
      controls={controls}
      status={value ? <output>{value}</output> : undefined}
      scene={phone ? "phone" : "default"}
      tone={sceneTone}
    >
      <div
        key={rendering}
        ref={stageRef}
        className={styles.stage}
        data-display={rendering}
        data-reserve={switchable ? mode : "field"}
        aria-busy={loading ? true : undefined}
        style={stageHeight ? { minHeight: stageHeight } : undefined}
      >
        {inline ? (
          <input ref={inputRef} type="text" className="sr-only" tabIndex={-1} aria-hidden="true" />
        ) : (
          <div className={styles.field}>
            <label htmlFor={inputId} className={demo.label}>
              Select time
            </label>
            <input
              ref={inputRef}
              id={inputId}
              type="text"
              placeholder={inputPlaceholder}
              className={demo.input}
              aria-describedby={hasMessage ? messageId : undefined}
            />
            {hasMessage && <div id={messageId}>{message}</div>}
          </div>
        )}
        {inline && <div ref={containerRef} className={styles.inlineHost} />}
        {loading && <PickerSkeleton mode={mode} className={styles.skeleton} />}
      </div>
    </Figure>
  );
}
