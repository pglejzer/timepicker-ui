import Link from "next/link";
import { Github, Heart } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">Timepicker-UI</h3>
            <p className="text-sm text-muted-foreground">
              A beautiful, customizable, and accessible time picker component
              for modern web applications.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/pglejzer/timepicker-ui"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Documentation
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/docs/installation"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Installation
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/quick-start"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Quick Start
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/configuration"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Configuration
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/api/methods"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  API Reference
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Features
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/docs/features/themes"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Themes
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/features/mobile"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Mobile Support
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/advanced/accessibility"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Accessibility
                </Link>
              </li>
              <li>
                <Link
                  href="/docs/advanced/localization"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Localization
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Resources
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://github.com/pglejzer/timepicker-ui"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://www.npmjs.com/package/timepicker-ui"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  npm Package
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/pglejzer/timepicker-ui/issues"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Report Issues
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/pglejzer/timepicker-ui/blob/main/CHANGELOG.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Changelog
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>© {currentYear} Timepicker-UI.</span>
              <span className="hidden md:inline">Made with</span>
              <Heart className="h-4 w-4 text-red-500 fill-red-500" />
              <span className="hidden md:inline">
                by the{" "}
                <a
                  href="https://github.com/pglejzer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Piotr Glejzer
                </a>{" "}
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <a
                href="https://github.com/pglejzer/timepicker-ui/blob/main/LICENSE"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                MIT License
              </a>
              <Link
                href="/docs"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                Documentation
              </Link>
              <a
                href="https://github.com/pglejzer/timepicker-ui/releases"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                v4.0.0
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
