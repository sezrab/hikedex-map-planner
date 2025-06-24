'use client';
import { Modal, Button, Text, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconHandStop } from '@tabler/icons-react';

export default function WelcomePopup() {
    const [opened, { close }] = useDisclosure(true);

    return (
        <Modal
            opened={opened}
            onClose={close}
            title={
                <Group align="end" gap="sm">
                    <span style={{ fontSize: '30px' }}>👋</span>
                    <Text size="lg" fw="bold" >
                        Welcome!
                    </Text>
                </ Group>
            }
            centered
            withCloseButton
            size="md"
        >
            <Text mb="md" c='gray.9' size="md">
                Focus the map on an area of interest, then add relevant layers to explore transport, food, water, toilets, parking, and more.
            </Text>
            <Button onClick={() => {
                close();
                // Open the drawer. The button to open the drawer has id "settings-drawer-button"
                const drawerButton = document.getElementById('settings-drawer-button');
                if (drawerButton) {
                    drawerButton.click();
                }
            }} fullWidth>
                Let&apos;s get started
            </Button>
        </Modal>
    );
}