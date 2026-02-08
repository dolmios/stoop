import type { JSX } from "react";

import { Button, Stack, Text } from "stoop-ui";

const NOT_FOUND_PADDING = "medium" as const;

export default function NotFound(): JSX.Element {
  return (
    <Stack
      as="main"
      bottom={NOT_FOUND_PADDING}
      css={{
        alignItems: "center",
        display: "flex",
        flex: 1,
        justifyContent: "center",
        minHeight: "90vh",
        mobile: {
          paddingLeft: "$small",
          paddingRight: "$small",
        },
      }}
      direction="column"
      gap="large"
      left="medium"
      right="medium"
      top={NOT_FOUND_PADDING}>
      <Stack
        align="center"
        css={{
          maxWidth: "600px",
          textAlign: "center",
        }}
        direction="column"
        gap="medium">
        <Text>
          <b>404</b>, The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </Text>
      </Stack>

      <Stack
        align="center"
        css={{
          marginTop: "$medium",
        }}
        direction="row"
        gap="small"
        justify="center"
        wrap>
        <Button as="a" href="/" size="small">
          {"\u273A"} Go home
        </Button>
      </Stack>
    </Stack>
  );
}
