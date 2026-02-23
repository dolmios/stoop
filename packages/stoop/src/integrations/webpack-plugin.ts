import { CSSAggregator } from "./css-aggregator.js";

interface Compiler {
  hooks: {
    thisCompilation: {
      tap: (name: string, cb: (compilation: Compilation) => void) => void;
    };
  };
}

interface Compilation {
  hooks: {
    processAssets: {
      tap: (
        options: { name: string; stage: number },
        cb: (assets: Record<string, unknown>) => void,
      ) => void;
    };
  };
  modules: Iterable<{
    resource?: string;
    _source?: { source: () => string };
  }>;
  emitAsset: (name: string, source: RawSource) => void;
}

class RawSource {
  private _value: string;
  constructor(value: string) {
    this._value = value;
  }
  source(): string {
    return this._value;
  }
  size(): number {
    return this._value.length;
  }
}

const STOOP_CSS_RE = /const __stoop_css__\s*=\s*'([^']*)'/;

/**
 * Webpack plugin that extracts __stoop_css__ metadata from compiled modules
 * and aggregates it into a single CSS file.
 *
 * **Known limitation:** The CSS asset is emitted via `compilation.emitAsset`,
 * which writes the file to the output directory but does NOT add it to the
 * chunk graph. This means plugins that traverse chunks (e.g., HtmlWebpackPlugin)
 * will not automatically discover or inject this CSS file.
 *
 * To include the generated CSS in your HTML, either:
 * 1. Manually add a `<link rel="stylesheet" href="/stoop/styles.css">` tag, or
 * 2. Use a separate webpack loader / plugin to inject the CSS reference, or
 * 3. Import the generated CSS file from your entry point after the build.
 *
 * The `outputPath` option controls where the file is emitted relative to the
 * webpack output directory (defaults to `"stoop/styles.css"`).
 */
export class StoopWebpackPlugin {
  private outputPath: string;
  private aggregator: CSSAggregator;

  constructor(options?: { outputPath?: string }) {
    this.outputPath = options?.outputPath ?? "stoop/styles.css";
    this.aggregator = new CSSAggregator();
  }

  apply(compiler: Compiler): void {
    compiler.hooks.thisCompilation.tap("StoopWebpackPlugin", (compilation) => {
      compilation.hooks.processAssets.tap(
        {
          name: "StoopWebpackPlugin",
          // PROCESS_ASSETS_STAGE_ADDITIONAL = 2000
          stage: 2000,
        },
        () => {
          for (const module of compilation.modules) {
            if (!module.resource || !module._source) continue;

            const source = module._source.source();
            const match = STOOP_CSS_RE.exec(source);

            if (!match) continue;

            try {
              const metadata = JSON.parse(match[1]);

              this.aggregator.addRules(module.resource, metadata);
            } catch {
              // Skip malformed metadata
            }
          }

          if (!this.aggregator.isEmpty()) {
            const css = this.aggregator.flush();

            compilation.emitAsset(this.outputPath, new RawSource(css));
          }
        },
      );
    });
  }
}
