// import { Container, Title, Text, Paper, List, ListItem } from '@mantine/core';
import { Button, Container, Group, Text, Title, Flex, List, ListItem } from '@mantine/core';
import Navbar from '../components/Navbar';

function AboutSection() {
    return (
        <Flex
            justify="space-between"
            align="center"
            gap="xl"
            p="sm"
            direction={{ base: 'column', sm: 'row' }}
            mih={0}
        >
            <div style={{ flex: 1 }}>
                <Title c='dark'>
                    about
                </Title>
                <Text c="dark.9" mt="md">
                    Hikedex is an interactive, printable map tool designed to help backpackers, wild campers, van-lifers, and day-trippers find all the amenities they need for any adventure, anywhere in the world.
                </Text>
                <Text c="dark.9" mt="md">
                    I built Hikedex after getting fed up with how long it took to plan even a simple multi-day route. I&apos;d spend a long time switching between tabs, checking where I could get water, whether there was a shop nearby, or if any of the car parks were free. It was slow and frustrating.
                </Text>
                <Text c="dark.9" mt="md">
                    With Hikedex, you just move the map to where you&apos;re going, choose the layers you want, and print or save it for offline use. You can check public toilets near your route, find shops in a remote village, or plan where to fill up on water. It&apos;s meant to be practical and quick to use, whether you&apos;re heading out for one night or a week.
                </Text>
                <Text c="dark.9" mt="md">
                    Features include:
                </Text>
                <List c="dark.9" mt="sm">
                    {/* Chips that show the layers */}
                    <ListItem>Interactive map with multiple layers</ListItem>
                    <ListItem>Amenities like water sources, toilets, parking, and shops</ListItem>
                    <ListItem>Save and print your routes for offline use</ListItem>
                    <ListItem>Customisable base map</ListItem>
                    <Text mt="md">
                        I&apos;m still adding features and improving the data, so if you have any suggestions, I&apos;d love to hear them. You can send me feedback below.
                    </Text>
                </List>

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
                    <Button
                        component="a"
                        href="https://forms.gle/BzXeS9KyEAtwWgxRA"
                        variant="light"
                        radius="sm"
                        size="md"
                        target="_blank"
                    >
                        Send feedback
                    </Button>

                </Group>
            </div>
            {/* <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                <Image
                    src="https://images.unsplash.com/photo-1512617835784-a92626c0a554?q=80&w=1374&auto=format&fit=crop"
                    alt="Mountain"
                    radius="md"
                    w="100%"
                    fit="cover"
                />
            </div> */}
        </Flex >
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
                <Navbar page="about" />
                <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                    <AboutSection />
                </div>
            </Container>
        </main>
    );
}


// export default function AboutPage() {
//     return (
//         <Container size="sm" py="xl">
//             <Paper shadow="md" p="lg" radius="md" withBorder>
//                 <Title order={2} mb="md">
//                     About Hikedex Map Planner
//                 </Title>
//                 <Text mb="md">
//                     Hikedex Map Planner is a tool designed to help hikers plan and visualize their hiking routes with ease. Whether you are preparing for a day hike or a multi-day trek, our app provides intuitive mapping features to make your adventure safer and more enjoyable.
//                 </Text>
//                 <List spacing="xs" size="sm" mb="md">
//                     <ListItem>
//                         🗺️ Interactive map for route planning
//                     </ListItem>
//                     <ListItem>
//                         📍 Add and manage waypoints
//                     </ListItem>
//                     <ListItem>
//                         📝 Save and review your planned hikes
//                     </ListItem>
//                     <ListItem>
//                         📤 Export routes for offline use
//                     </ListItem>
//                 </List>
//                 <Text c="dimmed" size="sm">
//                     Built with Mantine UI and modern web technologies.
//                 </Text>
//             </Paper>
//         </Container>
//     );
// }