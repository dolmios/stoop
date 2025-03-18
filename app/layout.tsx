import { JSX, ReactNode } from "react";

import { ThemeProvider } from "../src/context/ThemeContext";

export default function RootLayout({ children }: { children: ReactNode }): JSX.Element {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
