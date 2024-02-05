import NextAuth, { AuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { OAuthConfig } from 'next-auth/providers';

import {
    WfoSession,
    WfoUserProfile,
} from '@orchestrator-ui/orchestrator-ui-components';

const token_endpoint_auth_method = process.env.NEXTAUTH_CLIENT_SECRET
    ? 'client_secret_basic'
    : 'none';

const authActive = process.env.AUTH_ACTIVE?.toLowerCase() != 'false';
const wfoProvider: OAuthConfig<WfoUserProfile> = {
    id: process.env.NEXTAUTH_ID || '',
    name: process.env.NEXTAUTH_ID || '',
    type: 'oauth',
    clientId: process.env.NEXTAUTH_CLIENT_ID || '',
    clientSecret: process.env.NEXTAUTH_CLIENT_SECRET || undefined,
    wellKnown:
        process.env.NEXTAUTH_WELL_KNOWN_OVERRIDE ??
        `${process.env.NEXTAUTH_ISSUER || ''}/.well-known/openid-configuration`,
    authorization: { params: { scope: 'openid profile' } },
    idToken: true,
    checks: ['pkce', 'state'],
    userinfo: {
        request: async (context) => {
            const { client, tokens } = context;

            if (!context.provider.wellKnown || !tokens.access_token) {
                return {};
            }

            return await client.userinfo(tokens.access_token);
        },
    },
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
    providers: authActive ? [wfoProvider] : [],
    callbacks: {
        async jwt({ token, account, profile }) {
            // The "account" is only available right after signing in -- adding useful data to the token
            if (account) {
                token.accessToken = account.access_token;
                token.profile = profile;
            }
            return token;
        },
        async session({ session, token }: { session: WfoSession; token: JWT }) {
            // Assign data to the session to be available in the client through the useSession hook
            session.profile = token.profile as WfoUserProfile | undefined;
            session.accessToken = token.accessToken
                ? String(token.accessToken)
                : '';

            return session;
        },
    },
};
export default NextAuth(authOptions);
