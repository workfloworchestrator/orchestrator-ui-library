import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
    overwrite: true,
    schema: 'https://api.dev.automation.surf.net/pythia',
    documents: './**/*.tsx',
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
