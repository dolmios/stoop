"use client";

import type { ComponentProps, JSX } from "react";

import { styled } from "../../stoop.theme";

const TableStyled = styled("table", {
  border: "1px solid $border",
  borderCollapse: "collapse",
  width: "100%",
});

const TableHeadStyled = styled("thead", {
  backgroundColor: "$hover",
});

const TableBodyStyled = styled("tbody", {});

const TableRowStyled = styled("tr", {
  "&:last-child": {
    borderBottom: "none",
  },
  borderBottom: "1px solid $border",
});

const TableHeaderStyled = styled("th", {
  "&:last-child": {
    borderRight: "none",
  },
  borderBottom: "1px solid $border",
  borderRight: "1px solid $border",
  padding: "$small $medium",
  textAlign: "left",
});

const TableCellStyled = styled("td", {
  "&:last-child": {
    borderRight: "none",
  },
  borderBottom: "1px solid $border",
  borderRight: "1px solid $border",
  padding: "$small $medium",
});

export type TableProps = ComponentProps<typeof TableStyled>;
export type TableHeadProps = ComponentProps<typeof TableHeadStyled>;
export type TableBodyProps = ComponentProps<typeof TableBodyStyled>;
export type TableRowProps = ComponentProps<typeof TableRowStyled>;
export type TableHeaderProps = ComponentProps<typeof TableHeaderStyled>;
export type TableCellProps = ComponentProps<typeof TableCellStyled>;

export const Table = (props: TableProps): JSX.Element => <TableStyled {...props} />;
export const TableHead = (props: TableHeadProps): JSX.Element => <TableHeadStyled {...props} />;
export const TableBody = (props: TableBodyProps): JSX.Element => <TableBodyStyled {...props} />;
export const TableRow = (props: TableRowProps): JSX.Element => <TableRowStyled {...props} />;
export const TableHeader = (props: TableHeaderProps): JSX.Element => (
  <TableHeaderStyled {...props} />
);
export const TableCell = (props: TableCellProps): JSX.Element => <TableCellStyled {...props} />;
