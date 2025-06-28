"use client";

import { Button, Container, Group, Text, Flex } from '@mantine/core';
import Head from 'next/head';
import Navbar from '@/app/components/Navbar';

export interface GuideTemplateProps {
    title: string;
    description: string;
    details: string[];
    mapUrl: string;
    feedbackUrl?: string;
    ogUrl?: string;
    headerImage?: string;
    imagePosition?: 'top' | 'middle' | 'bottom';
    guideType?: string;
}

export default function GuideTemplate({
    title,
    description,
    details,
    mapUrl,
    feedbackUrl = 'https://forms.gle/huYH5Po6sEHhniMu5',
    ogUrl = '',
    headerImage,
    imagePosition = 'middle',
    guideType = 'Guide',
}: GuideTemplateProps) {
    const seoImage = headerImage || '/globe.svg';
    return (
        <>
            <Head>
                <title>{title} | {guideType}</title>
                <meta name="description" content={description} />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:type" content="website" />
                {ogUrl && <meta property="og:url" content={ogUrl} />}
                <meta property="og:image" content={seoImage} />
                <meta property="og:image:alt" content={`Header image for ${title}`} />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={title} />
                <meta name="twitter:description" content={description} />
                <meta name="twitter:image" content={seoImage} />
                <meta name="twitter:image:alt" content={`Header image for ${title}`} />
            </Head>
            <main
                style={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)'
                }}
            >
                <Container py="xl" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Navbar />
                    {headerImage && (
                        <img
                            src={headerImage}
                            alt={`Header image for ${title}`}
                            style={{
                                width: '100%',
                                maxHeight: 290,
                                objectFit: 'cover',
                                objectPosition: imagePosition,
                                borderRadius: 12,
                                marginBottom: 32,
                                boxShadow: '0 2px 16px rgba(0,0,0,0.08)'
                            }}
                        />
                    )}
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                        <Flex
                            p="sm"
                            mb="lg"
                            justify="space-between"
                            align="center"
                            gap="xl"
                            direction={{ base: 'column', sm: 'row' }}
                            mih={0}
                        >
                            <div style={{ flex: 1 }}>
                                <h1 style={{ color: '#212529', margin: 0 }}>{title}</h1>
                                <Text c="blue.5" mt="sm">{description}</Text>
                                {details.map((d: string, i: number) => (
                                    <Text c="dark.9" mt="md" key={i}>{d}</Text>
                                ))}
                                <Group mt={30}>
                                    <Button
                                        component="a"
                                        href={mapUrl}
                                        radius="sm"
                                        size="md"
                                        rel="noopener"
                                    >
                                        Open the map
                                    </Button>
                                    {feedbackUrl && (
                                        <Button
                                            component="a"
                                            href={feedbackUrl}
                                            variant="light"
                                            radius="sm"
                                            size="md"
                                            target="_blank"
                                        >
                                            Send feedback
                                        </Button>
                                    )}
                                </Group>
                            </div>
                        </Flex>
                    </div>
                </Container>
            </main>
        </>
    );
}
