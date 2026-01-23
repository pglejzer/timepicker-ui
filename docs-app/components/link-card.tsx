import { ArrowRight, LucideIcon } from "lucide-react";
import Link from "next/link";

interface LinkCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  linkText: string;
  linkHref: string;
  variant?: "blue" | "purple" | "green" | "red" | "orange" | "cyan";
}

const isExternalLink = (href?: string): boolean => {
  if (!href) {
    return false;
  }

  return href.startsWith("https://");
};

const variantStyles = {
  blue: {
    container: "from-blue-500/5 to-purple-500/5",
    icon: "bg-blue-500/10",
  },
  purple: {
    container: "from-purple-500/5 to-pink-500/5",
    icon: "bg-purple-500/10",
  },
  green: {
    container: "from-green-500/5 to-blue-500/5",
    icon: "bg-green-500/10",
  },
  red: {
    container: "from-red-500/5 to-orange-500/5",
    icon: "bg-red-500/10",
  },
  orange: {
    container: "from-orange-500/5 to-yellow-500/5",
    icon: "bg-orange-500/10",
  },
  cyan: {
    container: "from-cyan-500/5 to-blue-500/5",
    icon: "bg-cyan-500/10",
  },
};

export function LinkCard({
  icon: Icon,
  title,
  description,
  linkText,
  linkHref,
  variant = "blue",
}: LinkCardProps) {
  const styles = variantStyles[variant];

  return (
    <div
      className={`mt-12 rounded-xl border border-primary/20 bg-gradient-to-br ${styles.container} p-8`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${styles.icon}`}
        >
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="font-medium mb-2 text-foreground">{title}</p>
          <p className="text-sm text-muted-foreground mb-3">{description}</p>
          {isExternalLink(linkHref) ? (
            <a
              href={linkHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-primary hover:underline"
            >
              {linkText}{" "}
            </a>
          ) : (
            <Link
              href={linkHref}
              className="text-sm font-medium text-primary hover:underline"
            >
              {linkText}{" "}
              <ArrowRight className="inline w-4 h-4 align-middle text-gray-500" />{" "}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
