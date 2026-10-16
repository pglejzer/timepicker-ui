"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState, type KeyboardEvent, type RefObject } from "react";
import { CodeBlock } from "@/components/code-block";
import { Tabs, type TabItem } from "@/components/tabs";
import { TimepickerExample } from "@/components/timepicker-example";
import { appearanceCss, toCss, toJs, toOptions, toReact } from "@/lib/playground/code";
import { DEFAULT_STATE, hasAppearance, pluginsFor, type PlaygroundState } from "@/lib/playground/state";
import { ControlsPanel } from "./controls-panel";
import styles from "./playground.module.css";

const PREVIEW_CLASS = "tp-playground";
const PREVIEW_VIEW = "preview";
const CODE_MIN_REM = 12;
const TABLIST_FALLBACK_PX = 48;
const DESKTOP_QUERY = "(min-width: 64rem)";

type StickyLayout = "full" | "tabs" | "none";

// The numbers mirror the sticky rules in playground.module.css: the column sits one --space-4 below the
// header and above the bottom edge. "full" fits the preview, one --space-4 gap and a code panel of 12rem.
// "tabs" fits one tablist above the preview, and the code shares the preview's panel.
function stickyLayout(previewHeight: number, tablistHeight: number): StickyLayout {
  const root = getComputedStyle(document.documentElement);
  const rem = parseFloat(root.fontSize);
  const header = parseFloat(root.getPropertyValue("--header-h"));
  const space = parseFloat(root.getPropertyValue("--space-4"));
  const column = window.innerHeight - header - space * 2;
  if (previewHeight + space + CODE_MIN_REM * rem <= column) return "full";
  if (tablistHeight + previewHeight <= column) return "tabs";
  return "none";
}

function findTablist(own: HTMLElement | null, code: HTMLElement | null): HTMLElement | null {
  return own ?? code?.querySelector<HTMLElement>('[role="tablist"]') ?? null;
}

function useStickyLayout() {
  const stageRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const tablistRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLDivElement>(null);
  const refocus = useRef(false);
  const [layout, setLayout] = useState<StickyLayout>("none");
  const [view, setView] = useState<string>(PREVIEW_VIEW);

  useEffect(() => {
    const stage = stageRef.current;
    const preview = previewRef.current;
    if (!stage || !preview) return;
    const desktop = window.matchMedia(DESKTOP_QUERY);
    let current: StickyLayout = "none";
    let previewHeight = 0;
    let tablistHeight = 0;
    const measure = () => {
      previewHeight = preview.offsetHeight || previewHeight;
      tablistHeight =
        findTablist(tablistRef.current, codeRef.current)?.offsetHeight || tablistHeight || TABLIST_FALLBACK_PX;
      const next = desktop.matches ? stickyLayout(previewHeight, tablistHeight) : "none";
      if (next !== current) {
        const swapsTablist = (current === "tabs") !== (next === "tabs");
        const focused = document.activeElement;
        refocus.current = swapsTablist && stage.contains(focused) && !preview.contains(focused);
        current = next;
      }
      setLayout(next);
      if (next !== "tabs") setView(PREVIEW_VIEW);
    };
    let frame = 0;
    const onResize = () => {
      measure();
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(measure);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(preview);
    window.addEventListener("resize", onResize);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    if (!refocus.current) return;
    refocus.current = false;
    findTablist(tablistRef.current, codeRef.current)
      ?.querySelector<HTMLElement>('[aria-selected="true"]')
      ?.focus();
  }, [layout]);

  return { layout, view, setView, stageRef, previewRef, tablistRef, codeRef };
}

type ViewTabsProps = {
  ref: RefObject<HTMLDivElement | null>;
  items: ReadonlyArray<{ id: string; label: string }>;
  selected: string;
  onSelect: (id: string) => void;
  tabId: (id: string) => string;
  panelId: (id: string) => string;
};

function ViewTabs({ ref, items, selected, onSelect, tabId, panelId }: ViewTabsProps) {
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const last = items.length - 1;
  const active = Math.max(0, items.findIndex((item) => item.id === selected));

  const select = (index: number) => {
    onSelect(items[index].id);
    tabRefs.current[index]?.focus();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    let next: number | null = null;
    if (event.key === "ArrowRight") next = active === last ? 0 : active + 1;
    else if (event.key === "ArrowLeft") next = active === 0 ? last : active - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;
    if (next === null) return;
    event.preventDefault();
    select(next);
  };

  return (
    <div ref={ref} role="tablist" aria-label="Preview and generated code" className={styles.viewList}>
      {items.map((item, index) => (
        <button
          key={item.id}
          ref={(element) => {
            tabRefs.current[index] = element;
          }}
          type="button"
          role="tab"
          id={tabId(item.id)}
          aria-selected={index === active}
          aria-controls={panelId(item.id)}
          tabIndex={index === active ? 0 : -1}
          className={styles.viewTab}
          onClick={() => onSelect(item.id)}
          onKeyDown={onKeyDown}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

export function Playground() {
  const [state, setState] = useState<PlaygroundState>(DEFAULT_STATE);
  const [codeOpen, setCodeOpen] = useState(false);
  const codeId = useId();
  const viewsId = useId();
  const { layout, view, setView, stageRef, previewRef, tablistRef, codeRef } = useStickyLayout();
  const update = (next: Partial<PlaygroundState>) => setState((current) => ({ ...current, ...next }));

  const options = toOptions(state);
  const ui: Record<string, unknown> = { ...(options.ui ?? {}), theme: state.theme };
  if (hasAppearance(state)) ui.cssClass = PREVIEW_CLASS;
  const previewOptions = { ...options, ui };
  const previewCss = appearanceCss(state, PREVIEW_CLASS);
  const css = toCss(state);

  const codeItems: TabItem[] = [
    { id: "js", label: "JS", content: <CodeBlock code={toJs(state)} language="javascript" /> },
    {
      id: "react",
      label: "React",
      content: (
        <>
          {state.display === "inline" && (
            <p className={styles.note}>
              This React example opens the picker in a modal. For an inline picker, see{" "}
              <Link href="/docs/features/inline-mode">Inline Mode</Link>.
            </p>
          )}
          <CodeBlock code={toReact(state)} language="tsx" />
        </>
      ),
    },
    {
      id: "css",
      label: "CSS",
      content: css ? (
        <CodeBlock code={css} language="css" />
      ) : (
        <p className={styles.note}>Change a value under Colors and shape to generate CSS.</p>
      ),
    },
  ];
  const tabbed = layout === "tabs";
  const activeCode = codeItems.find((item) => item.id === view);
  const tabId = (id: string) => `${viewsId}-tab-${id}`;
  const previewPanelId = `${viewsId}-panel-preview`;
  const codePanelId = `${viewsId}-panel-code`;

  return (
    <div className={styles.layout} data-sticky={layout === "none" ? undefined : layout}>
      <div ref={stageRef} className={styles.stage}>
        {tabbed && (
          <ViewTabs
            ref={tablistRef}
            items={[{ id: PREVIEW_VIEW, label: "Preview" }, ...codeItems]}
            selected={view}
            onSelect={setView}
            tabId={tabId}
            panelId={(id) => (id === PREVIEW_VIEW ? previewPanelId : codePanelId)}
          />
        )}
        <div
          ref={previewRef}
          id={previewPanelId}
          className={styles.preview}
          role={tabbed ? "tabpanel" : undefined}
          aria-labelledby={tabbed ? tabId(PREVIEW_VIEW) : undefined}
          inert={tabbed && view !== PREVIEW_VIEW}
        >
          {previewCss !== "" && <style>{previewCss}</style>}
          <TimepickerExample
            code=""
            showCode={false}
            display="inline"
            preview={state.display}
            options={previewOptions}
            plugins={pluginsFor(state)}
            label="Preview"
          />
        </div>
        {tabbed ? (
          <div
            id={codePanelId}
            role="tabpanel"
            aria-labelledby={activeCode ? tabId(activeCode.id) : undefined}
            className={styles.codePanel}
            hidden={!activeCode}
          >
            {activeCode?.content}
          </div>
        ) : (
          <>
            <button
              type="button"
              className={styles.codeToggle}
              aria-expanded={codeOpen}
              aria-controls={codeId}
              onClick={() => setCodeOpen((open) => !open)}
            >
              {codeOpen ? "Hide code" : "Show code"}
            </button>
            <div ref={codeRef} id={codeId} className={styles.code} data-open={codeOpen ? "" : undefined}>
              <Tabs label="Generated code" items={codeItems} />
            </div>
          </>
        )}
      </div>
      <ControlsPanel state={state} onChange={update} onReplace={setState} />
    </div>
  );
}
