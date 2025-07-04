import { Modal, Text } from '@mantine/core';
import { SignInButton } from '../SignInButton';

export function SignInModal({ opened, onClose }: { opened: boolean; onClose: () => void }) {
    return (
        <Modal opened={opened} onClose={onClose} title="Sign in required" centered>
            <Text mb="md">You need to sign in to vote.</Text>
            <SignInButton onSuccess={onClose} onFailure={() => alert('Sign in failed. Please try again.')} />
        </Modal>
    );
}
