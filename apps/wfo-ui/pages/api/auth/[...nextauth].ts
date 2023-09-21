import NextAuth from 'next-auth';
import KeycloakProvider from 'next-auth/providers/keycloak';

export const authOptions = {
    providers: [
        KeycloakProvider({
            clientId: process.env.KEYCLOAK_ID || '',
            clientSecret: process.env.KEYCLOAK_SECRET || '',
            issuer: process.env.KEYCLOAK_ISSUER || '',
            version: '2.0',
        }),
    ],
    callbacks: {
        // not sure how to type this...
        // @ts-ignore
        async jwt({ token, account }) {
            // Persist the OAuth access_token to the token right after signin
            if (account) {
                token.accessToken = account.access_token;
            }
            return token;
        },
        // not sure how to type this...
        // @ts-ignore
        async session({ session, token }) {
            // Send properties to the client, like an access_token from a provider.
            session.accessToken = token.accessToken;
            return session;
        },
    },
};
export default NextAuth(authOptions);
