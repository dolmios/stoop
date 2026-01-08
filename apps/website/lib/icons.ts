/**
 * Centralized icon imports from Phosphor Icons.
 * All icons used across the website should be imported here to ensure consistency.
 * This prevents using different icons for the same purpose in different places.
 *
 * Note: This file imports from @phosphor-icons/react which is a client-side library.
 * Components importing from this file should be marked with "use client".
 */

import {
  ArrowRight,
  ArrowClockwise,
  CheckCircle,
  Code,
  CodeBlock,
  Database,
  Download,
  FileCode,
  FileText,
  Gear,
  GithubLogo,
  Globe,
  HardDrives,
  Info,
  Lightning,
  Link as LinkIcon,
  Moon,
  Package,
  PaintBrush,
  Palette,
  Play,
  RocketLaunch,
  Sparkle,
  Stack,
  Sun,
  Terminal,
  Warning,
  Wrench,
  Book,
  // Add more icons as needed
} from "@phosphor-icons/react";

// Export all icons for use throughout the application
// Note: Layers is exported as Stack, Server is exported as HardDrives
export {
  ArrowRight,
  ArrowClockwise,
  Book,
  CheckCircle,
  Code,
  CodeBlock,
  Database,
  Download,
  FileCode,
  FileText,
  Gear,
  GithubLogo,
  Globe,
  HardDrives as Server,
  Info,
  Lightning,
  LinkIcon,
  Moon,
  Package,
  PaintBrush,
  Palette,
  Play,
  RocketLaunch,
  Sparkle,
  Stack as Layers,
  Sun,
  Terminal,
  Warning,
  Wrench,
};
