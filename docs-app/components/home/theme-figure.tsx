"use client";

import { useRef, useState } from "react";
import { Figure } from "@/components/figure";
import { PickerSkeleton } from "@/components/picker-skeleton";
import { THEMES, type ThemeName } from "@/lib/site";
import { useTimepicker } from "@/lib/use-timepicker";
import styles from "./theme-figure.module.css";

export function ThemeFigure() {
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<ThemeName>("basic");
  const [ready, setReady] = useState(false);

  useTimepicker({ inputRef, containerRef, theme, onReady: () => setReady(true) });

  const code = `import 'timepicker-ui/index.css';

new TimepickerUI(input, { ui: { theme: '${theme}' } }).create();`;

  return (
    <Figure label="Fig. 3" caption="The same picker in each built-in theme." code={code}>
      <div className={styles.grid}>
        <fieldset className={styles.themes}>
          <legend className={styles.legend}>ui.theme</legend>
          {THEMES.map((name) => (
            <label key={name} className={styles.option}>
              <input
                type="radio"
                name="home-theme"
                value={name}
                checked={theme === name}
                onChange={() => setTheme(name)}
              />
              {name}
            </label>
          ))}
        </fieldset>
        <div className={styles.stage} aria-busy={ready ? undefined : true}>
          <input ref={inputRef} type="text" className="sr-only" tabIndex={-1} aria-hidden="true" />
          <div ref={containerRef} />
          {!ready && <PickerSkeleton mode="clock" />}
        </div>
      </div>
    </Figure>
  );
}
