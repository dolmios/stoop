"use client";

import { useCallback, useState, type JSX } from "react";

import { styled } from "../../stoop.theme";

const TabsStyled = styled("div", {
  "&::-webkit-scrollbar": {
    display: "none",
  },
  backgroundColor: "$background",
  borderBottom: "1px solid $border",
  display: "flex",
  flexWrap: "nowrap",
  gap: 0,
  minWidth: 0,
  overflowX: "auto",
  padding: 0,
  scrollbarWidth: "none",
  width: "100%",
});

const TabsTabStyled = styled("button", {
  "&:active": {
    transform: "none",
  },
  "&:disabled": {
    cursor: "not-allowed",
    opacity: "$disabled",
  },
  "&:focus-visible": {
    outline: "2px solid $text",
    outlineOffset: "2px",
  },
  "&:hover:not(:disabled)": {
    backgroundColor: "$hover",
  },
  alignItems: "center",
  backgroundColor: "transparent",
  border: "none",
  borderBottom: "2px solid transparent",
  borderLeft: "none",
  borderRadius: 0,
  borderRight: "1px solid $border",
  borderTop: "none",
  boxShadow: "none",
  color: "$text",
  cursor: "pointer",
  display: "inline-flex",
  flexShrink: 0,
  fontFamily: "$body",
  fontSize: "$small",
  fontWeight: "$default",
  justifyContent: "center",
  mobile: {
    fontSize: "13px",
    padding: "$smaller $small",
  },
  opacity: "0.7",
  padding: "$small $medium",
  position: "relative",
  transition: "$default",
  userSelect: "none",
  variants: {
    active: {
      false: {},
      true: {
        "&:hover:not(:disabled)": {
          backgroundColor: "$hover",
        },
        backgroundColor: "$hover",
        borderBottomColor: "$text",
        color: "$text",
        fontWeight: "$bold",
        opacity: "1",
      },
    },
  },
  whiteSpace: "nowrap",
});

export type TabItem = {
  readonly value: string;
  readonly label: string;
};

export interface TabsProps {
  defaultValue?: string;
  items: TabItem[];
  onTabChange?: (value: string) => void;
  value?: string;
}

export const Tabs = ({ defaultValue, items, onTabChange, value: controlledValue }: TabsProps): JSX.Element => {
  const [internalValue, setInternalValue] = useState(defaultValue || items[0]?.value);

  // Use controlled value if provided, otherwise use internal state
  const value = controlledValue ?? internalValue;

  const handleTabClick = useCallback(
    (item: TabItem): void => {
      // Update internal state if not controlled
      if (!controlledValue) {
        setInternalValue(item.value);
      }

      // Call callback
      onTabChange?.(item.value);
    },
    [controlledValue, onTabChange],
  );

  return (
    <TabsStyled>
      {items.map((item) => (
        <TabsTabStyled
          key={item.value}
          active={value === item.value}
          onClick={(): void => handleTabClick(item)}>
          {item.label}
        </TabsTabStyled>
      ))}
    </TabsStyled>
  );
};
