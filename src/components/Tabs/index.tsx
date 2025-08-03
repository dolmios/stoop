import { useState, type KeyboardEvent, type JSX } from "react";

import type { TabsProps } from "./types";

import { TabsStyled, TabListStyled, TabButtonStyled, TabPanelStyled } from "./styles";

/**
 * Tabs - Tab navigation component
 *
 * Sharp edges design with clean tab switching
 * Supports keyboard navigation and custom content
 *
 * Examples:
 * <Tabs items={[{label: 'Tab 1', content: <div>Content 1</div>}]} />
 * <Tabs items={tabs} defaultActive={1} variant="minimal" />
 */
export function Tabs({
  css,
  defaultActive = 0,
  items,
  onTabChange,
  variant = "default",
  ...props
}: TabsProps): JSX.Element {
  const [activeTab, setActiveTab] = useState(defaultActive);

  const handleTabClick = (index: number): void => {
    setActiveTab(index);
    onTabChange?.(index);
  };

  const handleKeyDown = (event: KeyboardEvent, index: number): void => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleTabClick(index);
    }
  };

  return (
    <TabsStyled css={css} {...props}>
      <TabListStyled role="tablist" variant={variant}>
        {items.map((item, index) => (
          <TabButtonStyled
            key={item.id || index}
            active={activeTab === index}
            aria-controls={`panel-${index}`}
            aria-selected={activeTab === index}
            disabled={item.disabled}
            id={`tab-${index}`}
            role="tab"
            tabIndex={activeTab === index ? 0 : -1}
            onClick={() => handleTabClick(index)}
            onKeyDown={(e) => handleKeyDown(e, index)}>
            {item.label}
          </TabButtonStyled>
        ))}
      </TabListStyled>

      {items.map((item, index) => (
        <TabPanelStyled
          key={`panel-${item.id || index}`}
          aria-labelledby={`tab-${index}`}
          hidden={activeTab !== index}
          id={`panel-${index}`}
          role="tabpanel"
          tabIndex={0}>
          {activeTab === index && item.content}
        </TabPanelStyled>
      ))}
    </TabsStyled>
  );
}
