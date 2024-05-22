import React, { useEffect } from 'react';

import { getSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

import { useGetOrchestratorConfig } from '@/hooks';

export const WfoRouteChangeListener = () => {
    const router = useRouter();
    const { authActive } = useGetOrchestratorConfig();

    useEffect(() => {
        if (authActive) {
            getSession().then((session) => {
                if (!session) {
                    signIn();
                }            });
        }
    }, [authActive, router]);
    return <></>;
};
