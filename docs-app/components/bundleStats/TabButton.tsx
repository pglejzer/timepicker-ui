export function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-5 md:px-7 py-3.5 font-semibold transition-all duration-200 border-b-2 text-sm md:text-base rounded-t-lg ${
        active
          ? "text-primary border-primary bg-primary/5 shadow-sm"
          : "text-muted-foreground border-transparent hover:text-foreground hover:bg-muted/50 hover:border-muted-foreground/20"
      }`}
    >
      {children}
    </button>
  );
}
