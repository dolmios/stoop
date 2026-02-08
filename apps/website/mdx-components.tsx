import type { MDXComponents } from "mdx/types";

import { Icon } from "./app/components/Icon";
import {
  Code,
  HeadingOne,
  HeadingTwo,
  HeadingThree,
  HeadingFour,
  Link,
  ListItem,
  OrderedList,
  Paragraph,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  UnorderedList,
} from "./app/components/Markdown";

const components: MDXComponents = {
  a: Link,
  code: Code,
  h1: HeadingOne,
  h2: HeadingTwo,
  h3: HeadingThree,
  h4: HeadingFour,
  Icon,
  li: ListItem,
  ol: OrderedList,
  p: Paragraph,
  table: Table,
  tbody: TableBody,
  td: TableCell,
  th: TableHeader,
  thead: TableHead,
  tr: TableRow,
  ul: UnorderedList,
};

export function useMDXComponents(componentsOverride: MDXComponents = {}): MDXComponents {
  return { ...components, ...componentsOverride };
}

export default components;
