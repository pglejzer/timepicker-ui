import { CopyButton } from "@/components/copy-button";
import styles from "./install-command.module.css";

export function InstallCommand({ command = "npm install timepicker-ui" }: { command?: string }) {
  return (
    <div className={styles.install}>
      <code className={styles.command}>{command}</code>
      <CopyButton text={command} />
    </div>
  );
}
