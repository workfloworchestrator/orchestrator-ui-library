import { orchestratorApi } from '../api';

const versionsQuery = `
    query Versions {
        versions {
            applicationVersions
        }
    }
`;

export type VersionsResponse = {
    versions: {
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
