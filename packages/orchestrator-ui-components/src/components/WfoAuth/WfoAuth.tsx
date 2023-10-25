import React, { JSX } from 'react';
import { useSession } from 'next-auth/react';

interface AuthProps {
    children: JSX.Element;
}

export const WfoAuth = ({ children }: AuthProps): JSX.Element => {
    const { status } = useSession({
        required: !!process.env.AUTH_ACTIVE || true,
    });

    if (status === 'loading') {
        return <></>;
    }
    return children;
};
