interface SectionProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}

export function Section({ icon: Icon, title, children }: SectionProps) {
  return (
    <section className="mb-12">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-4 w-4 text-primary" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}
