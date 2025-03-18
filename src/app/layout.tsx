import { ReactNode, JSX } from 'react';

import { ThemeProvider } from '../context/Theme';
import '../styles/global.css';

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
} 