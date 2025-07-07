"use client";
import dynamic from "next/dynamic"
import WelcomePopup from "../components/WelcomePopup";

const DynamicMap = dynamic(() => import("../components/map/Map"), {
    ssr: false
});

import { useEffect, useState } from "react";

export default function Home() {
    const [focus, setFocus] = useState<string | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setFocus(params.get("focus"));
    }, []);

    return (
        <main>
            {!focus && (
                <WelcomePopup />
            )}
            <DynamicMap />
        </main>
    );
}
