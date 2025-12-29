"use client";

import type { ComponentProps } from "react";

import { styled } from "../stoop.theme";

export const Table = styled("table", {
  border: "1px solid $border",
  borderCollapse: "collapse",
  width: "100%",
});

export const TableHead = styled("thead", {
  backgroundColor: "$hover",
});

export const TableBody = styled("tbody", {});

export const TableRow = styled("tr", {
  "&:last-child": {
    borderBottom: "none",
  },
  borderBottom: "1px solid $border",
});

export const TableHeader = styled("th", {
  "&:last-child": {
    borderRight: "none",
  },
  borderBottom: "1px solid $border",
  borderRight: "1px solid $border",
  padding: "$small $medium",
  textAlign: "left",
});

export const TableCell = styled("td", {
  "&:last-child": {
    borderRight: "none",
  },
  borderBottom: "1px solid $border",
  borderRight: "1px solid $border",
  padding: "$small $medium",
});

export type TableProps = ComponentProps<typeof Table>;
export type TableHeadProps = ComponentProps<typeof TableHead>;
export type TableBodyProps = ComponentProps<typeof TableBody>;
export type TableRowProps = ComponentProps<typeof TableRow>;
export type TableHeaderProps = ComponentProps<typeof TableHeader>;
export type TableCellProps = ComponentProps<typeof TableCell>;
