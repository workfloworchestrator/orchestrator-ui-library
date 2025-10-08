import type { FC } from 'react';
import React from 'react';

import { useGetSubscriptionDetailQuery } from '@/rtk';
import { useStartProcessMutation } from '@/rtk/endpoints/forms';
import { useUpdateSubscriptionDetailNoteOptimisticMutation } from '@/rtk/endpoints/subscriptionListMutation';
import { SubscriptionDetail } from '@/types';
import { INVISIBLE_CHARACTER } from '@/utils';

import { WfoInlineEdit } from '../WfoInlineEdit';

interface WfoSubscriptionDetailNoteEditProps {
    subscriptionId: SubscriptionDetail['subscriptionId'];
    onlyShowOnHover?: boolean;
}

export const WfoSubscriptionDetailNoteEdit: FC<
    WfoSubscriptionDetailNoteEditProps
> = ({ subscriptionId, onlyShowOnHover = false }) => {
    const { data, endpointName } = useGetSubscriptionDetailQuery({
        subscriptionId,
    });

    const selectedItem = data?.subscription ?? { note: '' };
    const [startProcess] = useStartProcessMutation();
    const [updateSub] = useUpdateSubscriptionDetailNoteOptimisticMutation();

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
