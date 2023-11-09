import React, { JSX } from 'react';
import { useSession } from 'next-auth/react';
import { WfoLoading } from '../WfoLoading';

interface AuthProps {
    isActive: boolean;
    children: JSX.Element;
}

export const WfoAuth = ({ isActive, children }: AuthProps): JSX.Element => {
    console.log(isActive);
    const { status } = useSession({
        required: isActive,
    });

    if (status === 'loading') {
        return <WfoLoading />;
    }
    return children;
};
