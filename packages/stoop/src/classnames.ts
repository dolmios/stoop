type ClassValue = string | number | boolean | null | undefined;

export function clsx(...classes: ClassValue[]): string {
  return classes.filter((x) => typeof x === "string" && x.length > 0).join(" ");
}
