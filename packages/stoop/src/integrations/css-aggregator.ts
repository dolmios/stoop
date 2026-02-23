interface CSSEntry {
  css: string;
  priority: number;
  global: boolean;
}

/**
 * Aggregates CSS metadata from compiled modules into a single stylesheet.
 * Handles deduplication, priority-based ordering, and incremental updates.
 */
export class CSSAggregator {
  private registry = new Map<string, CSSEntry>();
  private fileMap = new Map<string, Set<string>>();

  /**
   * Add CSS metadata entries from a compiled file.
   * Each entry is { c: className, s: cssRule, p: priority, g?: global }.
   */
  addRules(
    filePath: string,
    metadata: Array<{
      c: string;
      s: string;
      p: number;
      g?: boolean;
    }>,
  ): void {
    const keys = new Set<string>();

    for (const entry of metadata) {
      const key = entry.g ? `global:${entry.s}` : entry.c;

      keys.add(key);

      if (!this.registry.has(key)) {
        this.registry.set(key, {
          css: entry.s,
          global: entry.g ?? false,
          priority: entry.p,
        });
      }
    }

    this.fileMap.set(filePath, keys);
  }

  /**
   * Remove all CSS entries associated with a file (for incremental rebuilds).
   */
  removeFile(filePath: string): void {
    const keys = this.fileMap.get(filePath);

    if (!keys) return;

    for (const key of keys) {
      // Only remove if no other file references this key
      let referencedElsewhere = false;

      for (const [otherFile, otherKeys] of this.fileMap) {
        if (otherFile !== filePath && otherKeys.has(key)) {
          referencedElsewhere = true;
          break;
        }
      }
      if (!referencedElsewhere) {
        this.registry.delete(key);
      }
    }

    this.fileMap.delete(filePath);
  }

  /**
   * Generate the final CSS output.
   * Sorted by priority (ascending) then alphabetically for determinism.
   */
  flush(): string {
    const entries = Array.from(this.registry.values());

    entries.sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority;

      return a.css.localeCompare(b.css);
    });

    return entries
      .map((e) => e.css)
      .filter((rule) => {
        // Filter out malformed rules (e.g. empty nested selectors from compiler bugs)
        // A valid rule must have at least one property:value pair inside braces
        const inner = /\{([^}]*)\}/.exec(rule)?.[1]?.trim();

        if (!inner) return false;
        // Check it's not just a nested selector with no properties (e.g. "&:focus-visible:")
        if (/^&[^{]*:$/.test(inner)) return false;

        return true;
      })
      .join("\n");
  }

  /**
   * Returns true if no entries have been registered.
   */
  isEmpty(): boolean {
    return this.registry.size === 0;
  }
}
