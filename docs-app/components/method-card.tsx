import { Code2 } from "lucide-react";
import { CodeBlock } from "./code-block";

interface MethodCardProps {
  name: string;
  description: string;
  code: string;
}

export function MethodCard({ name, description, code }: MethodCardProps) {
  return (
    <div className="group relative">
      <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-primary/0 via-primary/5 to-purple-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="relative rounded-xl border border-border bg-card p-6 transition-all group-hover:border-primary/30">
        <div className="flex items-start gap-4 mb-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/10 to-purple-500/10">
            <Code2 className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-2">
              <code className="text-primary">{name}</code>
            </h2>
            <p className="text-muted-foreground">{description}</p>
          </div>
        </div>
        <CodeBlock code={code} language="typescript" />
      </div>
    </div>
  );
}
