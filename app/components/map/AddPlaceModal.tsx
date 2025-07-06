import { Modal, Button, Stack, TextInput, Select, Textarea, Group, Text } from '@mantine/core';
import { useState } from 'react';
import { queryLabels } from './mapPresets';

export interface AddPlaceModalProps {
    opened: boolean;
    onClose: () => void;
    coords: { lat: number; lng: number } | null;
}

let layers = Object.keys(queryLabels).map(source => ({ value: source, label: queryLabels[source] }))
const exclude = ['import_gpx']
layers = layers.filter(layer => !exclude.includes(layer.value))

export function AddPlaceModal({ opened, onClose, coords }: AddPlaceModalProps) {
    const [layer, setLayer] = useState<string>('parking');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        // TODO: Implement submission logic here
        // post to api/community-pois
        // Example payload:
        // {
        //     layer,
        //     name,
        //     description,
        //     lat: coords?.lat,
        //     lng: coords?.lng
        // }

        const res = await fetch('/api/community-pois', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,
                layer: layer,
                description: description,
                lat: coords?.lat.toFixed(7),
                lon: coords?.lng.toFixed(7)
            }),
        })

        if (!res.ok) {
            console.error('Failed to add place:', await res.text());
            setSubmitting(false);
            return;
        }

        const data = await res.json();
        console.log('Place added successfully:', data);
        setSubmitting(false);
        // Reset form fields

        setLayer('parking');
        setName('');
        setDescription('');
        onClose();

    };

    return (
        <Modal opened={opened} onClose={onClose} title="Add a Place" centered size="md">
            <form onSubmit={handleSubmit}>
                <Stack>
                    {coords && (
                        <Text size="sm" c="dimmed">
                            Selected location: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
                        </Text>
                    )}
                    <Select
                        label="Layer"
                        data={layers}
                        value={layer}
                        onChange={v => v && setLayer(v)}
                        required
                    />
                    <TextInput
                        label="Name"
                        value={name}
                        onChange={e => setName(e.currentTarget.value)}
                        required
                        maxLength={64}
                    />
                    <Textarea
                        label="Description"
                        value={description}
                        onChange={e => setDescription(e.currentTarget.value)}
                        minRows={2}
                        maxRows={5}
                        maxLength={256}
                    />
                    <Group justify="flex-end" mt="md">
                        <Button variant="default" onClick={onClose} disabled={submitting} type="button">
                            Cancel
                        </Button>
                        <Button type="submit" loading={submitting} color="indigo">
                            Add Place
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Modal>
    );
}
