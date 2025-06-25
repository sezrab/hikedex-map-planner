'use client';
import { Button, Container, Group, Text, Title, Flex, TextInput, Anchor, Modal } from '@mantine/core';
import Navbar from '../components/Navbar';
import { useForm } from '@mantine/form';
import React from 'react';

function RadarForm() {
    {/** Modal open state logic */ }
    const [sampleModalOpened, setSampleModalOpened] = React.useState(false);
    const [formSubmitted, setFormSubmitted] = React.useState(false);

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            firstName: '',
            townAndRegion: '',
            email: '',
        },
        validate: {
            firstName: (value) => (value.trim().length > 0 ? null : 'First name is required'),
            townAndRegion: (value) => (value.trim().length > 0 ? null : 'Town and region are required'),
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        },
    });

    return (
        <>
            <Modal
                opened={sampleModalOpened}
                onClose={() => setSampleModalOpened(false)}
                title="Don&apos;t miss tomorrow&apos;s sunrise"
                centered
                size="md"
                // title bold
                styles={{
                    title: {
                        fontWeight: 700,
                    },
                }}
            >
                <Text>Good afternoon, Jack.</Text>
                <Text mt="md">
                    Get ready to catch a stunning sunrise tomorrow at 06:20 in Edale!
                </Text>
                <Text mt="md">
                    The forecast is looking good with clear skies and high visibility. It&apos;ll be 12°C with 5% cloud cover and 40 km/h winds. That&apos;s quite windy, so bring an extra layer!
                </Text>
                <Text mt="md">
                    See you at sunrise?
                </Text>
            </Modal>
            <Modal
                opened={formSubmitted}
                onClose={() => setFormSubmitted(false)}
                title="Subscription Successful"
                centered
                size="md"
            >
                <Text >
                    You will receive a message next time the weather is looking good for an early morning adventure.
                </Text>
            </Modal>
            <Flex
                justify="space-between"
                align="center"
                gap="xl"
                direction={{ base: 'column', sm: 'row' }}
                mih={0}
            >
                <div style={{ flex: 1 }}>
                    <Title c='dark'>
                        Sunrise Radar
                    </Title>
                    <Text c="dark.9" my="md">
                        Receive an email notification the day before excellent early morning weather. <Anchor href="#" onClick={() => setSampleModalOpened(true)}>Sample.</Anchor>
                    </Text>
                    <form onSubmit={form.onSubmit(async (values) => {
                        const url = `https://api.hikedex.app/radar-subscribe?name=${encodeURIComponent(values.firstName)}&email=${encodeURIComponent(values.email)}&location=${encodeURIComponent(values.townAndRegion)}`;
                        try {
                            const response = await fetch(url, { method: 'GET' });
                            if (response.ok) {
                                // Optionally show a success modal/message
                                setFormSubmitted(true);
                            } else {
                                // Optionally handle error
                                alert('Failed to subscribe. Please try again.');
                            }
                        } catch {
                            alert('Network error. Please try again.');
                        }
                    })}>
                        <TextInput
                            withAsterisk
                            label="First Name"
                            placeholder="Sam"
                            key={form.key('firstName')}
                            {...form.getInputProps('firstName')}
                        />
                        <TextInput
                            withAsterisk
                            label="Town and Region"
                            placeholder="Cardiff, UK"
                            mt="md"
                            key={form.key('townAndRegion')}
                            {...form.getInputProps('townAndRegion')}
                        />
                        <TextInput
                            withAsterisk
                            label="Email"
                            placeholder="your@email.com"
                            mt="md"
                            key={form.key('email')}
                            {...form.getInputProps('email')}
                        />
                        <Anchor
                            href="/privacy-policy"
                            target="_blank"
                            mt="md"
                            size="xs"
                            style={{ display: 'block' }}
                        >privacy policy</Anchor>
                        <Group justify="flex-end" mt="md">
                            <Button type="submit">Submit</Button>
                        </Group>
                    </form>
                </div>
            </Flex >
        </>
    );
}

export default function AboutPage() {
    return (
        <main
            style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)',
            }}
        >
            <Container py="xl" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Navbar page="sunrise-radar" />
                <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                    <RadarForm />
                </div>
            </Container>
        </main>
    );
}
