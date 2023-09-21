import NextAuth, { AuthOptions, Session } from 'next-auth';
import KeycloakProvider from 'next-auth/providers/keycloak';
import { JWT } from 'next-auth/jwt';

export type SessionToken = Session & {
    accessToken?: unknown;
};

export const authOptions: AuthOptions = {
    providers: [
        KeycloakProvider({
            clientId: process.env.KEYCLOAK_ID || '',
            clientSecret: process.env.KEYCLOAK_SECRET || '',
            issuer: process.env.KEYCLOAK_ISSUER || '',
            version: '2.0',
        }),
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
