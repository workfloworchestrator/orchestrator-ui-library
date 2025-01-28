import type { FC } from 'react';
import React from 'react';


import { WfoInlineNoteEdit } from '@/components';
import { useStartProcessMutation } from '@/rtk/endpoints/forms';
import { Subscription, SubscriptionList } from '@/types';
import { useUpdateSubscriptionNoteOptimisticMutation } from '@/rtk/endpoints/subscriptionListMutation';
import { INVISIBLE_CHARACTER } from '@/utils';
import { ApiResult, UseQuery } from '@/rtk';

interface WfoSubscriptionNoteEditProps {
    subscriptionId: Subscription['subscriptionId'];
    onlyShowOnHover?: boolean;
    queryVariables: Record<string, unknown>;
    useQuery: UseQuery<SubscriptionList, Subscription>;
}


export const WfoSubscriptionNoteEdit: FC<WfoSubscriptionNoteEditProps> = ({
  subscriptionId,
  onlyShowOnHover = false,
  queryVariables,
  useQuery
}) => {
    const {selectedItem} = useQuery(queryVariables,{
        selectFromResult: (result: ApiResult<SubscriptionList>) => ({
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
            { note: (note === INVISIBLE_CHARACTER) ? "" : note },
        ];
        startProcess({
            workflowName: 'modify_note',
            userInputs: noteModifyPayload,
        });

        updateSub({queryName: endpointName ?? "",  subscriptionId: subscriptionId, graphQlQueryVariables: queryVariables, note: note });
    };


    return (
        <WfoInlineNoteEdit
            value={selectedItem?.note?.trim() ? selectedItem.note : INVISIBLE_CHARACTER}
            onlyShowOnHover={onlyShowOnHover}
            triggerNoteModifyWorkflow={triggerNoteModifyWorkflow}
        />
    );
};
