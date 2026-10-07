import { signOut } from 'next-auth/react';

import { HttpStatus, catchErrorResponse } from '@/rtk/api';

jest.mock('next-auth/react', () => ({ signOut: jest.fn(), getSession: jest.fn() }));

const fakeResponse = (status: number, body: unknown = {}) =>
  ({ status, body: null, json: () => Promise.resolve(body) }) as unknown as Response;

describe('catchErrorResponse', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  it('signs out on 401 when auth is active', async () => {
    await expect(catchErrorResponse(fakeResponse(HttpStatus.Unauthorized), true)).resolves.toBeUndefined();
    expect(signOut).toHaveBeenCalledTimes(1);
  });

  it('does not sign out on 401 when auth is not active', async () => {
    await expect(catchErrorResponse(fakeResponse(HttpStatus.Unauthorized, { detail: 'x' }), false)).resolves.toEqual({
      detail: 'x',
    });
    expect(signOut).not.toHaveBeenCalled();
  });

  it.each([true, false])('does not sign out on 403 (authActive=%s) and returns the body', async (authActive) => {
    const body = { detail: "User is not authorized to start 'x' workflow", status: 403, title: 'Forbidden' };
    await expect(catchErrorResponse(fakeResponse(HttpStatus.Forbidden, body), authActive)).resolves.toEqual(body);
    expect(signOut).not.toHaveBeenCalled();
  });

  it('returns an empty object on 204', async () => {
    await expect(catchErrorResponse(fakeResponse(HttpStatus.NoContent), true)).resolves.toEqual({});
  });
});
