/**
 * Main factory function that creates a Stoop instance.
 * Configures theme, media queries, utilities, and returns all API functions.
 */
import type { StoopConfig, StoopInstance, Theme } from "./types";
export declare function createStoop<TTheme extends Theme = Theme>(config: StoopConfig<TTheme>): StoopInstance<TTheme>;
