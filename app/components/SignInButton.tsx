import { useState, useEffect } from 'react';
import { Button } from '@mantine/core';
import dynamic from 'next/dynamic';
import pb from '@/app/pocketbase';

export async function handleSignIn(onAuthChange: () => void, onFailure?: (error: unknown) => void) {
    try {
        await pb.collection('users').authWithOAuth2({ provider: 'google' });
        document.cookie = pb.authStore.exportToCookie({ httpOnly: false });
        onAuthChange();
    } catch (error) {
        console.error('Sign in failed:', error);
        if (onFailure) onFailure(error);
        else alert('Sign in failed. Please try again.');
    }
}

export function SignInButton({ onSuccess, onFailure }: { onSuccess?: () => void; onFailure?: (error: unknown) => void }) {
    const [isSignedIn, setIsSignedIn] = useState(pb.authStore.isValid);

    useEffect(() => {
        // Listen for auth changes if needed
        const unsubscribe = pb.authStore.onChange(() => {
            setIsSignedIn(pb.authStore.isValid);
        });
        return () => unsubscribe();
    }, []);

    return isSignedIn ? (
        <Button
            size='xs'
            variant="light"
            color="blue"
            style={{ width: '100%' }}
            onClick={() => {
                pb.authStore.clear();
                document.cookie = pb.authStore.exportToCookie({ httpOnly: false });
                setIsSignedIn(false);
            }}
        >
            Log out
        </Button>
    ) : (
        <Button
            size='xs'
            leftSection={<i className="fa-brands fa-google" />}
            variant="light"
            color="blue"
            onClick={() => handleSignIn(() => {
                setIsSignedIn(true);
                onSuccess?.();
            }, onFailure)}
            style={{ width: '100%' }}
        >
            Sign in with Google
        </Button>
    );
}

export default dynamic(() => Promise.resolve(SignInButton), { ssr: false });