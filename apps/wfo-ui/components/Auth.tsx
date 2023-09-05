import React, { JSX } from 'react';
import { useSession } from 'next-auth/react';

interface AuthProps {
    children: JSX.Element;
}

const Auth = ({ children }: AuthProps): JSX.Element => {
    const { status } = useSession({ required: true });

    if (status === 'loading') {
        return <></>;
    }
    return children;
};

export default Auth;
