import { Container, Title, Text, Card, Button, Stack, Group, Flex } from '@mantine/core';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';

type GuideCardProps = {
    title: string;
    description: string;
    href: string;
};

function GuideCard({ title, description, href }: GuideCardProps) {
    return (
        <Card padding="lg" radius="md" style={{ minWidth: 320, flex: '1 1 320px', maxWidth: 400 }}>
            <Group justify="space-between" align="center">
                <div>
                    <Title order={2} size="h3" mb={4}>{title}</Title>
                    <Text c="dark.8">{description}</Text>
                </div>
                <Flex flex={1} justify="flex-end" align="center">
                    <Button component={Link} href={href} size="sm" radius="sm" variant="light">
                        Read more
                    </Button>
                </Flex>
            </Group>
        </Card>
    );
}

export default function Guides() {
    return (
        <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)' }}>
            <Container py="xl">
                <Navbar />
                <Title order={1} mb="lg">Guides</Title>
                <Text c="dark.9" mb="md">
                    Pre-made, activity-specific guides to help you plan your next adventure. We're starting with a few popular ones, but more will be added soon!
                </Text>
                <Stack gap="lg" mt="xl">
                    <Group gap="lg" wrap="wrap">
                        <GuideCard
                            title="Backpacking UK"
                            description="Explore the best backpacking routes in the UK with detailed maps and essential information."
                            href="/backpacking-uk"
                        />
                    </Group>
                </Stack>
            </Container>
        </main>
    );
}

