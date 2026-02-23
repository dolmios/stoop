"use client";

import { styled } from "stoop";

export const ProseHeading = styled("h1", {
  fontWeight: "$bold",
  lineHeight: 1.2,
  marginBottom: "$medium",
  marginTop: "$large",
});

export const ProseHeading2 = styled("h2", {
  fontWeight: "$bold",
  lineHeight: 1.2,
  marginBottom: "$medium",
  marginTop: "$large",
});

export const ProseHeading3 = styled("h3", {
  fontWeight: "$bold",
  lineHeight: 1.2,
  marginBottom: "$small",
  marginTop: "$medium",
});

export const ProseHeading4 = styled("h4", {
  fontWeight: "$bold",
  lineHeight: 1.2,
  marginBottom: "$small",
  marginTop: "$medium",
});

export const ProseHeadingWrapper2 = styled("h2", {
  alignItems: "center",
  display: "inline-flex",
  fontWeight: "$bold",
  gap: "$small",
  lineHeight: 1.2,
  marginBottom: "$medium",
  marginTop: "$large",
});

export const ProseHeadingWrapper3 = styled("h3", {
  alignItems: "center",
  display: "inline-flex",
  fontWeight: "$bold",
  gap: "$small",
  lineHeight: 1.2,
  marginBottom: "$small",
  marginTop: "$medium",
});

export const ProseLink = styled("a", {
  "&:hover": {
    borderBottomColor: "currentColor",
    opacity: "$hover",
  },
  borderBottom: "1px solid currentColor",
  color: "inherit",
  display: "inline",
  textDecoration: "none",
  transition: "$default",
});

export const ProseLinkWrapper = styled("span", {
  "& a": {
    "&:hover": {
      borderBottomColor: "currentColor",
      opacity: "$hover",
    },
    borderBottom: "1px solid currentColor",
    color: "inherit",
    textDecoration: "none",
    transition: "$default",
  },
  display: "inline",
});

export const ProseUnorderedList = styled("ul", {
  "&:last-child": {
    marginBottom: 0,
  },
  color: "$text",
  fontFamily: "$body",
  fontSize: "$default",
  fontWeight: "$default",
  lineHeight: 1.4,
  listStyle: "disc",
  margin: 0,
  marginBlock: 0,
  marginBottom: "$medium",
  marginTop: 0,
  paddingLeft: "$large",
});

export const ProseOrderedList = styled("ol", {
  "&:last-child": {
    marginBottom: 0,
  },
  color: "$text",
  fontFamily: "$body",
  fontSize: "$default",
  fontWeight: "$default",
  lineHeight: 1.4,
  listStyle: "decimal",
  margin: 0,
  marginBlock: 0,
  marginBottom: "$medium",
  marginTop: 0,
  paddingLeft: "$large",
});

export const ProseListItem = styled("li", {
  marginBottom: "$small",
  marginTop: 0,
});

export const ProseTableWrapper = styled("div", {
  marginBottom: "$medium",
  marginTop: "$medium",
  maxWidth: "100vw",
  overflowX: "auto",
  width: "100%",
});
