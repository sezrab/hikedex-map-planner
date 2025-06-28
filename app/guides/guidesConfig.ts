export interface GuidePageConfig {
  title: string;
  altTitle?: string; // Optional alternative title for display purposes
  description: string;
  details: string[];
  mapUrl: string;
  feedbackUrl?: string;
  ogUrl?: string;
  headerImage?: string;
  imagePosition?: "top" | "middle" | "bottom";
}

export interface GuideConfig {
  guideImage?: string; // Optional image for the guide
  guideType: string;
  guideTitle: string;
  guideDescription: string;
  guideDescriptionShort?: string; // Optional short description for the guide
  pages: Record<string, GuidePageConfig>;
}

export const guidesConfig: Record<string, GuideConfig> = {
  "backpacking-uk": {
    guideImage:
      "https://images.unsplash.com/photo-1691823301836-ec022e09106f?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzR8fHBlbiUyMHklMjBmYW58ZW58MHx8MHx8fDA%3D",
    guideType: "Backpacking UK",
    guideTitle: "UK Backpacking Maps",
    guideDescription:
      "Explore our collection of pre-made backpacking maps. Essential information like water sources, food resupply points, and public toilets, all on one printable or offline map. Perfect for planning your next adventure!",
    guideDescriptionShort:
      "Essential backpacking maps for the UK, including resupply points, water sources, and public toilets.",
    pages: {
      westhighlandway: {
        title: "The West Highland Way: resupply points",
        altTitle: "Resupply points along the West Highland Way",
        description:
          "A printable map of the West Highland Way showing resupply points, shops, cafes, water fountains, and public toilets for backpackers and hikers.",
        details: [
          "The West Highland Way is a long-distance hiking trail in Scotland, stretching 96 miles (154 km) from Milngavie, just north of Glasgow, to Fort William in the Scottish Highlands. It is one of the most popular long-distance walks in the UK, offering stunning views of lochs, mountains, and glens.",
          "We've curated this map specially for backpackers walking this beautiful section of the Scottish Highlands. The map shows resupply points along the West Highland Way, including shops, cafes, water fountains, and public toilets.",
          "This printable map is particularly useful for hikers who want to minimise their pack weight and ensure they have access to essential supplies without carrying everything from the start.",
        ],
        mapUrl: "/map/westhighlandway",
        feedbackUrl: "https://forms.gle/BzXeS9KyEAtwWgxRA",
        ogUrl: "https://hikedex.app/g/backpacking-uk/westhighlandway",
        headerImage:
          "https://images.unsplash.com/photo-1607602274042-161d6cba839a?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        imagePosition: "bottom",
      },
      southwestcoastpath: {
        title: "The South West Coast Path: resupply points",
        altTitle: "A backpacker's map of the South West Coast Path",
        description:
          "A printable map of the South West Coast Path showing resupply points, shops, cafes, water fountains, and public toilets for backpackers and hikers.",
        details: [
          "The South West Coast Path is a 630-mile footpath that wraps around the edge of England's toe, from Minehead to Poole. It weaves through crumbling cliffs, smugglers' coves, harbour towns, sandy beaches and wild headlands, with the sea never far from sight. Some stretches are gentle, others unforgiving, but there's always the promise of a pub or pasty to push you onwards.",
          "We've curated this map specially for backpackers walking the ever-pleasant cliffs and coves of the South West Coast Path. The map shows resupply points along the route, including shops, cafes, water fountains, and public toilets.",
          "This map is particularly useful for hikers who want to minimise their pack weight and ensure they have access to essential supplies without carrying everything from the start.",
        ],
        mapUrl: "/map/southwestcoastpath",
        feedbackUrl: "https://forms.gle/BzXeS9KyEAtwwGgxRA",
        ogUrl: "https://hikedex.app/g/backpacking-uk/southwestcoastpath",
        headerImage:
          "https://images.unsplash.com/photo-1543241964-2aff6a70473f?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        imagePosition: "middle",
      },
    },
  },
  "vanlife-uk": {
    guideType: "Vanlife UK",
    guideTitle: "Vanlife UK Maps",
    guideDescription:
      "Explore vanlife-friendly maps, resources, and tips for traveling the UK by van.",
    pages: {
      cornwallparkups: {
        title: "Basic Vanlife Facilities in Cornwall",
        altTitle: "Toilets and tap points for vanlife in Cornwall",
        description:
          "A practical map for van travellers in Cornwall showing public toilets, water taps, and places where overnight parking might be possible.",
        details: [
          "Cornwall's beautiful but tricky for vanlife. Car parks often ban overnight stays, and tap points can be few and far between.",
          "This map shows basic facilities for people travelling by van, including public toilets, water taps, and car parks where overnight parking might be possible. It’s not a guarantee—they aren’t official stopovers, and local rules change—but it’s better than guessing.",
          "There’s no glossy marketing here: this is just a simple map of useful spots for anyone moving through Cornwall in a van and trying to stay low-impact and self-sufficient.",
        ],
        mapUrl: "/map/cornwallparkups",
        feedbackUrl: "https://forms.gle/TF1WXApBp1XvMkKj6",
        ogUrl: "https://hikedex.app/g/vanlife-uk/cornwallparkups",
        headerImage:
          "https://images.unsplash.com/photo-1601645192200-77040b2b50a3?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0",
        imagePosition: "middle",
      },
    },
  },
  // Add more guides here
};
