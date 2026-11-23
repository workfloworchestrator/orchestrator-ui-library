import { HttpStatus, catchErrorResponse } from '@/rtk/api';
import { reauthenticate } from '@/rtk/session';

jest.mock('@/rtk/session', () => ({ reauthenticate: jest.fn(), getWfoSession: jest.fn() }));

const fakeResponse = (status: number, body: unknown = {}) =>
  ({ status, body: null, json: () => Promise.resolve(body) }) as unknown as Response;

describe('catchErrorResponse', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  it('signs in again on 401 when auth is active', async () => {
    await expect(catchErrorResponse(fakeResponse(HttpStatus.Unauthorized), true)).resolves.toBeUndefined();
    expect(reauthenticate).toHaveBeenCalledTimes(1);
  });

  it('does not sign in again on 401 when auth is not active', async () => {
    await expect(catchErrorResponse(fakeResponse(HttpStatus.Unauthorized, { detail: 'x' }), false)).resolves.toEqual({
      detail: 'x',
    });
    expect(reauthenticate).not.toHaveBeenCalled();
  });

  it.each([true, false])('does not sign in again on 403 (authActive=%s) and returns the body', async (authActive) => {
    const body = { detail: "User is not authorized to start 'x' workflow", status: 403, title: 'Forbidden' };
    await expect(catchErrorResponse(fakeResponse(HttpStatus.Forbidden, body), authActive)).resolves.toEqual(body);
    expect(reauthenticate).not.toHaveBeenCalled();
  });

  it('returns an empty object on 204', async () => {
    await expect(catchErrorResponse(fakeResponse(HttpStatus.NoContent), true)).resolves.toEqual({});
  });
});
