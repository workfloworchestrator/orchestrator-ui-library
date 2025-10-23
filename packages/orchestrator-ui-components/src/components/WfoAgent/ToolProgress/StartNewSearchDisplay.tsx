import React from 'react';

import { EuiFlexGroup, EuiFlexItem, EuiSpacer, EuiText } from '@elastic/eui';

import { WfoBadge } from '@/components/WfoBadges';

type StartNewSearchDisplayProps = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    result?: any;
    parameters: {
        entity_type?: string;
        action?: string;
        query?: string;
    };
};

export const StartNewSearchDisplay = ({
    parameters,
}: StartNewSearchDisplayProps) => {
    const { entity_type, action, query } = parameters;

    return (
        <div>
            <EuiFlexGroup gutterSize="s" wrap>
                {entity_type && (
                    <EuiFlexItem grow={false}>
                        <EuiText size="xs" color="subdued">
                            <strong>Entity Type</strong>
                        </EuiText>
                        <EuiSpacer size="xs" />
                        <WfoBadge textColor="default" color="hollow">
                            {entity_type}
                        </WfoBadge>
                    </EuiFlexItem>
                )}
                {action && (
                    <EuiFlexItem grow={false}>
                        <EuiText size="xs" color="subdued">
                            <strong>Action</strong>
                        </EuiText>
                        <EuiSpacer size="xs" />
                        <WfoBadge textColor="default" color="hollow">
                            {action}
                        </WfoBadge>
                    </EuiFlexItem>
                )}
            </EuiFlexGroup>
            {query && (
                <>
                    <EuiSpacer size="s" />
                    <EuiText size="xs" color="subdued">
                        <strong>Query</strong>
                    </EuiText>
                    <EuiSpacer size="xs" />
                    <EuiText size="s">
                        <em>"{query}"</em>
                    </EuiText>
                </>
            )}
        </div>
    );
};
