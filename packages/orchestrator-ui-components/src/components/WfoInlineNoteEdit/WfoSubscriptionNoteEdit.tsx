import type { FC } from 'react';
import React from 'react';

import { ApiResult, SubscriptionListResponse, UseQuery } from '@/rtk';
import { useStartProcessMutation } from '@/rtk/endpoints/forms';
import { useUpdateSubscriptionNoteOptimisticMutation } from '@/rtk/endpoints/subscriptionListMutation';
import { Subscription } from '@/types';
import { INVISIBLE_CHARACTER } from '@/utils';

import { WfoInlineEdit } from '../WfoInlineEdit';

interface WfoSubscriptionNoteEditProps {
    subscriptionId: Subscription['subscriptionId'];
    onlyShowOnHover?: boolean;
    queryVariables: Record<string, unknown>;
    useQuery: UseQuery<SubscriptionListResponse, Subscription>;
}

export const WfoSubscriptionNoteEdit: FC<WfoSubscriptionNoteEditProps> = ({
    subscriptionId,
    onlyShowOnHover = false,
    queryVariables,
    useQuery,
}) => {
    const { selectedItem } = useQuery(queryVariables, {
        selectFromResult: (result: ApiResult<SubscriptionListResponse>) => ({
            selectedItem: result?.data?.subscriptions?.find(
                (sub) => sub.subscriptionId === subscriptionId,
            ),
        }),
    });
    const endpointName = useQuery().endpointName;
    const [startProcess] = useStartProcessMutation();
    const [updateSub] = useUpdateSubscriptionNoteOptimisticMutation();

    const triggerNoteModifyWorkflow = (note: string) => {
        const noteModifyPayload = [
            { subscription_id: subscriptionId },
            { note: note === INVISIBLE_CHARACTER ? '' : note },
        ];
        startProcess({
            workflowName: 'modify_note',
            userInputs: noteModifyPayload,
        });

        updateSub({
            queryName: endpointName ?? '',
            subscriptionId: subscriptionId,
            graphQlQueryVariables: queryVariables,
            note: note,
        });
    };

    return (
        <WfoInlineEdit
            value={
                selectedItem?.note?.trim()
                    ? selectedItem.note
                    : INVISIBLE_CHARACTER
            }
            onlyShowOnHover={onlyShowOnHover}
            onSave={triggerNoteModifyWorkflow}
        />
    );
};
