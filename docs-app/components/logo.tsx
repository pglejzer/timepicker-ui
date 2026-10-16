type LogoProps = { size?: number; className?: string };

export function Logo({ size = 22, className }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="8.75" strokeWidth="1.6" />
      <path d="M12 12 8.7 10.1" strokeWidth="1.7" />
      <path d="M12 12 16.8 9.2" strokeWidth="2" />
      <circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  );
}
