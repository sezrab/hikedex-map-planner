'use client'
import pb from '@/app/pocketbase'

export async function fetchVoteTotal(poiId: string) {
    // Check if the user is authenticated
    if (!pb.authStore.isValid) {
        console.warn("User not authenticated")
        return null
    }
    const userId = pb.authStore.model?.id;
    if (!userId) {
        console.warn("User not authenticated")
        return 0
    }
    const voteCollection = "pois";
    const voteFilter = `poi_id = "${poiId}"`;
    console.log("Fetching vote total for query:", voteFilter, "in collection:", voteCollection);
    // Get the total score for the POI
    const totalScore = await pb
        .collection(voteCollection)
        .getFirstListItem(
            voteFilter,
            {
                requestKey: null,
                expand: 'user',
                $autoCancel: false,
            }
        )
        .then((item) => item?.score || null)
        .catch((err) => {
            console.error("Error fetching vote total:", err);
            return 0;
        });
    return totalScore ? totalScore : 0; // Return 0 if no votes found
}

export async function fetchVoteStatus(poiId: string) {
    // Check if the user is authenticated
    if (!pb.authStore.isValid) {
        console.warn("User not authenticated")
        return 0
    }

    const userId = pb.authStore.model?.id;
    if (!userId) {
        console.warn("User not authenticated")
        return 0
    }

    const voteCollection = "votes";
    const voteFilter = `poi_id = "${poiId}" && user_id = "${userId}"`;

    // Look for existing vote
    const existing = await pb
        .collection(voteCollection)
        .getFirstListItem(voteFilter, { requestKey: null })
        .catch(() => null);
    if (existing) {
        return existing.vote === 1 ? 1 : -1; // Return 1 for
    } else {
        console.log("No vote found for", poiId, voteCollection, userId);
        return 0; // No vote found
    }
}