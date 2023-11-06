import React, { JSX } from 'react';
import { useSession } from 'next-auth/react';
import { WfoLoading } from '../WfoLoading';

interface AuthProps {
    children: JSX.Element;
}

export const WfoAuth = ({ children }: AuthProps): JSX.Element => {
    const { status } = useSession({
        required: !!process.env.AUTH_ACTIVE || true,
    });

    if (status === 'loading') {
        return <WfoLoading />;
    }
    return children;
};
