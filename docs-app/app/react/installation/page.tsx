import Link from "next/link";
import { Download, ArrowRight, Code2, AlertCircle } from "lucide-react";

export const metadata = {
  title: "Installation - React - Timepicker-UI",
  description: "Install timepicker-ui-react in your project",
};

export default function InstallationPage() {
  return (
    <div>
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Installation</h1>
        <p className="text-xl text-muted-foreground">
          Install timepicker-ui-react in your project using npm, yarn, or pnpm
        </p>
      </div>

      <div className="rounded-lg border border-border bg-card p-6 mb-8">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Download className="h-6 w-6 text-primary" />
          Package Manager
        </h2>
        <p className="text-muted-foreground mb-4">
          Choose your preferred package manager:
        </p>
        <div className="space-y-3">
          <div>
            <p className="text-sm font-medium mb-2">npm</p>
            <div className="rounded-md bg-muted p-4 font-mono text-sm">
              npm install timepicker-ui-react
            </div>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">yarn</p>
            <div className="rounded-md bg-muted p-4 font-mono text-sm">
              yarn add timepicker-ui-react
            </div>
          </div>
          <div>
            <p className="text-sm font-medium mb-2">pnpm</p>
            <div className="rounded-md bg-muted p-4 font-mono text-sm">
              pnpm add timepicker-ui-react
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-6 mb-8">
        <div className="flex gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold mb-2 text-blue-600 dark:text-blue-400">
              Automatic Dependency
            </h3>
            <p className="text-sm text-muted-foreground">
              <code className="text-xs bg-muted px-1.5 py-0.5 rounded">
                timepicker-ui
              </code>{" "}
              is automatically installed as a dependency. You don't need to
              install it separately.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Requirements</h2>
        <div className="rounded-lg border border-border bg-card p-6">
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>
                <strong>React:</strong> 17.0.0 or higher
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>
                <strong>React DOM:</strong> 17.0.0 or higher
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span>
                <strong>timepicker-ui:</strong> Automatically installed (^4.0.2)
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Import Styles</h2>
        <div className="rounded-lg border border-border bg-card p-6">
          <p className="text-muted-foreground mb-4">
            Import the required CSS in your component or global styles:
          </p>
          <div className="rounded-md bg-muted p-4 font-mono text-sm">
            import "timepicker-ui/main.css";
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="text-2xl font-bold mb-4">Next Steps</h2>
        <div className="space-y-3">
          <Link
            href="/react/quick-start"
            className="flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:border-primary/50 hover:bg-accent"
          >
            <Code2 className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <div className="font-medium">Quick Start</div>
              <div className="text-sm text-muted-foreground">
                Create your first timepicker component
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>

          <Link
            href="/react/examples"
            className="flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:border-primary/50 hover:bg-accent"
          >
            <Code2 className="h-5 w-5 text-primary" />
            <div className="flex-1">
              <div className="font-medium">View Examples</div>
              <div className="text-sm text-muted-foreground">
                Explore interactive demos
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
          </Link>
        </div>
      </div>
    </div>
  );
}
