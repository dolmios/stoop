import { type JSX } from "react";
import { Stack, Modal, Button, Text } from "stoop-ui";

export default function ModalDemo(): JSX.Element {
  return (
    <Stack gap="large">
      <Text variant="h1">Modal</Text>
      <Stack direction="row" gap="medium">
        <Modal title="Dialog Modal" trigger={<Button>Open Dialog</Button>}>
          <Text>This is a dialog modal.</Text>
        </Modal>
        <Modal mode="drawer" title="Drawer Modal" trigger={<Button>Open Drawer</Button>}>
          <Text>This is a drawer modal.</Text>
        </Modal>
      </Stack>
    </Stack>
  );
}
