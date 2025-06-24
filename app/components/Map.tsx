'use client';

import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMapEvents, useMap } from 'react-leaflet';

import L, { LeafletEvent } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import html2canvas from 'html2canvas';
import { Modal, Table, Checkbox, MultiSelect, Select } from '@mantine/core';

import {
    Drawer,
    Button,
    Stack,
    Group,
    ActionIcon,
    Text,
    CloseButton,
    Space,
} from '@mantine/core';

const presetQueries: Record<string, string> = {
    '🚏 Bus Stops': `nwr["highway"="bus_stop"]`,
    '🅿️ Parking': `nwr["amenity"="parking"]`,
    '🛒 Supermarkets': `nwr["shop"~"supermarket|convenience|greengrocer"]`,
    '☕ Cafes': `nwr["amenity"="cafe"]`,
    '🍻 Pubs, Restaurants': `nwr["amenity"~"pub|restaurant"]`,
    '💧 Drinking Water': `nwr["amenity"="drinking_water"]`,
    '🌊 Natural Springs': `nwr["natural"="spring"]`,
    '🚻 Toilets': `nwr["amenity"="toilets"]`,
};
const queryIcons: Record<string, string> = {
    '🚏 Bus Stops': '<i class="fas fa-bus" style="color:#1e40af; font-size:20px"></i>',
    '🅿️ Parking': '<i class="fas fa-parking" style="color:#1e40af; font-size:20px"></i>',
    '🛒 Supermarkets': '<i class="fas fa-shopping-cart" style="color:#1e40af; font-size:20px"></i>',
    '☕ Cafes': '<i class="fas fa-coffee" style="color:#1e40af; font-size:20px"></i>',
    '🍻 Pubs, Restaurants': '<i class="fas fa-martini-glass" style="color:#1e40af; font-size:20px"></i>',
    '💧 Drinking Water': '<i class="fas fa-faucet-drip" style="color:#1e40af; font-size:20px"></i>',
    '🚻 Toilets': '<i class="fas fa-restroom" style="color:#1e40af; font-size:20px"></i>',
    '🌊 Natural Springs': '<i class="fas fa-water" style="color:#1e40af; font-size:20px"></i>',
};

type OsmElement = {
    id: number;
    lat: number;
    lon: number;
    tags?: Record<string, string>;
};

type Query = {
    id: string;
    label: string;
    queryString: string;
    data: OsmElement[];
};

function ClusteredMarkers({ queries, disableClusteringAtZoom, forceNoCluster }: { queries: Query[], disableClusteringAtZoom?: number, forceNoCluster?: boolean }) {
    const map = useMapEvents({});
    const markerClusterGroup = useRef<L.MarkerClusterGroup | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalData, setModalData] = useState<{ name?: string; tags?: Record<string, string> } | null>(null);

    // In ClusteredMarkers, update marker icon style to add white outline
    const markerStyle = 'border: 2px solid rgba(255, 255, 255, 0.5); border-radius: 20px; box-shadow: 0 1px 4px rgba(0,0,0,0.15); background: rgba(255, 255, 255, 0.5); display: flex; align-items: center; justify-content: center; padding: 5px';

    useEffect(() => {
        if (!map) return;
        if (markerClusterGroup.current) {
            if (map.hasLayer(markerClusterGroup.current)) {
                map.removeLayer(markerClusterGroup.current);
            }
            markerClusterGroup.current.clearLayers();
        }
        const clusterGroup = L.markerClusterGroup({
            maxClusterRadius: forceNoCluster ? 1 : 60,
            disableClusteringAtZoom: forceNoCluster ? 0 : (disableClusteringAtZoom ?? 18),
            iconCreateFunction(cluster: L.MarkerCluster) {
                const markers = cluster.getAllChildMarkers();

                // Find unique query labels present in this cluster
                const presentLabels = new Set<string>();
                markers.forEach((marker: L.Marker) => {
                    // We stored the query label on marker.options.title below
                    if (marker.options.title) {
                        presentLabels.add(marker.options.title);
                    }
                });

                // Build a horizontal row of icons for these query labels
                const iconsHtml = Array.from(presentLabels)
                    .map((label) => queryIcons[label] || '<i class="fas fa-map-marker-alt"></i>')
                    .join(
                        '<span style="margin: 2px 2px; vertical-align: middle;"></span>'
                    );

                // Cluster count badge
                const count = cluster.getChildCount();

                const html = `
          <div style="
            display: flex;
            align-items: center;
            border-radius: 20px;
            padding: 2px 6px;
            box-shadow: 0 1px 4px rgba(0,0,0,0.15);
            border: 2px solid rgba(255,255,255,0.5);
            white-space: nowrap;
            background: rgba(255,255,255,0.5);
          ">
            ${iconsHtml}
            <span style="
              margin-left: 6px;
              background: rgba(0,0,0,0.7);
              color: white;
              border-radius: 50px;
              height: 22px;
              display: flex;
              padding: 0 8px;
              align-items: center;
              justify-content: center;
              font-weight: bold;
              font-size: 14px;
              user-select: none;
            ">${count}</span>
          </div>
        `;

                return L.divIcon({
                    html,
                    className: '',
                    iconSize: [30 + 22 * presentLabels.size, 30],
                    iconAnchor: [15, 30],
                });
            },
        });

        // Add all markers from all queries to this cluster group
        queries.forEach((query) => {
            const iconHtml = `<div style="${markerStyle}">${queryIcons[query.label] || '<i class=\"fas fa-map-marker-alt\"></i>'}</div>`;
            query.data.forEach((el) => {
                try {
                    const marker = L.marker([el.lat, el.lon], {
                        icon: L.divIcon({
                            html: iconHtml,
                            className: '',
                            iconSize: [32, 32],
                            iconAnchor: [16, 32],
                        }),
                        title: query.label, // store query label to identify marker type in cluster icon
                    });
                    marker.on('click', () => {
                        setModalData({
                            name: el.tags?.name,
                            tags: el.tags,
                        });
                        setModalOpen(true);
                    });
                    clusterGroup.addLayer(marker);
                } catch (error) {
                    console.error(`Error creating marker for element ${el.id}:`, error);
                }
            });
        });

        clusterGroup.addTo(map);
        markerClusterGroup.current = clusterGroup;

        return () => {
            if (map.hasLayer(clusterGroup)) {
                map.removeLayer(clusterGroup);
            }
            clusterGroup.clearLayers();
            markerClusterGroup.current = null;
        };
    }, [queries, map, disableClusteringAtZoom, forceNoCluster]);

    return (
        <>
            <Modal opened={modalOpen} onClose={() => setModalOpen(false)} title={modalData?.name || 'Details'}>
                {modalData?.tags ? (
                    <Table striped withColumnBorders>
                        <tbody>
                            {Object.entries(modalData.tags).map(([key, value]) => (
                                <tr key={key}>
                                    <td style={{ fontWeight: 500 }}>{key}</td>
                                    <td>{value}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                ) : (
                    <div>No tag data available.</div>
                )}
            </Modal>
        </>
    );
}

const paperSizes = {
    A4: { width: 794, height: 1123 },
    A3: { width: 1123, height: 1587 },
};

function PrintPreviewEffect({ printPreview, paperSize, orientation, containerHeight, containerWidth }: { printPreview: boolean, paperSize: string, orientation: string, containerHeight: number, containerWidth: number }) {
    const map = useMap();
    useEffect(() => {
        if (!map) {
            console.warn('Map not initialized yet');
            return;
        }
        // Invalidate size after a short delay to allow DOM resize
        const timeout = setTimeout(() => {
            map.invalidateSize();
            if (printPreview) {
                // Center the map on the current bounds when entering print preview
                const bounds = map.getBounds();
                map.fitBounds(bounds, {
                    padding: [0, 0],
                    maxZoom: 18,
                    animate: true,
                    duration: 1,
                });
            }
        }, 300);
        return () => clearTimeout(timeout);
    }, [map, printPreview, paperSize, orientation, containerHeight, containerWidth]);
    return null;
}

const tileOptions = [
    {
        label: 'OpenStreetMap',
        value: 'osm',
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '© OpenStreetMap contributors',
    },
    {
        label: 'OpenTopoMap',
        value: 'opentopomap',
        url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
        attribution: '© OpenStreetMap contributors, © OpenTopoMap (CC-BY-SA)',
    },
    {
        label: 'OpenStreetMap Humanitarian',
        value: 'osm_humanitarian',
        url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
        attribution: '© OpenStreetMap contributors, © HOT OSM',
    },
    {
        label: 'CyclOSM',
        value: 'cyclosm',
        url: 'https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png',
        attribution: '© OpenStreetMap contributors, © CyclOSM',
    },
    {
        label: 'Stadia Outdoors',
        value: 'stadia_outdoors',
        url: 'https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png',
        attribution: '© OpenStreetMap contributors, © Stadia Maps',
    },
    {
        label: 'Stadia Alidade Satellite',
        value: 'stadia_satellite',
        url: 'https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.jpg',
        attribution: '© OpenStreetMap contributors, © Stadia Maps',
    },
    {
        label: 'CartoDB Voyager',
        value: 'carto',
        url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        attribution: '© OpenStreetMap contributors, © CartoDB',
    },
    {
        label: 'Stamen Toner',
        value: 'toner',
        url: 'https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}{r}.jpg',
        attribution: 'Map tiles by Stamen Design, CC BY 3.0 — Map data © OpenStreetMap',
    },
];

// Add a helper to detect mobile
function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);
    return isMobile;
}

export default function FullscreenMapWithQueries() {
    const [queries, setQueries] = useState<Query[]>([]);
    const [drawerOpened, setDrawerOpened] = useState(false);
    const [mapBounds, setMapBounds] = useState<L.LatLngBounds | null>(null);
    const [loading, setLoading] = useState(false);
    const [needsRefresh, setNeedsRefresh] = useState(false);
    const [printPreview, setPrintPreview] = useState(false);
    const [paperSize, setPaperSize] = useState<'A4' | 'A3'>('A4');
    const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
    const [printLoading, setPrintLoading] = useState(false);
    const [clustering, setClustering] = useState(true);
    const [parkingSettingsOpen, setParkingSettingsOpen] = useState(false);
    const [parkingFreeOnly, setParkingFreeOnly] = useState(false);
    const [parkingAmbiguous, setParkingAmbiguous] = useState(true);
    const [parkingCustomersOnly, setParkingCustomersOnly] = useState(false);
    const [tileType, setTileType] = useState('osm');
    const printContainerRef = useRef<HTMLDivElement>(null);
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [hasCenteredUserLocation, setHasCenteredUserLocation] = useState(false);
    const isMobile = useIsMobile();

    function MapEventsHandler() {
        useMapEvents({
            moveend(e: LeafletEvent) {
                const map = (e.target as L.Map);
                setMapBounds(map.getBounds());
                setNeedsRefresh(true);
                setTimeout(() => {
                    map.invalidateSize(true);
                }
                    , 100); // Delay to ensure map is fully rendered
                console.log('Map moved, new bounds:', map.getBounds());
            },
            zoomend(e: LeafletEvent) {
                const map = (e.target as L.Map);
                setMapBounds(map.getBounds());
                setNeedsRefresh(true);
                map.invalidateSize(true);
            },
            load(e: LeafletEvent) {
                const map = (e.target as L.Map);
                setMapBounds(map.getBounds());
                map.invalidateSize(true);
            },
        });
        return null;
    }

    const { width: baseWidth, height: baseHeight } = paperSizes[paperSize];
    const containerWidth = orientation === 'portrait' ? baseWidth : baseHeight;
    const containerHeight = orientation === 'portrait' ? baseHeight : baseWidth;
    let scale = 1;
    if (printPreview) {
        const vh = window.innerHeight;
        if (vh < containerHeight) {
            // If viewport height is less than container height, scale down
            scale = vh / containerHeight;
        }
    }

    const buildBBox = (bounds: L.LatLngBounds) => {
        const sw = bounds.getSouthWest();
        const ne = bounds.getNorthEast();
        return `${sw.lat},${sw.lng},${ne.lat},${ne.lng}`;
    };

    const fetchQueryData = async (queryString: string, bbox: L.LatLngBounds, label?: string) => {
        const bboxStr = buildBBox(bbox);
        const fullQuery = `[out:json][timeout:25];${queryString}(${bboxStr});out center;`;
        const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(fullQuery)}`;
        try {
            const res = await fetch(url);
            const json = await res.json();
            let elements = json.elements
                .map((el: {
                    type: string;
                    id: number;
                    lat?: number;
                    lon?: number;
                    tags?: Record<string, string>;
                    center?: { lat: number; lon: number };
                    members?: { type: string; lat: number; lon: number }[];
                }) => {
                    if (el.type === 'node') {
                        return {
                            id: el.id,
                            lat: el.lat,
                            lon: el.lon,
                            tags: el.tags,
                        };
                    } else if (el.type === 'way' && el.center) {
                        return {
                            id: el.id,
                            lat: el.center.lat,
                            lon: el.center.lon,
                            tags: el.tags,
                        };
                    } else if (el.type === 'relation' && el.members && el.members[0] && el.members[0].type === 'node') {
                        return {
                            id: el.id,
                            lat: el.members[0].lat,
                            lon: el.members[0].lon,
                            tags: el.tags,
                        };
                    }
                    return null;
                })
                .filter((el: OsmElement | null) => el !== null && el.id !== undefined && el.lat !== undefined && el.lon !== undefined);
            // Filter parking for fee-free if needed
            if (label === '🅿️ Parking' && parkingFreeOnly) {
                // Filter out parking with fee
                elements = elements.filter((el: OsmElement) => {
                    if (!el.tags) return true; // Keep if no tags
                    const fee = el.tags['fee'] || el.tags['parking:fee'];
                    if (parkingAmbiguous && !fee) return true; // Include if fee is not specified
                    else if (!fee) return false; // Exclude if fee is not specified and parkingAmbiguous is false)
                    if (parkingCustomersOnly && el.tags['parking:condition'] === 'customers') return true; // Include customer-only parking
                    return !fee || !fee.match(/yes|ticket|disc/i); // Exclude if fee is yes, ticket, or disc,
                });
                // Allow: (access=yes), (no access tag), (access=customers if parkingCustomersOnly is true)
                elements = elements.filter((el: OsmElement) => {
                    if (!el.tags) return true; // Keep if no tags
                    const access = el.tags['access'];
                    if (access === 'yes' || access === 'permissive' || !access) return true; // Allow if access is yes, permissive, or no access tag
                    if (parkingCustomersOnly && access === 'customers') return true;
                    return false;
                });

            }
            return elements as OsmElement[];
        } catch {
            return [];
        }
    };

    const refreshAllQueries = async () => {
        if (!mapBounds) return;
        setLoading(true);
        const results = await Promise.all(
            queries.map(async (q) => {
                const data = await fetchQueryData(q.queryString, mapBounds, q.label);
                return { ...q, data };
            })
        );
        setQueries(results);
        setNeedsRefresh(false);
        setLoading(false);
    };

    const removeQuery = (id: string) => {
        setQueries((q) => q.filter((item) => item.id !== id));
    };

    async function handlePrint() {
        if (!printContainerRef.current) return;
        setPrintLoading(true);
        try {
            const canvas = await html2canvas(printContainerRef.current, {
                scale: 2,
                useCORS: true,
                logging: false,
            });
            const imgData = canvas.toDataURL('image/png');
            const w = window.open('', '_blank');
            if (!w) throw new Error('Could not open print window');
            w.document.write(`
                <html><head><title>Print Map</title>
                <style>
                  @page { size: ${orientation} ${paperSize}; margin: 0; }
                  body, html {
                    margin: 0; padding: 0; height: 100%; width: 100%;
                    display: flex; align-items: center; justify-content: center;
                  }
                  img {
                    max-width: 100%; max-height: 100%;
                    object-fit: contain;
                  }
                </style>
                </head><body>
                  <img src="${imgData}" />
                  <script>window.onload = () => window.print();</script>
                </body></html>
            `);
            w.document.close();
        } catch (err) {
            console.error('Print failed', err);
        }
        setPrintLoading(false);
    }
    const faRefresh = <i className="fas fa-sync-alt" />;
    const faBars = <i className="fas fa-bars" />;

    // Track which layers are already added
    const addedLabels = queries.map((q) => q.label);
    const availablePresets = Object.keys(presetQueries);

    // MultiSelect handler
    const handleAddLayers = (selected: string[]) => {
        const toRemove = addedLabels.filter((label) => !selected.includes(label));
        setQueries((q) =>
            q.filter((query) => !toRemove.includes(query.label))
        );

        // Only add layers that aren't already present
        const toAdd = selected.filter((label) => !addedLabels.includes(label));
        const newQueries = toAdd.map((label) => {
            let queryStr = presetQueries[label];
            if (label === '🅿️ Parking' && parkingFreeOnly) {
                queryStr = 'nwr["amenity"="parking"]["fee"!~"yes|ticket|disc"]';
            }
            return {
                id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 10) + Date.now().toString(36),
                label,
                queryString: queryStr,
                data: [],
            };
        });
        if (newQueries.length > 0) {
            setQueries((q) => [...q, ...newQueries]);
        }
        setNeedsRefresh(true);
    };

    const selectedTile = tileOptions.find((t) => t.value === tileType) || tileOptions[0];

    // Center map on user location when available
    function UserLocationSetter() {
        const map = useMap();
        useEffect(() => {
            if (hasCenteredUserLocation) return;
            if (userLocation && map) {
                map.setView(userLocation, 15, { animate: true });
                setHasCenteredUserLocation(true);
            }
        }, [map]);
        return null;
    }

    // Request geolocation on mount
    useEffect(() => {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setUserLocation([pos.coords.latitude, pos.coords.longitude]);
            },
            () => {
                console.warn('Geolocation permission denied or not supported');
            },
            { enableHighAccuracy: true }
        );
    }, []);

    return (
        <>
            {/* Parking settings modal */}
            <Modal opened={parkingSettingsOpen} onClose={() => setParkingSettingsOpen(false)} title="Parking Layer Settings" zIndex={300}>
                <Stack>
                    <Checkbox
                        label="Free parking only"
                        checked={parkingFreeOnly}
                        onChange={(e) => { setParkingFreeOnly(e.currentTarget.checked); setNeedsRefresh(true); }}
                    />
                    {
                        parkingFreeOnly && (
                            <Checkbox
                                label="Include parking where fee is not specified?"
                                checked={parkingAmbiguous}
                                onChange={(e) => { setParkingAmbiguous(e.currentTarget.checked); setNeedsRefresh(true); }}
                            />
                        )
                    }
                    {parkingFreeOnly && (
                        <Checkbox
                            label="Include customer-only parking?"
                            checked={parkingCustomersOnly}
                            onChange={(e) => { setParkingCustomersOnly(e.currentTarget.checked); setNeedsRefresh(true); }}
                        />
                    )}
                    {parkingFreeOnly && (
                        <Text c="dimmed" size="sm">
                            Refresh the map to see changes.
                        </Text>
                    )}

                </Stack>
            </Modal>

            {/* Map container - resize and scale if print preview */}
            <div
                ref={printContainerRef}
                style={{
                    width: printPreview ? `${containerWidth}px` : '100vw',
                    height: printPreview ? `${containerHeight}px` : '100vh',
                    margin: printPreview ? '0 auto' : undefined,
                    border: printPreview ? '3px solid #444' : 'none',
                    transition: 'width 0.5s, height 0.5s, transform 0.5s',
                    position: 'relative',
                    overflow: 'hidden',
                    maxWidth: printPreview ? '100%' : undefined,
                    background: printPreview ? '#fff' : undefined,
                    transform: printPreview ? `scale(${scale})` : undefined,
                    transformOrigin: printPreview ? 'top center' : undefined,
                    display: printPreview ? 'block' : undefined,
                }}
            >
                <MapContainer
                    id="map"
                    center={[51.51, -0.11]}
                    zoom={15}
                    style={{ height: '100%', width: '100%', zIndex: 0 }}
                    zoomControl={false}
                >
                    <TileLayer
                        url={selectedTile.url}
                        attribution={selectedTile.attribution}
                    />
                    <PrintPreviewEffect printPreview={printPreview} paperSize={paperSize} orientation={orientation} containerHeight={containerHeight} containerWidth={containerWidth} />
                    <MapEventsHandler />
                    {clustering ? (
                        <ClusteredMarkers queries={queries} />
                    ) : (
                        <ClusteredMarkers queries={queries} disableClusteringAtZoom={100} forceNoCluster />
                    )}
                    <UserLocationSetter />
                </MapContainer>
            </div>

            <Drawer
                opened={drawerOpened}
                onClose={() => setDrawerOpened(false)}
                title="Settings"
                padding="md"
                size={320}
                position="left"
            >
                <Stack>
                    {!isMobile && (
                        <>
                            <Text fw={500} size="md">
                                Printing
                            </Text>
                            <Button
                                color={printPreview ? 'red' : 'blue'}
                                onClick={() => {
                                    setPrintPreview((p) => !p);
                                }}
                                size="sm"
                                aria-label="Toggle print preview"
                            >
                                {printPreview ? 'Exit Print Mode' : 'Enter Print Mode'}
                            </Button>
                        </>
                    )}
                    {isMobile && (
                        <Text c="dimmed" size="sm" pr="lg">
                            Come back on a desktop to print or export the map.
                        </Text>
                    )}
                    {printPreview && (
                        <>
                            <Select
                                size="sm"
                                label="Paper Size"
                                labelProps={{ c: 'dimmed' }}
                                value={paperSize}
                                onChange={(val) => setPaperSize(val as 'A4' | 'A3')}
                                data={[
                                    { value: 'A4', label: 'A4' },
                                    { value: 'A3', label: 'A3' },
                                ]}
                                aria-label="Select paper size"
                            />
                            <Select
                                size="sm"
                                label="Orientation"
                                labelProps={{ c: 'dimmed' }}
                                value={orientation}
                                onChange={(val) => setOrientation(val as 'portrait' | 'landscape')}
                                data={[
                                    { value: 'portrait', label: 'Portrait' },
                                    { value: 'landscape', label: 'Landscape' },
                                ]}
                                aria-label="Select orientation"
                            />
                            <Button
                                onClick={handlePrint}
                                size="sm"
                                loading={printLoading}
                                color="green"
                                aria-label="Print map"
                            >
                                Print / Export
                            </Button>
                        </>
                    )}
                    <Text fw={500} size="md">
                        Layers
                    </Text>
                    <MultiSelect
                        label="Add layers"
                        placeholder="Pick layers to add"
                        data={availablePresets.map((label) => ({
                            value: label,
                            label,
                        }))}
                        // hide the pills
                        styles={{ pill: { display: 'none' } }}
                        comboboxProps={{ transitionProps: { transition: 'pop', duration: 100 } }}
                        value={queries.map((q) => q.label)}
                        onChange={handleAddLayers}
                        // Show a check icon for selected items
                        checkIconPosition='left'
                        chevronColor='dimmed'
                        withCheckIcon
                    />

                    <Select
                        label="Map style"
                        value={tileType}
                        onChange={(value) => {
                            if (value !== null) setTileType(value);
                        }}
                        data={tileOptions.map((t) => ({ value: t.value, label: t.label }))}
                        style={{ marginBottom: 12 }}
                    />
                    {/* <Button
                        onClick={addQuery}
                        leftSection={faPlus}
                        disabled={(!selectedPreset && !customQuery) || !mapBounds}
                    >
                        Add Layer
                    </Button> */}
                    <Checkbox
                        label="Marker clustering"
                        checked={clustering}
                        onChange={(e) => setClustering(e.currentTarget.checked)}
                    />

                    <Group justify="space-between" mt="md">
                        <Text fw={500} size="md">Active layers</Text>
                        <Button
                            size="xs"
                            variant="outline"
                            leftSection={faRefresh}
                            onClick={refreshAllQueries}
                            loading={loading}
                            disabled={queries.length === 0}
                        >
                            Refresh
                        </Button>
                    </Group>

                    <Stack gap="xs" mt="sm" style={{ maxHeight: '40vh', overflowY: 'auto' }}>
                        {queries.length === 0 && <Text c="dimmed">No layers yet. Add some above!</Text>}
                        {queries.map(({ id, label }) => (
                            <Group key={id} align='center' justify='space-between'>
                                <Text>{label}</Text>
                                <Space style={{ flexGrow: 1 }} />
                                {label === '🅿️ Parking' && (
                                    <ActionIcon
                                        variant="subtle"
                                        color="gray"
                                        size="sm"
                                        onClick={() => setParkingSettingsOpen(true)}
                                        aria-label="Parking layer settings"
                                    >
                                        <i className="fas fa-cog" style={{ fontSize: 14 }} />
                                    </ActionIcon>
                                )}
                                <CloseButton
                                    color="red"
                                    onClick={() => removeQuery(id)}
                                    size="sm"
                                    aria-label={`Remove query ${label}`}
                                />
                            </Group>
                        ))}
                        {/* 
                                <a href="https://forms.gle/BzXeS9KyEAtwWgxRA" target="_blank" rel="noopener noreferrer" style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
                                    Feedback
                                </a> */}

                    </Stack>
                    <Button
                        component="a"
                        href="https://forms.gle/BzXeS9KyEAtwWgxRA"
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="light"
                        size="xs"
                        mt="md"
                        fullWidth
                        style={{ marginTop: 8 }}
                        leftSection={<i className="fa-regular fa-comment-dots" />}
                        aria-label="Give feedback"
                    >
                        Give Feedback
                    </Button>
                </Stack>
            </Drawer >
            <ActionIcon
                variant="filled"
                color="blue"
                size="lg"
                id="settings-drawer-button"
                style={{
                    position: 'fixed',
                    top: 20,
                    left: 20,
                }}
                onClick={() => setDrawerOpened(true)}
                aria-label="Open settings drawer"
            >
                {faBars}
            </ActionIcon>
            {/* Refresh button in top middle when needed */}
            <Button
                size="xs"
                variant='filled'
                leftSection={faRefresh}
                onClick={refreshAllQueries}
                loading={loading}
                style={{
                    position: 'fixed',
                    top: 20,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    transformOrigin: 'left',
                    zIndex: 1000,
                    scale: needsRefresh && queries.length > 0 ? 1 : 0,
                    transition: 'scale 0.1s ease',
                }}
            >
                Refresh
            </Button>
        </>
    );
}
