import { globalStyle } from '@vanilla-extract/css';

import { theme, nightTheme } from './theme.css';

// Global reset and base styles
globalStyle('*', {
  boxSizing: 'border-box',
  margin: 0,
  padding: 0,
});

globalStyle('html', {
  backgroundColor: theme.colors.background,
  color: theme.colors.text,
  fontSize: '62.5%', // 1rem = 10px
  scrollBehavior: 'smooth',
  textSizeAdjust: '100%',
  WebkitTextSizeAdjust: '100%',
});

globalStyle('body', {
  backgroundColor: 'inherit',
  color: 'inherit',
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontSize: '1.6rem', // 16px
  lineHeight: 1.5,
});

globalStyle('[data-theme="dark"] body', {
  backgroundColor: nightTheme.colors.background,
  color: nightTheme.colors.text,
});
