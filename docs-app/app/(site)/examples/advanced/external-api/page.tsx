"use client";

import { useEffect, useId, useRef, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { TimepickerUI } from "timepicker-ui";
import "timepicker-ui/main.css";
import { Section } from "@/components/section";
import { Callout } from "@/components/callout";
import { Figure } from "@/components/figure";
import { UnsubscribeDemo } from "@/components/unsubscribe-demo";
import demo from "@/components/demo-controls.module.css";
import styles from "./page.module.css";

export default function ExternalAPIExample() {
  const fieldId = useId();
  const input1Ref = useRef<HTMLInputElement>(null);
  const input2Ref = useRef<HTMLInputElement>(null);
  const input3Ref = useRef<HTMLInputElement>(null);
  const picker2Ref = useRef<TimepickerUI | null>(null);
  const [currentTime, setCurrentTime] = useState<string>("");
  const [timezone, setTimezone] = useState<string>("Europe/Warsaw");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Example 1: Basic - Set time from external API
  useEffect(() => {
    if (!input1Ref.current) return;

    const picker = new TimepickerUI(input1Ref.current, {
      clock: { type: "24h" },
    });
    picker.create();

    async function fetchCurrentTime() {
      try {
        const res = await fetch(
          "https://timeapi.io/api/Time/current/zone?timeZone=Europe/Warsaw"
        );
        const data = await res.json();

        const hour = String(data.hour).padStart(2, "0");
        const minutes = String(data.minute).padStart(2, "0");
        picker.setValue(`${hour}:${minutes}`);
        setCurrentTime(`${hour}:${minutes}`);
      } catch (err) {
        console.error("Failed to fetch time:", err);
      }
    }

    fetchCurrentTime();

    return () => picker.destroy();
  }, []);

  // Example 2: Advanced - Auto-refresh with events
  useEffect(() => {
    if (!input2Ref.current) return;

    const picker = new TimepickerUI(input2Ref.current, {
      clock: {
        type: "24h",
        autoSwitchToMinutes: true,
        incrementMinutes: 5,
      },
      ui: {
        theme: "m3-green",
        animation: true,
      },
      callbacks: {
        onConfirm: (data) => {
          console.log("Time confirmed:", data);
        },
        onUpdate: (data) => {
          console.log("Time updated:", data);
        },
      },
    });
    picker.create();
    picker2Ref.current = picker;

    // EventEmitter API
    picker.on("confirm", (data) => {
      console.log("Confirmed via EventEmitter:", data);
    });

    async function fetchAndSetTime() {
      setIsLoading(true);
      setError("");

      try {
        const res = await fetch(
          `https://timeapi.io/api/Time/current/zone?timeZone=${timezone}`
        );

        if (!res.ok) throw new Error("Failed to fetch time");

        const data = await res.json();
        const hour = String(data.hour).padStart(2, "0");
        const minutes = String(data.minute).padStart(2, "0");

        picker.setValue(`${hour}:${minutes}`);
        setCurrentTime(`${hour}:${minutes} (${timezone})`);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        console.error("Error:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAndSetTime();

    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchAndSetTime, 60000);

    return () => {
      clearInterval(interval);
      picker.destroy();
      picker2Ref.current = null;
    };
  }, [timezone]);

  // Example 3: Multiple timezones with validation
  useEffect(() => {
    if (!input3Ref.current) return;

    const picker = new TimepickerUI(input3Ref.current, {
      clock: {
        type: "12h",
        disabledTime: {
          ranges: "1:00 AM - 5:59 AM", // Disable 1 AM - 5 AM
        },
      },
      ui: {
        theme: "dark",
        animation: true,
        backdrop: true,
      },
      labels: {
        am: "AM",
        pm: "PM",
        clockTitle: "Select Time",
      },
      behavior: {
        focusTrap: true,
        returnFocus: true,
      },
      callbacks: {
        onConfirm: (data) => {
          console.log("Time confirmed:", data);
        },
        onError: (data) => {
          console.error("Error:", data);
        },
      },
    });
    picker.create();

    // Listen to events
    picker.on("open", () => console.log("Picker opened"));
    picker.on("cancel", () => console.log("Picker cancelled"));
    picker.on("select:hour", (data) => console.log("Hour selected:", data));
    picker.on("select:minute", (data) => console.log("Minute selected:", data));

    async function fetchWorldTime() {
      try {
        const timezones = ["America/New_York", "Asia/Tokyo", "Europe/London"];
        const randomTz =
          timezones[Math.floor(Math.random() * timezones.length)];

        const res = await fetch(
          `https://timeapi.io/api/Time/current/zone?timeZone=${randomTz}`
        );
        const data = await res.json();

        const hour = data.hour % 12 || 12; // Convert to 12h
        const minutes = String(data.minute).padStart(2, "0");
        const period = data.hour >= 12 ? "PM" : "AM";

        picker.setValue(`${hour}:${minutes} ${period}`);
      } catch (err) {
        console.error("Failed to fetch world time:", err);
      }
    }

    fetchWorldTime();

    return () => picker.destroy();
  }, []);

  const handleRefresh = async () => {
    if (!input2Ref.current) return;

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(
        `https://timeapi.io/api/Time/current/zone?timeZone=${timezone}`
      );

      if (!res.ok) throw new Error("Failed to fetch time");

      const data = await res.json();
      const hour = String(data.hour).padStart(2, "0");
      const minutes = String(data.minute).padStart(2, "0");

      const picker = picker2Ref.current;
      if (picker) {
        picker.setValue(`${hour}:${minutes}`);
        setCurrentTime(`${hour}:${minutes} (${timezone})`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="External API Integration"
        description="Integrate timepicker with external time APIs for real-world applications"
      />

      <Callout title="API Used">
        These examples use{" "}
        <a
          href="https://timeapi.io/"
          target="_blank"
          rel="noopener noreferrer"
        >
          TimeAPI.io
        </a>{" "}
        to fetch current time from different timezones. You can use any API that
        returns time data.
      </Callout>

      <Section title="Basic - Fetch and Set Time">
        <p>
          Simple example: Fetch current time from API and set it to the
          timepicker on mount.
        </p>

        <Figure
          code={`const picker = new TimepickerUI(input, {
  clock: { type: '24h' }
});
picker.create();

async function fetchCurrentTime() {
  try {
    const res = await fetch(
      'https://timeapi.io/api/Time/current/zone?timeZone=Europe/Warsaw'
    );
    const data = await res.json();

    const hour = String(data.hour).padStart(2, '0');
    const minutes = String(data.minute).padStart(2, '0');
    picker.setValue(\`\${hour}:\${minutes}\`);
  } catch (err) {
    console.error('Failed to fetch time:', err);
  }
}

fetchCurrentTime();`}
        >
          <div className={`${demo.form} ${styles.stage}`}>
            <div className={demo.field}>
              <label htmlFor={`${fieldId}-warsaw`} className={demo.label}>
                Current Time (Europe/Warsaw)
              </label>
              <input
                id={`${fieldId}-warsaw`}
                ref={input1Ref}
                type="text"
                className={demo.input}
                placeholder="Click to select time"
              />
              {currentTime && (
                <p className={demo.output}>
                  Loaded: {currentTime}
                </p>
              )}
            </div>
          </div>
        </Figure>
      </Section>

      <Section title="Advanced - Auto-Refresh with Events">
        <p>
          Advanced example: Auto-refresh time every 60 seconds with timezone
          selector, EventEmitter API, and error handling.
        </p>

        <Figure
          code={`const picker = new TimepickerUI(input, {
  clock: {
    type: '24h',
    autoSwitchToMinutes: true,
    incrementMinutes: 5,
  },
  ui: {
    theme: 'm3-green',
    animation: true,
  },
  callbacks: {
    onConfirm: (data) => console.log('Time confirmed:', data),
    onUpdate: (data) => console.log('Time updated:', data),
  },
});
picker.create();

// EventEmitter API
picker.on('confirm', (data) => {
  console.log('Confirmed via EventEmitter:', data);
});

async function fetchAndSetTime() {
  try {
    const res = await fetch(
      \`https://timeapi.io/api/Time/current/zone?timeZone=\${timezone}\`
    );
    if (!res.ok) throw new Error('Failed to fetch time');

    const data = await res.json();
    const hour = String(data.hour).padStart(2, '0');
    const minutes = String(data.minute).padStart(2, '0');

    picker.setValue(\`\${hour}:\${minutes}\`);
  } catch (err) {
    console.error('Error:', err);
  }
}

// Auto-refresh every 60 seconds
const interval = setInterval(fetchAndSetTime, 60000);

// Cleanup
return () => {
  clearInterval(interval);
  picker.destroy();
};`}
        >
          <div className={`${demo.form} ${styles.stage}`}>
            <div className={demo.field}>
              <label htmlFor={`${fieldId}-timezone`} className={demo.label}>
                Select Timezone
              </label>
              <select
                id={`${fieldId}-timezone`}
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className={demo.input}
              >
                <option value="Europe/Warsaw">Europe/Warsaw</option>
                <option value="America/New_York">America/New York</option>
                <option value="Asia/Tokyo">Asia/Tokyo</option>
                <option value="Europe/London">Europe/London</option>
                <option value="Australia/Sydney">Australia/Sydney</option>
              </select>
            </div>

            <div className={demo.field}>
              <label htmlFor={`${fieldId}-refresh`} className={demo.label}>
                Current Time (Auto-refresh)
              </label>
              <div className={styles.inputRow}>
                <input
                  id={`${fieldId}-refresh`}
                  ref={input2Ref}
                  type="text"
                  className={demo.input}
                  placeholder="Click to select time"
                />
                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={isLoading}
                  className={demo.button}
                >
                  Refresh
                </button>
              </div>

              {currentTime && (
                <p className={demo.output}>
                  {currentTime}
                </p>
              )}
              {error && (
                <p className={demo.error}>
                  {error}
                </p>
              )}
            </div>
          </div>
        </Figure>
      </Section>

      <Section title="Multiple Timezones with Validation">
        <p>
          Complex example: Random timezone selection, 12h format, disabled night
          hours, and full EventEmitter integration.
        </p>

        <Figure
          code={`const picker = new TimepickerUI(input, {
  clock: {
    type: '12h',
    disabledTime: {
      ranges: '1:00 AM - 5:59 AM', // Disable 1 AM - 5 AM
    },
  },
  ui: {
    theme: 'dark',
    animation: true,
    backdrop: true,
  },
  labels: {
    am: 'AM',
    pm: 'PM',
    clockTitle: 'Select Time',
  },
  behavior: {
    focusTrap: true,
    returnFocus: true,
  },
  callbacks: {
    onConfirm: (data) => console.log('Time confirmed:', data),
    onError: (data) => console.error('Error:', data),
  },
});
picker.create();

// Full EventEmitter integration
picker.on('open', () => console.log('Picker opened'));
picker.on('cancel', () => console.log('Picker cancelled'));
picker.on('select:hour', (data) => console.log('Hour selected:', data));
picker.on('select:minute', (data) => console.log('Minute selected:', data));

async function fetchWorldTime() {
  try {
    const timezones = ['America/New_York', 'Asia/Tokyo', 'Europe/London'];
    const randomTz = timezones[Math.floor(Math.random() * timezones.length)];

    const res = await fetch(
      \`https://timeapi.io/api/Time/current/zone?timeZone=\${randomTz}\`
    );
    const data = await res.json();

    const hour = data.hour % 12 || 12; // Convert to 12h
    const minutes = String(data.minute).padStart(2, '0');
    const period = data.hour >= 12 ? 'PM' : 'AM';

    picker.setValue(\`\${hour}:\${minutes} \${period}\`);
  } catch (err) {
    console.error('Failed to fetch world time:', err);
  }
}

fetchWorldTime();`}
        >
          <div className={`${demo.form} ${styles.stage}`}>
            <div className={demo.field}>
              <label htmlFor={`${fieldId}-world`} className={demo.label}>
                Random World Time (12h format, night hours disabled)
              </label>
              <input
                id={`${fieldId}-world`}
                ref={input3Ref}
                type="text"
                className={demo.input}
                placeholder="Click to select time"
              />
              <p className={demo.hint}>
                Hours 1 AM - 5 AM are disabled. Fetches random timezone on mount.
              </p>
            </div>
          </div>
        </Figure>
      </Section>

      <Section title="Unsubscribe from an Event">
        <p>
          <code>on()</code> and <code>once()</code> return a function that
          removes the handler. Call it when the code that subscribed goes
          away, for example in a React effect cleanup.
        </p>
        <Figure
          code={`const picker = new TimepickerUI(input, {
  clock: { type: '24h' }
});
picker.create();

const unsubscribe = picker.on('confirm', ({ hour, minutes }) => {
  console.log('confirm', hour, minutes);
});

unsubscribe();`}
        >
          <UnsubscribeDemo />
        </Figure>
      </Section>

      <Section title="Key Features Demonstrated">
        <ul>
          <li>
            <strong>setValue()</strong> - Set time
            programmatically from API
          </li>
          <li>
            <strong>EventEmitter API</strong> -
            Listen to events with on(), once(), off()
          </li>
          <li>
            <strong>Callback options</strong> -
            onConfirm, onUpdate, onError handlers
          </li>
          <li>
            <strong>Grouped options</strong> -
            clock, ui, labels, behavior, callbacks
          </li>
          <li>
            <strong>Auto-refresh</strong> - Update
            time periodically with setInterval
          </li>
          <li>
            <strong>Timezone support</strong> -
            Fetch time from different timezones
          </li>
          <li>
            <strong>Validation</strong> -
            disabledTime for restricted hours
          </li>
          <li>
            <strong>Error handling</strong> - Proper
            try/catch with user feedback
          </li>
          <li>
            <strong>Cleanup</strong> - Destroy
            picker and clear intervals in useEffect
          </li>
        </ul>
      </Section>

      <Callout title="Production Tips">
        <ul>
          <li>Always handle API errors gracefully with try/catch</li>
          <li>
            Clean up intervals and destroy pickers in React useEffect cleanup
          </li>
          <li>Use EventEmitter API for better TypeScript support</li>
          <li>Consider rate limiting and caching for frequent API calls</li>
          <li>Validate time data from external APIs before setting</li>
        </ul>
      </Callout>
    </div>
  );
}
