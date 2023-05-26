import type { CodegenConfig } from '@graphql-codegen/cli';
import { GRAPHQL_ENDPOINT } from './apps/example-orchestrator-ui/constants';

const config: CodegenConfig = {
    overwrite: true,
    schema: GRAPHQL_ENDPOINT,
    documents: ['./**/*.tsx', './**/*.ts'],
    // generates: {
    //     './src/gql/': {
    //         preset: 'client',
    //     },
    // },
    generates: {
        './apps/example-orchestrator-ui/__generated__/': {
            preset: 'client',
            plugins: [],
        },
        './graphql.schema.json': {
            plugins: ['introspection'],
        },
    },
};

export default config;
