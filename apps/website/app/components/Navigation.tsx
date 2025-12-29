"use client";

import type { ReactElement } from "react";

import { mainNavTabs } from "../../lib/navigation";
import { Tabs } from "../../ui/Tabs";

/**
 * Navigation component that renders the main navigation tabs.
 *
 * @returns Navigation element
 */
export function Navigation(): ReactElement {
  return <Tabs items={mainNavTabs} />;
}
