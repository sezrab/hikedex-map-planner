export interface BackpackingMapPageProps {
    title: string;
    description: string;
    details: string[];
    mapUrl: string;
    feedbackUrl?: string;
    pageUrl?: string;
    ogUrl?: string;
    headerImage?: string;
    imagePosition?: 'top' | 'middle' | 'bottom';
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
        pageUrl: '/backpacking-uk/westhighlandway',
        ogUrl: 'https://hikedex.app/backpacking-uk/westhighlandway',
        headerImage: 'https://images.unsplash.com/photo-1607602274042-161d6cba839a?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        imagePosition: 'bottom',
    },
    southwestcoastpath: {
        title: 'The South West Coast Path: resupply points',
        description: 'A printable map of the South West Coast Path showing resupply points, shops, cafes, water fountains, and public toilets for backpackers and hikers.',
        details: [
            'The South West Coast Path is a 630-mile footpath that wraps around the edge of England&#39;s toe, from Minehead to Poole. It weaves through crumbling cliffs, smugglers&#39; coves, harbour towns, sandy beaches and wild headlands, with the sea never far from sight. Some stretches are gentle, others unforgiving, but there&#39;s always the promise of a pub or pasty to push you onwards.',
            "We've curated this map specially for backpackers walking the ever-pleasant cliffs and coves of the South West Coast Path. The map shows resupply points along the route, including shops, cafes, water fountains, and public toilets.",
            'This map is particularly useful for hikers who want to minimise their pack weight and ensure they have access to essential supplies without carrying everything from the start.'
        ],
        mapUrl: '/map/southwestcoastpath',
        feedbackUrl: 'https://forms.gle/BzXeS9KyEAtwwGgxRA',
        pageUrl: '/backpacking-uk/southwestcoastpath',
        ogUrl: 'https://hikedex.app/backpacking-uk/southwestcoastpath',
        headerImage: 'https://images.unsplash.com/photo-1543241964-2aff6a70473f?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        imagePosition: 'middle'
    },
};
