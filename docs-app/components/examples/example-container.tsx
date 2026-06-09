"use client";

import { Suspense, lazy, ComponentType, LazyExoticComponent } from "react";
import { Loader2 } from "lucide-react";

interface ExampleContainerProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function ExampleContainer({
  title,
  description,
  children,
}: ExampleContainerProps) {
  return (
    <div className="mb-8 rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-5">
        <span className="eyebrow">Example</span>
        <h3 className="display mt-2 text-lg font-semibold text-foreground sm:text-xl">
          {title}
        </h3>
        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
        <div className="mt-4 h-px w-full bg-border" aria-hidden="true" />
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

export function ExampleLoader() {
  return (
    <div className="flex items-center justify-center p-12">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

type ComponentLoader = () => Promise<{ default: ComponentType }>;

interface LazyExampleProps {
  component: ComponentLoader;
}

// Cache lazy components by their loader so they are created once, outside of
// render. Creating them during render would reset their state on every render
// and is flagged by react-hooks/static-components.
const lazyCache = new Map<
  ComponentLoader,
  LazyExoticComponent<ComponentType>
>();

function getLazyComponent(component: ComponentLoader) {
  let cached = lazyCache.get(component);
  if (!cached) {
    cached = lazy(component);
    lazyCache.set(component, cached);
  }
  return cached;
}

export function LazyExample({ component }: LazyExampleProps) {
  // getLazyComponent memoizes by loader identity in a module-level cache, so the
  // lazy component is created once per loader and never recreated on re-render.
  // The static-components rule can't see through the cache to verify this.
  const LazyComponent = getLazyComponent(component);

  return (
    <Suspense fallback={<ExampleLoader />}>
      {/* eslint-disable-next-line react-hooks/static-components -- lazy component is cached per loader at module scope, not recreated each render */}
      <LazyComponent />
    </Suspense>
  );
}
