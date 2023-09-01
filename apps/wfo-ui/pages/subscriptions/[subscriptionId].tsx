import React from 'react';

import NoSSR from 'react-no-ssr';
import { WFOSubscriptionDetailPage } from '@orchestrator-ui/orchestrator-ui-components';

const SubscriptionDetailPage = () => {
    return (
        <NoSSR>
            <WFOSubscriptionDetailPage />
        </NoSSR>
    );
};

export default SubscriptionDetailPage;
