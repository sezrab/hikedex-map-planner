'use client';

import { Anchor, Button, Group, Title, Burger, Drawer, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Image from 'next/image';

export default function Navbar({ page }: { page?: string }) {
    const [drawerOpened, { open, close }] = useDisclosure(false);

    const navLinks = (
        <>
            <Button component="a" href="/map" variant="subtle" color="indigo" radius="sm">
                map
            </Button>
            <Button component="a" href="/about" variant="subtle" color={page === 'about' ? 'indigo.3' : 'indigo'} radius="sm" >
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
        </>
    );

    return (
        <>
            <Group mb='lg' display={{ base: 'none', xs: 'flex' }} justify="space-between" align="center" style={{ flexWrap: 'wrap' }}>
                <Anchor href="/" >
                    <Group gap='md' align="center" style={{ textDecoration: 'none', color: 'inherit', alignItems: 'center' }}>
                        <Image
                            src="/logo.svg"
                            alt="Hikedex Logo"
                            height={40}
                            width={40}
                            style={{ marginTop: 5 }}
                        />
                        <Title order={3} c="indigo.8">
                            hikedex
                        </Title>
                    </Group>
                </Anchor>
                <Group>
                    {navLinks}
                </Group>

            </Group>


            <Burger opened={drawerOpened} onClick={open} aria-label="Open navigation" color="indigo.9" display={{ base: 'block', xs: 'none' }} mb="lg" />
            <Drawer opened={drawerOpened} onClose={close} title="Menu" padding="md" size="xs">
                <Stack gap="sm" style={{ width: '100%' }}>
                    <Button
                        component="a"
                        href="/"
                        onClick={close}
                        variant="subtle"
                    >
                        home
                    </Button>
                    {navLinks}
                </Stack>
            </Drawer>


        </>

    );
}