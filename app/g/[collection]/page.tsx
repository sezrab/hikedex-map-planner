import { guidesConfig } from '@/app/guides/guidesConfig';
import Navbar from '@/app/components/Navbar';
import { notFound } from 'next/navigation';
import { Container, Title, Text, Card, Button, Stack, Group, Flex } from '@mantine/core';
import Link from 'next/link';
import type { PageProps } from '../../../.next/types/app/g/[collection]/page';
import { Metadata } from 'next';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    let awaitedParams: Record<string, unknown> | undefined;
    if (params && typeof (params as Promise<unknown>).then === 'function') {
        awaitedParams = await params as Record<string, unknown>;
    } else {
        awaitedParams = params as Record<string, unknown> | undefined;
    }
    const collection = typeof awaitedParams?.collection === 'string' ? awaitedParams.collection : undefined;
    const guide = collection ? guidesConfig[collection] : undefined;
    if (!guide) return {};
    return {
        title: `${guide.guideTitle} | Hikedex`,
        description: guide.guideDescriptionShort || guide.guideDescription,
        openGraph: {
            title: `${guide.guideTitle} | Hikedex`,
            description: guide.guideDescriptionShort || guide.guideDescription,
            url: `https://hikedex.app/g/${collection}`,
            images: guide.guideImage ? [
                {
                    url: guide.guideImage,
                    width: 1200,
                    height: 630,
                    alt: guide.guideTitle
                }
            ] : undefined,
            type: 'website',
        },
    };
}

export default async function GuideIndexPage({ params }: PageProps) {
    // Await params if it's a promise
    let awaitedParams: Record<string, unknown> | undefined;
    if (params && typeof (params as Promise<unknown>).then === 'function') {
        awaitedParams = await params as Record<string, unknown>;
    } else {
        awaitedParams = params as Record<string, unknown> | undefined;
    }
    const collection = typeof awaitedParams?.collection === 'string' ? awaitedParams.collection : undefined;
    const guide = collection ? guidesConfig[collection] : undefined;
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
