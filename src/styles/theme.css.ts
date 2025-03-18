import { createGlobalTheme } from '@vanilla-extract/css';

// Base theme tokens
export const theme = createGlobalTheme(':root', {
  breakpoints: {
    desktop: '1440px',
    phone: '800px',
    tablet: '1024px',
  },
  colors: {
    background: '#FFFFFF',
    border: 'rgba(0, 0, 0, 0.5)',
    text: '#000000',
  },
  radii: {
    large: '0.5rem',
    round: '9999px',
    small: '0.25rem',
  },
  shadows: {
    default: '0 0 0 1px rgba(0, 0, 0, 0.1)',
  },
  space: {
    large: '1.5rem',
    larger: '2rem',
    largest: '10rem',
    medium: '1rem',
    small: '0.75rem',
    smaller: '0.5rem',
    smallest: '0.25rem',
  },
});

// Night theme overrides
export const nightTheme = createGlobalTheme('[data-theme="dark"]', {
  breakpoints: theme.breakpoints,
  colors: {
    background: '#212121',
    border: 'rgba(255, 255, 255, 0.5)',
    text: '#FFFFFF',
  },
  radii: theme.radii,
  shadows: theme.shadows,
  space: theme.space,
}); 