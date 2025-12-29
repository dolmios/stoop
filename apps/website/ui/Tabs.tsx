"use client";

import type { ReactNode } from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { styled } from "../stoop.theme";
import { Button } from "./Button";

const TabsContainer = styled("nav", {
  "&::-webkit-scrollbar": {
    display: "none",
  },
  backgroundColor: "$background",
  borderBottom: "1px solid $border",
  display: "flex",
  flexWrap: "nowrap",
  gap: 0,
  overflowX: "auto",
  padding: 0,
  position: "sticky",
  scrollbarWidth: "none",
  top: "48px",
  width: "100%",
  zIndex: "50",
});

const TabButton = styled(Button, {
  "&:hover": {
    backgroundColor: "$hover",
  },
  backgroundColor: "transparent",
  border: "none",
  borderBottom: "2px solid transparent",
  borderRadius: 0,
  borderRight: "1px solid $border",
  color: "$text",
  flexShrink: 0,
  fontSize: "$small",
  fontWeight: "$default",
  mobile: {
    fontSize: "13px",
    padding: "$smaller $small",
  },
  opacity: "0.7",
  padding: "$small $medium",
  variants: {
    active: {
      false: {},
      true: {
        "&:hover": {
          backgroundColor: "$hover",
        },
        backgroundColor: "$hover",
        borderBottomColor: "$text",
        color: "$text",
        opacity: "1",
      },
    },
  },
  whiteSpace: "nowrap",
});

export interface TabItem {
  id: string;
  label: string;
  href: string;
}

export interface TabsProps {
  items: TabItem[];
}

export function Tabs({ items }: TabsProps): ReactNode {
  const pathname = usePathname();

  return (
    <TabsContainer>
      {items.map((item) => {
        const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");

        return (
          <TabButton key={item.id} active={isActive} as={Link} href={item.href} variant="minimal">
            {item.label}
          </TabButton>
        );
      })}
    </TabsContainer>
  );
}
