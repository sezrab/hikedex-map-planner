import Image from "next/image";
import Map from "../components/Map";
import { Modal } from "@mantine/core";
import WelcomePopup from "../components/WelcomePopup";

export default function Home() {
    return (
        <main>
            <WelcomePopup />
            <Map />
        </main>
    );
}
