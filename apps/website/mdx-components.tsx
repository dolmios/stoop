import type { MDXComponents } from "mdx/types";
import type { ReactNode } from "react";

import {
  Code,
  Heading,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Text,
} from "./ui";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    code: ({
      children,
      className,
      ...props
    }: {
      children?: ReactNode;
      className?: string;
    }): ReactNode => {
      const isBlock = className?.includes("language-");

      return (
        <Code block={isBlock} {...props}>
          {children}
        </Code>
      );
    },
    h1: ({ children, id, ...props }) => (
      <Heading id={id} level={1} {...props}>
        {children}
      </Heading>
    ),
    h2: ({ children, id, ...props }) => (
      <Heading id={id} level={2} {...props}>
        {children}
      </Heading>
    ),
    h3: ({ children, id, ...props }) => (
      <Heading id={id} level={3} {...props}>
        {children}
      </Heading>
    ),
    h4: ({ children, id, ...props }) => (
      <Heading id={id} level={4} {...props}>
        {children}
      </Heading>
    ),
    p: ({ children, ...props }) => (
      <Text as="p" {...props}>
        {children}
      </Text>
    ),
    table: ({ children, ...props }) => <Table {...props}>{children}</Table>,
    tbody: ({ children, ...props }) => <TableBody {...props}>{children}</TableBody>,
    td: ({ children, ...props }) => <TableCell {...props}>{children}</TableCell>,
    th: ({ children, ...props }) => <TableHeader {...props}>{children}</TableHeader>,
    thead: ({ children, ...props }) => <TableHead {...props}>{children}</TableHead>,
    tr: ({ children, ...props }) => <TableRow {...props}>{children}</TableRow>,
    ...components,
  };
}
