import React, { FC } from 'react';

import { useTranslations } from 'next-intl';

import {
    EuiButton,
    EuiModal,
    EuiModalBody,
    EuiModalFooter,
    EuiModalHeader,
    EuiModalHeaderTitle,
} from '@elastic/eui';

import { WfoSubscription } from '@/components';
import { TreeProvider } from '@/contexts';

interface WfoSubscriptionDetailModalProps {
    isVisible: boolean;
    onClose: () => void;
    resultData?: unknown;
}

export const WfoSubscriptionDetailModal: FC<
    WfoSubscriptionDetailModalProps
> = ({ isVisible, onClose, resultData }) => {
    const t = useTranslations('search.page');
    if (!isVisible || !resultData) return null;

    const subscriptionId =
        (resultData as { entity_id: string } | undefined)?.entity_id || '';

    return (
        <EuiModal onClose={onClose} maxWidth={800}>
            <EuiModalHeader>
                <EuiModalHeaderTitle>
                    {t('subscriptionDetails')}
                </EuiModalHeaderTitle>
            </EuiModalHeader>

            <EuiModalBody>
                <TreeProvider>
                    <WfoSubscription subscriptionId={subscriptionId} />
                </TreeProvider>
            </EuiModalBody>

            <EuiModalFooter>
                <EuiButton onClick={onClose} fill>
                    {t('closeButton')}
                </EuiButton>
            </EuiModalFooter>
        </EuiModal>
    );
};
