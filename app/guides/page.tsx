import { Container, Title, Text, Card, Button, Stack, Group, Image, CardSection } from '@mantine/core';
import Link from 'next/link';
import Navbar from '@/app/components/Navbar';
import { guidesConfig } from './guidesConfig';

type GuideCardProps = {
    image?: string;
    title: string;
    description: string;
    descriptionShort?: string; // Optional short description for the guide
    href: string;
};

function GuideCard({ image, title, description, descriptionShort, href }: GuideCardProps) {
    return (
        <Card padding="lg" radius="md" style={{ minWidth: 320, flex: '1 1 320px', maxWidth: 400 }}>
            <CardSection>
                <Image
                    src={image || 'https://images.unsplash.com/photo-1512617835784-a92626c0a554?q=80&w=1374&auto=format&fit=crop'}
                    height={160}
                />
            </CardSection>
            <Group justify="space-between" mt="md" mb="xs">
                <Text fw={500}>
                    {title}
                </Text>
            </Group>

            <Text size="sm" c="dimmed">
                {descriptionShort || description}
            </Text>

            <Button color="blue" fullWidth mt="md" radius="md" component={Link} href={href} variant="light">
                See more
            </Button>
            {/* 
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
            </Group> */}
        </Card>
    );
}

export const metadata = {
    title: "Guides | Hikedex | Trip Planning Made Easy",
    description: "Browse pre-made, activity-specific guides for backpackers, vanlifers, and more. Plan your next adventure with curated maps and essential info.",
    openGraph: {
        title: "Guides | Hikedex | Trip Planning Made Easy",
        description: "Browse pre-made, activity-specific guides for backpackers, vanlifers, and more. Plan your next adventure with curated maps and essential info.",
        url: "https://hikedex.app/guides",
        images: [
            {
                url: "https://hikedex.app/logo.svg",
                width: 1200,
                height: 630,
                alt: "Hikedex Guides"
            }
        ],
        type: "website"
    }
};

export default function Guides() {
    return (
        <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)' }}>
            <Container py="xl">
                <Navbar />
                <Title order={1} mb="lg">Guides</Title>
                <Text c="dark.9" mb="md">
                    Pre-made, activity-specific guides to help you plan your next adventure. We&apos;re starting with a few popular ones, but more will be added soon!
                </Text>
                <Stack gap="lg" mt="xl">
                    <Group gap="lg" wrap="wrap">
                        {Object.entries(guidesConfig).map(([slug, guide]) => (
                            <GuideCard
                                key={slug}
                                image={guide.guideImage}
                                title={guide.guideTitle}
                                description={guide.guideDescription}
                                descriptionShort={guide.guideDescriptionShort}
                                href={`/g/${slug}`}
                            />
                        ))}
                    </Group>
                </Stack>
            </Container>
        </main>
    );
}

