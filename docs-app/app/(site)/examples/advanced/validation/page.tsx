"use client";

import { Section } from "@/components/section";
import { PageHeader } from "@/components/page-header";
import { TimepickerExample } from "@/components/examples/timepicker-example";
import { CodeBlock } from "@/components/code-block";
import { Callout } from "@/components/callout";
import type { TimepickerEventData } from "@/components/examples/types";
import demo from "@/components/demo-controls.module.css";
import { useState } from "react";

export default function ValidationPage() {
  const [error, setError] = useState("");

  return (
    <div>
      <PageHeader
        title="Validation"
        description="Validate time input and handle invalid entries"
      />

      <Callout title="Built-in Validation">
        Timepicker-UI includes built-in validation that adds error classes to
        invalid inputs. Use event callbacks to implement custom validation
        logic.
      </Callout>

      <Section title="Basic Validation">
        <p>
          The timepicker automatically validates input format:
        </p>
        <TimepickerExample
          display="field"
          code={`import { TimepickerUI } from 'timepicker-ui';

const input = document.querySelector('#timepicker');
const picker = new TimepickerUI(input, {
  callbacks: {
    onConfirm: (data) => {
      console.log('Valid time:', data);
    }
  }
});

picker.create();

// Invalid format will add 'tp-ui-invalid-format' class
// and show error message`}
          options={{}}
        />
      </Section>

      <Section title="Custom Validation">
        <p>
          Implement custom validation in the onConfirm callback:
        </p>
        <TimepickerExample
          display="field"
          code={`import { TimepickerUI } from 'timepicker-ui';

const input = document.querySelector('#timepicker');
// Markup: <p id="time-error" role="alert"></p> next to the input
const timeError = document.querySelector('#time-error');
const picker = new TimepickerUI(input, {
  clock: { type: '24h' },
  callbacks: {
    onConfirm: (data) => {
      const hour = parseInt(data.hour);
      
      // Custom rule: Only allow working hours (9 AM - 5 PM)
      if (hour < 9 || hour > 17) {
        timeError.textContent = 'Please select time between 9 AM and 5 PM';
        input.classList.add('error');
        return;
      }

      input.classList.remove('error');
      timeError.textContent = '';
      console.log('Valid time:', data);
    }
  }
});

picker.create();`}
          options={{
            clock: { type: "24h" },
            callbacks: {
              onConfirm: (data: TimepickerEventData) => {
                if (!data.hour) return;
                const hour = parseInt(data.hour);
                if (hour < 9 || hour > 17) {
                  setError("Please select time between 9 AM and 5 PM");
                  return;
                }
                setError("");
              },
            },
          }}
          message={
            <p role="alert" className={demo.error}>
              {error}
            </p>
          }
        />
      </Section>

      <Section title="Required Field">
        <p>
          Validate that a time has been selected:
        </p>
        <CodeBlock
          code={`import { TimepickerUI } from 'timepicker-ui';

const input = document.querySelector('#timepicker');
const form = document.querySelector('#myForm');
const picker = new TimepickerUI(input);

picker.create();

form.addEventListener('submit', (e) => {
  e.preventDefault();
  
  if (!input.value) {
    input.classList.add('error');
    
    // Add error message
    const errorMsg = document.createElement('div');
    errorMsg.className = 'error-message';
    errorMsg.textContent = 'Time is required';
    input.parentElement.appendChild(errorMsg);
    
    return;
  }
  
  input.classList.remove('error');
  // Submit form
  console.log('Form submitted with time:', input.value);
});`}
          language="typescript"
        />
      </Section>

      <Section title="Time Range Validation">
        <p>
          Validate time is within a specific range:
        </p>
        <CodeBlock
          code={`import { TimepickerUI } from 'timepicker-ui';

function validateTimeRange(time: string, min: string, max: string): boolean {
  const [timeH, timeM] = time.split(':').map(Number);
  const [minH, minM] = min.split(':').map(Number);
  const [maxH, maxM] = max.split(':').map(Number);
  
  const timeMinutes = timeH * 60 + timeM;
  const minMinutes = minH * 60 + minM;
  const maxMinutes = maxH * 60 + maxM;
  
  return timeMinutes >= minMinutes && timeMinutes <= maxMinutes;
}

const input = document.querySelector('#timepicker');
// Markup: <p id="time-error" role="alert"></p> next to the input
const timeError = document.querySelector('#time-error');
const picker = new TimepickerUI(input, {
  clock: { type: '24h' },
  callbacks: {
    onConfirm: (data) => {
      const time = \`\${data.hour}:\${data.minutes}\`;

      if (!validateTimeRange(time, '08:00', '18:00')) {
        timeError.textContent = 'Time must be between 8:00 AM and 6:00 PM';
        input.classList.add('error');
        return;
      }

      input.classList.remove('error');
      timeError.textContent = '';
    }
  }
});

picker.create();`}
          language="typescript"
        />
      </Section>

      <Section title="React Form Integration">
        <p>
          Integrate with React form validation libraries:
        </p>
        <CodeBlock
          code={`import { useEffect, useRef, useMemo } from 'react';
import { TimepickerUI } from 'timepicker-ui';
import { useForm } from 'react-hook-form';

function TimePickerForm() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const pickerRef = useRef<TimepickerUI | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm();

  const { ref: registerRef, ...timeField } = register('time', {
    required: 'Time is required',
    pattern: {
      value: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      message: 'Invalid time format'
    }
  });

  const options = useMemo(() => ({
    clock: { type: '24h' as const },
    callbacks: {
      onConfirm: (data) => {
        const time = \`\${data.hour}:\${data.minutes}\`;
        setValue('time', time, { shouldValidate: true });
      }
    }
  }), [setValue]);

  useEffect(() => {
    if (!inputRef.current) return;

    pickerRef.current = new TimepickerUI(inputRef.current, options);
    pickerRef.current.create();

    return () => {
      pickerRef.current?.destroy();
    };
  }, []);

  const onSubmit = (data) => {
    console.log('Form data:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...timeField}
        ref={(el) => {
          registerRef(el);
          inputRef.current = el;
        }}
        type="text"
      />
      {errors.time && (
        <span className="error">{errors.time.message}</span>
      )}
      <button type="submit">Submit</button>
    </form>
  );
}`}
          language="tsx"
        />
      </Section>

      <Section title="Server-Side Validation">
        <p>
          Handle validation errors from server responses:
        </p>
        <CodeBlock
          code={`import { TimepickerUI } from 'timepicker-ui';

const input = document.querySelector('#timepicker');
const picker = new TimepickerUI(input);

picker.create();

async function submitTime(time: string) {
  try {
    const response = await fetch('/api/appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ time })
    });
    
    if (!response.ok) {
      const error = await response.json();
      
      // Show server validation error
      input.classList.add('error');
      
      const errorMsg = document.createElement('div');
      errorMsg.className = 'error-message';
      errorMsg.textContent = error.message;
      input.parentElement.appendChild(errorMsg);
      
      return;
    }
    
    console.log('Time saved successfully');
  } catch (error) {
    console.error('Validation error:', error);
  }
}`}
          language="typescript"
        />
      </Section>
    </div>
  );
}
