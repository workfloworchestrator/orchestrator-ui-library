import React from 'react';
import {
    ProductBlock,
    SubscriptionContext,
    SubscriptionContextType,
    Tree,
} from '@orchestrator-ui/orchestrator-ui-components';
import { EuiFlexGrid, EuiFlexItem } from '@elastic/eui';

export const SubscriptionGeneral = () => {
    const { subscriptionData, loadingStatus } = React.useContext(
        SubscriptionContext,
    ) as SubscriptionContextType;

    return (
        <EuiFlexGrid columns={3}>
            <EuiFlexItem>
                {ProductBlock('General info', subscriptionData.subscription)}
            </EuiFlexItem>
            <EuiFlexItem>
                {ProductBlock(
                    'Customer info',
                    subscriptionData.subscription?.organisation,
                )}
            </EuiFlexItem>
            <EuiFlexItem>
                {ProductBlock(
                    'Product info',
                    subscriptionData.subscription?.product,
                )}
            </EuiFlexItem>
            <EuiFlexItem>
                {ProductBlock(
                    'Fixed inputs',
                    subscriptionData.subscription?.fixedInputs,
                )}
            </EuiFlexItem>
            {subscriptionData.subscription?.locations?.map((l, i) => (
                <EuiFlexItem key={`loc-${i}`}>
                    {ProductBlock(`Location ${i + 1}`, l)}
                </EuiFlexItem>
            ))}
            {loadingStatus > 1 && (
                <>
                    {subscriptionData.subscription?.productBlocks?.map(
                        (l, i) => (
                            <>
                                <EuiFlexItem>
                                    {ProductBlock(
                                        `Product Block ${i + 1}`,
                                        l.resourceTypes,
                                    )}
                                </EuiFlexItem>
                            </>
                        ),
                    )}
                    {subscriptionData.subscription.inUseBy.map((l, i) => (
                        <EuiFlexItem key={`in-use-by-${i}`}>
                            {ProductBlock(`In use by ${i + 1}`, l)}
                        </EuiFlexItem>
                    ))}
                    {subscriptionData.subscription.dependsOn.map((l, i) => (
                        <EuiFlexItem key={`depends-on-${i}`}>
                            {ProductBlock(`Depends on ${i + 1}`, l)}
                        </EuiFlexItem>
                    ))}
                </>
            )}
            {loadingStatus === 3 &&
                subscriptionData.subscription?.imsCircuits?.map((l, i) => (
                    <>
                        <EuiFlexItem>
                            {ProductBlock(`IMS circuit ${i + 1}`, l.ims)}
                        </EuiFlexItem>
                        {l.ims.allEndpoints.map((d, idx) => (
                            <EuiFlexItem key={`endpoint-${idx}`}>
                                {ProductBlock(`Endpoint ${idx + 1}`, d)}
                            </EuiFlexItem>
                        ))}
                    </>
                ))}
        </EuiFlexGrid>
    );
};
