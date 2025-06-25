import { Button, Container, Group, Text, Title, Image, Flex } from '@mantine/core';
import Navbar from './components/Navbar';
function Hero() {
  return (
    <Flex
      justify="space-between"
      align="center"
      gap="xl"
      direction={{ base: 'column', sm: 'row' }}
      mih={0}
    >
      <div style={{ flex: 1 }}>
        <Title>
          A <span style={{ color: '#228be6' }}>no-nonsense</span> travel <br /> companion.
        </Title>
        <Text mt="md" component="h2" style={{ fontFamily: 'var(--mantine-font-family)' }}>
          Hiking, backpacking, vanlife, or travelling. Find everything you need for any adventure, anywhere in the world. From food and water to parking and toilets, hikedex has your back.
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
          src="https://images.unsplash.com/photo-1512617835784-a92626c0a554?q=80&w=1374&auto=format&fit=crop"
          alt="Backpacking with Hikedex"
          radius="md"
          w="100%"
          fit="cover"
        />
      </div>
    </Flex>
  );
}

export default function Home() {
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
        <Navbar />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <Hero />
        </div>
      </Container>
    </main>
  );
}
