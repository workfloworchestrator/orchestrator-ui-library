---
"@orchestrator-ui/orchestrator-ui-components": minor
---

Sign in again, instead of signing out, when the access token is no longer valid

- On a REST 401 or a GraphQL `not_authenticated` error the user is sent to sign in again (`signIn()`), not signed out. With an active login at the identity provider the user comes back on the same page without a password. With one provider the next-auth sign-in page is skipped. `events.signOut` no longer runs on an expired token; it still runs on Log out.
- Many failed calls at the same time give one sign-in. More than 3 sign-ins within a minute signs the user out, to stop a redirect loop.
- The session is fetched once for all API calls and reused until shortly before `accessTokenExpiresAt` (seconds since epoch). Apps without `accessTokenExpiresAt` only share calls made at the same moment.
- When the server sets `session.error` (for example `RefreshAccessTokenError` from a failed token refresh), `WfoAuth` shows a spinner and signs in again.
