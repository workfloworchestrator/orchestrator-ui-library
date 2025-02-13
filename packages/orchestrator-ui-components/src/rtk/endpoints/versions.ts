import { orchestratorApi } from '../api';

const versionsQuery = `
    query Versions {
        version {
            applicationVersions
        }
    }
`;

export type VersionsResponse = {
    version: {
        applicationVersions: [string];
    };
};

const versionsApi = orchestratorApi.injectEndpoints({
    endpoints: (build) => ({
        getVersions: build.query<VersionsResponse, void>({
            query: () => ({
                document: versionsQuery,
            }),
        }),
    }),
});

export const { useGetVersionsQuery } = versionsApi;
