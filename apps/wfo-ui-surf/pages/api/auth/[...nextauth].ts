import NextAuth, { AuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { OAuthConfig } from 'next-auth/providers';

import { SessionToken } from '@orchestrator-ui/orchestrator-ui-components';

const token_endpoint_auth_method = process.env.NEXTAUTH_CLIENT_SECRET
    ? 'client_secret_basic'
    : 'none';

export interface WfoProfile extends Record<string, string> {}

const authActive = process.env.AUTH_ACTIVE?.toLowerCase() != 'false';
const WfoProvider: OAuthConfig<WfoProfile> = {
    id: process.env.NEXTAUTH_ID || '',
    name: process.env.NEXTAUTH_ID || '',
    clientId: process.env.NEXTAUTH_CLIENT_ID || '',
    clientSecret: process.env.NEXTAUTH_CLIENT_SECRET || undefined,
    wellKnown: `${
        process.env.NEXTAUTH_ISSUER || ''
    }/.well-known/openid-configuration`,
    type: 'oauth',
    authorization: { params: { scope: 'openid profile' } },
    checks: ['pkce', 'state'],
    idToken: true,
    profile(profile) {
        return {
            id: profile.sub,
            name: profile.name ?? profile.preferred_username,
            email: profile.email,
        };
    },
    client: {
        token_endpoint_auth_method,
        response_types: ['code'],
    },
};

export const authOptions: AuthOptions = {
    providers: authActive ? [WfoProvider] : [],
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
            session.accessToken = token.accessToken
                ? String(token.accessToken)
                : '';
            return session;
        },
    },
};
export default NextAuth(authOptions);
