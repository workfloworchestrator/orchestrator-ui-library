import React from 'react';

import { WfoError, WfoLoading } from '@/components';
import { useGetInUseByRelationDetailsQuery } from '@/rtk';
import { InUseByRelation } from '@/types';

interface WfoInUseByRelationsProps {
    inUseByRelations: InUseByRelation[];
}

export const WfoInUseByRelations = ({
    inUseByRelations,
}: WfoInUseByRelationsProps) => {
    const subscriptionIds = inUseByRelations
        .map((relation) => relation.subscription_id)
        .join('|');
    const { data, isLoading, isError } = useGetInUseByRelationDetailsQuery({
        subscriptionIds,
    });
    console.log(data);
    if (isError) {
        return <WfoError />;
    }

    if (isLoading) {
        return <WfoLoading />;
    }
    return <>WIP</>;
};
