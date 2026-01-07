import { type JSX } from "react";
import { Stack, Modal, Button, Text } from "stoop-ui";

export default function ModalDemo(): JSX.Element {
  return (
    <Stack gap="large">
      <Text variant="h1">Modal</Text>
      <Stack gap="medium">
        <Text variant="h3">Dialog Modal</Text>
        <Stack direction="row" gap="medium" wrap>
          <Modal title="Dialog Modal" trigger={<Button>Open Dialog</Button>}>
            <Text>This is a dialog modal with a title.</Text>
          </Modal>
          <Modal small title="Small Dialog" trigger={<Button>Small Dialog</Button>}>
            <Text>This is a small dialog modal.</Text>
          </Modal>
        </Stack>
      </Stack>
      <Stack gap="medium">
        <Text variant="h3">Drawer Modal</Text>
        <Modal mode="drawer" title="Drawer Modal" trigger={<Button>Open Drawer</Button>}>
          <Text>This is a drawer modal that slides in from the right.</Text>
        </Modal>
      </Stack>
      <Stack gap="medium">
        <Text variant="h3">Modal with Footer</Text>
        <Modal
          footer={
            <Stack direction="row" gap="small" style={{ justifyContent: "flex-end" }}>
              <Button variant="minimal">Cancel</Button>
              <Button variant="primary">Confirm</Button>
            </Stack>
          }
          title="Modal with Footer"
          trigger={<Button>Modal with Footer</Button>}>
          <Text>This modal has a custom footer with action buttons.</Text>
        </Modal>
      </Stack>
    </Stack>
  );
}
