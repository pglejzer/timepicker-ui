import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Date Picker Examples",
  section: true,
  description:
    "Live @pglejzer/datepicker-ui examples, the date picker companion of timepicker-ui: ranges, multiple dates, min and max, month pickers, themes and forms.",
  path: "/datepicker/examples",
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
