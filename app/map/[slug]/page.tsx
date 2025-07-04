"use client";

import { useParams } from "next/navigation";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { ExportedMapState } from "@/app/components/map/Map";

const DynamicMap = dynamic(() => import("@/app/components/map/Map"), {
    ssr: false
});

export default function Home() {
    const [jsonData, setJsonData] = useState<ExportedMapState | undefined>(undefined);
    const params = useParams();
    useEffect(() => {
        if (!params?.slug) return;
        fetch(`/mapsJson/${params.slug}.json`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => setJsonData(data ?? undefined))
            .catch((error) => console.error("Error fetching JSON data:", error));
    }, [params?.slug]);
    return (
        <main>
            <DynamicMap jsonData={jsonData} norefresh={jsonData?.norefresh} />
        </main>
    );
}
