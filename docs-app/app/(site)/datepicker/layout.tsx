import { DocsShell } from "@/components/docs-shell";
import { datepickerNav } from "@/lib/nav";
import "@pglejzer/datepicker-ui/index.css";

export default function DatepickerLayout({ children }: { children: React.ReactNode }) {
  return (
    <DocsShell nav={datepickerNav} navLabel="Datepicker">
      {children}
    </DocsShell>
  );
}
