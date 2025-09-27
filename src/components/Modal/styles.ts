import { styled } from "../../styles";

export const ModalTriggerStyled = styled(
  "div",
  {
    cursor: "pointer",
    display: "inline-block",
  },
  {
    disabled: {
      true: {
        cursor: "not-allowed",
        opacity: 0.6,
      },
    },
  },
);

export const ModalBackdropStyled = styled("div", {
  backdropFilter: "blur(2px)",
  backgroundColor: "$overlay",
  bottom: 0,
  left: 0,
  position: "fixed",
  right: 0,
  top: 0,
  zIndex: 1000,
});

export const ModalStyled = styled(
  "div",
  {
    // Focus management
    "&:focus": {
      outline: `1px solid $brand`,
      outlineOffset: "2px",
    },
    // Mobile responsive
    "@media (max-width: 768px)": {
      maxHeight: "90vh",
      width: "95%",
    },
    backgroundColor: "$fill",
    borderRadius: "$small",
    color: "$text",
    display: "flex",
    flexDirection: "column",
    left: "50%",
    maxHeight: "80vh",
    maxWidth: "600px", // Default max-width like old implementation
    opacity: 0,
    outline: "none",
    overflow: "hidden", // Let content area handle scroll
    position: "fixed",
    top: "50%",
    transform: "translate(-50%, -50%) translateY(20px) scale(0.95)",
    transition: "$default",

    width: "90%", // Default width like old implementation
  },
  {
    isOpen: {
      true: {
        opacity: 1,
        transform: "translate(-50%, -50%) translateY(0) scale(1)",
      },
    },
    small: {
      true: {
        maxWidth: "280px",
      },
    },
    variant: {
      bordered: {
        backgroundColor: "$fill",
        border: `1px solid $border`,
      },
      default: {
        backgroundColor: "$fill",
        border: "none",
      },
    },
  },
);

export const ModalHeaderStyled = styled("div", {
  alignItems: "center",
  display: "flex",
  flexShrink: 0,
  justifyContent: "space-between",
  padding: "$small $medium $small $medium",
});

export const ModalTitleStyled = styled("h2", {
  color: "$text",
  fontSize: "1.25rem",
  fontWeight: "600",
  margin: 0,
});

export const ModalCloseButtonStyled = styled("button", {
  "&:focus": {
    outline: `1px solid $brand`,
    outlineOffset: "2px",
  },
  "&:hover": {
    backgroundColor: "$hover",
  },
  background: "none",
  border: "none",
  color: "$text",
  cursor: "pointer",

  fontSize: "1.5rem",

  padding: "$smaller",
});

export const ModalContentStyled = styled("div", {
  // Content area - scrollable and padded
  flex: 1,
  overflow: "auto",
  padding: "$large",
  paddingTop: "$medium",
});

export const ModalFooterStyled = styled("div", {
  display: "flex",
  gap: "$small",
  justifyContent: "flex-end",
  marginTop: "$medium",
  paddingTop: "$small",
});
