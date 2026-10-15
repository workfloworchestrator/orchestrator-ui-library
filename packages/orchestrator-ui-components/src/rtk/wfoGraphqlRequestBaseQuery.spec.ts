import { ClientError, GraphQLClient } from 'graphql-request';
import { signOut } from 'next-auth/react';

import { BaseQueryApi } from '@reduxjs/toolkit/query';

import { wfoGraphqlRequestBaseQuery } from '@/rtk/wfoGraphqlRequestBaseQuery';

jest.mock('next-auth/react', () => ({ signOut: jest.fn() }));

const notAuthorized = { message: 'Not authorized', extensions: { error_type: 'not_authorized' } };
const notAuthenticated = { message: 'User is not authenticated', extensions: { error_type: 'not_authenticated' } };

const queryWith = (rawRequest: jest.Mock) =>
  wfoGraphqlRequestBaseQuery(
    {
      client: { rawRequest } as unknown as GraphQLClient,
      customErrors: (error: ClientError) => error.response?.errors,
    },
    true,
  );

const run = (rawRequest: jest.Mock) =>
  queryWith(rawRequest)({ document: '{ version { applicationVersions } }' }, {} as BaseQueryApi, {});

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

    await expect(run(jest.fn().mockResolvedValue({ data: null, errors }))).resolves.toEqual({
      error: errors,
      meta: { errors },
    });
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
    const response = { status: 401, headers: new Headers(), body: '', errors: [notAuthenticated] };
    const clientError = new ClientError(response as unknown as ConstructorParameters<typeof ClientError>[0], {
      query: '',
    });

    const result = await run(jest.fn().mockRejectedValue(clientError));

    expect(result).toMatchObject({ error: [notAuthenticated] });
    expect(signOut).toHaveBeenCalledTimes(1);
  });
});
