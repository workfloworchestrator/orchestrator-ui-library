import React from 'react';

import {
    EuiFlexGrid,
    EuiFlexItem,
    EuiLoadingContent,
    EuiSpacer,
} from '@elastic/eui';
// import { useTranslations } from 'next-intl';
import { SubscriptionContext } from '../../contexts/SubscriptionContext';
import { WFOSubscriptionBlock } from './WFOSubscriptionBlock';
import { WFOFixedInputBlock } from './WFOFixedInputBlock';

/** TODO: Adding a useTranslations hook here leads to an hooks error. https://github.com/workfloworchestrator/orchestrator-ui/issues/177 */

export const WFOSubscriptionGeneral = () => {
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
                    {WFOSubscriptionBlock(
                        'Subscription details',
                        subscriptionData,
                    )}
                </EuiFlexItem>
                <EuiFlexItem>
                    {WFOFixedInputBlock(
                        'Fixed Inputs',
                        subscriptionData.fixedInputs,
                    )}
                </EuiFlexItem>
                <EuiFlexItem>
                    {WFOFixedInputBlock(
                        'Product Info',
                        subscriptionData.product,
                    )}
                </EuiFlexItem>
            </>
        </EuiFlexGrid>
    );
};
