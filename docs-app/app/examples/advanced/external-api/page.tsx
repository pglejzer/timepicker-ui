"use client";

import { useEffect, useRef, useState } from "react";
import { TimepickerUI } from "timepicker-ui";
import "timepicker-ui/main.css";
import { Section } from "@/components/section";
import { CodeBlock } from "@/components/code-block";
import { InfoBox } from "@/components/info-box";
import { Clock, RefreshCw, Globe, Zap } from "lucide-react";

export default function ExternalAPIExample() {
  const input1Ref = useRef<HTMLInputElement>(null);
  const input2Ref = useRef<HTMLInputElement>(null);
  const input3Ref = useRef<HTMLInputElement>(null);
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
    };
  }, [timezone]);

  // Example 3: Multiple timezones with validation
  useEffect(() => {
    if (!input3Ref.current) return;

    const picker = new TimepickerUI(input3Ref.current, {
      clock: {
        type: "12h",
        disabledTime: {
          hours: [1, 2, 3, 4, 5], // Disable 1 AM - 5 AM
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
        time: "Select Time",
      },
      behavior: {
        focusTrap: true,
        focusInputAfterClose: true,
      },
      callbacks: {
        onConfirm: (data) => {
          console.log("✅ Time confirmed:", data);
        },
        onError: (data) => {
          console.error("❌ Error:", data);
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

      const picker = TimepickerUI.getById(
        input2Ref.current.getAttribute("data-timepicker-id") || ""
      );
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
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          External API Integration
        </h1>
        <p className="text-lg text-muted-foreground">
          Integrate timepicker with external time APIs for real-world
          applications
        </p>
      </div>

      <InfoBox title="API Used" emoji="🌐" variant="blue" className="mb-8">
        These examples use{" "}
        <a
          href="https://timeapi.io/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline font-medium"
        >
          TimeAPI.io
        </a>{" "}
        to fetch current time from different timezones. You can use any API that
        returns time data.
      </InfoBox>

      <Section icon={Clock} title="Basic - Fetch and Set Time">
        <p className="text-muted-foreground mb-4">
          Simple example: Fetch current time from API and set it to the
          timepicker on mount.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Current Time (Europe/Warsaw)
            </label>
            <input
              ref={input1Ref}
              type="text"
              className="w-full max-w-xs px-4 py-2 border border-border rounded-md bg-background"
              placeholder="Click to select time"
            />
            {currentTime && (
              <p className="text-sm text-muted-foreground mt-2">
                Loaded: {currentTime}
              </p>
            )}
          </div>

          <CodeBlock
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
            language="typescript"
          />
        </div>
      </Section>

      <Section icon={RefreshCw} title="Advanced - Auto-Refresh with Events">
        <p className="text-muted-foreground mb-4">
          Advanced example: Auto-refresh time every 60 seconds with timezone
          selector, EventEmitter API, and error handling.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Select Timezone
            </label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full max-w-xs px-4 py-2 border border-border rounded-md bg-background mb-4"
            >
              <option value="Europe/Warsaw">Europe/Warsaw</option>
              <option value="America/New_York">America/New York</option>
              <option value="Asia/Tokyo">Asia/Tokyo</option>
              <option value="Europe/London">Europe/London</option>
              <option value="Australia/Sydney">Australia/Sydney</option>
            </select>

            <label className="block text-sm font-medium mb-2">
              Current Time (Auto-refresh)
            </label>
            <div className="flex gap-2 items-center">
              <input
                ref={input2Ref}
                type="text"
                className="flex-1 max-w-xs px-4 py-2 border border-border rounded-md bg-background"
                placeholder="Click to select time"
              />
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
            </div>

            {currentTime && (
              <p className="text-sm text-green-600 dark:text-green-400 mt-2">
                ✅ {currentTime}
              </p>
            )}
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                ❌ {error}
              </p>
            )}
          </div>

          <CodeBlock
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
            language="typescript"
          />
        </div>
      </Section>

      <Section icon={Globe} title="Multiple Timezones with Validation">
        <p className="text-muted-foreground mb-4">
          Complex example: Random timezone selection, 12h format, disabled night
          hours, and full EventEmitter integration.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Random World Time (12h format, night hours disabled)
            </label>
            <input
              ref={input3Ref}
              type="text"
              className="w-full max-w-xs px-4 py-2 border border-border rounded-md bg-background"
              placeholder="Click to select time"
            />
            <p className="text-sm text-muted-foreground mt-2">
              Hours 1 AM - 5 AM are disabled. Fetches random timezone on mount.
            </p>
          </div>

          <CodeBlock
            code={`const picker = new TimepickerUI(input, {
  clock: {
    type: '12h',
    disabledTime: {
      hours: [1, 2, 3, 4, 5], // Disable 1 AM - 5 AM
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
    time: 'Select Time',
  },
  behavior: {
    focusTrap: true,
    focusInputAfterClose: true,
  },
  callbacks: {
    onConfirm: (data) => console.log('✅ Time confirmed:', data),
    onError: (data) => console.error('❌ Error:', data),
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
            language="typescript"
          />
        </div>
      </Section>

      <Section icon={Zap} title="Key Features Demonstrated">
        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
          <li>
            <strong className="text-foreground">setValue()</strong> - Set time
            programmatically from API
          </li>
          <li>
            <strong className="text-foreground">EventEmitter API</strong> -
            Listen to events with on(), once(), off()
          </li>
          <li>
            <strong className="text-foreground">Callback options</strong> -
            onConfirm, onUpdate, onError handlers
          </li>
          <li>
            <strong className="text-foreground">Grouped options</strong> -
            clock, ui, labels, behavior, callbacks
          </li>
          <li>
            <strong className="text-foreground">Auto-refresh</strong> - Update
            time periodically with setInterval
          </li>
          <li>
            <strong className="text-foreground">Timezone support</strong> -
            Fetch time from different timezones
          </li>
          <li>
            <strong className="text-foreground">Validation</strong> -
            disabledTime for restricted hours
          </li>
          <li>
            <strong className="text-foreground">Error handling</strong> - Proper
            try/catch with user feedback
          </li>
          <li>
            <strong className="text-foreground">Cleanup</strong> - Destroy
            picker and clear intervals in useEffect
          </li>
        </ul>
      </Section>

      <InfoBox title="Production Tips" emoji="💡" variant="purple">
        <ul className="space-y-2 text-sm">
          <li>• Always handle API errors gracefully with try/catch</li>
          <li>
            • Clean up intervals and destroy pickers in React useEffect cleanup
          </li>
          <li>• Use EventEmitter API for better TypeScript support</li>
          <li>• Consider rate limiting and caching for frequent API calls</li>
          <li>• Validate time data from external APIs before setting</li>
        </ul>
      </InfoBox>
    </div>
  );
}
