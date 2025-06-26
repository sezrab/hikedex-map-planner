import { Container, Title, Text, Card, Button, Stack, Group, Flex } from '@mantine/core';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import { guidesConfig } from '@/app/guides/guidesConfig';
import { notFound } from 'next/navigation';

interface GuideIndexPageProps {
    params: { collection: string };
}

export default async function GuideIndexPage({ params }: GuideIndexPageProps) {
    const awaitedParams = await params;
    const { collection } = awaitedParams;
    const guide = guidesConfig[collection];
    if (!guide) return notFound();
    return (
        <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)' }}>
            <Container py="xl">
                <Navbar />
                <Title order={1} mb="lg">{guide.guideTitle}</Title>
                <Text c="dark.9" mb="md">
                    {guide.guideDescription}
                </Text>
                <Stack gap="lg" mt="xl">
                    <Group gap="lg" wrap="wrap">
                        {Object.entries(guide.pages).map(([slug, page]) => (
                            <Card key={slug} padding="lg" radius="md" style={{ minWidth: 320, flex: '1 1 320px', maxWidth: 400 }}>
                                <Group justify="space-between" align="center">
                                    <div>
                                        <Title order={2} size="h3" mb={4}>{page.altTitle ? page.altTitle : page.title}</Title>
                                        <Text c="dark.8">{page.description}</Text>
                                    </div>
                                    <Flex flex={1} justify="flex-end" align="center">
                                        <Button component={Link} href={`/g/${collection}/${slug}`} size="sm" radius="sm" variant="light">
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
