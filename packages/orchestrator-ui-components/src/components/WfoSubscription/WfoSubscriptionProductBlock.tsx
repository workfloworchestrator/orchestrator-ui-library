import React, { useState } from 'react';

import {
    EuiButtonEmpty,
    EuiIcon,
    EuiFlexGroup,
    EuiFlexItem,
    EuiPanel,
    EuiSpacer,
    EuiText,
} from '@elastic/eui';
import { FieldValue } from '../../types';
import { getProductBlockTitle } from './utils';
import { useOrchestratorTheme, useWithOrchestratorTheme } from '../../hooks';
import { getStyles } from './styles';
import { camelToHuman } from '../../utils';
import { useTranslations } from 'next-intl';

interface WfoSubscriptionProductBlockProps {
    ownerSubscriptionId: string;
    subscriptionInstanceId: string;
    productBlockInstanceValues: FieldValue[];
    id: number;
}

export const HIDDEN_KEYS = ['title', 'name', 'label'];

export const WfoSubscriptionProductBlock = ({
    ownerSubscriptionId,
    subscriptionInstanceId,
    productBlockInstanceValues,
}: WfoSubscriptionProductBlockProps) => {
    const t = useTranslations('subscriptions.detail');
    const { theme } = useOrchestratorTheme();
    const { productBlockPanelStyle } = useWithOrchestratorTheme(getStyles);

    const [hideDetails, setHideDetails] = useState(true);

    const getBorderThickness = (index: number): number => {
        if (!hideDetails) return 0;
        return index === 0 ? 1 : 0;
    };

    return (
        <>
            <EuiSpacer size={'m'}></EuiSpacer>
            <EuiPanel
                color="transparent"
                hasShadow={false}
                css={productBlockPanelStyle}
            >
                <EuiFlexGroup>
                    <EuiFlexItem grow={false}>
                        <div
                            style={{
                                width: 45,
                                height: 45,
                                backgroundColor: 'rgb(193,221,241,1)',
                                paddingTop: 13,
                                paddingLeft: 15,
                                borderRadius: 7,
                            }}
                        >
                            <EuiIcon
                                type="filebeatApp"
                                color={theme.colors.primary}
                            />
                        </div>
                    </EuiFlexItem>
                    <EuiFlexItem>
                        <EuiText grow={true}>
                            <h3>
                                {getProductBlockTitle(
                                    productBlockInstanceValues,
                                )}
                            </h3>
                        </EuiText>
                        <EuiText>Instance ID: {subscriptionInstanceId}</EuiText>
                    </EuiFlexItem>
                    <EuiFlexItem grow={false}>
                        <EuiButtonEmpty
                            aria-label={
                                hideDetails
                                    ? t('showDetails')
                                    : t('hideDetails')
                            }
                            size={'m'}
                            onClick={() => setHideDetails(!hideDetails)}
                        >
                            {hideDetails ? t('showDetails') : t('hideDetails')}
                        </EuiButtonEmpty>
                    </EuiFlexItem>
                </EuiFlexGroup>

                <EuiSpacer size={'m'}></EuiSpacer>
                {
                    <table width="100%">
                        {!hideDetails && (
                            <tr key={-1}>
                                <td
                                    valign={'top'}
                                    style={{
                                        width: 250,
                                        paddingLeft: 0,
                                        paddingTop: 10,
                                        paddingBottom: 10,
                                        borderTop: `solid 1px #ddd`,
                                        borderBottom: `solid 1px #ddd`,
                                    }}
                                >
                                    <b>Owner subscription ID</b>
                                </td>
                                <td
                                    style={{
                                        paddingLeft: 0,
                                        paddingTop: 10,
                                        paddingBottom: 10,
                                        borderTop: `solid 1px #ddd`,
                                        borderBottom: `solid 1px #ddd`,
                                    }}
                                >
                                    {ownerSubscriptionId}
                                </td>
                            </tr>
                        )}

                        {productBlockInstanceValues
                            .filter(
                                (productBlockInstanceValue) =>
                                    !HIDDEN_KEYS.includes(
                                        productBlockInstanceValue.field,
                                    ),
                            )
                            .map((productBlockInstanceValue, index) => (
                                <tr key={index}>
                                    <td
                                        valign={'top'}
                                        style={{
                                            width: 250,
                                            paddingLeft: 0,
                                            paddingTop: 10,
                                            paddingBottom: 10,
                                            borderTop: `solid ${getBorderThickness(
                                                index,
                                            )}px #ddd`,
                                            borderBottom: `solid 1px #ddd`,
                                        }}
                                    >
                                        <b>
                                            {camelToHuman(
                                                productBlockInstanceValue.field,
                                            )}
                                        </b>
                                    </td>
                                    <td
                                        style={{
                                            paddingLeft: 0,
                                            paddingTop: 10,
                                            paddingBottom: 10,
                                            borderTop: `solid ${getBorderThickness(
                                                index,
                                            )}px #ddd`,
                                            borderBottom: `solid 1px #ddd`,
                                        }}
                                    >
                                        {productBlockInstanceValue.value}
                                    </td>
                                </tr>
                            ))}
                    </table>
                }
            </EuiPanel>
        </>
    );
};
