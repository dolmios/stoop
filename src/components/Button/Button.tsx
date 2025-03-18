import { type ButtonHTMLAttributes, type JSX } from "react";

import styles from "./Button.module.css";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ className, ...props }: ButtonProps): JSX.Element {
  return <button className={styles.button} type="button" {...props} />;
}
