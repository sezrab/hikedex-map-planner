import { NextRequest, NextResponse } from "next/server";
import { getServerPbClient } from "@/app/utils/getServerPbClient";

export async function POST(req: NextRequest) {
  try {
    const pb = await getServerPbClient();

    if (!pb.authStore.isValid) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    const { poiId, voteValue, poiSource } = await req.json(); // poiSource: 'user' | 'osm'

    if (
      typeof poiId !== "string" ||
      !["user", "osm"].includes(poiSource) ||
      ![1, -1].includes(voteValue)
    ) {
      console.error("Invalid input:", { poiId, voteValue, poiSource });
      return NextResponse.json(
        { error: "Invalid input", details: { poiId, voteValue, poiSource } },
        { status: 400 }
      );
    }

    const userId = pb.authStore.model?.id;
    if (!userId) {
      return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
    }

    // const voteCollection = poiSource === "user" ? "user_poi_votes" : "osm_votes";
    const voteCollection = "votes";
    const voteFilter = `poi_id = "${poiId}" && user_id = "${userId}"`;

    // Look for existing vote
    const existing = await pb
      .collection(voteCollection)
      .getFirstListItem(voteFilter, { requestKey: null })
      .catch((err) => {
        console.error("Error fetching existing vote:", err);
        return null;
      });

    if (existing) {
      if (existing.vote === voteValue) {
        // Cancel vote
        console.log("Cancelling existing vote:", existing);
        await pb.collection(voteCollection).delete(existing.id);
      } else {
        // Change vote
        await pb
          .collection(voteCollection)
          .update(existing.id, { vote: voteValue });
      }
    } else {
      // New vote
      const payload = { poi_id: poiId, user_id: userId, vote: voteValue };
      await pb.collection(voteCollection).create(payload);
    }

    // Recalculate total score
    const allVotes = await pb
      .collection(voteCollection)
      .getFullList({
        filter: `poi_id = "${poiId}"`,
      })
      .catch((err) => {
        console.error("Error fetching all votes:", err);
        return [];
      });

    const newScore = allVotes.reduce((sum, v) => sum + (v.vote || 0), 0);

    // Update or create poi collection.
    // id, poi_id, score
    const poiCollection = "pois";
    const poiFilter = `poi_id = "${poiId}"`;
    const poiItem = await pb
      .collection(poiCollection)
      .getFirstListItem(poiFilter, { requestKey: null })
      .catch((err) => {
        console.error("Error fetching poi item:", err);
        return null;
      });
    if (poiItem) {
      await pb
        .collection(poiCollection)
        .update(poiItem.id, { score: newScore });
    } else {
      await pb.collection(poiCollection).create({
        poi_id: poiId,
        score: newScore,
      });
    }

    return NextResponse.json({ newScore });
  } catch (err: any) {
    console.error("API /api/vote error:", err);
    return NextResponse.json(
      { error: "Internal Server Error", details: err?.message || err },
      { status: 500 }
    );
  }
}
