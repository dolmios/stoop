import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  description: "Performance benchmarks comparing Stoop vs Stitches CSS-in-JS libraries",
  title: "Benchmarks | Stoop",
};

export default function BenchmarksLayout({ children }: { children: ReactNode }): ReactNode {
  return children;
}
