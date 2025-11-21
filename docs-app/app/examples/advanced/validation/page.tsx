"use client";

import { Section } from "@/components/section";
import { TimepickerExample } from "@/components/examples/timepicker-example";
import { CodeBlock } from "@/components/code-block";
import { ShieldCheck, AlertCircle } from "lucide-react";
import { InfoBox } from "@/components/info-box";
import type { TimepickerEventData } from "@/components/examples/types";

export default function ValidationPage() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          Validation
        </h1>
        <p className="text-lg text-muted-foreground">
          Validate time input and handle invalid entries
        </p>
      </div>

      <InfoBox title="Built-in Validation" variant="blue" className="mb-8">
        Timepicker-UI includes built-in validation that adds error classes to
        invalid inputs. Use event callbacks to implement custom validation
        logic.
      </InfoBox>

      <Section icon={ShieldCheck} title="Basic Validation">
        <p className="text-muted-foreground mb-4">
          The timepicker automatically validates input format:
        </p>
        <TimepickerExample
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

      <Section icon={AlertCircle} title="Custom Validation">
        <p className="text-muted-foreground mb-4">
          Implement custom validation in the onConfirm callback:
        </p>
        <TimepickerExample
          code={`import { TimepickerUI } from 'timepicker-ui';

const input = document.querySelector('#timepicker');
const picker = new TimepickerUI(input, {
  callbacks: {
    onConfirm: (data) => {
      const hour = parseInt(data.hour);
      
      // Custom rule: Only allow working hours (9 AM - 5 PM)
      if (hour < 9 || hour > 17) {
        alert('Please select time between 9 AM and 5 PM');
        input.classList.add('error');
        return;
      }
      
      input.classList.remove('error');
      console.log('Valid time:', data);
    }
  }
});

picker.create();`}
          options={{
            callbacks: {
              onConfirm: (data: TimepickerEventData) => {
                if (!data.hour) return;
                const hour = parseInt(data.hour);
                if (hour < 9 || hour > 17) {
                  alert("Please select time between 9 AM and 5 PM");
                }
              },
            },
          }}
        />
      </Section>

      <Section icon={ShieldCheck} title="Required Field">
        <p className="text-muted-foreground mb-4">
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

      <Section icon={AlertCircle} title="Time Range Validation">
        <p className="text-muted-foreground mb-4">
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
const picker = new TimepickerUI(input, {
  callbacks: {
    onConfirm: (data) => {
      const time = \`\${data.hour}:\${data.minutes}\`;
      
      if (!validateTimeRange(time, '08:00', '18:00')) {
        alert('Time must be between 8:00 AM and 6:00 PM');
        input.classList.add('error');
        return;
      }
      
      input.classList.remove('error');
    }
  }
});

picker.create();`}
          language="typescript"
        />
      </Section>

      <Section icon={ShieldCheck} title="React Form Integration">
        <p className="text-muted-foreground mb-4">
          Integrate with React form validation libraries:
        </p>
        <CodeBlock
          code={`import { useEffect, useRef, useMemo } from 'react';
import { TimepickerUI } from 'timepicker-ui';
import { useForm } from 'react-hook-form';

function TimePickerForm() {
  const inputRef = useRef<HTMLInputElement>(null);
  const pickerRef = useRef<TimepickerUI | null>(null);
  
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm();

  const options = useMemo(() => ({
    callbacks: {
      onConfirm: (data) => {
        const time = \`\${data.hour}:\${data.minutes}\${data.type ? ' ' + data.type : ''}\`;
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
        ref={inputRef}
        type="text"
        {...register('time', {
          required: 'Time is required',
          pattern: {
            value: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
            message: 'Invalid time format'
          }
        })}
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

      <Section icon={AlertCircle} title="Server-Side Validation">
        <p className="text-muted-foreground mb-4">
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
