import { styled } from "stoop-swc/runtime";

export const Button = styled(
  "button",
  {
    "&:hover": {
      backgroundColor: "$secondary",
    },
    backgroundColor: "$primary",
    border: "none",
    borderRadius: "4px",
    color: "white",
    cursor: "pointer",

    padding: "$md",
  },
  {
    size: {
      lg: { fontSize: "$lg", padding: "$lg" },
      md: { fontSize: "$md", padding: "$md" },
      sm: { fontSize: "$sm", padding: "$sm" },
    },
  },
);
