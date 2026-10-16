import Link from "next/link";
import { CodeBlock } from "@/components/code-block";
import { buildMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/page-header";
import { Section } from "@/components/section";
import { Callout } from "@/components/callout";

export const metadata = buildMetadata({
  title: "Server Rendering",
  description:
    "Use timepicker-ui with Next.js, Nuxt and SvelteKit: create the picker on the client and destroy it on unmount.",
  path: "/docs/guides/server-rendering",
});

const DOCUMENT_NOT_DEFINED =
  "/docs/guides/troubleshooting#referenceerror-document-is-not-defined-nextjs-nuxt-sveltekit";

export default function ServerRenderingPage() {
  return (
    <div>
      <PageHeader
        title="Server Rendering"
        description="Create the picker in the browser and destroy it when the component unmounts."
      />

      <p>
        You can import <code>timepicker-ui</code> on the server: loading the
        package does not touch <code>window</code> or <code>document</code>.
        The picker itself needs the DOM, so create it in a lifecycle hook that
        runs only in the browser, and call <code>destroy()</code> when the
        component unmounts.
      </p>
      <p>
        On the server, <code>new TimepickerUI()</code> throws{" "}
        <code>TimepickerUI requires browser environment</code>. For{" "}
        <code>ReferenceError: document is not defined</code>, see the{" "}
        <Link href={DOCUMENT_NOT_DEFINED}>Troubleshooting entry</Link>.
      </p>

      <Section title="Next.js">
        <p>
          In the App Router, pages and layouts are Server Components by
          default. Put the picker in a file that starts with{" "}
          <code>&apos;use client&apos;</code> and create it in{" "}
          <code>useEffect</code>, which runs only in the browser:
        </p>
        <CodeBlock
          filename="time-field.tsx"
          code={`'use client';

import { useEffect, useRef } from 'react';
import { TimepickerUI } from 'timepicker-ui';
import 'timepicker-ui/main.css';

export function TimeField() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current) return;
    const picker = new TimepickerUI(inputRef.current);
    picker.create();
    return () => picker.destroy();
  }, []);

  return (
    <div className="tp-ui">
      <input ref={inputRef} type="text" placeholder="Select time" />
    </div>
  );
}`}
          language="tsx"
        />
        <Callout title="The tp-ui wrapper">
          <p>
            Given a bare input, the picker wraps it in a new{" "}
            <code>div.tp-ui</code>, and <code>destroy()</code> leaves that{" "}
            <code>div</code> in place. React does not know about it. When the
            component unmounts while its parent stays on the page, React calls{" "}
            <code>removeChild</code> on the parent it rendered the input into,
            and the call throws. With <code>div.tp-ui</code> in your JSX, the
            picker uses that element as its root and moves nothing.
          </p>
        </Callout>

        <h3>
          With <code>timepicker-ui-react</code>
        </h3>
        <p>
          The <code>Timepicker</code> component creates and destroys the
          picker for you. It uses hooks, and the package does not add{" "}
          <code>&apos;use client&apos;</code>, so import it from a file that
          does:
        </p>
        <CodeBlock
          filename="time-field.tsx"
          code={`'use client';

import { Timepicker } from 'timepicker-ui-react';
import 'timepicker-ui/main.css';

export function TimeField() {
  return (
    <Timepicker
      placeholder="Select time"
      onConfirm={(data) => console.log(data.hour, data.minutes)}
    />
  );
}`}
          language="tsx"
        />
        <p>
          Any page or layout can render <code>{"<TimeField />"}</code>. Keep
          callbacks such as <code>onConfirm</code> in the client file: props
          passed from a Server Component must be serializable, and functions
          are not. Import <code>timepicker-ui/main.css</code> here or once in{" "}
          <code>app/layout.tsx</code>. The <Link href="/react">React</Link>{" "}
          section lists the component&apos;s props.
        </p>
      </Section>

      <Section title="Nuxt">
        <p>
          Vue does not run <code>onMounted</code> during server rendering. Load
          the library inside it and destroy the picker in{" "}
          <code>onBeforeUnmount</code>:
        </p>
        <CodeBlock
          filename="TimeField.vue"
          code={`<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import type { TimepickerUI } from 'timepicker-ui';

const input = ref<HTMLInputElement | null>(null);
let picker: TimepickerUI | undefined;

onMounted(async () => {
  const { TimepickerUI } = await import('timepicker-ui');
  if (!input.value) return;
  picker = new TimepickerUI(input.value);
  picker.create();
});

onBeforeUnmount(() => picker?.destroy());
</script>

<template>
  <input ref="input" type="text" placeholder="Select time" />
</template>`}
          language="markup"
        />
        <p>
          A static import works too, because importing the package is safe on
          the server.
        </p>
        <p>
          Load the styles for the whole app in <code>nuxt.config.ts</code>, or
          import <code>timepicker-ui/main.css</code> in the component:
        </p>
        <CodeBlock
          filename="nuxt.config.ts"
          code={`export default defineNuxtConfig({
  css: ['timepicker-ui/main.css'],
});`}
          language="typescript"
        />

        <h3>
          With <code>&lt;ClientOnly&gt;</code>
        </h3>
        <p>
          <code>&lt;ClientOnly&gt;</code> renders its <code>#fallback</code>{" "}
          slot on the server and its content only in the browser. Here the
          fallback is a disabled field that stays until{" "}
          <code>&lt;ClientOnly&gt;</code> mounts:
        </p>
        <CodeBlock
          filename="app.vue"
          code={`<template>
  <ClientOnly>
    <TimeField />
    <template #fallback>
      <input type="text" placeholder="Select time" disabled />
    </template>
  </ClientOnly>
</template>`}
          language="markup"
        />
      </Section>

      <Section title="SvelteKit">
        <p>
          Svelte does not run <code>onMount</code> during server rendering.
          Load the library inside it and return a cleanup function, which
          Svelte calls when the component is destroyed:
        </p>
        <CodeBlock
          filename="TimeField.svelte"
          code={`<script>
  import { onMount } from 'svelte';
  import 'timepicker-ui/main.css';

  let input;

  onMount(() => {
    let picker;
    import('timepicker-ui').then(({ TimepickerUI }) => {
      picker = new TimepickerUI(input);
      picker.create();
    });
    return () => picker?.destroy();
  });
</script>

<input bind:this={input} type="text" placeholder="Select time" />`}
          language="markup"
        />
        <p>
          The callback uses <code>.then()</code> instead of{" "}
          <code>async</code>. An <code>async</code> function returns a
          promise, and Svelte only calls a cleanup function that{" "}
          <code>onMount</code> returns synchronously.
        </p>
      </Section>

      <Section title="Plugins and Themes">
        <p>
          Register plugins in the same client code, before the first{" "}
          <code>new TimepickerUI()</code>.{" "}
          <code>PluginRegistry.register()</code> only stores the plugin and
          skips a name that is already registered, so calling it at the top
          of a client module is safe during server rendering:
        </p>
        <CodeBlock
          filename="wheel-field.tsx"
          code={`'use client';

import { useEffect, useRef } from 'react';
import { PluginRegistry, TimepickerUI } from 'timepicker-ui';
import { WheelPlugin } from 'timepicker-ui/plugins/wheel';

PluginRegistry.register(WheelPlugin);

export function WheelField() {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!inputRef.current) return;
    const picker = new TimepickerUI(inputRef.current, { ui: { mode: 'wheel', theme: 'dark' } });
    picker.create();
    return () => picker.destroy();
  }, []);

  return (
    <div className="tp-ui">
      <input ref={inputRef} type="text" placeholder="Select time" />
    </div>
  );
}`}
          language="tsx"
        />
        <p>
          With a dynamic import, load the plugin next to the library. In the
          Nuxt component above, <code>onMounted</code> becomes:
        </p>
        <CodeBlock
          filename="TimeField.vue"
          code={`onMounted(async () => {
  const { TimepickerUI, PluginRegistry } = await import('timepicker-ui');
  const { WheelPlugin } = await import('timepicker-ui/plugins/wheel');
  PluginRegistry.register(WheelPlugin);
  if (!input.value) return;
  picker = new TimepickerUI(input.value, { ui: { mode: 'wheel' } });
  picker.create();
});`}
          language="typescript"
        />
        <p>
          Theme files are global CSS. Import <code>main.css</code> and each
          theme you use once: in <code>app/layout.tsx</code> (Next.js), in the{" "}
          <code>css</code> list of <code>nuxt.config.ts</code> (Nuxt) or in the
          root <code>+layout.svelte</code> (SvelteKit). Then pick the theme
          with <code>ui.theme</code>.
        </p>
        <CodeBlock
          filename="app/layout.tsx"
          code={`import 'timepicker-ui/main.css';
import 'timepicker-ui/theme-dark.css';`}
          language="tsx"
        />
        <p>
          See <Link href="/docs/features/themes">Themes</Link> for the theme
          names and <Link href="/docs/features/plugins">Plugins</Link> for the
          options of each plugin.
        </p>
      </Section>
    </div>
  );
}
