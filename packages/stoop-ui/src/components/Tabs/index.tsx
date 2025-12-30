"use client";

import { useState, type ReactNode } from "react";

import { styled } from "../../stoop.theme";
import { Button as ButtonComponent } from "../Button";

const TabsContainer = styled("div", {
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
  scrollbarWidth: "none",
  width: "100%",
});

const TabButton = styled(ButtonComponent, {
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
  fontSize: "$small !important",
  fontWeight: "$default",
  mobile: {
    fontSize: "13px !important",
    padding: "$smaller $small",
  },
  opacity: "0.7",
  padding: "$small $medium",
  variants: {
    active: {
      false: {},
      true: {
        "&:hover": {
          backgroundColor: "$hover !important",
        },
        backgroundColor: "$hover !important",
        borderBottomColor: "$text",
        color: "$text",
        fontWeight: "$bold !important",
        opacity: "1",
      },
    },
  },
  whiteSpace: "nowrap",
});

export type TabItem = {
  value: string;
  label: string;
};

export type TabsProps = {
  defaultValue?: string;
  items: TabItem[];
  onTabChange?: (value: string) => void;
  value?: string;
};

export function Tabs({ defaultValue, items, onTabChange, value: controlledValue }: TabsProps): ReactNode {
  const [internalValue, setInternalValue] = useState(defaultValue || items[0]?.value);

  // Use controlled value if provided, otherwise use internal state
  const value = controlledValue ?? internalValue;

  const handleTabClick = (item: TabItem): void => {
    // Update internal state if not controlled
    if (!controlledValue) {
      setInternalValue(item.value);
    }

    // Call callback
    onTabChange?.(item.value);
  };

  return (
    <TabsContainer>
      {items.map((item) => (
        <TabButton
          key={item.value}
          active={value === item.value}
          variant="minimal"
          onClick={() => handleTabClick(item)}>
          {item.label}
        </TabButton>
      ))}
    </TabsContainer>
  );
}
