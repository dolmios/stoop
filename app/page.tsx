"use client";

import { JSX } from "react";

import { useTheme } from "../src/context/ThemeContext";

export default function Home(): JSX.Element {
  const { mode, toggleTheme } = useTheme();

  return (
    <main>
      <h1>Theme Playground</h1>
      <p>Current theme: {mode}</p>
      <button type="button" onClick={toggleTheme}>
        Toggle Theme
      </button>
    </main>
  );
}
