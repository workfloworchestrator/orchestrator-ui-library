import React from 'react';
import { Subscriptions } from '@orchestrator-ui/orchestrator-ui-components';
import NoSSR from 'react-no-ssr';

export default function SubscriptionsPage() {
    return (
        <NoSSR>
            <Subscriptions></Subscriptions>
        </NoSSR>
    );
}
