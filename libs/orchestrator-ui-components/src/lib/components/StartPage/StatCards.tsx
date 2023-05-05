import React, { useState, FC } from 'react';
import {
    EuiAvatar,
    EuiFlexGroup,
    EuiFlexItem,
    EuiPanel,
    EuiText,
} from '@elastic/eui';
import { useOrchestratorTheme } from '../../hooks/useOrchestratorTheme';
import { TotalStat } from '../../types';

const totalStats: TotalStat[] = [
    {
        icon: 'kubernetesPod',
        name: 'subscriptions',
        value: 24864,
        color: 'primary',
    },
    {
        icon: 'error',
        name: 'processes failed',
        value: 462252,
        color: 'danger',
    },
    {
        icon: 'checkInCircleFilled',
        name: 'processes completed',
        value: 1353632,
        color: 'success',
    },
];

export const StatCards: FC = () => {
    const [stats] = useState<TotalStat[]>(totalStats);
    const { theme } = useOrchestratorTheme();

    return (
        <EuiFlexGroup wrap>
            {stats.map((stat, index) => (
                <EuiFlexItem key={index}>
                    <EuiPanel hasShadow={false} color="subdued" paddingSize="l">
                        <EuiFlexGroup>
                            <EuiFlexItem grow={false}>
                                <EuiAvatar
                                    iconSize="l"
                                    size="xl"
                                    type="space"
                                    name={stat.name}
                                    style={{ maxHeight: 55, maxWidth: 55 }}
                                    iconType={stat.icon}
                                    iconColor={theme.colors.ghost}
                                    color={theme.colors[stat.color]}
                                />
                            </EuiFlexItem>
                            <EuiFlexItem>
                                <EuiText color="subdued">
                                    <h4 style={{ fontWeight: 300 }}>
                                        Total {stat.name}
                                    </h4>
                                </EuiText>
                                <EuiText>
                                    <h2 style={{ fontWeight: 500 }}>
                                        {stat.value.toLocaleString('de-DE')}
                                    </h2>
                                </EuiText>
                            </EuiFlexItem>
                        </EuiFlexGroup>
                    </EuiPanel>
                </EuiFlexItem>
            ))}
        </EuiFlexGroup>
    );
};
