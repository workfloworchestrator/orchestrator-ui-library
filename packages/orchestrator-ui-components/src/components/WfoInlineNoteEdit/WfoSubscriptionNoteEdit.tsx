import type { FC } from 'react';
import React from 'react';

import { useStartProcessMutation } from '@/rtk/endpoints/forms';
import { useUpdateSubscriptionNoteOptimisticMutation } from '@/rtk/endpoints/subscriptionListMutation';
import { INVISIBLE_CHARACTER } from '@/utils';

import { WfoInlineEdit } from '../WfoInlineEdit';
import { SubscriptionListItem } from '../WfoSubscriptionsList';

interface WfoSubscriptionNoteEditProps {
    onlyShowOnHover?: boolean;
    queryVariables: Record<string, unknown>;
    endpointName: string | undefined;
    subscription: SubscriptionListItem;
}

export const WfoSubscriptionNoteEdit: FC<WfoSubscriptionNoteEditProps> = ({
    onlyShowOnHover = false,
    queryVariables,
    endpointName,
    subscription,
}) => {
    const [startProcess] = useStartProcessMutation();
    const [updateSub] = useUpdateSubscriptionNoteOptimisticMutation();

    const triggerNoteModifyWorkflow = (note: string) => {
        const noteModifyPayload = [
            { subscription_id: subscription.subscriptionId },
            { note: note === INVISIBLE_CHARACTER ? '' : note },
        ];
        startProcess({
            workflowName: 'modify_note',
            userInputs: noteModifyPayload,
        });

        updateSub({
            queryName: endpointName ?? '',
            subscriptionId: subscription.subscriptionId,
            graphQlQueryVariables: queryVariables,
            note: note,
        });
    };

    return (
        <WfoInlineEdit
            value={
                subscription?.note?.trim()
                    ? subscription.note
                    : INVISIBLE_CHARACTER
            }
            onlyShowOnHover={onlyShowOnHover}
            onSave={triggerNoteModifyWorkflow}
        />
    );
};
