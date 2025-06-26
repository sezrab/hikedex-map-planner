import { Container, Title, Text, Card, Button, Stack, Group, Flex } from '@mantine/core';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import { backpackingPages } from './backpackingPages';

export default function BackpackingIndexPage() {
    return (
        <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)' }}>
            <Container py="xl">
                <Navbar />
                <Title order={1} mb="lg">Backpacking Maps</Title>
                <Text c="dark.9" mb="md">
                    Explore our collection of pre-made backpacking maps. Essential information like water sources, food resupply points, and public toilets, all on one printable or offline map. Perfect for planning your next adventure!
                </Text>
                <Stack gap="lg" mt="xl">
                    <Group gap="lg" wrap="wrap">
                        {Object.entries(backpackingPages).map(([slug, page]) => (
                            <Card key={slug} padding="lg" radius="md" style={{ minWidth: 320, flex: '1 1 320px', maxWidth: 400 }}>
                                <Group justify="space-between" align="center">
                                    <div>
                                        <Title order={2} size="h3" mb={4}>{page.title}</Title>
                                        <Text c="dark.8">{page.description}</Text>
                                    </div>
                                    <Flex flex={1} justify="flex-end" align="center">
                                        <Button component={Link} href={`/backpacking/${slug}`} size="sm" radius="sm" variant="light">
                                            Read more
                                        </Button>
                                    </Flex>
                                </Group>
                            </Card>
                        ))}
                    </Group>
                </Stack>
            </Container>
        </main>
    );
}
