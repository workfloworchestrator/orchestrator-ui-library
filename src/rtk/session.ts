import { getProviders, getSession, signIn, signOut } from 'next-auth/react';

import type { WfoSession } from '@/hooks';

// Ask the session endpoint again this many seconds before the access token expires
const SESSION_EXPIRY_MARGIN_IN_SECONDS = 30;
// More re-logins than this within the window means the API rejects every new token too (a redirect loop):
// sign out instead. Counting, not timing one redirect, so a slow identity provider does not hide a loop.
const REAUTHENTICATE_LOOP_MAX_COUNT = 3;
const REAUTHENTICATE_LOOP_WINDOW_IN_MILLISECONDS = 60_000;
const REAUTHENTICATIONS_KEY = 'wfo-reauthentications';

let cachedSession: { session: WfoSession | null; validUntil: number } | undefined;
let pendingSession: Promise<WfoSession | null> | undefined;
let isReauthenticating = false;

const getCurrentTimeInSeconds = () => Math.floor(Date.now() / 1000);

// Times of the re-logins in this tab within the loop window
const getRecentReauthentications = (): number[] => {
  try {
    const times: unknown = JSON.parse(sessionStorage.getItem(REAUTHENTICATIONS_KEY) ?? '[]');
    return Array.isArray(times) ?
        times.filter(
          (time) => typeof time === 'number' && Date.now() - time < REAUTHENTICATE_LOOP_WINDOW_IN_MILLISECONDS,
        )
      : [];
  } catch {
    return [];
  }
};

const saveReauthentications = (times: number[]) => {
  try {
    sessionStorage.setItem(REAUTHENTICATIONS_KEY, JSON.stringify(times));
  } catch {
    // Without sessionStorage there is no loop guard, the re-login still works
  }
};

/**
 * Signs in again: with an active login at the issuer the user comes back on the same page without a password.
 * signOut() is not used for an expired token, because it also ends the login at the issuer.
 * Many failed calls at the same time give one redirect.
 */
export const reauthenticate = async () => {
  if (isReauthenticating) {
    return;
  }
  isReauthenticating = true;
  cachedSession = undefined;

  const recentReauthentications = getRecentReauthentications();
  if (recentReauthentications.length >= REAUTHENTICATE_LOOP_MAX_COUNT) {
    console.error('The API keeps rejecting the token after signing in again. Signing out.');
    saveReauthentications([]);
    await signOut();
    return;
  }
  saveReauthentications([...recentReauthentications, Date.now()]);

  try {
    // With one provider, go to it directly instead of the provider list page
    const providerIds = Object.keys((await getProviders()) ?? {});
    await signIn(providerIds.length === 1 ? providerIds[0] : undefined, { callbackUrl: window.location.href });
  } catch (error) {
    // Network error: allow the next failed call to try again, instead of a spinner forever
    console.error('Signing in again failed:', error);
    isReauthenticating = false;
  }
};

/**
 * Gets the session one time for all API calls. Calls at the same moment share one request, and the session
 * is reused until its access token is about to expire. Apps that do not send accessTokenExpiresAt only get
 * the shared request. A session with an error starts one re-login.
 */
export const getWfoSession = async (): Promise<WfoSession | null> => {
  if (cachedSession && getCurrentTimeInSeconds() < cachedSession.validUntil) {
    return cachedSession.session;
  }

  // broadcast: false, so other tabs do not fetch the session too
  pendingSession ??= getSession({ broadcast: false })
    .then((session) => {
      const wfoSession = session as WfoSession | null;
      if (wfoSession?.error) {
        reauthenticate();
      } else {
        cachedSession = {
          session: wfoSession,
          validUntil: (wfoSession?.accessTokenExpiresAt ?? 0) - SESSION_EXPIRY_MARGIN_IN_SECONDS,
        };
      }
      return wfoSession;
    })
    .finally(() => {
      pendingSession = undefined;
    });

  return pendingSession;
};
