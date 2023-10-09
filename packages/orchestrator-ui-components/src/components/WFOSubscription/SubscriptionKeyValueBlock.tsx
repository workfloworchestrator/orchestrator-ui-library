import React from 'react';
import { EuiThemeComputed } from '@elastic/eui/src/services/theme/types';
import { EuiFlexGroup, EuiFlexItem, EuiSpacer, EuiText } from '@elastic/eui';

import { WFOCheckmarkCircleFill, WFOMinusCircleOutline } from '../../icons';
import { WFOSubscriptionStatusBadge } from '../WFOBadges';
import {
    WFOKeyValueTable,
    WFOKeyValueTableDataType,
} from '../WFOKeyValueTable/WFOKeyValueTable';
import { useOrchestratorTheme } from '../../hooks';

import { KeyValue, SubscriptionStatus } from '../../types';

export const getRenderField = (
    key: string,
    value: unknown,
    theme: EuiThemeComputed,
) => {
    if (key === 'status') {
        return (
            <WFOSubscriptionStatusBadge status={value as SubscriptionStatus} />
        );
    }

    if (key === 'insync')
        return value ? (
            <WFOCheckmarkCircleFill
                height={20}
                width={20}
                color={theme.colors.primary}
            />
        ) : (
            <WFOMinusCircleOutline
                height={20}
                width={20}
                color={theme.colors.mediumShade}
            />
        );

    return <div>{value as string}</div>;
};

interface SubscriptionKeyValueBlockProps {
    title: string;
    keyValues: KeyValue[];
}

export const SubscriptionKeyValueBlock = ({
    title,
    keyValues,
}: SubscriptionKeyValueBlockProps) => {
    const { theme } = useOrchestratorTheme();

    const subscriptionKeyValues: WFOKeyValueTableDataType[] = keyValues.map(
        (keyValue) => ({
            key: keyValue.key,
            value: getRenderField(keyValue.key, keyValue.value, theme),
        }),
    );

    return (
        <>
            <EuiSpacer size={'m'}></EuiSpacer>
            <div>
                <div style={{ marginTop: 5 }}>
                    <EuiFlexGroup justifyContent="spaceBetween">
                        <EuiFlexItem>
                            <EuiText grow={false}>
                                <h3>{title}</h3>
                            </EuiText>
                        </EuiFlexItem>
                    </EuiFlexGroup>

                    <EuiSpacer size={'s'}></EuiSpacer>
                    <WFOKeyValueTable
                        keyValues={subscriptionKeyValues}
                        showCopyToClipboardIcon={false}
                    />
                </div>
            </div>
        </>
    );
};
