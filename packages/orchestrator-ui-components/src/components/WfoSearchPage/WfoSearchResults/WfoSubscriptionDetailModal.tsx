import React from 'react';

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
    subscriptionData: any;
    matchingField?: any;
}

export const WfoSubscriptionDetailModal: React.FC<
    WfoSubscriptionDetailModalProps
> = ({ isVisible, onClose, subscriptionData }) => {
    if (!isVisible || !subscriptionData) return null;

    const subscriptionId = subscriptionData.subscription_id;

    return (
        <EuiModal onClose={onClose} maxWidth={800}>
            <EuiModalHeader>
                <EuiModalHeaderTitle>
                    Subscription Details
                </EuiModalHeaderTitle>
            </EuiModalHeader>

            <EuiModalBody>
                <TreeProvider>
                    <WfoSubscription subscriptionId={subscriptionId} />
                </TreeProvider>
            </EuiModalBody>

            <EuiModalFooter>
                <EuiButton onClick={onClose} fill>
                    Close
                </EuiButton>
            </EuiModalFooter>
        </EuiModal>
    );
};
