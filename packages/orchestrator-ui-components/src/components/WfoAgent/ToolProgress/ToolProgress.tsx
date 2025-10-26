import React, { useState } from 'react';

import { EuiFlexGroup, EuiFlexItem, EuiLoadingSpinner } from '@elastic/eui';

import { useWithOrchestratorTheme } from '@/hooks';
import { useOrchestratorTheme } from '@/hooks/useOrchestratorTheme';
import {
    WfoCheckmarkCircleFill,
    WfoChevronDown,
    WfoChevronUp,
    WfoXCircleFill,
} from '@/icons';
import { WfoWrench } from '@/icons/heroicons';

import { DiscoverFilterPathsDisplay } from './DiscoverFilterPathsDisplay';
import { RunSearchDisplay } from './RunSearchDisplay';
import { SetFilterTreeDisplay } from './SetFilterTreeDisplay';
import { StartNewSearchDisplay } from './StartNewSearchDisplay';
import { getToolProgressStyles } from './styles';

type ToolProgressProps = {
    name: string;
    status: 'executing' | 'inProgress' | 'complete' | 'failed';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    args?: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    result?: any;
};

// Mapping of tool names to their display components
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const TOOL_DISPLAY_COMPONENTS: Record<string, React.ComponentType<any>> = {
    set_filter_tree: SetFilterTreeDisplay,
    start_new_search: StartNewSearchDisplay,
    run_search: RunSearchDisplay,
    discover_filter_paths: DiscoverFilterPathsDisplay,
};

export const ToolProgress = ({
    name,
    status,
    args,
    result,
}: ToolProgressProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const {
        containerStyle,
        containerClickableStyle,
        headerStyle,
        nameStyle,
        expandedContentStyle,
        iconSize,
        iconStyle,
    } = useWithOrchestratorTheme(getToolProgressStyles);

    const { theme } = useOrchestratorTheme();

    const renderStatus = () => {
        if (status === 'complete') {
            return (
                <WfoCheckmarkCircleFill
                    color={theme.colors.success}
                    width={iconSize}
                    height={iconSize}
                />
            );
        }
        if (status === 'inProgress' || status === 'executing') {
            return <EuiLoadingSpinner size="s" />;
        }
        if (status === 'failed') {
            return (
                <WfoXCircleFill
                    color={theme.colors.danger}
                    width={iconSize}
                    height={iconSize}
                />
            );
        }
        return null;
    };

    const DisplayComponent = TOOL_DISPLAY_COMPONENTS[name];
    const hasArgs = DisplayComponent && args;

    return (
        <div css={containerStyle}>
            <div
                css={hasArgs && containerClickableStyle}
                onClick={() => hasArgs && setIsExpanded(!isExpanded)}
            >
                <EuiFlexGroup
                    gutterSize="m"
                    alignItems="center"
                    css={headerStyle}
                >
                    <EuiFlexItem grow={false}>
                        <div css={iconStyle}>
                            <WfoWrench width={iconSize} height={iconSize} />
                        </div>
                    </EuiFlexItem>
                    <EuiFlexItem grow={true}>
                        <span css={nameStyle}>{name}</span>
                    </EuiFlexItem>
                    <EuiFlexItem
                        grow={false}
                        style={{ minWidth: `${iconSize}px` }}
                    >
                        {renderStatus()}
                    </EuiFlexItem>
                    <EuiFlexItem
                        grow={false}
                        style={{ minWidth: `${iconSize}px` }}
                    >
                        {hasArgs &&
                            (isExpanded ? (
                                <WfoChevronUp
                                    width={iconSize}
                                    height={iconSize}
                                />
                            ) : (
                                <WfoChevronDown
                                    width={iconSize}
                                    height={iconSize}
                                />
                            ))}
                    </EuiFlexItem>
                </EuiFlexGroup>
            </div>
            {hasArgs && isExpanded && (
                <div css={expandedContentStyle}>
                    <DisplayComponent parameters={args} result={result} />
                </div>
            )}
        </div>
    );
};
