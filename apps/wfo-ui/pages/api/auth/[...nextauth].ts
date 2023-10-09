import NextAuth, { AuthOptions, Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';

export type SessionToken = Session & {
    accessToken?: unknown;
};

export const authOptions: AuthOptions = {
    providers: [
        {
            id: process.env.NEXTAUTH_ID || '',
            name: process.env.NEXTAUTH_ID || '',
            clientId: process.env.NEXTAUTH_CLIENT_ID || '',
            clientSecret: process.env.NEXTAUTH_SECRET || '',
            wellKnown: `${
                process.env.NEXTAUTH_ISSUER || ''
            }/.well-known/openid-configuration`,
            type: 'oauth',
            authorization: { params: { scope: 'openid' } },
            checks: ['pkce'],
            idToken: true,
            profile(profile) {
                return {
                    id: profile.sub,
                    name: profile.name ?? profile.preferred_username,
                    email: profile.email,
                    image: profile.picture,
                };
            },
        },
    ],
    callbacks: {
        async jwt({ token, account }) {
            // Persist the OAuth access_token to the token right after signin
            if (account) {
                token.accessToken = account.access_token;
            }
            return token;
        },
        async session({
            session,
            token,
        }: {
            session: SessionToken;
            token: JWT;
        }) {
            // Send properties to the client, like an access_token from a provider.
            session.accessToken = token.accessToken;
            return session;
        },
    },
};
export default NextAuth(authOptions);
