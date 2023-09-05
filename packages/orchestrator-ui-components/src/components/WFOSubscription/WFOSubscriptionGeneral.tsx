import React from 'react';

import { EuiFlexGrid, EuiFlexItem, EuiSpacer } from '@elastic/eui';
import { SubscriptionContext } from '../../contexts/SubscriptionContext';
import { WFOSubscriptionBlock } from './WFOSubscriptionBlock';
import { WFOFixedInputBlock } from './WFOFixedInputBlock';
import { WFOLoading } from '../WFOLoading';

/** TODO: Adding a useTranslations hook here leads to an hooks error. https://github.com/workfloworchestrator/orchestrator-ui/issues/177 */

export const WFOSubscriptionGeneral = () => {
    const { subscriptionData, loadingStatus } =
        React.useContext(SubscriptionContext);

    if (!loadingStatus) {
        return (
            <>
                <EuiSpacer size={'m'} />
                <WFOLoading />
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
