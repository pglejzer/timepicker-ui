"use client";

import { Suspense, lazy, ComponentType } from "react";
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
    <div className="mb-8 rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
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

interface LazyExampleProps {
  component: () => Promise<{ default: ComponentType }>;
}

export function LazyExample({ component }: LazyExampleProps) {
  const LazyComponent = lazy(component);

  return (
    <Suspense fallback={<ExampleLoader />}>
      <LazyComponent />
    </Suspense>
  );
}
