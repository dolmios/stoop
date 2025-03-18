export interface Theme {
  colors: {
    text: string;
    background: string;
    border: string;
    primary: string;
    muted: string;
  };
  space: {
    smallest: string;
    smaller: string;
    small: string;
    medium: string;
    large: string;
    larger: string;
    largest: string;
  };
  radii: {
    small: string;
    large: string;
    round: string;
  };
  shadows: {
    default: string;
  };
  breakpoints: {
    phone: string;
    tablet: string;
    desktop: string;
  };
}
