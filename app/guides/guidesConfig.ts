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
          "A handy, printable map of the West Highland Way showing resupply points, shops, cafes, water fountains, and public toilets for backpackers and hikers.",
        details: [
          "The West Highland Way is a long-distance hiking trail in Scotland, stretching 96 miles (154 km) from Milngavie, just north of Glasgow, to Fort William in the Scottish Highlands. It is one of the most popular long-distance walks in the UK, offering stunning views of lochs, mountains, and glens.",
          "We've curated this map specially for backpackers walking this beautiful section of the Scottish Highlands. The map shows resupply points along the West Highland Way, including shops, cafes, water fountains, and public toilets.",
          "This printable map is particularly useful for hikers who want to minimise their pack weight and ensure they have access to essential supplies without carrying everything from the start.",
        ],
        mapUrl: "/map/westhighlandway",
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
        ogUrl: "https://hikedex.app/g/backpacking-uk/southwestcoastpath",
        headerImage:
          "https://images.unsplash.com/photo-1543241964-2aff6a70473f?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        imagePosition: "middle",
      },
      offasdyke: {
        title: "Offa’s Dyke Path: resupply and facilities",
        altTitle: "Resupply points along Offa’s Dyke Path",
        description:
          "A printable map showing resupply points, shops, cafes, water sources, and public toilets along Offa's Dyke Path for walkers and backpackers.",
        details: [
          "It's interesting how a border built over a thousand years ago still draws plenty of walkers today. Offa's Dyke, named after King Offa of Mercia, was meant to mark the boundary between his kingdom and Wales. The path follows roughly 177 miles of that old line, crossing rolling hills, sleepy villages, and ancient woodlands.",
          "Typically taking 10-13 days to complete, the route is never too far from a little village shop so you can stock up on the supplies you need to keep you plodding on.",
          "This map focuses on these practical stops for walkers, highlighting places to get food, find water, and use toilets along the route so you can plan your stops and travel lighter. It makes all the difference when you're out for a number of days.",
        ],
        mapUrl: "/map/offasdyke",
        ogUrl: "https://hikedex.app/g/backpacking-uk/offasdyke",
        headerImage:
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0",
        imagePosition: "bottom",
      },
    },
  },
  "vanlife-uk": {
    guideType: "Vanlife UK",
    guideTitle: "Vanlife UK Maps",
    guideImage:
      "https://images.unsplash.com/photo-1576793048000-494aaa93d160?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    guideDescription:
      "Explore vanlife-friendly maps for exploring the UK from your home on wheels.",
    pages: {
      cornwall: {
        title: "Guide to vanlife in Cornwall",
        altTitle: "A vanlifer's guide to Cornwall",
        description:
          "A practical map for life on the road in Cornwall showing public toilets, water taps, and places where overnight parking might be possible.",
        details: [
          "Cornwall's beautiful but can be tricky for vanlifers. It’s famously crowded in the summer months, car parks often ban overnight stays, and tap points can be few and far between.",
          "This map shows some basic facilities for people travelling by van, including public toilets, water taps, and car parks where overnight parking might be possible. No guarantees, though. Parking spots listed here may not be official stopovers, and local rules change. Use this map as a starting point for planning your trip around Cornwall.",
          "No glossy marketing to be found here, just a simple map of useful spots for anyone moving through Cornwall in a van and trying to stay low-impact and self-sufficient.",
        ],
        mapUrl: "/map/cornwall-vanlife",
        ogUrl: "https://hikedex.app/g/vanlife-uk/cornwall",
        headerImage:
          "https://images.unsplash.com/photo-1521014710171-f44dfe788ece?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        imagePosition: "middle",
      },
      lakedistrict: {
        title: "Guide to vanlife in the Lake District",
        altTitle: "Vanlife in the Lake District",
        description:
          "A straightforward map for vanlife in the Lake District showing public toilets, water sources, and potential overnight parking spots.",
        details: [
          "The Lake District is stunning, but living on the road here isn’t always easy. Popular spots fill up fast, overnight parking is often restricted, and finding reliable water taps can be a challenge.",
          "But fear not. Our printable map highlights essential facilities for van travellers. Public loos, fresh water points, and places where staying overnight might be allowed. Keep in mind, not all parking shown is officially designated for overnight stops, and local regulations can change. Use this as a practical guide to help plan your stay in the Lakes.",
          "Just a clear map with the basics to help you keep your trip smooth, self-sufficient, and respectful of the area.",
        ],
        mapUrl: "/map/lakedistrict-vanlife",
        ogUrl: "https://hikedex.app/g/vanlife-uk/lakedistrict",
        headerImage:
          "https://images.unsplash.com/photo-1600185947787-ad08e1b51430?q=80&w=2212&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        imagePosition: "middle",
      },
    },
  },
};
