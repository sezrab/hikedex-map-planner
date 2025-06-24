import { Button, Container, Group, Text, Title, Image } from '@mantine/core';

export function HeroBullets() {
  return (
    // slightly blue background
    <Container>
      <Group
        align="center"
        style={{ minHeight: '100vh' }}
      >
        <div style={{ flex: 1 }}>
          {/* logo here */}
          <Image src={'/logo.svg'} alt="Logo" w={80} h={80} mb="xs" />
          <Title>
            A <span style={{ color: '#228be6' }}>no-nonsense</span> travel <br /> companion.
          </Title>
          <Text c="blue.9" mt="md">
            Find all the amenities you need for any adventure, anywhere in the world. From food and water to parking and toilets, hikedex has your back.
          </Text>
          <Group mt={30}>
            <Button
              component="a"
              href="/map"
              radius="sm"
              size="md"
              rel="noopener"
            >
              Explore the map
            </Button>
          </Group>
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <Image
            src="https://images.unsplash.com/photo-1512617835784-a92626c0a554?q=80&w=1374&auto=format&fit=crop&fit=crop"
            alt="Mountain"
            radius="md"
            w={400}
            h={300}
            fit="cover"
          />
        </div>
      </Group>
    </Container>
  );
}

export default function Home() {
  return (
    // slightly blue gradient (sky)
    <main style={{ background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)' }}>
      <HeroBullets />
    </main>
  );
}
