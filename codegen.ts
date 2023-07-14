import type { CodegenConfig } from '@graphql-codegen/cli';
import { GRAPHQL_ENDPOINT_CORE } from './apps/example-orchestrator-ui/constants';

const config: CodegenConfig = {
    documents: [
        'apps/**/*.tsx',
        'apps/**/*.ts',
        'libs/**/*.tsx',
        'libs/**/*.ts',
    ],
    generates: {
        './apps/example-orchestrator-ui/__generated__/': {
            schema: GRAPHQL_ENDPOINT_CORE,
            preset: 'client',
            overwrite: true,
        },
        // './apps/example-orchestrator-ui/__generated__/graphql.schema.json': {
        //     plugins: ['introspection'],
        // },
    },
};

export default config;
