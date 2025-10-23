import React from 'react';

import { EuiFlexGroup, EuiFlexItem, EuiSpacer, EuiText } from '@elastic/eui';

import { WfoBadge } from '@/components/WfoBadges';

type RunSearchDisplayProps = {
    result?: any;
    parameters: {
        limit?: number;
    };
};

export const RunSearchDisplay = ({ parameters }: RunSearchDisplayProps) => {
    const { limit = 10 } = parameters;

    return (
        <div>
            <EuiFlexGroup gutterSize="s" alignItems="center">
                <EuiFlexItem grow={false}>
                    <EuiText size="xs" color="subdued">
                        <strong>Results Limit</strong>
                    </EuiText>
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                    <WfoBadge textColor="default" color="hollow">
                        {limit}
                    </WfoBadge>
                </EuiFlexItem>
            </EuiFlexGroup>
        </div>
    );
};
