import { useId, type ReactNode } from "react";
import styles from "./v5-style-preview.module.css";

const SELECTED_HOUR = 14;
const OUTER_RADIUS = 39;
const INNER_RADIUS = 24.7;

const TICK_CENTER = 140;
const TICK_OUTER = 136;
const TICK_MAJOR_INNER = 129;
const TICK_MINOR_INNER = 132;

const ZONES = [
  "Warsaw · UTC+02:00",
  "London · UTC+01:00",
  "New York · UTC-04:00",
  "Tokyo · UTC+09:00",
  "UTC · UTC+00:00",
];

const icons = {
  clock: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6h4" />
    </>
  ),
  close: <path d="m18 6-12 12M6 6l12 12" />,
  arrowRight: <path d="M5 12h14m-6-6 6 6-6 6" />,
  arrowLeft: <path d="M19 12H5m6-6-6 6 6 6" />,
  timer: (
    <>
      <path d="M10 2h4m-2 6v4m7-7-1.5 1.5" />
      <circle cx="12" cy="14" r="8" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a17 17 0 0 1 0 20 17 17 0 0 1 0-20Z" />
    </>
  ),
  keyboard: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M6 12h.01M10 12h.01M14 12h.01M18 12h.01M6 16h12" />
    </>
  ),
  minus: <path d="M5 12h14" />,
  plus: <path d="M5 12h14M12 5v14" />,
  check: <path d="m20 6-11 11-5-5" />,
  signal: <path d="M2 20h.01M7 20v-4m5 4v-8m5 8V8m5 12V4" />,
  wifi: (
    <path d="M2 8.8a15 15 0 0 1 20 0M5 12a10 10 0 0 1 14 0m-10.5 3.5a5 5 0 0 1 7 0M12 19h.01" />
  ),
  battery: (
    <>
      <rect x="2" y="6" width="17" height="12" rx="2" />
      <path d="M22 10v4M6 10v4m4-4v4m4-4v4" />
    </>
  ),
} satisfies Record<string, ReactNode>;

type IconName = keyof typeof icons;

interface DialHour {
  hour: number;
  inner: boolean;
}

const DESKTOP_HOURS: DialHour[] = Array.from({ length: 24 }, (_, hour) => ({
  hour,
  inner: hour >= 12,
}));

const MOBILE_HOURS: DialHour[] = Array.from({ length: 12 }, (_, index) => ({
  hour: index + 12,
  inner: false,
}));

function round(value: number) {
  return Math.round(value * 1000) / 1000;
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function radiusOf(inner: boolean) {
  return inner ? INNER_RADIUS : OUTER_RADIUS;
}

const TICKS = Array.from({ length: 60 }, (_, index) => {
  const angle = (index * Math.PI) / 30;
  const major = index % 5 === 0;
  const inner = major ? TICK_MAJOR_INNER : TICK_MINOR_INNER;
  return {
    major,
    x1: round(TICK_CENTER + inner * Math.sin(angle)),
    y1: round(TICK_CENTER - inner * Math.cos(angle)),
    x2: round(TICK_CENTER + TICK_OUTER * Math.sin(angle)),
    y2: round(TICK_CENTER - TICK_OUTER * Math.cos(angle)),
  };
});

function Icon({ name }: { name: IconName }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icons[name]}
    </svg>
  );
}

function Trigger({ ariaLabel }: { ariaLabel?: string }) {
  return (
    <button type="button" className={styles.trigger} aria-label={ariaLabel}>
      <span>
        14:30<span data-range-only>{" – 16:00"}</span>
      </span>
      <Icon name="clock" />
    </button>
  );
}

interface TimeGroupProps {
  label: string;
  endpoint: string;
  hour: string;
  minute: string;
  active?: boolean;
  rangeOnly?: boolean;
}

function TimeGroup({
  label,
  endpoint,
  hour,
  minute,
  active = false,
  rangeOnly = false,
}: TimeGroupProps) {
  return (
    <div className={styles.timeGroup} data-range-only={rangeOnly || undefined}>
      <span className={styles.endpointLabel} data-range-only>
        {label}
      </span>
      <div className={styles.timeInputs}>
        <input
          className={styles.timeEntry}
          type="text"
          inputMode="numeric"
          readOnly
          value={hour}
          data-active={active || undefined}
          aria-label={`${endpoint} hour`}
        />
        <span className={styles.colon}>:</span>
        <input
          className={styles.timeEntry}
          type="text"
          inputMode="numeric"
          readOnly
          value={minute}
          aria-label={`${endpoint} minute`}
        />
      </div>
    </div>
  );
}

function Dial({ hours }: { hours: DialHour[] }) {
  const handInner = hours.some(
    (item) => item.hour === SELECTED_HOUR && item.inner,
  );

  return (
    <div className={styles.dial}>
      <svg className={styles.ticks} viewBox="0 0 280 280" aria-hidden="true">
        {TICKS.map((tick, index) => (
          <line
            key={index}
            x1={tick.x1}
            y1={tick.y1}
            x2={tick.x2}
            y2={tick.y2}
            data-major={tick.major || undefined}
          />
        ))}
      </svg>
      <div
        className={styles.hand}
        style={{
          height: `${radiusOf(handInner)}%`,
          transform: `rotate(${(SELECTED_HOUR % 12) * 30}deg)`,
        }}
      />
      <div className={styles.handCenter} />
      <div className={styles.numbers}>
        {hours.map(({ hour, inner }) => {
          const angle = ((hour % 12) * Math.PI) / 6;
          const radius = radiusOf(inner);
          return (
            <button
              key={hour}
              type="button"
              style={{
                left: `${round(50 + radius * Math.sin(angle))}%`,
                top: `${round(50 - radius * Math.cos(angle))}%`,
              }}
              data-inner={inner || undefined}
              aria-pressed={hour === SELECTED_HOUR}
              aria-label={`Hour ${hour}`}
            >
              {pad(hour)}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Panel({ mobile = false }: { mobile?: boolean }) {
  return (
    <div
      className={
        mobile ? `${styles.panel} ${styles.mobilePanel}` : styles.panel
      }
      role="group"
      aria-label={mobile ? "Time picker, phone" : "Time picker, desktop"}
    >
      {mobile && <div className={styles.handle} />}
      <div className={styles.heading}>
        <span>
          <span className={styles.rangeCopy}>Time range</span>
          <span className={styles.singleCopy}>Select time</span>
        </span>
        <button type="button" className={styles.iconButton} aria-label="Close">
          <Icon name="close" />
        </button>
      </div>
      <div className={styles.times}>
        <TimeGroup
          label="From"
          endpoint="Start"
          hour="14"
          minute="30"
          active
        />
        <div className={styles.rangeDivider} data-range-only>
          <Icon name="arrowRight" />
        </div>
        <TimeGroup
          label="To"
          endpoint="End"
          hour="16"
          minute="00"
          rangeOnly
        />
      </div>
      <div className={styles.duration} data-range-only>
        <Icon name="timer" />
        <span>1 h 30 min</span>
      </div>
      <div>
        <div className={styles.clockHeading}>
          <span>
            Hours<span data-range-only>{" · From"}</span>
          </span>
          <span>24 h</span>
        </div>
        <Dial hours={mobile ? MOBILE_HOURS : DESKTOP_HOURS} />
        {mobile && (
          <div className={styles.half}>
            <button type="button" aria-pressed={false}>
              00–11
            </button>
            <button type="button" aria-pressed>
              12–23
            </button>
          </div>
        )}
      </div>
      <div className={styles.zone} data-zone-only>
        <span className={styles.zoneLabel}>
          <Icon name="globe" />
          Time zone
        </span>
        <select aria-label="Time zone">
          {ZONES.map((zone) => (
            <option key={zone}>{zone}</option>
          ))}
        </select>
      </div>
      <div className={styles.tools}>
        <button type="button" className={styles.mode}>
          <Icon name="keyboard" />
          <span>Type</span>
        </button>
        <div className={styles.step}>
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Decrease selected value"
          >
            <Icon name="minus" />
          </button>
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Increase selected value"
          >
            <Icon name="plus" />
          </button>
        </div>
      </div>
      <div className={styles.footer}>
        <button type="button" className={styles.cancel}>
          Cancel
        </button>
        <button type="button" className={styles.confirm}>
          <span>OK</span>
          <Icon name="check" />
        </button>
      </div>
      {mobile && <div className={styles.homeBar} />}
    </div>
  );
}

function DesktopFrame() {
  return (
    <div className={`${styles.desktop} ${styles.product}`} inert>
      <span className={styles.fieldLabel}>Meeting time</span>
      <Trigger />
      <Panel />
    </div>
  );
}

function PhoneFrame() {
  return (
    <div className={`${styles.phone} ${styles.product}`} inert>
      <div className={styles.status}>
        <span>9:41</span>
        <div>
          <Icon name="signal" />
          <Icon name="wifi" />
          <Icon name="battery" />
        </div>
      </div>
      <div className={styles.phoneApp}>
        <div className={styles.appTitle}>
          <Icon name="arrowLeft" />
          New meeting
        </div>
        <Trigger ariaLabel="Open time picker" />
      </div>
      <div className={styles.scrim} />
      <Panel mobile />
    </div>
  );
}

export function V5StylePreview() {
  const titleId = useId();

  return (
    <figure aria-labelledby={titleId}>
      <figcaption className="mb-4">
        <p id={titleId} className="font-medium text-foreground">
          Design preview: new style in 5.0
        </p>
        <p className="mt-1">
          A static picture, not a working picker. The switches show or hide
          the range and time zone parts. The style is not in 4.5, and its
          final look and option name may change.
        </p>
      </figcaption>
      <div className={styles.stage}>
        <div
          className={styles.controls}
          role="group"
          aria-label="Preview options"
        >
          <label className={styles.switchLabel}>
            <input
              type="checkbox"
              role="switch"
              className={`${styles.switch} ${styles.rangeSwitch}`}
              defaultChecked
            />
            Range
          </label>
          <label className={styles.switchLabel}>
            <input
              type="checkbox"
              role="switch"
              className={`${styles.switch} ${styles.zoneSwitch}`}
              defaultChecked
            />
            Timezone
          </label>
        </div>
        <div className={styles.comparison}>
          <figure className={styles.example}>
            <figcaption className={styles.exampleTitle}>Desktop</figcaption>
            <DesktopFrame />
          </figure>
          <figure className={styles.example}>
            <figcaption className={styles.exampleTitle}>Mobile</figcaption>
            <PhoneFrame />
          </figure>
        </div>
      </div>
    </figure>
  );
}
