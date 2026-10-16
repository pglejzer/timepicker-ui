import type { CSSProperties } from "react";
import styles from "./picker-skeleton.module.css";

export type PickerMode = "clock" | "wheel" | "compact-wheel";

type PickerSkeletonProps = {
  mode: PickerMode;
  className?: string;
};

const TIP_ANGLES = Array.from({ length: 12 }, (_, index) => `${index * 30}deg`);
const WHEEL_ROWS = [0, 1, 2, 3, 4];
const PERIOD_ROWS = [2, 3];
const CENTER_ROW = 2;

function Header() {
  return (
    <>
      <div className={styles.title}>
        <span className={styles.titleLine} />
      </div>
      <div className={styles.header}>
        <span className={styles.field} />
        <span className={styles.colon}>
          <span className={styles.colonDot} />
          <span className={styles.colonDot} />
        </span>
        <span className={styles.field} />
        <span className={styles.period}>
          <span className={styles.periodHalf} />
          <span className={styles.periodHalf} />
        </span>
      </div>
    </>
  );
}

function Dial() {
  return (
    <div className={styles.face}>
      <div className={styles.dial}>
        {TIP_ANGLES.map((angle) => (
          <span key={angle} className={styles.tip} style={{ "--angle": angle } as CSSProperties} />
        ))}
        <span className={styles.hand} />
        <span className={styles.pivot} />
      </div>
    </div>
  );
}

function WheelColumn({ filled, className }: { filled: number[]; className: string }) {
  return (
    <span className={className}>
      {WHEEL_ROWS.map((row) => (
        <span key={row} className={styles.row}>
          {filled.includes(row) && <span className={row === CENTER_ROW ? styles.selected : styles.line} />}
        </span>
      ))}
    </span>
  );
}

function Wheel({ compact }: { compact: boolean }) {
  return (
    <div className={styles.face}>
      <div className={styles.wheel}>
        <span className={styles.band} />
        <WheelColumn filled={WHEEL_ROWS} className={styles.column} />
        <span className={styles.separator}>
          <span className={styles.separatorDot} />
          <span className={styles.separatorDot} />
        </span>
        <WheelColumn filled={WHEEL_ROWS} className={styles.column} />
        {compact && (
          <WheelColumn filled={PERIOD_ROWS} className={`${styles.column} ${styles.periodColumn}`} />
        )}
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className={styles.footer}>
      <span className={styles.button}>
        <span className={styles.cancel} />
      </span>
      <span className={styles.button}>
        <span className={styles.ok} />
      </span>
    </div>
  );
}

export function PickerSkeleton({ mode, className }: PickerSkeletonProps) {
  return (
    <div className={className ? `${styles.root} ${className}` : styles.root} aria-hidden="true">
      <div className={styles.card} data-mode={mode}>
        {mode !== "compact-wheel" && <Header />}
        {mode === "clock" ? <Dial /> : <Wheel compact={mode === "compact-wheel"} />}
        <Footer />
      </div>
    </div>
  );
}
