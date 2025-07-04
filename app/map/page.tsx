"use client";
import dynamic from "next/dynamic"
import WelcomePopup from "../components/WelcomePopup";

const DynamicMap = dynamic(() => import("../components/map/Map"), {
    ssr: false
});

export default function Home() {
    return (
        <main>
            <WelcomePopup />
            <DynamicMap />
        </main>
    );
}
