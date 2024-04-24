import React, { FC } from 'react';

import {
    EuiAvatar,
    EuiFlexGroup,
    EuiFlexItem,
    EuiPanel,
    EuiText,
} from '@elastic/eui';
import { IconType } from '@elastic/eui/src/components/icon';

import { useOrchestratorTheme, useWithOrchestratorTheme } from '@/hooks';

import { getWfoSummaryCardHeaderStyles } from './styles';

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
    const { avatarStyle, totalSectionStyle, valueStyle } =
        useWithOrchestratorTheme(getWfoSummaryCardHeaderStyles);

    return (
        <EuiFlexItem grow={0}>
            <EuiPanel hasShadow={false} color="subdued" paddingSize="l">
                <EuiFlexGroup>
                    <EuiAvatar
                        iconSize="l"
                        size="xl"
                        type="space"
                        name={text}
                        css={avatarStyle}
                        iconType={iconType}
                        iconColor={theme.colors.ghost}
                        color={iconColor}
                    />
                    <div css={totalSectionStyle}>
                        <EuiText color="subdued">{text}</EuiText>
                        <EuiText css={valueStyle}>{value}</EuiText>
                    </div>
                </EuiFlexGroup>
            </EuiPanel>
        </EuiFlexItem>
    );
};
