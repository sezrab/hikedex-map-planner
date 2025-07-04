'use client'

import { Button, Group } from '@mantine/core'
import { useEffect, useState } from 'react'
import { fetchVoteStatus } from './fetchVoteData'
import { SignInModal } from './SignInModal'
import pb from '@/app/pocketbase'

async function submitVote(
    poiId: string,
    voteValue: 1 | 0 | -1,
    poiSource: 'user' | 'osm'
): Promise<number> {
    const res = await fetch('/api/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ poiId, voteValue, poiSource }),
    })
    if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Vote failed')
    }
    const data = await res.json()
    // console.log("Vote response:", data)
    return data.newScore
}


export function VoteButtons({
    poiId,
    poiSource,
    onScoreChange,
}: {
    poiId: string
    poiSource: 'user' | 'osm'
    onScoreChange?: (newScore: number) => void
}) {
    const [voteStatus, setVoteStatus] = useState<1 | 0 | -1>(0)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [modalOpen, setModalOpen] = useState(false)

    useEffect(() => {
        fetchVoteStatus(poiId).then(setVoteStatus)
    }, [poiId, poiSource])

    async function handleVote(voteValue: 1 | 0 | -1) {
        if (!pb.authStore.isValid) {
            setModalOpen(true)
            return
        }
        setLoading(true)
        setError('')
        try {
            const newScore = await submitVote(poiId, voteValue, poiSource)
            setVoteStatus(newScore === 0 ? 0 : voteValue) // Update vote status based on new score
            console.log(`Vote ${voteValue} submitted for ${poiId} (${poiSource}) : `, newScore)
            onScoreChange?.(newScore)
        } catch (e: unknown) {
            if (e instanceof Error) {
                setError(e.message)
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Group gap="xs">
                <Button
                    size="xs"
                    variant={voteStatus === 1 ? "filled" : "light"}
                    color={voteStatus === 1 ? "green" : "gray"}
                    onClick={() => handleVote(1)}
                    loading={loading}
                    disabled={loading}
                >
                    <i className="fa-solid fa-thumbs-up" />
                </Button>
                <Button
                    size="xs"
                    variant={voteStatus === -1 ? "filled" : "light"}
                    color={voteStatus === -1 ? "red" : "gray"}
                    onClick={() => handleVote(-1)}
                    loading={loading}
                    disabled={loading}
                >
                    <i className="fa-solid fa-thumbs-down" />
                </Button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </Group>
            <SignInModal opened={modalOpen} onClose={() => setModalOpen(false)} />
        </>
    )
}
