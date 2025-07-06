import { Modal, Text } from '@mantine/core';
import { SignInButton } from '../SignInButton';

export function SignInModal({ action, opened, onClose }: { action: string; opened: boolean; onClose: () => void }) {
    return (
        <Modal opened={opened} onClose={onClose} title="Sign in required" zIndex={1100} centered>
            <Text mb="md">You need to sign in to {action}.</Text>
            <SignInButton onSuccess={onClose} onFailure={() => alert('Sign in failed. Please try again.')} />
        </Modal>
    );
}
