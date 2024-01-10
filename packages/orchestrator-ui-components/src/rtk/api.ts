// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define a service using a base URL and expected endpoints
export const orchestratorApi = createApi({
    reducerPath: 'orchestratorApi',
    baseQuery: fetchBaseQuery({
        // baseUrl: 'https://orchestrator.dev.automation.surf.net',
        baseUrl: 'https://pokeapi.co/api/v2/',
    }),
    endpoints: (builder) => ({
        getPokemonByName: builder.query<any, string>({
            query: (name) => `pokemon/${name}`,
        }),
    }),
});

export const { useGetPokemonByNameQuery } = orchestratorApi;
