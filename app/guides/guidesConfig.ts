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
      offasdykepan: {
        title: "A guide to Offa's Dyke for backpackers",
        altTitle: "Backpacking Offa's Dyke",
        description:
          "A comprehensive map showing essential facilities for backpackers along Offa's Dyke Path, including water sources, public toilets, village shops, and resupply points.",
        details: [
          "Standing at the edge of Sedbury Cliffs, with the Severn estuary churning below and 177 miles of ancient earthwork stretching north into the Welsh hills, Offa's Dyke is one of Britain's most historically charged long-distance walks. King Offa of Mercia ordered this massive ditch and rampart to be built in the 8th century to mark the boundary between his kingdom and the Welsh lands of Powys, and walking it today feels like tracing the very spine of British history. The dyke itself is a marvel of Dark Age engineering - where it survives intact, you'll find yourself walking along a 6-foot-high earthen wall with an 8-foot ditch on the Welsh side, a border so definitive that it still influences the modern boundary between England and Wales. What makes this trail exceptional for backpackers is not just its historical significance, but the way it threads together every type of British landscape: from the dramatic river valleys of the Wye and Dee to the rolling hills of Shropshire, the Black Mountains' rugged heights, and the wind-swept moors of Clwyd.",
          "The 12-14 day journey demands respect, particularly in the middle sections where the path climbs to over 2,000 feet and water sources can be scarce. The stretch between Hay-on-Wye and Kington is notorious for its boggy terrain and sudden weather changes, while the Clwydian Range offers some of the finest ridge walking in Wales alongside some of the most challenging navigation in mist. What guidebooks rarely mention is that the path passes through dozens of tiny villages where the local pub landlord will often let you pitch a tent in the back garden for the price of a pint, and where village shops stock just enough to resupply a backpacker without the weight of a full town stop. The trail also follows ancient drove roads used by Welsh cattle farmers for centuries, and you'll occasionally find old waymarkers carved into stone stiles that predate the official trail by generations.",
          "The logistics of backpacking Offa's Dyke reward careful planning, as this is not a wilderness trail but a journey through a working landscape where wild camping requires discretion and local knowledge. Water sources are generally reliable in the first and last thirds of the route, but the middle sections across the Radnor Forest and Clwydian Hills can test your planning skills. The trail's beauty lies not just in its grand vistas but in its intimate moments: the 12th-century church at Beguildy where medieval pilgrims prayed before crossing the hills, the ancient yew trees at Llanfair Waterdine that have watched over the valley for a thousand years, and the sudden silence you'll find in the depths of the Radnor Forest where the only sounds are your footsteps and the whisper of wind through the trees.",
          "To help you navigate the practical challenges of this historic journey, we've created a comprehensive map showing all the essential facilities you'll need as a backpacker. The map pinpoints every water source, public toilet, village shop, and resupply point along the route. With this resource, you can focus on what matters most: walking in the footsteps of a medieval king and experiencing one of Britain's most remarkable long-distance trails.",
        ],
        mapUrl: "/map/offasdyke",
        ogUrl: "https://hikedex.app/g/backpacking-uk/offasdyke",
        headerImage:
          "https://images.unsplash.com/photo-1722275003487-85ea5e00a647?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        imagePosition: "middle",
      },

      westmendipway: {
        title: "West Mendip Way: resupply and facilities",
        altTitle: "Backpacking the West Mendip Way",
        description:
          "A printable map showing resupply points, shops, cafes, water sources, and public toilets along the West Mendip Way for walkers and backpackers.",
        details: [
          "The West Mendip Way is a captivating long-distance footpath that traverses the western half of the Mendip Hills AONB in Somerset, England. This route offers a whimsical blend of challenging ascents, sweeping panoramic views, and encounters with ancient landscapes, perfect for walkers seeking both natural beauty and a dance with history.",
          "Stretching approximately 30 miles (48 km) from the market town of Axbridge in the east to the coastal resort of Weston-super-Mare in the west, the West Mendip Way showcases the diverse character of this limestone upland. From the dramatic Cheddar Gorge to the still reservoirs and ancient Iron Age hillforts, the route promises a varied and rewarding experience. Walkers will encounter a wide variety of flora and fauna, alongside archaeological sites that tell tales of our ancestors. While generally well-marked, carrying a map is always advisable for navigation.",
          'Among the quaint rolling hills, the Mendips are steeped in local folklore. One prominent tale you might encounter, particularly as you approach the Priddy area or Wookey Hole, is the Legend of the Wookey Hole Witch. According to this legend, a woman named "Hilda" lived in the caves and cast spells over the surrounding village. Troubled by her powers, villagers sought the help of a Glastonbury monk. He confronted the witch within the caves and, using holy water, managed to turn her to stone. Visitors to Wookey Hole today can still see a distinctive stalagmite formation believed to be the petrified witch.',
          "Typically completed over 2 to 3 days, the route is moderately challenging with varied terrain, including paved paths, bridleways, grassy tracks, and some stony sections with significant ascents and descents. Most choose to walk it from east to west (Axbridge to Weston-super-Mare), progressing towards the coast. Highlights include the iconic Cheddar Gorge, the expansive views from Black Down (the highest point in the Mendips), and the quiet Axbridge Reservoir. Accommodation, including B&Bs, guesthouses, and campsites, is available along or near the route, though booking in advance is recommended. This map provides detailed information on essential amenities like water sources, public toilets, and shops along the way, helping you plan your stops and travel lighter.",
        ],
        mapUrl: "/map/westmendips",
        ogUrl: "https://hikedex.app/g/backpacking-uk/westmendips",
        headerImage:
          "https://images.unsplash.com/photo-1645465518158-24d244658ff9?q=80&w=2170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        imagePosition: "middle",
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
