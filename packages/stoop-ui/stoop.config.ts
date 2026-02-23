import { defineConfig } from "stoop";

import theme from "./src/theme.config";

export default defineConfig({
  ...theme,
  output: { dir: "dist" },
});
