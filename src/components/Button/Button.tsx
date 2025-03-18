import { clsx } from "clsx";
import { type ButtonHTMLAttributes, type JSX } from "react";

import styles from "./Button.module.css";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({ className, ...props }: ButtonProps): JSX.Element {
  // @ts-ignore - CSS module types are correct at runtime
  return <button className={clsx(styles["button"], className)} type="button" {...props} />;
}
