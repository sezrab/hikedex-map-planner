import pb from "@/app/pocketbase";
import L from "leaflet";
import { OsmElement } from "./mapPresets";

// params: bounding box coordinates in form [west, south, east, north]
export async function fetchCommunityNodes(bounds: L.LatLngBounds, layer: string): Promise<OsmElement[]> {
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();
    const records = await pb.collection('community_pois').getFullList({
        filter: `layer="${layer}" && lat >= ${sw.lat} && lat <= ${ne.lat} && lon >= ${sw.lng} && lon <= ${ne.lng}`,
        sort: '-created',
        expand: 'createdBy',
    });
    return records.map((record) => {
        const { id, lat, lon, name, description, ...rest } = record;
        // Convert string id to a number (hash or timestamp fallback)
        let numericId = 0;
        if (typeof id === 'string') {
            // Simple hash function for string id
            numericId = Array.from(id).reduce((acc, c) => acc + c.charCodeAt(0), 0);
        } else if (typeof id === 'number') {
            numericId = id;
        } else {
            numericId = Date.now();
        }
        // Only include string fields in tags
        const tagFields: Record<string, string> = {
            name: name ? String(name) : '',
            description: description ? String(description) : '',
            hd_community: 'true',
        };
        Object.entries(rest).forEach(([k, v]) => {
            if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
                tagFields[k] = String(v);
            }
        });
        return {
            id: numericId,
            lat,
            lon,
            tags: tagFields,
        } as OsmElement;
    });
}