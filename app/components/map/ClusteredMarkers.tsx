'use client';

import { useState, useEffect, useRef } from 'react';
import { useMapEvents } from 'react-leaflet';
import { queryIcons, OsmElement, Query } from './mapPresets';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import { Modal, Table, Accordion, AccordionItem, AccordionControl, AccordionPanel } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import {
    Button,
    Stack,
    Group,
    Text,
    Space,
} from '@mantine/core';
import { VoteButtons } from '../Voting/VoteButtons';
import VoteStatusBadge from '../Voting/VoteStatusBadge';
import { generateNodeDescription } from './generateNodeDescriptions';


export function ClusteredMarkers({ queries, disableClusteringAtZoom, forceNoCluster, markerSelectionMode = false, selectedMarkerIds = new Set(), onMarkerSelect = () => { } }: { queries: Query[], disableClusteringAtZoom?: number, forceNoCluster?: boolean, markerSelectionMode?: boolean, selectedMarkerIds?: Set<number>, onMarkerSelect?: (id: number) => void }) {
    const map = useMapEvents({});
    const markerClusterGroup = useRef<L.MarkerClusterGroup | null>(null);

    const [nodeModalOpen, setNodeModalOpen] = useState(false);
    const [nodeModalData, setNodeModalData] = useState<OsmElement | null>(null);

    const [streetviewModalOpen, setStreetviewModalOpen] = useState(false);
    const [streetviewData, setStreetviewData] = useState<OsmElement | null>(null);

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
            const iconHtml = (el: OsmElement) => `
                <div 
                    style="${markerStyle};${markerSelectionMode && selectedMarkerIds.has(el.id) ? 'box-shadow: 0 0 0 3px #2563eb;' : ''};transition: transform 0.15s cubic-bezier(.4,2,.6,1);"
                    onmouseover="this.style.transform='scale(1.1)'"
                    onmouseout="this.style.transform='scale(1)'"
                >
                    ${queryIcons[query.label] || '<i class="fas fa-map-marker-alt"></i>'}
                </div>
            `;
            query.data.forEach((el) => {
                try {
                    const marker = L.marker([el.lat, el.lon], {
                        icon: L.divIcon({
                            html: iconHtml(el),
                            className: '',
                            iconSize: [32, 32],
                            iconAnchor: [16, 32],
                        }),
                        title: query.label, // store query label to identify marker type in cluster icon
                    });
                    marker.on('click', () => {
                        if (markerSelectionMode) {
                            onMarkerSelect(el.id);
                        } else {
                            setNodeModalData(el);
                            setNodeModalOpen(true);
                        }
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
    }, [queries, map, disableClusteringAtZoom, forceNoCluster, markerSelectionMode, selectedMarkerIds, onMarkerSelect]);

    const nodeDesc = generateNodeDescription(nodeModalData);
    return (
        <>
            <Modal opened={nodeModalOpen} onClose={() => setNodeModalOpen(false)} title={nodeDesc.title} size={'md'} centered>
                {nodeModalData?.tags ? (
                    <Stack>
                        <Group gap="xs">
                            {/* share button */}
                            {/* toasts "Copied to clipboard" */}
                            <VoteStatusBadge poiId={`${nodeModalData.lat}, ${nodeModalData.lon}`} poiSource={'osm'} />
                            <Button
                                variant="subtle"
                                color="dark.3"
                                size="xs"
                                p={'5px'}
                                component="a"
                                onClick={() => {
                                    navigator.clipboard.writeText(`https://hikedex.app/map?focus=${nodeModalData.lat},${nodeModalData.lon}&layers=${nodeDesc.layer}`);
                                    notifications.show({
                                        title: 'Link copied to clipboard',
                                        message: `Thank you for sharing! You can now paste this link anywhere.`,
                                        color: 'blue',
                                        autoClose: 2000,
                                        icon: <i className="fas fa-link" />,
                                    });
                                }
                                }
                                aria-label="Share this node"
                            >
                                <i className="fas fa-link" />
                            </Button>

                            <Space flex="1" />
                            <VoteButtons poiId={nodeModalData.lat + ',' + nodeModalData.lon} poiSource={'osm'} />
                        </Group>
                        {/* If amenity=parking but access tag is missing, display a warning */}
                        {nodeDesc.warning && (
                            <Text c="dark.5" size="sm">
                                <b>Warning:</b> {nodeDesc.warning}
                            </Text>
                        )}

                        {nodeDesc.descriptions.map((desc, index) => (
                            <Text key={index} size="sm" style={{ whiteSpace: 'pre-wrap' }}>
                                {desc}
                            </Text>
                        ))}

                        {/* If there are coordinates, display them */}
                        {(nodeModalData.lat !== undefined && nodeModalData.lon !== undefined) && (
                            <Text size="sm" c="dimmed">
                                Coordinates: {nodeModalData.lat.toFixed(6)}, {nodeModalData.lon.toFixed(6)}
                            </Text>
                        )}

                        {/* If there are tags, display them in a table */}

                        <Accordion variant='filled' chevronPosition="left">
                            <AccordionItem value="tags">
                                <AccordionControl>
                                    <Text size="sm">
                                        Source
                                    </Text>
                                </AccordionControl>
                                <AccordionPanel>
                                    <Table striped highlightOnHover withTableBorder withColumnBorders>
                                        <Table.Thead>
                                            <Table.Tr>
                                                <Table.Th style={{ width: 120 }}>Tag</Table.Th>
                                                <Table.Th>Value</Table.Th>
                                            </Table.Tr>
                                        </Table.Thead>
                                        <Table.Tbody>
                                            {Object.entries(nodeModalData.tags).map(([key, value]) => (
                                                <Table.Tr key={key}>
                                                    <Table.Td>{key}</Table.Td>
                                                    <Table.Td style={{ wordBreak: 'break-word' }}>
                                                        {typeof value === 'string' && (
                                                            // URL
                                                            /^https?:\/\/\S+$/i.test(value) ? (
                                                                <a href={value} target="_blank" rel="noopener noreferrer">{value}</a>
                                                            ) :
                                                                // Email
                                                                /^[\w.-]+@[\w.-]+\.\w{2,}$/.test(value) ? (
                                                                    <a href={`mailto:${value}`}>{value}</a>
                                                                ) : (
                                                                    // If key = "phone" then format as phone number
                                                                    key === 'phone' ? (
                                                                        <a href={`tel:${value}`}>{value}</a>
                                                                    ) :
                                                                        // Otherwise just display the string
                                                                        value
                                                                )
                                                        )}
                                                        {/* {typeof value !== 'string' && value} */}
                                                    </Table.Td>
                                                </Table.Tr>
                                            ))}
                                        </Table.Tbody >
                                    </Table >
                                </AccordionPanel >
                            </AccordionItem >
                        </Accordion >

                        {
                            nodeModalData.lat !== undefined && nodeModalData.lon !== undefined && (
                                <Group gap="xs">
                                    <Button
                                        component="a"
                                        href={`https://www.google.com/maps/search/?api=1&query=${nodeModalData.lat},${nodeModalData.lon}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        color="blue"
                                        aria-label="Open in Google Maps"
                                        flex="1"
                                    >
                                        Open in Google Maps
                                    </Button>
                                    <Button
                                        variant="light"
                                        color="blue"
                                        onClick={() => {
                                            setStreetviewData(nodeModalData);
                                            setStreetviewModalOpen(true);
                                        }}
                                        aria-label="Open Street View"
                                    >
                                        <i className="fas fa-street-view" />
                                    </Button>
                                </Group>

                            )
                        }
                    </Stack >
                ) : (
                    <div>No tag data available.</div>
                )
                }
            </Modal >
            <Modal opened={streetviewModalOpen} onClose={() => setStreetviewModalOpen(false)} title={nodeDesc.title + ': street view'} size={'lg'} centered>
                {streetviewData ? (
                    <iframe
                        src={`https://www.google.com/maps/embed/v1/streetview?key=AIzaSyB2NIWI3Tv9iDPrlnowr_0ZqZWoAQydKJU&location=${streetviewData.lat},${streetviewData.lon}`}
                        width="100%"
                        height="400"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                    ></iframe>
                ) : (
                    <div>No Street View data available.</div>
                )}
            </Modal>
        </>
    );
}