export const queryLabels: Record<string, string> = {
  bus_stops: "🚏 Bus Stops",
  parking: "🅿️ Parking",
  groceries: "🛒 Groceries",
  cafes: "☕ Cafes",
  pubs_restaurants: "🍻 Pubs, Restaurants",
  drinking_water: "💧 Drinking Water",
  natural_springs: "🌊 Natural Springs",
  toilets: "🚻 Toilets",
  import_gpx: "🗺️ Import GPX",
};

export const presetQueries: Record<string, string> = {
  bus_stops: `nwr["highway"="bus_stop"]`,
  parking: `nwr["amenity"="parking"]`,
  groceries: `nwr["shop"~"supermarket|convenience|greengrocer"]`,
  cafes: `nwr["amenity"="cafe"]`,
  pubs_restaurants: `nwr["amenity"~"^pub$|^restaurant$"]`,
  drinking_water: `nwr["amenity"="drinking_water"]`,
  natural_springs: `nwr["natural"="spring"]`,
  toilets: `nwr["amenity"="toilets"]`,
  import_gpx: `#gpx`,
};
export const queryIcons: Record<string, string> = {
  bus_stops: '<i class="fas fa-bus" style="color:#1e40af; font-size:20px"></i>',
  parking:
    '<i class="fas fa-parking" style="color:#1e40af; font-size:20px"></i>',
  groceries:
    '<i class="fas fa-shopping-cart" style="color:#1e40af; font-size:20px"></i>',
  cafes: '<i class="fas fa-coffee" style="color:#1e40af; font-size:20px"></i>',
  pubs_restaurants:
    '<i class="fas fa-martini-glass" style="color:#1e40af; font-size:20px"></i>',
  drinking_water:
    '<i class="fas fa-faucet-drip" style="color:#1e40af; font-size:20px"></i>',
  toilets:
    '<i class="fas fa-restroom" style="color:#1e40af; font-size:20px"></i>',
  natural_springs:
    '<i class="fas fa-water" style="color:#1e40af; font-size:20px"></i>',
  import_gpx:
    '<i class="fas fa-file-import" style="color:#1e40af; font-size:20px"></i>',
};

export type OsmElement = {
  id: number;
  lat: number;
  lon: number;
  tags: Record<string, string> | undefined;
};

export type Query = {
  id: string;
  label: string;
  queryString: string;
  data: OsmElement[];
};

export const paperSizes = {
  A4: { width: 794, height: 1123 },
  A3: { width: 1123, height: 1587 },
};

export const tileOptions = [
  {
    label: "OpenStreetMap",
    value: "osm",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "© OpenStreetMap contributors",
  },
  {
    label: "OpenTopoMap",
    value: "opentopomap",
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution: "© OpenStreetMap contributors, © OpenTopoMap (CC-BY-SA)",
  },
  {
    label: "OpenStreetMap Humanitarian",
    value: "osm_humanitarian",
    url: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
    attribution: "© OpenStreetMap contributors, © HOT OSM",
  },
  {
    label: "CyclOSM",
    value: "cyclosm",
    url: "https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png",
    attribution: "© OpenStreetMap contributors, © CyclOSM",
  },
  // {
  //     label: 'Stadia Outdoors',
  //     value: 'stadia_outdoors',
  //     url: 'https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png',
  //     attribution: '© OpenStreetMap contributors, © Stadia Maps',
  // },
  // {
  //     label: 'Stadia Alidade Satellite',
  //     value: 'stadia_satellite',
  //     url: 'https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.jpg',
  //     attribution: '© OpenStreetMap contributors, © Stadia Maps',
  // },
  {
    label: "CartoDB Voyager",
    value: "carto",
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    attribution: "© OpenStreetMap contributors, © CartoDB",
  },
  // {
  //     label: 'Stamen Toner',
  //     value: 'toner',
  //     url: 'https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}{r}.jpg',
  //     attribution: 'Map tiles by Stamen Design, CC BY 3.0 — Map data © OpenStreetMap',
  // },
];
