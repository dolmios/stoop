"use client";

import type { ReactElement } from "react";

import { usePathname, useRouter } from "next/navigation";
import { Stack, Tabs } from "stoop-ui";

import { mainNavTabs } from "../../lib/navigation";

/**
 * Navigation component that renders the main navigation tabs.
 *
 * @returns Navigation element
 */
export function Navigation(): ReactElement {
  const pathname = usePathname();
  const router = useRouter();

  // Find the active tab based on current pathname
  const activeTab = mainNavTabs.find(
    (tab) => pathname === tab.value || pathname.startsWith(tab.value),
  );
  const activeValue = activeTab?.value;

  const handleTabChange = (value: string): void => {
    // Navigate using Next.js router
    router.push(value);
  };

  return (
    <Stack
      as="nav"
      css={{
        backgroundColor: "$background",
        left: 0,
        position: "sticky",
        right: 0,
        top: 0,
        zIndex: "99",
      }}>
      <Tabs items={mainNavTabs} value={activeValue} onTabChange={handleTabChange} />
    </Stack>
  );
}
