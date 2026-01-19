import React, { FC } from 'react';

import { EuiFlexGroup, EuiFlexItem, EuiText } from '@elastic/eui';

import { useOrchestratorTheme } from '@/hooks';

import { SelectedPathDisplayProps } from './types';
import { getFieldNameFromFullPath } from './utils';

export const WfoSelectedPathDisplay: FC<SelectedPathDisplayProps> = ({
    condition,
    onEdit,
}) => {
    const { theme } = useOrchestratorTheme();

    const isFullPath = condition.path.includes('.');

    return (
        <div
            onClick={onEdit}
            style={{
                cursor: 'pointer',
                border: `1px solid ${theme.colors.borderBaseSubdued}`,
                borderRadius: theme.border.radius.medium,
                padding: `${theme.size.s} ${theme.size.m}`,
                backgroundColor: theme.colors.backgroundBaseNeutral,
                minHeight: '40px',
                display: 'flex',
                alignItems: 'center',
            }}
        >
            <EuiFlexGroup
                alignItems="center"
                gutterSize="s"
                responsive={false}
                justifyContent="spaceBetween"
            >
                <EuiFlexItem grow={true}>
                    {isFullPath ? (
                        <EuiFlexGroup
                            gutterSize="none"
                            alignItems="center"
                            responsive={false}
                        >
                            <EuiFlexItem grow={false}>
                                <EuiText
                                    size="s"
                                    color={theme.colors.textParagraph}
                                >
                                    {getFieldNameFromFullPath(condition.path)}:
                                </EuiText>
                            </EuiFlexItem>
                            <EuiFlexItem grow={false}>
                                <EuiText
                                    size="s"
                                    style={{
                                        backgroundColor:
                                            theme.colors.backgroundBasePlain,
                                        color: theme.colors.primary,
                                        padding: `${theme.size.xxs} ${theme.size.xs}`,
                                        borderRadius: theme.border.radius.small,
                                        marginLeft: theme.size.xs,
                                    }}
                                >
                                    {condition.path}
                                </EuiText>
                            </EuiFlexItem>
                        </EuiFlexGroup>
                    ) : (
                        <EuiText size="s" color={theme.colors.textParagraph}>
                            {condition.path}
                        </EuiText>
                    )}
                </EuiFlexItem>
            </EuiFlexGroup>
        </div>
    );
};
