import type { Session } from 'next-auth';
import { useSession } from 'next-auth/react';

export type SessionWithToken = Session & {
    accessToken?: string;
};

export const useSessionWithToken = () => {
    const sessionData = useSession();
    const dataWithToken = sessionData.data as SessionWithToken;
    return { ...sessionData, session: dataWithToken };
};
