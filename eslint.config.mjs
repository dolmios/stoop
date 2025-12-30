import dolmios from "eslint-config-dolmios";

export default [
  ...dolmios,
  {
    rules: {
      "react-hooks/exhaustive-deps": "off",
      "react/no-danger": "off",
    },
  },
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/.next/**",
      "**/build/**",
      "**/*.d.ts",
      "scripts/**",
      "temp/**",
    ],
  },
];
