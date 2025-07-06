'use client';

import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMapEvents, useMap, Polyline } from 'react-leaflet';
import L, { LeafletEvent } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import html2canvas from 'html2canvas';
import { Modal, Checkbox, MultiSelect, Select } from '@mantine/core';
import { Dropzone } from '@mantine/dropzone';
import * as toGeoJSON from '@tmcw/togeojson';
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
import { SignInButton } from '../SignInButton';

import { ClusteredMarkers } from './ClusteredMarkers';
import { presetQueries, paperSizes, queryLabels, OsmElement, Query, tileOptions } from './mapPresets';
import { AddPlaceModal } from './AddPlaceModal';
import { fetchCommunityNodes } from './getCommunityNodes';

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

// Types for export/import state
interface ExportedQuery {
    label: string;
    queryString: string;
    data: OsmElement[];
}

interface ExportedGpxFile {
    name: string;
    geojson: GeoJSON.FeatureCollection<GeoJSON.LineString | GeoJSON.MultiLineString>;
    color: string;
}

export interface ExportedMapState {
    norefresh?: boolean; // If true, do not refresh map on load
    queries: ExportedQuery[];
    gpxFiles: ExportedGpxFile[];
    selectedLayers: string[];
    mapBounds: {
        southWest: { lat: number; lng: number };
        northEast: { lat: number; lng: number };
    } | null;
}


export default function FullscreenMapWithQueries({ jsonData, norefresh }: { jsonData?: ExportedMapState, norefresh?: boolean } = {}) {
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
    const [parkingFreeOnly, setParkingFreeOnly] = useState(true);
    const [parkingAmbiguous, setParkingAmbiguous] = useState(false);
    const [parkingCustomersOnly, setParkingCustomersOnly] = useState(false);
    const [tileType, setTileType] = useState('osm');
    const printContainerRef = useRef<HTMLDivElement>(null);
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
    const [hasCenteredUserLocation, setHasCenteredUserLocation] = useState(false);
    const isMobile = useIsMobile();
    const [markerSelectionMode, setMarkerSelectionMode] = useState(false);
    const [selectedMarkerIds, setSelectedMarkerIds] = useState<Set<number>>(new Set());
    const [markerSelectionModalOpen, setMarkerSelectionModalOpen] = useState(false);
    const [gpxSettingsOpen, setGPXSettingsOpen] = useState(false);
    const [gpxFiles, setGpxFiles] = useState<{
        id: string;
        name: string;
        geojson: GeoJSON.FeatureCollection<GeoJSON.LineString | GeoJSON.MultiLineString>;
        color: string;
    }[]>([]);
    const [gpxProximity, setGpxProximity] = useState(1); // km
    const mapRef = useRef<L.Map | null>(null);
    const [addPlaceMode, setAddPlaceMode] = useState(false);
    const [addPlaceCoords, setAddPlaceCoords] = useState<{ lat: number; lng: number } | null>(null);
    const [addPlaceModalOpen, setAddPlaceModalOpen] = useState(false);
    const [addPlaceHelpOpen, setAddPlaceHelpOpen] = useState(false);

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

    const fetchQueryData = async (queryString: string, bbox: L.LatLngBounds, label: string): Promise<OsmElement[]> => {
        const bboxStr = buildBBox(bbox);
        const fullQuery = `[out:json][timeout:25];${queryString}(${bboxStr});out center;`;
        const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(fullQuery)}`;

        let returnElements = [] as OsmElement[];
        try {
            const communityData = await fetchCommunityNodes(bbox, label);
            if (communityData && communityData.length > 0) {
                returnElements = [...returnElements, ...communityData];
            }
        } catch (err) {
            console.error('Failed to fetch community data:', err);
        }

        try {
            const res = await fetch(url);
            const json = await res.json();
            type OverpassElement = {
                type: string;
                id: number;
                lat?: number;
                lon?: number;
                tags?: Record<string, string>;
                center?: { lat: number; lon: number };
                members?: { type: string; lat: number; lon: number }[];
            };
            let elements = (json.elements as OverpassElement[])
                .map((el) => {
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
                .filter(
                    (el): el is OsmElement =>
                        el !== null &&
                        typeof el.id === 'number' &&
                        typeof el.lat === 'number' &&
                        typeof el.lon === 'number'
                );
            // Filter parking for fee-free if needed
            if (label === 'parking') {
                if (parkingFreeOnly) {
                    // Filter out parking with fee unless: its a layby, street-side, or has no fee specified
                    elements = elements.filter((el: OsmElement) => {
                        if (!el.tags) return true; // Keep if no tags
                        if (el.tags['parking'] === 'layby' || el.tags['parking'] === 'street_side') return true; // Keep layby and street parking
                        const fee = el.tags['fee'] || el.tags['parking:fee'];
                        if (parkingAmbiguous && !fee) return true; // Include if fee is not specified
                        else if (!fee) return false; // Exclude if fee is not specified and parkingAmbiguous is false)
                        if (parkingCustomersOnly && el.tags['access'] === 'customers') return true; // Include customer-only parking
                        return !fee || !fee.match(/yes|ticket|disc/i); // Exclude if fee is yes, ticket, or disc,
                    });
                }

                // Allow: (access=yes), (no access tag), (access=customers if parkingCustomersOnly is true)
                elements = elements.filter((el: OsmElement) => {
                    if (!el.tags) return true; // Keep if no tags
                    const access = el.tags['access'];
                    if (access === 'yes' || access === 'permissive' || !access) return true; // Allow if access is yes, permissive, or no access tag
                    if (parkingCustomersOnly && access === 'customers') return true;
                    return false;
                });
            }

            // add to returnElements
            returnElements = [...returnElements, ...elements];
        } catch {
            console.error('Failed to fetch query data:', queryString, bbox);
            return returnElements;
        }

        return returnElements;
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
    const faPrint = <i className="fas fa-print" />;
    const faClose = <i className="fas fa-times" />;
    const faMarker = <i className="fas fa-location-dot" />;

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
            if (label === "parking") {
                setParkingSettingsOpen(true);
                if (parkingFreeOnly) {
                    queryStr = 'nwr["amenity"="parking"]["fee"!~"yes|ticket|disc"]';
                }
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
            if (hasCenteredUserLocation || norefresh) return;
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

    // Handler to remove unselected markers
    const removeUnselectedMarkers = () => {
        setQueries((prevQueries) =>
            prevQueries.map((query) => ({
                ...query,
                data: query.data.filter((el) => selectedMarkerIds.has(el.id)),
            }))
        );
        setSelectedMarkerIds(new Set());
    };

    const removeSelectedMarkers = () => {
        setQueries((prevQueries) =>
            prevQueries.map((query) => ({
                ...query,
                data: query.data.filter((el) => !selectedMarkerIds.has(el.id)),
            }))
        );
        setSelectedMarkerIds(new Set());
    };

    // Handler to toggle marker selection
    const handleMarkerSelect = (id: number) => {
        setSelectedMarkerIds((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    // Box select handler: select all markers within boxzoom bounds
    function BoxSelectHandler() {
        const map = useMap();
        const originalFitBoundsFunction = useRef(map.fitBounds.bind(map));
        const originalFitBounds = useRef(originalFitBoundsFunction.current);
        useEffect(() => {
            if (!markerSelectionMode) return;
            if (!map) return;
            // Handler to disable zooming when box selection starts
            const onBoxZoomStart = () => {
                // Disable fitbounds method.
                map.fitBounds = () => {
                    console.warn('Box selection active, fitBounds disabled');
                    return map;
                };
            };
            // Handler to re-enable zooming after box selection ends
            const onBoxZoomEnd = (e: unknown) => {
                // Re-enable fitbounds method
                map.fitBounds = originalFitBounds.current;
                // Type guard for Leaflet boxzoom event
                const event = e as { boxZoomBounds?: L.LatLngBounds, bounds?: L.LatLngBounds, target?: L.Map };
                const bounds = event.boxZoomBounds || event.bounds || (event.target && event.target.getBounds && event.target.getBounds());
                if (!bounds) return;
                // Collect all marker IDs within bounds
                const idsInBox = new Set<number>();
                queries.forEach((query) => {
                    query.data.forEach((el) => {
                        if (bounds.contains([el.lat, el.lon])) {
                            idsInBox.add(el.id);
                        }
                    });
                });
                // Add selected IDs to the current selection, unless they were already selected, in which case they will be toggled off
                if (idsInBox.size === 0) return; // No markers in box, do nothing
                setSelectedMarkerIds((prev) => {
                    const newSet = new Set(prev);
                    idsInBox.forEach((id) => {
                        if (newSet.has(id)) {
                            // newSet.delete(id); // Toggle off if already selected
                        } else {
                            newSet.add(id); // Toggle on if not selected
                        }
                    });
                    return newSet;
                });
            };
            // Set crosshair cursor on Shift down, revert on Shift up
            const mapContainer = map.getContainer();
            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === 'Shift') {
                    mapContainer.style.cursor = 'crosshair';
                }
            };
            const handleKeyUp = (e: KeyboardEvent) => {
                if (e.key === 'Shift') {
                    mapContainer.style.cursor = '';
                }
            };
            window.addEventListener('keydown', handleKeyDown);
            window.addEventListener('keyup', handleKeyUp);
            map.on('boxzoomstart', onBoxZoomStart);
            map.on('boxzoomend', onBoxZoomEnd);
            return () => {
                map.off('boxzoomstart', onBoxZoomStart);
                map.off('boxzoomend', onBoxZoomEnd);
                window.removeEventListener('keydown', handleKeyDown);
                window.removeEventListener('keyup', handleKeyUp);
                mapContainer.style.cursor = '';
            };
        }, [map]);
        return null;
    }

    // Helper to parse GPX file to GeoJSON
    const parseGpxToGeoJson = async (file: File) => {
        const text = await file.text();
        // const xml = parser.parse(text); // Removed unused variable
        // Use togeojson to convert
        const dom = new window.DOMParser().parseFromString(text, 'text/xml');
        const geojson = toGeoJSON.gpx(dom) as GeoJSON.FeatureCollection<GeoJSON.LineString | GeoJSON.MultiLineString>;
        return geojson;
    };

    // Helper to generate high-contrast color palette
    const gpxColorPalette = [
        '#e6194b', // red
        '#3cb44b', // green
        '#ffe119', // yellow
        '#4363d8', // blue
        '#f58231', // orange
        '#911eb4', // purple
        '#46f0f0', // cyan
        '#f032e6', // magenta
        '#bcf60c', // lime
        '#fabebe', // pink
        '#008080', // teal
        '#e6beff', // lavender
        '#9a6324', // brown
        '#fffac8', // beige
        '#800000', // maroon
        '#aaffc3', // mint
        '#808000', // olive
        '#ffd8b1', // apricot
        '#000075', // navy
        '#808080', // gray
        '#ffffff', // white
        '#000000', // black
    ];
    let gpxColorIndex = 0;

    // Add GPX file(s)
    const handleGpxDrop = async (files: File[]) => {
        const newFiles = await Promise.all(files.map(async (file) => {
            const geojson = await parseGpxToGeoJson(file);
            // Pick next high-contrast color
            const color = gpxColorPalette[gpxColorIndex % gpxColorPalette.length];
            gpxColorIndex++;
            return {
                id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 10) + Date.now().toString(36),
                name: file.name,
                geojson,
                color,
            };
        }));
        setGpxFiles((prev) => [...prev, ...newFiles]);
        setNeedsRefresh(true);
    };

    // Remove GPX file by id
    const removeGpxFile = (id: string) => {
        setGpxFiles((prev) => prev.filter((f) => f.id !== id));
        setNeedsRefresh(true);
    };

    // Helper: get all coordinates from all GPX lines
    const getAllGpxCoords = () => {
        const coords: [number, number][] = [];
        gpxFiles.forEach((f) => {
            f.geojson.features.forEach((feat) => {
                if (feat.geometry.type === 'LineString') {
                    (feat.geometry.coordinates as [number, number][]).forEach(([lon, lat]) => coords.push([lat, lon]));
                } else if (feat.geometry.type === 'MultiLineString') {
                    (feat.geometry.coordinates as [number, number][][]).forEach((line) => {
                        line.forEach(([lon, lat]) => coords.push([lat, lon]));
                    });
                }
            });
        });
        return coords;
    };

    // Haversine distance in km
    function haversine(lat1: number, lon1: number, lat2: number, lon2: number) {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    // Select markers within X km of any GPX line
    const selectMarkersNearGpx = () => {
        // set marker selection mode if not already
        setClustering(false);
        setGPXSettingsOpen(false);
        if (!markerSelectionMode)
            setMarkerSelectionModalOpen(true);
        setMarkerSelectionMode(true);
        setGPXSettingsOpen(false);
        setDrawerOpened(false);
        const coords = getAllGpxCoords();
        if (coords.length === 0) return;
        const newSelected = new Set<number>();
        queries.forEach((query) => {
            query.data.forEach((el) => {
                for (const [lat, lon] of coords) {
                    if (haversine(lat, lon, el.lat, el.lon) <= gpxProximity) {
                        newSelected.add(el.id);
                        break;
                    }
                }
            });
        });
        setSelectedMarkerIds(newSelected);
    };

    // DEV: Export/Import state helpers
    const isDev = typeof window !== 'undefined' && window.location.search.includes('dev=1');
    const [devModalOpen, setDevModalOpen] = useState(false);
    const [importText, setImportText] = useState('');
    const [importError, setImportError] = useState('');

    // Helper: build exportable state
    const buildExportState = (): ExportedMapState => {
        return {
            queries: queries.map(q => ({
                label: q.label,
                queryString: q.queryString,
                data: q.data,
            })),
            gpxFiles: gpxFiles.map(f => ({
                name: f.name,
                geojson: f.geojson,
                color: f.color,
            })),
            selectedLayers: queries.map(q => q.label),
            mapBounds: mapBounds ? {
                southWest: mapBounds.getSouthWest(),
                northEast: mapBounds.getNorthEast(),
            } : null,
        };
    };

    // Helper: load state from JSON
    const loadExportState = (state: ExportedMapState) => {
        if (state.queries) setQueries(state.queries.map((q) => ({
            id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 10) + Date.now().toString(36),
            ...q,
        })));
        if (state.gpxFiles) setGpxFiles(state.gpxFiles.map((f) => ({
            id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 10) + Date.now().toString(36),
            ...f,
        })));
        // No need to set selectedLayers, as queries are set
        if (state.mapBounds && state.mapBounds.southWest && state.mapBounds.northEast) {
            setTimeout(() => {
                if (mapRef.current) {
                    const map = mapRef.current;
                    const { southWest, northEast } = state.mapBounds!;
                    if (southWest && northEast) {
                        const bounds = L.latLngBounds(
                            L.latLng(southWest.lat, southWest.lng),
                            L.latLng(northEast.lat, northEast.lng)
                        );
                        map.fitBounds(bounds, { animate: false });
                    }
                } else {
                    console.warn('Map not initialized yet, cannot set bounds');
                }
            }, 500);
        }
    };

    // Load from jsonData prop if provided
    useEffect(() => {
        if (jsonData) {
            loadExportState(jsonData as ExportedMapState);
        }
    }, [jsonData]);

    // Optional: Load JSON data from ?json=FILENAME.json parameter
    const windowSearch = typeof window !== 'undefined' ? window.location.search : undefined;
    useEffect(() => {
        if (typeof window === 'undefined') return;
        const params = new URLSearchParams(windowSearch);
        const jsonFile = params.get('json');
        if (!jsonFile) return;
        // Prevent duplicate layers
        if (queries.some(q => q.label === jsonFile)) return;
        fetch('/' + jsonFile)
            .then(res => res.json())
            .then((data) => {
                // Accepts either {elements: OsmElement[]} or OsmElement[]
                const elements: OsmElement[] = Array.isArray(data) ? data : data.elements || [];
                setQueries(prev => [
                    ...prev,
                    {
                        id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 10) + Date.now().toString(36),
                        label: jsonFile,
                        queryString: '',
                        data: elements,
                    }
                ]);
            })
            .catch(() => {
                // Optionally show error
                console.warn('Could not load JSON file:', jsonFile);
            });
    }, [windowSearch, queries]);

    // Handler for map click in add place mode
    function AddPlaceMapClickHandler() {
        useMapEvents({
            click(e) {
                setAddPlaceCoords(e.latlng);
                setAddPlaceModalOpen(true);
                setAddPlaceMode(false);
                setAddPlaceHelpOpen(false);
                // Reset cursor
                const map = document.getElementById('map');
                if (map) map.style.cursor = '';
            },
        });
        // Set crosshair cursor
        useEffect(() => {
            const map = document.getElementById('map');
            if (map) map.style.cursor = 'crosshair';
            return () => {
                if (map) map.style.cursor = '';
            };
        }, []);
        return null;
    }

    return (
        <>
            {/* Add Place Instruction Modal */}
            <Modal
                opened={addPlaceHelpOpen}
                onClose={() => {
                    setAddPlaceHelpOpen(false);
                    setAddPlaceMode(false);
                }}
                title="Add a Place"
                centered
                size="md"
            >
                <Stack>
                    <Text>
                        Click anywhere on the map to select the location for a new POI.
                    </Text>
                    <Text>
                        After clicking, you can enter details for the new place. Thank you for contributing!
                    </Text>
                    <Group justify="flex-end">
                        <Button variant="default" onClick={() => {
                            setAddPlaceHelpOpen(false);
                            setAddPlaceMode(false);
                        }}>Cancel</Button>
                        <Button onClick={() => {
                            setAddPlaceHelpOpen(false);
                            setAddPlaceMode(true);
                        }} color="indigo">OK</Button>
                    </Group>
                </Stack>
            </Modal>
            {/* Add Place Modal */}
            <AddPlaceModal
                opened={addPlaceModalOpen}
                onClose={() => {
                    setAddPlaceModalOpen(false);
                    setAddPlaceCoords(null);
                }}
                coords={addPlaceCoords}
            // You will implement the submit handler inside AddPlaceModal
            />
            {/* DEV: Export/Import State Modal */}
            {isDev && (
                <>
                    <Modal opened={devModalOpen} onClose={() => setDevModalOpen(false)} title="Export/Import Map State (DEV)" size="lg" centered>
                        <Stack>
                            <Button onClick={() => {
                                const json = JSON.stringify(buildExportState(), null, 2);
                                navigator.clipboard.writeText(json);
                            }}>Copy State to Clipboard</Button>
                            <Button onClick={() => {
                                const json = JSON.stringify(buildExportState(), null, 2);
                                const blob = new Blob([json], { type: 'application/json' });
                                const url = URL.createObjectURL(blob);
                                const a = document.createElement('a');
                                a.href = url;
                                a.download = 'map-state.json';
                                a.click();
                                URL.revokeObjectURL(url);
                            }}>Download State as JSON</Button>
                            <Text>Paste JSON below to import:</Text>
                            <textarea style={{ width: '100%', minHeight: 120 }} value={importText} onChange={e => setImportText(e.target.value)} />
                            {importError && <Text c="red">{importError}</Text>}
                            <Button onClick={() => {
                                try {
                                    const state = JSON.parse(importText);
                                    loadExportState(state);
                                    setImportError('');
                                    setDevModalOpen(false);
                                } catch {
                                    setImportError('Invalid JSON');
                                }
                            }}>Import State</Button>
                        </Stack>
                    </Modal>
                    <Button style={{ position: 'fixed', bottom: 32, right: 100, zIndex: 9999 }} color="gray" size="xs" onClick={() => setDevModalOpen(true)}>
                        DEV: Export/Import State
                    </Button>
                </>
            )}
            {/* Parking settings modal */}
            <Modal opened={parkingSettingsOpen} onClose={() => setParkingSettingsOpen(false)} title="Parking Layer Settings" zIndex={300} centered size="md">
                <Stack>
                    <Text c="gray.7" size="sm">
                        Please use common sense when using the parking layer. Parking data is not guaranteed to be accurate or up-to-date.
                    </Text>
                    <Checkbox
                        label="Free parking only"
                        checked={parkingFreeOnly}
                        onChange={(e) => { setParkingFreeOnly(e.currentTarget.checked); setNeedsRefresh(true); }}
                    />
                    {
                        parkingFreeOnly && (
                            <Checkbox
                                label="Include parking where fee is not known?"
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
                    {needsRefresh && (
                        <Text c="gray.7" size="sm">
                            Refresh the map to see changes.
                        </Text>
                    )}

                </Stack>
            </Modal>

            {/* GPX Settings */}
            <Modal
                opened={gpxSettingsOpen}
                onClose={() => setGPXSettingsOpen(false)}
                title="Import GPX Files"
                centered
                size="md"
                zIndex={350}
            >
                <Stack>
                    <Dropzone
                        onDrop={handleGpxDrop}
                        multiple
                        accept={{ 'application/gpx+xml': ['.gpx'], 'application/xml': ['.gpx'] }}
                        maxSize={5 * 1024 * 1024}
                        style={{ minHeight: 100, border: '2px dashed #ccc', borderRadius: 8, padding: '30px', cursor: 'pointer' }}
                    >
                        <Text c="gray.7" size="sm">
                            Drag and drop GPX files here, or click to select files (max 5MB each)
                        </Text>
                    </Dropzone>
                    {gpxFiles.length > 0 && (
                        <Stack>
                            <Text fw={500} size="sm">Imported GPX Tracks:</Text>
                            {gpxFiles.map((f) => (
                                <Group key={f.id}>
                                    <span style={{ color: f.color, fontWeight: 600 }}>&#9632;</span>
                                    <Text>{f.name}</Text>
                                    <Space style={{ flex: 1 }} />
                                    <Button size="xs" color="red" variant="light" onClick={() => removeGpxFile(f.id)} aria-label={`Remove ${f.name}`}>Remove</Button>
                                </Group>
                            ))}
                        </Stack>
                    )}
                    {gpxFiles.length > 0 && !isMobile && (
                        <Group>
                            <Text size="sm">Select markers within</Text>
                            <Space style={{ flex: 1 }} />
                            <Select
                                size="xs"
                                value={gpxProximity.toString()}
                                onChange={v => setGpxProximity(Number(v))}
                                comboboxProps={{
                                    withinPortal: true,
                                    zIndex: 500
                                }}
                                data={[
                                    { value: '0.5', label: '0.5 km' },
                                    { value: '1', label: '1 km' },
                                    { value: '2', label: '2 km' },
                                    { value: '5', label: '5 km' },
                                ]}
                                style={{ width: 90 }}
                            />
                            <Button size="xs" onClick={selectMarkersNearGpx} aria-label="Select markers near GPX">Select</Button>
                        </Group>
                    )}
                </Stack>
            </Modal>

            {/* Marker Selection Tutorial Modal */}
            <Modal
                opened={markerSelectionModalOpen}
                onClose={() => setMarkerSelectionModalOpen(false)}
                title="Marker Selection"
                centered
                size="md"
                closeOnClickOutside
                closeOnEscape
                zIndex={400}
            >
                <Stack gap={0}>
                    <Text>
                        Select and remove markers from the map by clicking them, or by dragging a box (<em>Shift + drag</em>) to select multiple markers at once.
                    </Text>
                    <Text>
                        <ul>
                            <li>Click markers to select or deselect them.</li>
                            <li>Hold <b>shift</b> then drag to select multiple markers.</li>
                            <li>Use the buttons at the bottom to remove markers or clear your selection.</li>
                            <li>When finished, click &quot;Exit Marker Selection&quot; in the sidebar.</li>
                        </ul>
                    </Text>
                    <Button mt="md"
                        color="blue"
                        variant="filled"
                        aria-label="Close marker selection tutorial"
                        onClick={() => {
                            setMarkerSelectionModalOpen(false);
                            setTimeout(() => {
                                setDrawerOpened(false);
                            }, 200);
                        }}
                    >
                        Got it
                    </Button>
                </Stack>
            </Modal >


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
                }
                }
            >
                <MapContainer
                    id="map"
                    center={[51.51, -0.11]}
                    zoom={15}
                    style={{ height: '100%', width: '100%', zIndex: 0 }}
                    zoomControl={false}
                    zoomDelta={0.5}
                    zoomSnap={0.5}
                    ref={mapRef}
                >
                    <TileLayer
                        url={selectedTile.url}
                        attribution={selectedTile.attribution}
                    />
                    <PrintPreviewEffect printPreview={printPreview} paperSize={paperSize} orientation={orientation} containerHeight={containerHeight} containerWidth={containerWidth} />
                    <MapEventsHandler />
                    {markerSelectionMode && <BoxSelectHandler />}
                    {clustering ? (
                        <ClusteredMarkers
                            queries={queries}
                            markerSelectionMode={markerSelectionMode}
                            selectedMarkerIds={selectedMarkerIds}
                            onMarkerSelect={handleMarkerSelect}
                        />
                    ) : (
                        <ClusteredMarkers
                            queries={queries}
                            disableClusteringAtZoom={100}
                            forceNoCluster
                            markerSelectionMode={markerSelectionMode}
                            selectedMarkerIds={selectedMarkerIds}
                            onMarkerSelect={handleMarkerSelect}
                        />
                    )}
                    <UserLocationSetter />
                    {/* Render GPX lines */}
                    {gpxFiles.map((f) => f.geojson.features.map((feat, i) =>
                        feat.geometry.type === 'LineString' ? (
                            <Polyline
                                key={f.id + '-' + i}
                                positions={(feat.geometry.coordinates as [number, number][]).map(([lon, lat]) => [lat, lon])}
                                pathOptions={{ color: f.color, weight: 4, opacity: 0.8 }}
                                renderer={L.canvas()}
                            />
                        ) : feat.geometry.type === 'MultiLineString' ? (
                            (feat.geometry.coordinates as [number, number][][]).map((line, j) => (
                                <Polyline
                                    key={f.id + '-' + i + '-' + j}
                                    positions={line.map(([lon, lat]) => [lat, lon])}
                                    pathOptions={{ color: f.color, weight: 4, opacity: 0.8 }}
                                    renderer={L.canvas()}
                                />
                            ))
                        ) : null
                    ))}
                    {/* In MapContainer, only show AddPlaceMapClickHandler if addPlaceMode is true */}
                    {addPlaceMode && <AddPlaceMapClickHandler />}
                </MapContainer>
            </div >

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
                                color='indigo'
                                leftSection={printPreview ? faClose : faPrint}
                                variant={printPreview ? 'light' : 'outline'}
                                onClick={() => {
                                    setPrintPreview((p) => !p);
                                }}
                                size="xs"
                                aria-label="Toggle print preview"
                            >
                                {printPreview ? 'Exit Print Mode' : 'Print Mode'}
                            </Button>
                        </>
                    )}
                    {isMobile && (
                        <Text c="gray.7" size="sm" pr="lg">
                            Come back on a desktop to print or export the map.
                        </Text>
                    )}
                    {printPreview && (
                        <>
                            <Select
                                size="sm"
                                label="Paper Size"
                                labelProps={{ c: 'gray.7' }}
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
                                labelProps={{ c: 'gray.7' }}
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
                                variant="filled"
                                size="xs"
                                leftSection={faPrint}
                                loading={printLoading}
                                color="lime"
                                aria-label="Print map"
                            >
                                Print
                            </Button>
                        </>
                    )}
                    <Text fw={500} size="md" mt="md">
                        Layers
                    </Text>
                    {/* light gray background for layers section */}
                    <Stack style={{ borderColor: '#ebedef', padding: '10px 10px', borderRadius: '5px', borderWidth: 2, borderStyle: 'solid' }}>
                        <MultiSelect
                            label="Add layers"
                            labelProps={{ c: 'gray.7' }}
                            placeholder="Pick layers to add"
                            data={availablePresets.map((label) => ({
                                value: label,
                                label: queryLabels[label] || label,
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

                        <Stack gap="xs" style={{ maxHeight: '40vh', overflowY: 'auto' }}>
                            {queries.length === 0 && <Text c="dimmed">No layers yet. Add some above!</Text>}
                            {queries.map(({ id, label }) => (
                                <Group key={id} align='center' justify='space-between'>
                                    <Text>{queryLabels[label]}</Text>
                                    <Space style={{ flexGrow: 1 }} />
                                    {label == "parking" && (
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
                                    {/* label === '🗺️ Import GPX' */}
                                    {label == "import_gpx" && (
                                        <ActionIcon
                                            variant="subtle"
                                            color="gray"
                                            size="sm"
                                            onClick={() => setGPXSettingsOpen(true)}
                                            aria-label="Import GPX file"
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
                            size="xs"
                            variant="filled"
                            color="indigo"
                            leftSection={faRefresh}
                            onClick={() => refreshAllQueries().then(() => setDrawerOpened(false))}
                            loading={loading}
                            disabled={queries.length === 0 || !mapBounds || !needsRefresh}
                        >
                            Fetch Data
                        </Button>
                    </Stack>

                    <Select
                        label="Map style"
                        labelProps={{ c: 'gray.7' }}
                        value={tileType}
                        onChange={(value) => {
                            if (value !== null) setTileType(value);
                        }}
                        data={tileOptions.map((t) => ({ value: t.value, label: t.label }))}
                    />

                    <Text fw={500} size="md" mt="md">
                        Markers
                    </Text>
                    {!isMobile && (
                        <Button
                            size="xs"
                            variant={markerSelectionMode ? 'light' : 'outline'}
                            color='indigo'
                            leftSection={markerSelectionMode ? faClose : faMarker}
                            onClick={() => {
                                setMarkerSelectionMode((m) => !m);
                                if (markerSelectionMode) {
                                    setClustering(true); // Disable clustering when entering marker selection mode
                                } else {
                                    setClustering(false); // Re-enable clustering when exiting marker selection mode
                                    setMarkerSelectionModalOpen(true); // Open the tutorial modal when entering marker selection mode
                                }
                            }}
                            aria-label="Toggle marker selection mode"
                        >
                            {markerSelectionMode ? 'Exit Marker Selection' : 'Marker Selection'}
                        </Button>
                    )}

                    <Checkbox
                        label="Marker clustering"
                        checked={clustering}
                        onChange={(e) => setClustering(e.currentTarget.checked)}
                    />
                    <Space h="md" />
                    <SignInButton />
                    <Button
                        component="a"
                        color="teal"
                        href="https://forms.gle/BzXeS9KyEAtwWgxRA"
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="light"
                        size="xs"
                        fullWidth
                        leftSection={<i className="fa-regular fa-comment-dots" />}
                        aria-label="Give feedback"
                    >
                        Give Feedback
                    </Button>
                </Stack>
            </Drawer >
            <Group gap={'8px'}
                style={{
                    position: 'fixed',
                    top: 20,
                    left: 20,
                }}>
                <ActionIcon
                    variant="white"
                    size="lg"
                    id="home-button"
                    component="a"
                    href="/"
                    aria-label="Go to home page"
                >
                    <i className="fas fa-home" />
                </ActionIcon>
                <ActionIcon
                    variant="white"
                    size="lg"
                    id="settings-drawer-button"

                    onClick={() => setDrawerOpened(true)}
                    aria-label="Open settings drawer"
                >
                    {faBars}
                </ActionIcon>

            </Group >
            {/* Refresh button in top middle when needed */}
            {!norefresh && (
                < Button
                    size="xs"
                    variant='white'
                    leftSection={faRefresh}
                    onClick={refreshAllQueries}
                    loading={loading}
                    style={{
                        position: 'fixed',
                        top: 20,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        transformOrigin: 'left',
                        // zIndex: 500,
                        scale: needsRefresh && queries.length > 0 ? 1 : 0,
                        transition: 'scale 0.1s ease',
                    }
                    }
                >
                    Refresh
                </Button >
            )}
            <Group style={{
                position: 'fixed',
                bottom: markerSelectionMode ? 40 : -50,
                opacity: markerSelectionMode ? 1 : 0,
                left: '50%',
                transform: 'translateX(-50%)',
                transformOrigin: 'left',
                transition: '0.4s ease',
            }}>

                <Button
                    size="xs"
                    color="red.9"
                    variant="filled"
                    disabled={!markerSelectionMode || selectedMarkerIds.size === 0}
                    onClick={removeSelectedMarkers}
                    aria-label="Remove unselected markers"
                >
                    Remove Selected
                </Button>
                <Button
                    size="xs"
                    variant="white"
                    color="red.9"
                    onClick={() => removeUnselectedMarkers()}
                    aria-label="Remove other markers"
                    disabled={!markerSelectionMode || selectedMarkerIds.size === 0}
                >
                    Remove Others
                </Button>
                <Button
                    size="xs"
                    variant="filled"
                    color="gray"
                    onClick={() => setSelectedMarkerIds(new Set())}
                    disabled={!markerSelectionMode || selectedMarkerIds.size === 0}
                    aria-label="Clear marker selection"
                >
                    Clear Selection
                </Button>
                <Button
                    size="xs"
                    variant="white"
                    color="gray"
                    onClick={() => {
                        setClustering(true);
                        setMarkerSelectionModalOpen(false);
                        setMarkerSelectionMode(false);
                        setDrawerOpened(false);
                    }}
                    aria-label="Exit marker selection mode"
                >
                    Exit Marker Selection
                </Button>
            </Group >
            {!printPreview && (
                <ActionIcon
                    style={{
                        position: 'fixed',
                        bottom: 32,
                        right: 32,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        background: '#1971c2',
                        color: '#fff',
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        fontSize: 24,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                    size="xl"
                    variant="filled"
                    onClick={() => setAddPlaceHelpOpen(true)}
                    aria-label="Add a place"
                >
                    <i className="fas fa-plus" />
                </ActionIcon>
            )}
        </>
    );
}
