"use client";

import type { ComponentProps, JSX } from "react";

import { styled } from "stoop";

const TextStyled = styled("p", {
  "&:last-child": {
    marginBottom: 0,
  },
  color: "$text",
  fontFamily: "$body",
  fontSize: "$default",
  fontWeight: "$default",
  lineHeight: 1.4,
  margin: 0,
  marginBlock: 0,
  marginBottom: "$medium",
  variants: {
    bottom: {
      none: {
        marginBottom: 0,
      },
    },
    variant: {
      h1: {
        "&:first-child": {
          marginTop: 0,
        },
        fontFamily: "$heading",
        fontSize: "$h1",
        fontWeight: "$bold",
        lineHeight: 1.2,
        marginBlock: 0,
        marginBottom: "$large",
        marginTop: "$larger",
      },
      h2: {
        fontFamily: "$heading",
        fontSize: "$h2",
        fontWeight: "$bold",
        lineHeight: 1.2,
        marginBlock: 0,
        marginBottom: "$medium",
        marginTop: "$large",
      },
      h3: {
        fontFamily: "$heading",
        fontSize: "$h3",
        fontWeight: "$bold",
        lineHeight: 1.2,
        marginBlock: 0,
        marginBottom: "$medium",
        marginTop: "$large",
      },
      h4: {
        fontFamily: "$heading",
        fontSize: "$h4",
        fontWeight: "$bold",
        lineHeight: 1.2,
        marginBlock: 0,
        marginBottom: "$small",
        marginTop: "$medium",
      },
      h5: {
        fontFamily: "$heading",
        fontSize: "$h5",
        fontWeight: "$bold",
        lineHeight: 1.2,
        marginBlock: 0,
        marginBottom: "$small",
        marginTop: "$medium",
      },
      h6: {
        fontFamily: "$heading",
        fontSize: "$h6",
        fontWeight: "$bold",
        lineHeight: 1.2,
        marginBlock: 0,
        marginBottom: "$small",
        marginTop: "$medium",
      },
      small: {
        fontSize: "$small",
      },
      strong: {
        fontWeight: "$bold",
      },
    },
  },
});

export interface TextProps extends Omit<ComponentProps<typeof TextStyled>, "as" | "variant"> {
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  as?: ComponentProps<typeof TextStyled>["variant"] | "ul" | "ol" | "li" | (string & {});
  variant?: ComponentProps<typeof TextStyled>["variant"];
}

export const Text = (props: TextProps): JSX.Element => {
  const { as, variant, ...rest } = props;

  const effectiveVariant =
    as && ["h1", "h2", "h3", "h4", "h5", "h6", "small", "strong"].includes(as) ? as : variant;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <TextStyled as={as as any} variant={effectiveVariant} {...rest} />;
};
