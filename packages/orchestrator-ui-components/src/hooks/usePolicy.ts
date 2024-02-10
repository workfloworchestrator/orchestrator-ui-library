import { useContext } from 'react';

import { useRouter } from 'next/router';

import { PolicyContext } from '@/contexts';

export const usePolicy = () => {
    const { isAllowed } = useContext(PolicyContext);
    const router = useRouter();

    return {
        isAllowed: (resource: string) => isAllowed(resource, router.asPath),
    };
};
