import { NextRequest, NextResponse } from "next/server";
import { getServerPbClient } from "../../utils/getServerPbClient";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { name, description, layer, lat, lon } = data;
    if (!name || !layer || !lat || !lon) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    const pbClient = await getServerPbClient();
    const record = await pbClient.collection("community_pois").create({
      name,
      description,
      layer,
      lat: lat,
      lon: lon,
      createdBy: pbClient.authStore.model?.id || "anonymous",
    });
    return NextResponse.json({ success: true, record });
  } catch (error) {
    console.error("Failed to add community POI:", error);
    return NextResponse.json({ error: "Failed to add place" }, { status: 500 });
  }
}
