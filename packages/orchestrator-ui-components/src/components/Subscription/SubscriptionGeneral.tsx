import React from 'react';

import {
    EuiFlexGrid,
    EuiFlexItem,
    EuiLoadingContent,
    EuiSpacer,
} from '@elastic/eui';
// import { useTranslations } from 'next-intl';
import { SubscriptionContext } from '../../contexts/SubscriptionContext';
import { SubscriptionBlock } from './SubscriptionBlock';
import { FixedInputBlock } from './FixedInputBlock';

/** TODO: Adding a useTranslations hook here leads to an hooks error. https://github.com/workfloworchestrator/orchestrator-ui/issues/177 */

export const SubscriptionGeneral = () => {
    const { subscriptionData, loadingStatus } =
        React.useContext(SubscriptionContext);

    if (!loadingStatus) {
        return (
            <>
                <EuiSpacer size={'m'} />
                <EuiLoadingContent />
            </>
        );
    }

    return (
        <EuiFlexGrid direction={'row'}>
            <>
                <EuiFlexItem>
                    {SubscriptionBlock(
                        'Subscription details',
                        subscriptionData,
                    )}
                </EuiFlexItem>
                <EuiFlexItem>
                    {FixedInputBlock(
                        'Fixed Inputs',
                        subscriptionData.fixedInputs,
                    )}
                </EuiFlexItem>
                <EuiFlexItem>
                    {FixedInputBlock('Product Info', subscriptionData.product)}
                </EuiFlexItem>
            </>
        </EuiFlexGrid>
    );
};
