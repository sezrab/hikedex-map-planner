'use client'
import { Badge } from "@mantine/core"
import { fetchVoteTotal } from "./fetchVoteData"
import { useEffect, useState } from "react"
export default function VoteStatusBadge({
    poiId,
    poiSource,
}: {
    poiId: string
    poiSource: 'user' | 'osm'
}) {
    const [totalVotes, setTotalVotes] = useState<number | null>(null)

    useEffect(() => {
        async function loadVoteTotal() {
            try {
                const total = await fetchVoteTotal(poiId)
                console.log(`Total votes for ${poiId} (${poiSource}):`, total)
                setTotalVotes(total)
            } catch (error) {
                console.error("Failed to fetch vote total:", error)
            }
        }

        loadVoteTotal()
    }, [poiId, poiSource])

    if (totalVotes === null) return null

    return (
        <Badge
            variant="light"
            color={totalVotes > 0 ? "green" : totalVotes < 0 ? "red" : "gray"}
            size="xs"
            p="sm"
            m={0}
        >
            {totalVotes != 0 ? totalVotes : "No votes yet"}
        </Badge>
    )
}