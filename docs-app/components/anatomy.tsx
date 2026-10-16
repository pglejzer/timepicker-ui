"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Figure } from "@/components/figure";
import { PickerSkeleton } from "@/components/picker-skeleton";
import { useTimepicker } from "@/lib/use-timepicker";
import styles from "./anatomy.module.css";

export type AnatomyNote = { selector: string; side: "left" | "right"; code: string; text: string };

type AnatomyProps = {
  notes: AnatomyNote[];
  caption: ReactNode;
  label?: string;
  code?: string;
  options?: Record<string, unknown>;
};

type Point = { x: number; y: number };

type Geometry = {
  wide: boolean;
  height: number;
  points: Array<Point | null>;
  labels: Array<{ top: number; left: number } | null>;
  lines: string[];
};

const WIDE_MIN = 1032;
const NOTE_WIDTH = 280;
const GAP = 72;

export function Anatomy({ notes, caption, label, code, options }: AnatomyProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const noteRefs = useRef<Array<HTMLLIElement | null>>([]);
  const [geometry, setGeometry] = useState<Geometry | null>(null);
  const [ready, setReady] = useState(false);

  const measure = useCallback(() => {
    const stage = stageRef.current;
    const host = hostRef.current;
    if (!stage || !host || !host.querySelector(".tp-ui-wrapper")) return;
    const s = stage.getBoundingClientRect();
    const h = host.getBoundingClientRect();
    const wide = s.width >= Math.max(WIDE_MIN, h.width + 2 * (GAP + NOTE_WIDTH));
    const lastBottom = { left: -Infinity, right: -Infinity };
    const points: Geometry["points"] = [];
    const labels: Geometry["labels"] = [];
    const lines: string[] = [];

    notes.forEach((note, index) => {
      const part = host.querySelector(note.selector);
      if (!part) {
        points.push(null);
        labels.push(null);
        return;
      }
      const r = part.getBoundingClientRect();
      if (!wide) {
        points.push({
          x: (note.side === "left" ? r.left + 2 : r.right - 2) - h.left,
          y: r.top + Math.min(14, r.height / 2) - h.top,
        });
        labels.push(null);
        return;
      }
      const tx = (note.side === "left" ? r.left + 4 : r.right - 4) - s.left;
      const ty = r.top + r.height / 2 - s.top;
      const noteHeight = noteRefs.current[index]?.offsetHeight ?? 48;
      const top = Math.max(ty - 10, lastBottom[note.side] + 16);
      lastBottom[note.side] = top + noteHeight;
      const hostLeft = h.left - s.left;
      const hostRight = h.right - s.left;
      const left = note.side === "left" ? hostLeft - GAP - NOTE_WIDTH : hostRight + GAP;
      const start = note.side === "left" ? hostLeft - GAP + 8 : hostRight + GAP - 8;
      const bend = note.side === "left" ? hostLeft - 14 : hostRight + 14;
      points.push({ x: tx, y: ty });
      labels.push({ top, left });
      lines.push(`${start},${top + 10} ${bend},${top + 10} ${tx},${ty}`);
    });

    const height = Math.max(h.bottom - s.top, lastBottom.left, lastBottom.right) + 24;
    const next: Geometry = { wide, height, points, labels, lines };
    setGeometry((prev) => (prev && JSON.stringify(prev) === JSON.stringify(next) ? prev : next));
  }, [notes]);

  useTimepicker({
    inputRef,
    containerRef,
    options,
    onReady: () => {
      setReady(true);
      window.requestAnimationFrame(() => {
        const running = hostRef.current?.getAnimations({ subtree: true }) ?? [];
        void Promise.allSettled(running.map((animation) => animation.finished)).then(() =>
          window.requestAnimationFrame(measure),
        );
      });
    },
  });

  useEffect(() => {
    const stage = stageRef.current;
    const host = hostRef.current;
    if (!stage || !host) return;
    const observer = new ResizeObserver(() => measure());
    observer.observe(stage);
    host.addEventListener("transitionend", measure);
    return () => {
      observer.disconnect();
      host.removeEventListener("transitionend", measure);
    };
  }, [measure]);

  const wide = geometry?.wide ?? false;

  return (
    <Figure caption={caption} label={label} code={code} codeOpen={false}>
      <div className={styles.frame}>
        <div
          ref={stageRef}
          className={styles.stage}
          data-wide={wide ? "" : undefined}
          style={wide && geometry ? { minHeight: geometry.height } : undefined}
        >
          <div ref={hostRef} className={styles.host} aria-busy={ready ? undefined : true}>
            <input ref={inputRef} type="text" className="sr-only" tabIndex={-1} aria-hidden="true" />
            <div ref={containerRef} />
            {!ready && <PickerSkeleton mode="clock" />}
            {!wide &&
              geometry?.points.map((point, index) =>
                point ? (
                  <span
                    key={notes[index].code}
                    className={styles.balloon}
                    style={{ left: point.x, top: point.y }}
                    aria-hidden="true"
                  >
                    {index + 1}
                  </span>
                ) : null,
              )}
          </div>
          {wide && geometry && (
            <svg className={styles.lines} aria-hidden="true" focusable="false">
              {geometry.lines.map((line) => (
                <polyline key={line} points={line} />
              ))}
              {geometry.points.map((point, index) =>
                point ? <circle key={notes[index].code} cx={point.x} cy={point.y} r={3.5} /> : null,
              )}
            </svg>
          )}
          <ol className={styles.notes}>
            {notes.map((note, index) => {
              const position = wide ? geometry?.labels[index] : null;
              return (
                <li
                  key={note.code}
                  ref={(element) => {
                    noteRefs.current[index] = element;
                  }}
                  className={styles.note}
                  data-side={note.side}
                  data-placed={position ? "" : undefined}
                  style={position ? { top: position.top, left: position.left } : undefined}
                >
                  <span className={styles.number} aria-hidden="true">
                    {index + 1}
                  </span>
                  <span className={styles.noteText}>
                    <code>{note.code}</code>
                    {note.text}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </Figure>
  );
}
