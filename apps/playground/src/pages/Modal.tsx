import { useState, type JSX } from "react";
import { Stack, Modal, Button, Text } from "stoop-ui";

export default function ModalDemo(): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <Stack gap="large">
      <Text variant="h1">Modal</Text>
      <Stack direction="row" gap="medium">
        <Modal
          isOpen={isOpen}
          title="Dialog Modal"
          trigger={<Button onClick={() => setIsOpen(true)}>Open Dialog</Button>}
          onClose={() => setIsOpen(false)}>
          <Text>This is a dialog modal.</Text>
        </Modal>
        <Modal
          isOpen={isDrawerOpen}
          mode="drawer"
          title="Drawer Modal"
          trigger={<Button onClick={() => setIsDrawerOpen(true)}>Open Drawer</Button>}
          onClose={() => setIsDrawerOpen(false)}>
          <Text>This is a drawer modal.</Text>
        </Modal>
      </Stack>
    </Stack>
  );
}
