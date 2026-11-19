jest.mock('next-auth/react', () => ({
  getProviders: jest.fn(),
  getSession: jest.fn(),
  signIn: jest.fn(),
  signOut: jest.fn(),
}));

const nowInSeconds = () => Math.floor(Date.now() / 1000);

// Module state (cache, redirect flag) must start empty in each test, so the module and its mocks load again
const loadSessionModule = async () => {
  jest.resetModules();
  const nextAuth = jest.mocked(await import('next-auth/react'));
  nextAuth.getProviders.mockResolvedValue({ keycloak: {} } as never);
  return { ...nextAuth, ...(await import('@/rtk/session')) };
};

describe('session', () => {
  it('can sign in again after a failed attempt', async () => {
    const { reauthenticate, signIn, getProviders } = await loadSessionModule();
    getProviders.mockRejectedValueOnce(new Error('network'));
    jest.spyOn(console, 'error').mockImplementation(() => undefined);

    await reauthenticate();
    sessionStorage.clear();
    await reauthenticate();

    expect(signIn).toHaveBeenCalledTimes(1);
  });

  beforeEach(() => {
    sessionStorage.clear();
  });

  it('shares one session request and reuses a valid session', async () => {
    const { getWfoSession, getSession } = await loadSessionModule();
    const session = { expires: '', accessToken: 'a', accessTokenExpiresAt: nowInSeconds() + 3600 };
    getSession.mockResolvedValue(session);

    await Promise.all([getWfoSession(), getWfoSession(), getWfoSession()]);
    await expect(getWfoSession()).resolves.toBe(session);

    expect(getSession).toHaveBeenCalledTimes(1);
  });

  it('asks again when the access token is about to expire', async () => {
    const { getWfoSession, getSession } = await loadSessionModule();
    getSession.mockResolvedValue({ expires: '', accessTokenExpiresAt: nowInSeconds() + 10 } as never);

    await getWfoSession();
    await getWfoSession();

    expect(getSession).toHaveBeenCalledTimes(2);
  });

  it('signs in again one time, at the only provider, for a session with an error', async () => {
    const { getWfoSession, reauthenticate, getSession, signIn, signOut } = await loadSessionModule();
    getSession.mockResolvedValue({ expires: '', error: 'AccessTokenExpired' } as never);

    await Promise.all([getWfoSession(), getWfoSession(), reauthenticate()]);
    await new Promise(process.nextTick);

    expect(signIn).toHaveBeenCalledTimes(1);
    expect(signIn).toHaveBeenCalledWith('keycloak', { callbackUrl: window.location.href });
    expect(signOut).not.toHaveBeenCalled();
  });

  it('still signs in again after two re-logins within a minute (short token lifespan)', async () => {
    const { reauthenticate, signIn, signOut } = await loadSessionModule();
    sessionStorage.setItem('wfo-reauthentications', JSON.stringify([Date.now() - 50_000, Date.now() - 20_000]));

    await reauthenticate();

    expect(signIn).toHaveBeenCalledTimes(1);
    expect(signOut).not.toHaveBeenCalled();
  });

  it('signs out instead of looping after three re-logins within a minute', async () => {
    const { reauthenticate, signIn, signOut } = await loadSessionModule();
    sessionStorage.setItem(
      'wfo-reauthentications',
      JSON.stringify([Date.now() - 40_000, Date.now() - 25_000, Date.now() - 5_000]),
    );
    jest.spyOn(console, 'error').mockImplementation(() => undefined);

    await reauthenticate();

    expect(signOut).toHaveBeenCalledTimes(1);
    expect(signIn).not.toHaveBeenCalled();
  });
});
