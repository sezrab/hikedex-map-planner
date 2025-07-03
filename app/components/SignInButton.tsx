"use client";
import { Button } from "@mantine/core";
import PocketBase from 'pocketbase';

const pb = new PocketBase('https://api.hikedex.app');

function handleSignIn() {
    pb.authStore.clear(); // Clear any existing auth
    pb.collection('users').authWithOAuth2({
        provider: 'google',
        redirectUrl: window.location.href,
    }).then(() => {
        // Handle successful sign-in
        console.log('Signed in successfully');
    }).catch((error) => {
        // Handle sign-in error
        console.error('Sign-in failed:', error);
    });
}

export default function SignInButton() {
    return (
        <Button color="blue" variant="light" size="xs" component="a" onClick={handleSignIn}>
            <i className="fas fa-sign-in-alt" style={{ marginRight: 8 }}></i>
            Sign In
        </Button >
    );
}