import styles from "./CriteriaItem.module.css";

interface CriteriaItemProps {
  passed: boolean;
  text: string;
}

export function CriteriaItem({ passed, text }: CriteriaItemProps) {
  return (
    <li className={styles.item}>
      <span className={styles.status}>{passed ? "pass" : "fail"}</span>
      <span>{text}</span>
    </li>
  );
}
