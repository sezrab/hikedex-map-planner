import { Anchor, Button, Group, Title } from '@mantine/core';

export default function Navbar({ page }: { page?: string }) {
    return (
        <Group mb='lg' align="center" style={{ flexWrap: 'wrap' }}>
            <Anchor
                href="/"
                style={{ textDecoration: 'none', flex: 1 }}>
                <Title order={3} c="indigo.9" display={{ base: 'none', xs: 'block' }}>
                    hikedex
                </Title>
            </Anchor>
            <Button component="a" href="/map" variant="subtle" color="indigo" radius="sm">
                map
            </Button>
            <Button component="a" href="/about" variant="subtle" color={page === 'about' ? 'indigo.3' : 'indigo'} radius="sm">
                about
            </Button>
            <Button
                component="a"
                href="/sunrise-radar"
                variant="subtle"
                color={page === 'sunrise-radar' ? 'indigo.3' : 'indigo'}
                radius="sm"
            >
                sunrise radar
            </Button>
        </Group>
    );
}