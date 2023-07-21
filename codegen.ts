import type { CodegenConfig } from '@graphql-codegen/cli';
import { GRAPHQL_ENDPOINT_CORE } from './apps/example-orchestrator-ui/constants';

const config: CodegenConfig = {
    documents: [
        'apps/**/*.tsx',
        'apps/**/*.ts',
        'libs/**/*.tsx',
        'libs/**/*.ts',
    ],
    overwrite: true,
    generates: {
        './apps/example-orchestrator-ui/__generated__/': {
            schema: GRAPHQL_ENDPOINT_CORE,
            preset: 'client',
        },
        './apps/example-orchestrator-ui/__generated__/gql-core.schema.json': {
            schema: GRAPHQL_ENDPOINT_CORE,
            plugins: ['introspection'],
        },
    },
};

export default config;
