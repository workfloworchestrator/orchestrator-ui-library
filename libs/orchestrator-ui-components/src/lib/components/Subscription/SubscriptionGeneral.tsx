import React from 'react';
import {
    FixedInputBlock,
    SubscriptionBlock,
    SubscriptionContext,
} from '@orchestrator-ui/orchestrator-ui-components';
import {
    EuiFlexGrid,
    EuiFlexItem,
    EuiLoadingContent,
    EuiSpacer,
} from '@elastic/eui';

export const SubscriptionGeneral = () => {
    const { subscriptionData, loadingStatus } =
        React.useContext(SubscriptionContext);

    console.log('Loading status: ', loadingStatus);
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
                        'Fixed inputs',
                        subscriptionData.fixedInputs,
                    )}
                </EuiFlexItem>
                <EuiFlexItem>
                    {FixedInputBlock('Product info', subscriptionData.product)}
                </EuiFlexItem>
            </>
        </EuiFlexGrid>
    );
};
