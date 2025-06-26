export interface BackpackingMapPageProps {
    title: string;
    description: string;
    details: string[];
    mapUrl: string;
    feedbackUrl?: string;
    ogUrl?: string;
    headerImage?: string;
}

export const backpackingPages: Record<string, BackpackingMapPageProps> = {
    westhighlandway: {
        title: 'The West Highland Way: resupply points',
        description: 'A printable map of the West Highland Way showing resupply points, shops, cafes, water fountains, and public toilets for backpackers and hikers.',
        details: [
            'The West Highland Way is a long-distance hiking trail in Scotland, stretching 96 miles (154 km) from Milngavie, just north of Glasgow, to Fort William in the Scottish Highlands. It is one of the most popular long-distance walks in the UK, offering stunning views of lochs, mountains, and glens.',
            "We've curated this map specially for backpackers walking this beautiful section of the Scottish Highlands. The map shows resupply points along the West Highland Way, including shops, cafes, water fountains, and public toilets.",
            'This printable map is particularly useful for hikers who want to minimise their pack weight and ensure they have access to essential supplies without carrying everything from the start.'
        ],
        mapUrl: '/map/westhighlandway',
        feedbackUrl: 'https://forms.gle/BzXeS9KyEAtwWgxRA',
        ogUrl: 'https://hikedex.com/backpacking/westhighlandway',
        headerImage: 'https://images.unsplash.com/photo-1607602274042-161d6cba839a?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    },
    // Add more slugs here as needed
};
