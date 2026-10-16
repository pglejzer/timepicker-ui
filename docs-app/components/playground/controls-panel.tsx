"use client";

import { useId, useState, type CSSProperties, type ReactNode } from "react";
import { cssReference, themeTokens } from "@/lib/css-reference";
import {
  CONTROL_GROUPS,
  changedCount,
  defaultText,
  groupDefaults,
  isChanged,
  isVisible,
  type Control,
  type ControlGroup,
  type GroupId,
} from "@/lib/playground/controls";
import {
  APPEARANCE_VARS,
  DEFAULT_STATE,
  PRESETS,
  appearanceEntries,
  presetState,
  type PlaygroundState,
} from "@/lib/playground/state";
import styles from "./playground.module.css";

type Change = (next: Partial<PlaygroundState>) => void;

type ControlsPanelProps = {
  state: PlaygroundState;
  onChange: Change;
  onReplace: (next: PlaygroundState) => void;
};

type AppearanceVar = (typeof APPEARANCE_VARS)[number];

const DEFAULTS = new Map(cssReference.variables.map((variable) => [variable.name, variable.default ?? ""]));

const INITIAL_OPEN = Object.fromEntries(
  CONTROL_GROUPS.map((group) => [group.id, group.open]),
) as Record<GroupId, boolean>;

function coerce(current: unknown, raw: string): unknown {
  if (typeof current === "number") return Number(raw);
  return raw;
}

function toHex(value: string): string | null {
  const trimmed = value.trim().toLowerCase();
  if (/^#[0-9a-f]{6}$/.test(trimmed)) return trimmed;
  if (/^#[0-9a-f]{3}$/.test(trimmed)) {
    return `#${trimmed
      .slice(1)
      .split("")
      .map((digit) => digit + digit)
      .join("")}`;
  }
  return null;
}

function sampleStyle(theme: string): CSSProperties {
  const tokens = themeTokens(theme);
  return { "--sample-bg": tokens["--tp-bg"], "--sample-primary": tokens["--tp-primary"] } as CSSProperties;
}

function LabelText({ label, changed }: { label: ReactNode; changed: boolean }) {
  return (
    <>
      {label}
      {changed && (
        <>
          {" "}
          <span className={styles.changed}>changed</span>
        </>
      )}
    </>
  );
}

function Description({ id, control }: { id: string; control: Control }) {
  return (
    <div id={id} className={styles.meta}>
      <p>
        <code>{control.option}</code> · default <code>{defaultText(control)}</code>
      </p>
      {control.help && <p>{control.help}</p>}
    </div>
  );
}

function Field({ control, state, onChange }: { control: Control; state: PlaygroundState; onChange: Change }) {
  const id = useId();
  const descriptionId = `${id}-description`;
  const value = state[control.key];
  const label = <LabelText label={control.label} changed={isChanged(control, state)} />;
  const description = <Description id={descriptionId} control={control} />;
  const set = (next: unknown) => onChange({ [control.key]: next } as Partial<PlaygroundState>);

  if (control.kind === "toggle") {
    return (
      <div className={styles.control}>
        <label className={styles.toggle}>
          <input
            type="checkbox"
            checked={Boolean(value)}
            aria-describedby={descriptionId}
            onChange={(event) => set(event.target.checked)}
          />
          {label}
        </label>
        {description}
      </div>
    );
  }

  if (control.kind === "radio") {
    return (
      <fieldset className={styles.radio} aria-describedby={descriptionId}>
        <legend>{label}</legend>
        <div className={styles.choices}>
          {control.choices.map((choice) => (
            <label key={choice.value} className={styles.choice}>
              <input
                type="radio"
                name={id}
                value={choice.value}
                checked={String(value) === choice.value}
                onChange={() => set(coerce(value, choice.value))}
              />
              {choice.label}
            </label>
          ))}
        </div>
        {description}
      </fieldset>
    );
  }

  if (control.kind === "swatches") {
    return (
      <fieldset className={styles.radio} aria-describedby={descriptionId}>
        <legend>{label}</legend>
        <div className={styles.themes}>
          {control.choices.map((choice) => {
            const checked = String(value) === choice.value;
            return (
              <label key={choice.value} className={styles.theme} data-checked={checked ? "" : undefined}>
                <span className={styles.sample} aria-hidden="true">
                  <span className={styles.samplePanel} style={sampleStyle(choice.value)}>
                    <span className={styles.sampleDot} />
                  </span>
                </span>
                <input
                  type="radio"
                  name={id}
                  value={choice.value}
                  checked={checked}
                  onChange={() => set(choice.value)}
                />
                <span className={styles.themeName}>{choice.label}</span>
              </label>
            );
          })}
        </div>
        {description}
      </fieldset>
    );
  }

  if (control.kind === "select") {
    return (
      <div className={styles.field}>
        <label htmlFor={id}>{label}</label>
        <select
          id={id}
          value={String(value)}
          aria-describedby={descriptionId}
          onChange={(event) => set(coerce(value, event.target.value))}
        >
          {control.choices.map((choice) => (
            <option key={choice.value} value={choice.value}>
              {choice.label}
            </option>
          ))}
        </select>
        {description}
      </div>
    );
  }

  if (control.kind === "number") {
    return (
      <div className={styles.field}>
        <label htmlFor={id}>{label}</label>
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={control.min}
          max={control.max}
          step={control.step}
          value={value === null ? "" : String(value)}
          aria-describedby={descriptionId}
          onChange={(event) => set(event.target.value === "" ? null : Number(event.target.value))}
        />
        {description}
      </div>
    );
  }

  return (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="text"
        value={String(value)}
        aria-describedby={descriptionId}
        onChange={(event) => set(event.target.value)}
      />
      {description}
    </div>
  );
}

function AppearanceField({
  variable,
  state,
  changed,
  onChange,
}: {
  variable: AppearanceVar;
  state: PlaygroundState;
  changed: boolean;
  onChange: Change;
}) {
  const id = useId();
  const current = state.appearance[variable.name] ?? "";
  const fallback = DEFAULTS.get(variable.name) ?? "";
  const update = (next: string) => onChange({ appearance: { ...state.appearance, [variable.name]: next } });
  const text = (
    <input
      id={id}
      type="text"
      spellCheck={false}
      autoComplete="off"
      placeholder={fallback}
      value={current}
      onChange={(event) => update(event.target.value)}
    />
  );

  return (
    <div className={styles.field}>
      <label htmlFor={id}>
        <LabelText
          label={
            <>
              {variable.label} <code>{variable.name}</code>
            </>
          }
          changed={changed}
        />
      </label>
      {variable.kind === "color" ? (
        <div className={styles.colorRow}>
          <input
            type="color"
            className={styles.swatch}
            aria-label={`${variable.label} color picker`}
            value={toHex(current || fallback) ?? "#000000"}
            onChange={(event) => update(event.target.value)}
          />
          {text}
        </div>
      ) : (
        text
      )}
    </div>
  );
}

function AppearanceFields({ state, onChange }: { state: PlaygroundState; onChange: Change }) {
  const changed = new Set(appearanceEntries(state).map(([name]) => name));
  return (
    <>
      {APPEARANCE_VARS.map((variable) => (
        <AppearanceField
          key={variable.name}
          variable={variable}
          state={state}
          changed={changed.has(variable.name)}
          onChange={onChange}
        />
      ))}
    </>
  );
}

function Group({
  group,
  state,
  open,
  onToggle,
  onChange,
}: {
  group: ControlGroup;
  state: PlaygroundState;
  open: boolean;
  onToggle: (id: GroupId, open: boolean) => void;
  onChange: Change;
}) {
  const count = changedCount(group, state);

  return (
    <details
      className={styles.group}
      open={open}
      onToggle={(event) => onToggle(group.id, event.currentTarget.open)}
    >
      <summary className={styles.summary}>
        {group.legend}
        {count > 0 && <span className={styles.count}> · {count} changed</span>}
      </summary>
      <fieldset className={styles.fields}>
        <legend className="sr-only">{group.legend}</legend>
        <button
          type="button"
          className={styles.groupReset}
          aria-disabled={count === 0}
          onClick={() => {
            if (count > 0) onChange(groupDefaults(group));
          }}
        >
          Reset<span className="sr-only"> {group.legend}</span>
        </button>
        {group.id === "appearance" ? (
          <AppearanceFields state={state} onChange={onChange} />
        ) : (
          group.controls
            .filter((control) => isVisible(control, state))
            .map((control) => <Field key={control.key} control={control} state={state} onChange={onChange} />)
        )}
      </fieldset>
    </details>
  );
}

export function ControlsPanel({ state, onChange, onReplace }: ControlsPanelProps) {
  const presetsId = useId();
  const [open, setOpen] = useState<Record<GroupId, boolean>>(INITIAL_OPEN);
  const toggle = (id: GroupId, next: boolean) =>
    setOpen((current) => (current[id] === next ? current : { ...current, [id]: next }));

  return (
    <div className={styles.controls}>
      <button type="button" className={styles.reset} onClick={() => onReplace(DEFAULT_STATE)}>
        Reset all
      </button>
      <div role="group" aria-labelledby={presetsId} className={styles.presets}>
        <span id={presetsId} className={styles.presetsLabel}>
          Start from
        </span>
        <div className={styles.presetList}>
          {PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              className={styles.preset}
              onClick={() => onReplace(presetState(preset))}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.groups}>
        {CONTROL_GROUPS.map((group) => (
          <Group
            key={group.id}
            group={group}
            state={state}
            open={open[group.id]}
            onToggle={toggle}
            onChange={onChange}
          />
        ))}
      </div>
    </div>
  );
}
