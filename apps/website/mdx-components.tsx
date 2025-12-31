import type { MDXComponents } from "mdx/types";

import {
  MDXCode,
  MDXHeading1,
  MDXHeading2,
  MDXHeading3,
  MDXHeading4,
  MDXLink,
  MDXParagraph,
  MDXTable,
  MDXTableBody,
  MDXTableCell,
  MDXTableHead,
  MDXTableHeader,
  MDXTableRow,
} from "./components/MDXClientComponents";

const components: MDXComponents = {
  a: MDXLink,
  code: MDXCode,
  h1: MDXHeading1,
  h2: MDXHeading2,
  h3: MDXHeading3,
  h4: MDXHeading4,
  p: MDXParagraph,
  table: MDXTable,
  tbody: MDXTableBody,
  td: MDXTableCell,
  th: MDXTableHeader,
  thead: MDXTableHead,
  tr: MDXTableRow,
};

export function useMDXComponents(componentsOverride: MDXComponents = {}): MDXComponents {
  return { ...components, ...componentsOverride };
}

export default components;
