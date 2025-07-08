import { OsmElement } from "./mapPresets";
export function generateNodeDescription(node: OsmElement | null): {
    title: string;
    layer?: string;
    descriptions: string[];
    warning: string | null;
} {
    if (node) {
        // Make a verbose description of the node.
        if (node.tags?.hd_community === "true") {
            if (node.tags?.layer === "parking") {
                return {
                    title: node.tags?.name || "Parking Area (community data)",
                    layer: node.tags.hd_layer,
                    descriptions: [
                        node.tags?.description || "See the source data below for more information.",
                    ],
                    warning: `This is a community-contributed parking area. Please verify the details before relying on them.`,
                };
            }
        }
        // Case 1: amenity=parking
        if (node.tags?.amenity === "parking") {
            let title = "Parking Area";
            let warning = null;
            const descriptions: string[] = [];

            // warning if                         {modalData.tags.amenity === 'parking' && !modalData.tags.access && (
            //                                 <b>Note:</b> This parking area does not specify access restrictions and may not be open to the public.

            if (node.tags.name) {
                title = node.tags.name;
            } else {
                title = "Parking Area";
            }

            if (!node.tags?.access) {
                warning = "This parking area does not specify access restrictions and may not be open to the public.";
            }

            let park_type = "A parking area";
            if (node.tags.parking) {
                if (node.tags.parking === "street_side" || node.tags.parking === "street-side" || node.tags.parking === "streetside") {
                    park_type = "Street-side parking";
                } else if (node.tags.parking === "layby") {
                    park_type = "A layby";
                } else if (node.tags.parking === "garage") {
                    park_type = "A parking garage";
                } else if (node.tags.parking === "surface") {
                    park_type = "A car park";
                } else if (node.tags.parking === "multi-storey") {
                    park_type = "A multi-storey car park";
                }
            }

            if (node.tags.access === "yes") {
                descriptions.push(`${park_type} with public access.`);
            } else if (node.tags.access === "permissive") {
                descriptions.push(`${park_type} with permissive access (usually open to the public but not officially designated).`);
            } else if (!node.tags.access) {
                if (node.tags.parking === "street_side" || node.tags.parking === "layby" || node.tags.parking === "streetside") {
                    descriptions.push(`${park_type} that is likely open to the public.`);
                    warning = null;
                }
            }

            if (!node.tags.fee) {
                descriptions.push("No fee information available.");
            } else if (node.tags.fee === "yes") {
                descriptions.push("This parking area requires a fee for use.");
            } else if (node.tags.fee === "no") {
                descriptions.push("Parking is free in this area.");
            } else {
                descriptions.push(`Parking fee: ${node.tags.fee}`);
            }

            if (node.tags.capacity) {
                descriptions.push(`Capacity: ${node.tags.capacity} vehicles.`);
            }

            return {
                title: title,
                layer: node.tags.hd_layer,
                descriptions: descriptions,
                warning: warning,
            };
        }
    }
    return {
        title: node?.tags?.name || "Details",
        layer: node?.tags?.hd_layer || "unknown",
        descriptions: ["Check the source data below for more information."],
        warning: null,
    };
}