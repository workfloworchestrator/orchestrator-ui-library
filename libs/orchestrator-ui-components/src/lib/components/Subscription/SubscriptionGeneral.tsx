import React, { FC } from 'react';

import {
    EuiFlexGrid,
    EuiFlexItem,
    EuiLoadingContent,
    EuiSpacer,
} from '@elastic/eui';
import { SubscriptionBlockBase } from '../../types';
import { SubscriptionBlock } from './SubscriptionBlock';
import { SubscriptionActionsProps } from './SubscriptionActions';
// import {FixedInputBlock} from "./FixedInputBlock";

export type SubscriptionGeneralProps = {
    subscriptionBlock: SubscriptionBlockBase | null;
};

export const SubscriptionGeneral: FC<SubscriptionGeneralProps> = ({
    subscriptionBlock,
}) => {
    // const { subscriptionData, loadingStatus } =
    //     React.useContext(SubscriptionContext);

    // console.log(loadingStatus);
    // if (!loadingStatus) {
    //     return (
    //         <>
    //             <EuiSpacer size={'m'} />
    //             <EuiLoadingContent />
    //         </>
    //     );
    // }
    console.log(subscriptionBlock);
    return (
        <EuiFlexGrid direction={'row'}>
            <>
                {subscriptionBlock && (
                    <EuiFlexItem>
                        <SubscriptionBlock
                            title={'Subscription details'}
                            subscriptionBlock={subscriptionBlock}
                        />
                    </EuiFlexItem>
                )}
                {/*<EuiFlexItem>*/}
                {/*    {FixedInputBlock(*/}
                {/*        'Fixed inputs',*/}
                {/*        fixedInputs,*/}
                {/*    )}*/}
                {/*</EuiFlexItem>*/}
            </>
        </EuiFlexGrid>
    );
};
