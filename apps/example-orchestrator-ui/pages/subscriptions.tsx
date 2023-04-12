import React from 'react';
import NoSSR from 'react-no-ssr';
import { Subscriptions } from '../components/Subscriptions/Subscriptions';

export default function SubscriptionsPage() {
    return (
        <NoSSR>
            <Subscriptions />
        </NoSSR>
    );
}
