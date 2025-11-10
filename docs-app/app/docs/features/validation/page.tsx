import { CodeBlock } from "@/components/code-block";
import { Section } from "@/components/section";
import { LinkCard } from "@/components/link-card";
import { Shield, CheckCircle, AlertTriangle, XCircle } from "lucide-react";

export const metadata = {
  title: "Validation - Timepicker-UI",
  description: "Input validation, error handling, and custom validation rules",
};

export default function ValidationPage() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-foreground">
          Validation
        </h1>
        <p className="text-lg text-muted-foreground">
          Built-in validation with custom rules and error handling
        </p>
      </div>

      <Section icon={Shield} title="Built-in Validation">
        <p className="text-muted-foreground mb-4">
          Timepicker-UI automatically validates time input and provides feedback
          for invalid values:
        </p>
        <div className="rounded-lg border border-border bg-card p-6">
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Validates time format (HH:mm or hh:mm AM/PM)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Checks for valid hour and minute ranges</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Respects disabled time restrictions</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>Prevents invalid manual input</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">✓</span>
              <span>HTML5 time input validation support</span>
            </li>
          </ul>
        </div>
      </Section>

      <Section icon={CheckCircle} title="Valid Time Detection">
        <p className="text-muted-foreground mb-4">
          Use the{" "}
          <code className="text-primary bg-primary/10 px-1.5 py-0.5 rounded text-sm">
            accept
          </code>{" "}
          event to handle valid time selection:
        </p>
        <CodeBlock
          code={`const input = document.querySelector('#timepicker');
const picker = new TimepickerUI(input);

picker.create();

input.addEventListener('accept', (event) => {
  const selectedTime = event.detail.hour + ':' + event.detail.minutes;
  console.log('Valid time selected:', selectedTime);
  
  // Perform actions with validated time
  submitForm(selectedTime);
});`}
          language="typescript"
        />
      </Section>

      <Section icon={AlertTriangle} title="Error Handling">
        <p className="text-muted-foreground mb-4">
          Detect and handle invalid time input:
        </p>
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Invalid Input Detection
            </h3>
            <CodeBlock
              code={`const input = document.querySelector('#timepicker');
const errorMessage = document.querySelector('#error-message');

input.addEventListener('input', (e) => {
  const value = e.target.value;
  
  if (!isValidTimeFormat(value)) {
    errorMessage.textContent = 'Please enter a valid time (HH:mm)';
    errorMessage.classList.add('visible');
  } else {
    errorMessage.classList.remove('visible');
  }
});

function isValidTimeFormat(time) {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
}`}
              language="typescript"
            />
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Disabled Time Validation
            </h3>
            <CodeBlock
              code={`const picker = new TimepickerUI(input, {
  disabledTime: {
    hours: [0, 1, 2, 3, 4, 5, 22, 23]
  }
});

picker.create();

input.addEventListener('accept', (event) => {
  const hour = event.detail.hour;
  
  // This will never trigger for disabled hours
  // as they cannot be selected
  console.log('Selected hour:', hour);
});

// Validate manual input
input.addEventListener('change', (e) => {
  const [hour] = e.target.value.split(':').map(Number);
  const disabledHours = [0, 1, 2, 3, 4, 5, 22, 23];
  
  if (disabledHours.includes(hour)) {
    e.target.setCustomValidity('This time is not available');
    e.target.reportValidity();
  } else {
    e.target.setCustomValidity('');
  }
});`}
              language="typescript"
            />
          </div>
        </div>
      </Section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold tracking-tight mb-6 text-foreground">
          Custom Validation Rules
        </h2>
        <p className="text-muted-foreground mb-4">
          Implement custom validation logic for specific business requirements:
        </p>
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Minimum Time Validation
            </h3>
            <CodeBlock
              code={`function validateMinTime(selectedTime, minTime) {
  const selected = timeToMinutes(selectedTime);
  const minimum = timeToMinutes(minTime);
  
  return selected >= minimum;
}

function timeToMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

// Usage
input.addEventListener('accept', (event) => {
  const time = event.detail.hour + ':' + event.detail.minutes;
  const minTime = '09:00';
  
  if (!validateMinTime(time, minTime)) {
    alert('Please select a time after 9:00 AM');
    input.value = '';
  }
});`}
              language="typescript"
            />
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Time Range Validation
            </h3>
            <CodeBlock
              code={`function isTimeInRange(time, startTime, endTime) {
  const selected = timeToMinutes(time);
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);
  
  return selected >= start && selected <= end;
}

function timeToMinutes(time) {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}

// Validate on accept
input.addEventListener('accept', (event) => {
  const time = event.detail.hour + ':' + event.detail.minutes;
  
  if (!isTimeInRange(time, '09:00', '17:00')) {
    showError('Please select a time between 9:00 AM and 5:00 PM');
    return;
  }
  
  submitTime(time);
});`}
              language="typescript"
            />
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Date-Time Validation
            </h3>
            <CodeBlock
              code={`function validateDateTime(date, time) {
  const now = new Date();
  const selected = new Date(date + 'T' + time);
  
  return selected > now;
}

// Combined date and time validation
const dateInput = document.querySelector('#date-picker');
const timeInput = document.querySelector('#time-picker');

timeInput.addEventListener('accept', (event) => {
  const time = event.detail.hour + ':' + event.detail.minutes;
  const date = dateInput.value;
  
  if (!validateDateTime(date, time)) {
    showError('Cannot select a time in the past');
    timeInput.value = '';
    return;
  }
  
  console.log('Valid future date-time:', date, time);
});`}
              language="typescript"
            />
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold tracking-tight mb-6 text-foreground">
          HTML5 Validation
        </h2>
        <p className="text-muted-foreground mb-4">
          Leverage native HTML5 validation attributes:
        </p>
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Required Time Input
            </h3>
            <CodeBlock
              code={`<form>
  <label for="timepicker">
    Meeting Time (Required)
  </label>
  <input 
    type="time" 
    id="timepicker"
    required
    min="09:00"
    max="17:00"
    step="900"
  />
  <button type="submit">Schedule</button>
</form>

<script>
const picker = new TimepickerUI(
  document.querySelector('#timepicker')
);
picker.create();

document.querySelector('form').addEventListener('submit', (e) => {
  e.preventDefault();
  
  if (e.target.checkValidity()) {
    console.log('Form is valid!');
    // Submit form
  } else {
    console.log('Form has validation errors');
  }
});
</script>`}
              language="html"
            />
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Custom Validation Messages
            </h3>
            <CodeBlock
              code={`const input = document.querySelector('#timepicker');

input.addEventListener('invalid', (e) => {
  e.target.setCustomValidity('Please select a valid time');
});

input.addEventListener('input', (e) => {
  // Clear custom message when user starts typing
  e.target.setCustomValidity('');
});

// Custom range validation
input.addEventListener('change', (e) => {
  const [hours, minutes] = e.target.value.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes;
  
  if (totalMinutes < 540) { // Before 9:00 AM
    e.target.setCustomValidity('Business hours start at 9:00 AM');
    e.target.reportValidity();
  } else if (totalMinutes > 1020) { // After 5:00 PM
    e.target.setCustomValidity('Business hours end at 5:00 PM');
    e.target.reportValidity();
  } else {
    e.target.setCustomValidity('');
  }
});`}
              language="typescript"
            />
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold tracking-tight mb-6 text-foreground">
          Visual Error States
        </h2>
        <p className="text-muted-foreground mb-4">
          Style the input to show validation errors:
        </p>
        <div className="space-y-6">
          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Error Styling
            </h3>
            <CodeBlock
              code={`/* Input error state */
input[type="time"]:invalid {
  border-color: #ef4444;
  background-color: #fef2f2;
}

input[type="time"]:invalid:focus {
  outline-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

/* Error message */
.error-message {
  display: none;
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.error-message.visible {
  display: block;
}

/* Success state */
input[type="time"]:valid {
  border-color: #10b981;
}`}
              language="css"
            />
          </div>

          <div className="rounded-lg border border-border bg-card p-6">
            <h3 className="font-semibold mb-3 text-foreground">
              Complete Example
            </h3>
            <CodeBlock
              code={`<div class="form-group">
  <label for="timepicker">Select time</label>
  <input 
    type="time" 
    id="timepicker"
    class="form-control"
    required
  />
  <span class="error-message" id="error"></span>
</div>

<style>
.form-control {
  border: 2px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  transition: all 0.2s;
}

.form-control.error {
  border-color: #ef4444;
}

.form-control.success {
  border-color: #10b981;
}
</style>

<script>
const input = document.querySelector('#timepicker');
const errorMsg = document.querySelector('#error');

input.addEventListener('change', () => {
  if (input.validity.valid) {
    input.classList.remove('error');
    input.classList.add('success');
    errorMsg.textContent = '';
  } else {
    input.classList.add('error');
    input.classList.remove('success');
    errorMsg.textContent = input.validationMessage;
  }
});
</script>`}
              language="html"
            />
          </div>
        </div>
      </section>

      <LinkCard
        icon={XCircle}
        title="Server-Side Validation"
        description="Always validate time values on your server. Client-side validation improves user experience but can be bypassed. Implement the same validation rules on your backend to ensure data integrity and security."
        linkText="Learn about events"
        linkHref="/docs/api/events"
        variant="blue"
      />
    </div>
  );
}
