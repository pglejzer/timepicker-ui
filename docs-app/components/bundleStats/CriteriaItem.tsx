interface CriteriaItemProps {
  passed: boolean;
  text: string;
}

export function CriteriaItem({ passed, text }: CriteriaItemProps) {
  return (
    <li className="flex items-center gap-3 p-3 bg-card rounded-lg transition-colors hover:bg-accent">
      <span
        className={
          passed
            ? "text-green-600 dark:text-green-500"
            : "text-red-600 dark:text-red-500"
        }
      >
        {passed ? "✓" : "✗"}
      </span>
      <span className="text-sm text-foreground">{text}</span>
    </li>
  );
}
