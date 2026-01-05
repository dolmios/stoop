import type { MDXComponents } from "mdx/types";

import {
  Code,
  HeadingOne,
  HeadingTwo,
  HeadingThree,
  HeadingFour,
  Link,
  Paragraph,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./app/components/Markdown";

const components: MDXComponents = {
  a: Link,
  code: Code,
  h1: HeadingOne,
  h2: HeadingTwo,
  h3: HeadingThree,
  h4: HeadingFour,
  p: Paragraph,
  table: Table,
  tbody: TableBody,
  td: TableCell,
  th: TableHeader,
  thead: TableHead,
  tr: TableRow,
};

export function useMDXComponents(componentsOverride: MDXComponents = {}): MDXComponents {
  return { ...components, ...componentsOverride };
}

export default components;
