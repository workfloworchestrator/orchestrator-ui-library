import React from 'react';

import {
    EuiButtonEmpty,
    EuiFlexGroup,
    EuiFlexItem,
    EuiSpacer,
    EuiText,
} from '@elastic/eui';
import { useTranslations } from 'next-intl';
import { WFOCheckmarkCircleFill, WFOMinusCircleOutline } from '../../icons';
import { WFOSubscriptionStatusBadge } from '../WFOBadges';
import {
    WFOKeyValueTable,
    WFOKeyValueTableDataType,
} from '../WFOKeyValueTable/WFOKeyValueTable';
import { useOrchestratorTheme } from '../../hooks';
import { EuiThemeComputed } from '@elastic/eui/src/services/theme/types';

export const RenderField = (
    field: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any,
    theme: EuiThemeComputed,
) => {
    if (field === 'status')
        return <WFOSubscriptionStatusBadge status={data[field]} />;
    else if (field === 'insync')
        return data[field] ? (
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
    else if (field === 'product.name') return <div>{data.product.name}</div>;
    return <div>{data[field]}</div>;
};

export const WFOSubscriptionBlock = (title: string, data: object) => {
    const { theme } = useOrchestratorTheme();

    const t = useTranslations('common');
    const keys = [];
    for (const key in data) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        if (typeof data[key] !== 'object') {
            keys.push(key);
        }
    }
    if (keys.length === 0) return;

    const productNameKeyValue: WFOKeyValueTableDataType = {
        key: 'Product',
        // @ts-ignore
        value: data.product.name,
    };

    const subscriptionKeyValues: WFOKeyValueTableDataType[] = keys.map(
        (key) => ({
            key: key,
            value: RenderField(key, data, theme),
        }),
    );

    const keyValues: WFOKeyValueTableDataType[] = [
        productNameKeyValue,
        ...subscriptionKeyValues,
    ];

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
                        <EuiFlexItem grow={false}>
                            <EuiButtonEmpty size={'s'} iconType={'starEmpty'}>
                                {t('addToFavorites')}
                            </EuiButtonEmpty>
                        </EuiFlexItem>
                    </EuiFlexGroup>

                    <EuiSpacer size={'s'}></EuiSpacer>
                    <WFOKeyValueTable
                        keyValues={keyValues}
                        showCopyToClipboardIcon={false}
                    />
                </div>
            </div>
        </>
    );
};
