import { IntlProvider } from 'next-intl';

import { WfoError } from '@orchestrator-ui/orchestrator-ui-components';
import type { Meta } from '@storybook/react';

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
