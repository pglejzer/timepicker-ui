"use client";

import { Fragment, useId, useMemo, useState } from "react";
import { slugify } from "@/lib/slugify";
import {
  cssReference,
  isColorValue,
  type CssVariable,
  type CssVariableGroup,
} from "@/lib/css-reference";
import styles from "./css-variable-table.module.css";

type Filter = CssVariableGroup | "All";

type UsedByKind = "readers" | "through" | "runtime" | "stylesheet" | "unread";

const FILTERS: Filter[] = ["All", ...cssReference.groups];
const SHOWN_READERS = 3;
const RUNTIME_LABEL = "Set by the library at runtime";

function readersOf(variable: CssVariable): string[] {
  return [
    ...variable.usedBy.map((cls) => `.${cls}`),
    ...variable.usedByAttributes.map((attribute) => `[${attribute}]`),
  ];
}

function usedByKind(variable: CssVariable): UsedByKind {
  if (readersOf(variable).length > 0) return "readers";
  if (variable.referencedBy.length > 0) return "through";
  if (variable.setByScript) return "runtime";
  if (variable.read) return "stylesheet";
  return "unread";
}

function matches(variable: CssVariable, needle: string): boolean {
  if (!needle) return true;
  const haystack = [variable.name, variable.default ?? "", ...readersOf(variable), ...variable.referencedBy];
  return haystack.some((text) => text.toLowerCase().includes(needle));
}

function matchedFirst(readers: string[], needle: string): string[] {
  if (!needle) return readers;
  const hits = readers.filter((reader) => reader.toLowerCase().includes(needle));
  return [...hits, ...readers.filter((reader) => !hits.includes(reader))];
}

function CodeList({ items, separator = " " }: { items: string[]; separator?: string }) {
  return (
    <>
      {items.map((item, index) => (
        <Fragment key={item}>
          {index > 0 && separator}
          <code>{item}</code>
        </Fragment>
      ))}
    </>
  );
}

function Readers({ readers }: { readers: string[] }) {
  const shown = readers.slice(0, SHOWN_READERS);
  const hidden = readers.slice(SHOWN_READERS);
  return (
    <>
      <CodeList items={shown} />
      {hidden.length > 0 && (
        <details className={styles.more}>
          <summary>{hidden.length} more</summary>
          <CodeList items={hidden} />
        </details>
      )}
    </>
  );
}

function UsedBy({ variable, needle }: { variable: CssVariable; needle: string }) {
  const kind = usedByKind(variable);
  if (kind === "runtime") return <>{RUNTIME_LABEL}</>;
  if (kind === "stylesheet") return <>Read by a theme file or a global rule</>;
  if (kind === "unread") return <>Not read by the library</>;
  return (
    <>
      {kind === "readers" ? (
        <Readers readers={matchedFirst(readersOf(variable), needle)} />
      ) : (
        <>
          Through <CodeList items={variable.referencedBy} separator=", " />
        </>
      )}
      {variable.setByScript && <span className={styles.note}>{RUNTIME_LABEL}</span>}
    </>
  );
}

function DefaultValue({ variable }: { variable: CssVariable }) {
  if (variable.default === null) return <>Not set</>;
  return (
    <>
      {isColorValue(variable.default) && (
        <span
          className={styles.swatch}
          style={{ backgroundColor: variable.default }}
          aria-hidden="true"
        />
      )}
      <code>{variable.default}</code>
      {!variable.declared && <span className={styles.note}>Fallback</span>}
    </>
  );
}

export function CssVariableTable() {
  const filterId = useId();
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<Filter>("All");
  const needle = query.trim().toLowerCase();

  const visible = useMemo(
    () =>
      cssReference.variables.filter(
        (variable) => (group === "All" || variable.group === group) && matches(variable, needle),
      ),
    [group, needle],
  );

  return (
    <div>
      <div className={styles.controls}>
        <div className={styles.field}>
          <label htmlFor={filterId} className={styles.label}>
            Filter
          </label>
          <input
            id={filterId}
            type="search"
            className={styles.input}
            value={query}
            placeholder="primary, size, tp-ui-hour"
            autoComplete="off"
            spellCheck={false}
            aria-describedby={`${filterId}-hint`}
            onChange={(event) => setQuery(event.target.value)}
          />
          <p id={`${filterId}-hint`} className={styles.hint}>
            Matches names, default values and the entries in Used by.
          </p>
        </div>
        <fieldset className={styles.groups}>
          <legend className={`${styles.label} ${styles.legend}`}>Group</legend>
          <div className={styles.chips}>
            {FILTERS.map((name) => (
              <label key={name} className={styles.chip}>
                <input
                  type="radio"
                  name={`${filterId}-group`}
                  value={name}
                  checked={group === name}
                  onChange={() => setGroup(name)}
                />
                {name}
              </label>
            ))}
          </div>
        </fieldset>
        <p className={styles.count} aria-live="polite">
          {visible.length} of {cssReference.variables.length} variables
        </p>
      </div>

      {visible.length === 0 && (
        <div className={styles.empty}>
          <p>No variables match.</p>
          <button
            type="button"
            className={styles.reset}
            onClick={() => {
              setQuery("");
              setGroup("All");
            }}
          >
            Show all variables
          </button>
        </div>
      )}

      {cssReference.groups.map((name) => {
        const rows = visible.filter((variable) => variable.group === name);
        const headingId = slugify(name);
        return (
          <section key={name} hidden={rows.length === 0}>
            <h2 id={headingId}>{name}</h2>
            <div className={styles.scroll}>
              <table className={styles.table} role="table" aria-labelledby={headingId}>
                <thead role="rowgroup">
                  <tr role="row">
                    <th scope="col" role="columnheader">
                      Variable
                    </th>
                    <th scope="col" role="columnheader">
                      Default
                    </th>
                    <th scope="col" role="columnheader">
                      Used by
                    </th>
                  </tr>
                </thead>
                <tbody role="rowgroup">
                  {rows.map((variable) => (
                    <tr key={variable.name} role="row">
                      <td role="cell" data-label="Variable" className={styles.name}>
                        <code>{variable.name}</code>
                      </td>
                      <td role="cell" data-label="Default">
                        <DefaultValue variable={variable} />
                      </td>
                      <td role="cell" data-label="Used by">
                        <UsedBy variable={variable} needle={needle} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        );
      })}
    </div>
  );
}

export function CssVariableLegend() {
  const { variables } = cssReference;
  const kinds = new Set(variables.map(usedByKind));
  const hasAttributes = variables.some((variable) => variable.usedByAttributes.length > 0);
  const hasRipple = variables.some((variable) => variable.usedByAttributes.includes("data-md3-ripple"));
  const hasRuntime = variables.some((variable) => variable.setByScript);
  const hasFallback = variables.some((variable) => !variable.declared && variable.default !== null);
  const hasUnset = variables.some((variable) => variable.default === null);

  return (
    <dl>
      <div>
        <dt>
          A class, such as <code>.tp-ui-hour</code>
        </dt>
        <dd>
          A rule that names this class reads the variable. A row shows three entries and puts the
          rest under &quot;more&quot;.
        </dd>
      </div>
      {hasAttributes && (
        <div>
          <dt>An attribute in brackets</dt>
          <dd>
            A rule that matches the attribute, not a class, reads the variable.
            {hasRipple && (
              <>
                {" "}
                <code>[data-md3-ripple]</code> is on the controls that have the ripple and state
                layer.
              </>
            )}
          </dd>
        </div>
      )}
      {kinds.has("through") && (
        <div>
          <dt>
            Through <code>--tp-…</code>
          </dt>
          <dd>
            No rule reads it directly. The variable named uses it in its own value, so changing it
            changes that variable too.
          </dd>
        </div>
      )}
      {hasRuntime && (
        <div>
          <dt>{RUNTIME_LABEL}</dt>
          <dd>
            The picker writes the value as an inline style while it is open, which replaces a value
            from your stylesheet. You can still read it in your own CSS.
          </dd>
        </div>
      )}
      {kinds.has("stylesheet") && (
        <div>
          <dt>Read by a theme file or a global rule</dt>
          <dd>
            A theme file reads it, or a rule that targets no <code>tp-ui-</code> class and no data
            attribute.
          </dd>
        </div>
      )}
      {kinds.has("unread") && (
        <div>
          <dt>Not read by the library</dt>
          <dd>
            The stylesheet declares it, but no rule reads it and the picker does not set it.
            Changing it has no visible effect in this version.
          </dd>
        </div>
      )}
      {hasFallback && (
        <div>
          <dt>Fallback</dt>
          <dd>
            The stylesheet does not declare the variable. The value shown is the fallback written in
            the <code>var()</code> that reads it, and it applies until you set the variable.
          </dd>
        </div>
      )}
      {hasUnset && (
        <div>
          <dt>Not set</dt>
          <dd>The stylesheet gives the variable no value.</dd>
        </div>
      )}
    </dl>
  );
}
