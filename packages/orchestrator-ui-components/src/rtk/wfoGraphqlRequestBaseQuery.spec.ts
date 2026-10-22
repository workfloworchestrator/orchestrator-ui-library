import { ClientError, GraphQLClient } from 'graphql-request';
import { signOut } from 'next-auth/react';

import { BaseQueryApi } from '@reduxjs/toolkit/query';

import { wfoGraphqlRequestBaseQuery } from '@/rtk/wfoGraphqlRequestBaseQuery';

jest.mock('next-auth/react', () => ({ signOut: jest.fn() }));

const notAuthorized = { message: 'Not authorized', extensions: { error_type: 'not_authorized' } };
const notAuthenticated = { message: 'User is not authenticated', extensions: { error_type: 'not_authenticated' } };

const document = '{ version { applicationVersions } }';

const toErrorList = (error: ClientError): unknown => error.response?.errors;

const queryWith = (rawRequest: jest.Mock, authActive: boolean, customErrors: (error: ClientError) => unknown) =>
  wfoGraphqlRequestBaseQuery(
    {
      client: { rawRequest } as unknown as GraphQLClient,
      customErrors,
    },
    authActive,
  );

const run = (rawRequest: jest.Mock, authActive = true, customErrors = toErrorList) =>
  queryWith(rawRequest, authActive, customErrors)({ document }, {} as BaseQueryApi, {});

const clientErrorWith = (status: number, errors: unknown[]) =>
  new ClientError(
    { status, headers: new Headers(), body: '', errors } as unknown as ConstructorParameters<typeof ClientError>[0],
    { query: document },
  );

describe('wfoGraphqlRequestBaseQuery', () => {
  it('returns the data of a successful response', async () => {
    const data = { version: { applicationVersions: ['orchestrator-core 5.4.0'] } };

    await expect(run(jest.fn().mockResolvedValue({ data }))).resolves.toEqual({
      data,
      meta: { errors: undefined },
    });
  });

  it('returns the errors as an error when the response has errors and no data', async () => {
    const errors = [notAuthorized];

    await expect(run(jest.fn().mockResolvedValue({ data: null, errors }))).resolves.toMatchObject({
      error: errors,
      meta: { request: { query: document }, response: { data: null, errors } },
    });
  });

  // The configured customErrors shape must not depend on the HTTP status the errors came with
  it('converts the errors with customErrors for a response without data, as for a non-2xx response', async () => {
    const toDetail = (error: ClientError) => ({
      status: error.response.status,
      data: { detail: error.response.errors?.[0]?.message },
    });

    const resolved = await run(
      jest.fn().mockResolvedValue({ data: null, errors: [notAuthorized], status: 200 }),
      true,
      toDetail,
    );
    const rejected = await run(jest.fn().mockRejectedValue(clientErrorWith(403, [notAuthorized])), true, toDetail);

    expect(resolved).toMatchObject({ error: { status: 200, data: { detail: 'Not authorized' } } });
    expect(rejected).toMatchObject({ error: { status: 403, data: { detail: 'Not authorized' } } });
  });

  it('keeps the data of a partial response with errors', async () => {
    const data = { version: null, products: { page: [] } };
    const errors = [notAuthorized];

    await expect(run(jest.fn().mockResolvedValue({ data, errors }))).resolves.toEqual({
      data,
      meta: { errors },
    });
  });

  it('signs out when a non-2xx response reports the user as not authenticated', async () => {
    const result = await run(jest.fn().mockRejectedValue(clientErrorWith(401, [notAuthenticated])));

    expect(result).toMatchObject({ error: [notAuthenticated] });
    expect(signOut).toHaveBeenCalledTimes(1);
  });

  // orchestrator-core reports a missing or invalid token on GraphQL with HTTP 200, which resolves with errorPolicy 'all'
  it('signs out when a resolved response reports the user as not authenticated', async () => {
    const errors = [notAuthenticated];

    await expect(run(jest.fn().mockResolvedValue({ data: null, errors }))).resolves.toMatchObject({ error: errors });
    expect(signOut).toHaveBeenCalledTimes(1);
  });

  it('does not sign out when a resolved response reports the user as not authorized', async () => {
    await run(jest.fn().mockResolvedValue({ data: null, errors: [notAuthorized] }));

    expect(signOut).not.toHaveBeenCalled();
  });

  it('does not sign out on not authenticated when auth is not active', async () => {
    await run(jest.fn().mockResolvedValue({ data: null, errors: [notAuthenticated] }), false);

    expect(signOut).not.toHaveBeenCalled();
  });
});
