import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';

export type SessionToken = Session & {
    accessToken?: string;
};

export const useSessionWithToken = () => {
    const sessionData = useSession();
    const dataWithToken = sessionData.data as SessionToken;
    return { ...sessionData, session: dataWithToken };
};
