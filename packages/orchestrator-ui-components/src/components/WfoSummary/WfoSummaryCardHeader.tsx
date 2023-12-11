import React, { FC } from 'react';

import {
    EuiAvatar,
    EuiFlexGroup,
    EuiFlexItem,
    EuiPanel,
    EuiText,
} from '@elastic/eui';
import { IconType } from '@elastic/eui/src/components/icon';

import { useOrchestratorTheme } from '@/hooks';

export type WfoSummaryCardHeaderProps = {
    text: string;
    value: number | string;
    iconType: IconType;
    iconColor: string | undefined;
};

export const WfoSummaryCardHeader: FC<WfoSummaryCardHeaderProps> = ({
    text,
    value,
    iconType,
    iconColor,
}) => {
    const { theme } = useOrchestratorTheme();

    return (
        <EuiFlexItem grow={0}>
            <EuiPanel hasShadow={false} color="subdued" paddingSize="l">
                <EuiFlexGroup>
                    <EuiFlexItem grow={false}>
                        <EuiAvatar
                            iconSize="l"
                            size="xl"
                            type="space"
                            name={text}
                            style={{ maxHeight: 55, maxWidth: 55 }}
                            iconType={iconType}
                            iconColor={theme.colors.ghost}
                            color={iconColor}
                        />
                    </EuiFlexItem>
                    <EuiFlexItem>
                        <EuiText color="subdued">
                            <h4 style={{ fontWeight: 300 }}>Total {text}</h4>
                        </EuiText>
                        <EuiText>
                            <h2 style={{ fontWeight: 500 }}>{value}</h2>
                        </EuiText>
                    </EuiFlexItem>
                </EuiFlexGroup>
            </EuiPanel>
        </EuiFlexItem>
    );
};
