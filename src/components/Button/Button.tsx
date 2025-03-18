import { clsx } from "clsx";
import { type ButtonHTMLAttributes, type JSX } from "react";

import styles from "./Button.module.css";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ className, ...props }: ButtonProps): JSX.Element {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return <button className={clsx(styles.button, className)} type="button" {...props} />;
}
