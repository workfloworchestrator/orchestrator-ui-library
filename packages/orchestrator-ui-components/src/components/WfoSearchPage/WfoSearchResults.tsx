import React from 'react';

import {
    EuiBadge,
    EuiFlexGroup,
    EuiFlexItem,
    EuiPanel,
    EuiText,
} from '@elastic/eui';

import {
    getDisplayText,
    isSubscriptionSearchResult,
} from '@/components/WfoSearchPage/utils';
import { AnySearchResult } from '@/types';

interface WfoSearchResultsProps {
    results: AnySearchResult[];
    loading: boolean;
}

export const WfoSearchResults: React.FC<WfoSearchResultsProps> = ({
    results,
    loading,
}) => {
    if (loading) {
        return (
            <EuiPanel paddingSize="s" color="transparent" hasShadow={false}>
                <EuiText size="s" color="subdued">
                    Loading...
                </EuiText>
            </EuiPanel>
        );
    }

    if (!results || results.length === 0) {
        return (
            <EuiPanel paddingSize="s" color="transparent" hasShadow={false}>
                <EuiText size="s" color="subdued">
                    No results to display.
                </EuiText>
            </EuiPanel>
        );
    }

    return (
        <div className="eui-yScroll" style={{ maxHeight: '25rem' }}>
            {results.map((item, index) => (
                <EuiPanel
                    key={index}
                    paddingSize="s"
                    color="transparent"
                    hasShadow={false}
                    style={{
                        borderBottom: '1px solid var(--euiColorLightShade)',
                    }}
                >
                    <EuiFlexGroup
                        gutterSize="m"
                        alignItems="center"
                        responsive={false}
                    >
                        <EuiFlexItem>
                            <EuiText size="s" color="default">
                                <strong>{getDisplayText(item)}</strong>
                            </EuiText>
                        </EuiFlexItem>
                        <EuiFlexItem grow={false}>
                            {isSubscriptionSearchResult(item) &&
                                typeof item.score === 'number' && (
                                    <EuiBadge color="hollow">
                                        {item.score.toFixed(4)}
                                    </EuiBadge>
                                )}
                        </EuiFlexItem>
                    </EuiFlexGroup>
                </EuiPanel>
            ))}
        </div>
    );
};
