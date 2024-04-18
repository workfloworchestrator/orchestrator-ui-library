import React from 'react';

type inUseByRelation = {
    subscription_instance_id: string;
    subscription_id: string;
};

interface WfoInUseByRelationsProps {
    inUseByRelations: inUseByRelation[];
}

export const WfoInUseByRelations = ({
    inUseByRelations,
}: WfoInUseByRelationsProps) => {
    const subscriptionIds = inUseByRelations.map(
        (relation) => relation.subscription_id,
    );

    return <div>WfoInUseBySubscriptions: {subscriptionIds.join(', ')}</div>;
};
