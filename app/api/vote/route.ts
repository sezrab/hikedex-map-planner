import { NextRequest, NextResponse } from "next/server";
import { getServerPbClient } from "@/app/utils/getServerPbClient";

export async function POST(req: NextRequest) {
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
    // Include the input in the error response for better debugging
    console.error("Invalid input:", { poiId, voteValue, poiSource });
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
    .catch(() => null);

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
  const allVotes = await pb.collection(voteCollection).getFullList({
    filter:
      poiSource === "user" ? `poi_id = "${poiId}"` : `poi_id = "${poiId}"`,
  });

  const newScore = allVotes.reduce((sum, v) => sum + (v.vote || 0), 0);

  // Update or create poi collection.
  // id, poi_id, score
  const poiCollection = "pois";
  const poiFilter = `poi_id = "${poiId}"`;
  const poiItem = await pb
    .collection(poiCollection)
    .getFirstListItem(poiFilter, { requestKey: null })
    .catch(() => null);
  if (poiItem) {
    await pb.collection(poiCollection).update(poiItem.id, { score: newScore });
  } else {
    await pb.collection(poiCollection).create({
      poi_id: poiId,
      score: newScore,
    });
  }

  return NextResponse.json({ newScore });
}
