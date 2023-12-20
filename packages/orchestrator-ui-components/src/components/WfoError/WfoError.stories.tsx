import React from 'react';

import { IntlProvider } from 'next-intl';

import type { Meta } from '@storybook/react';

import { WfoError } from './WfoError';

const Story: Meta<typeof WfoError> = {
    component: () => {
        return (
            <IntlProvider
                locale="en-GB"
                messages={{ common: { errorMessage: 'ERROR!' } }}
            >
                <WfoError />
            </IntlProvider>
        );
    },
    title: 'Error',
};
export default Story;

export const Primary = {
    args: {},
};
