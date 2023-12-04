import React, { useState } from 'react';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';

import {
    EuiBadge,
    EuiButtonEmpty,
    EuiCodeBlock,
    EuiFlexGroup,
    EuiFlexItem,
    EuiIcon,
    EuiPanel,
    EuiSpacer,
    EuiText,
} from '@elastic/eui';

import { useOrchestratorTheme, useWithOrchestratorTheme } from '../../hooks';
import { FieldValue, InUseByRelation } from '../../types';
import { camelToHuman } from '../../utils';
import { PATH_SUBSCRIPTIONS } from '../WfoPageTemplate';
import { getStyles } from './styles';
import { getProductBlockTitle } from './utils';

interface WfoSubscriptionProductBlockProps {
    ownerSubscriptionId: string;
    subscriptionInstanceId: string;
    productBlockInstanceValues: FieldValue[];
    inUseByRelations: InUseByRelation[];
    id: number;
}

export const HIDDEN_KEYS = ['title', 'name', 'label'];

export const WfoSubscriptionProductBlock = ({
    ownerSubscriptionId,
    subscriptionInstanceId,
    productBlockInstanceValues,
    inUseByRelations,
}: WfoSubscriptionProductBlockProps) => {
    const router = useRouter();
    const subscriptionId = router.query['subscriptionId'];

    const t = useTranslations('subscriptions.detail');
    const { theme } = useOrchestratorTheme();
    const {
        productBlockIconStyle,
        productBlockPanelStyle,
        productBlockLeftColStyle,
        productBlockFirstLeftColStyle,
        productBlockRightColStyle,
        productBlockFirstRightColStyle,
    } = useWithOrchestratorTheme(getStyles);

    const [hideDetails, setHideDetails] = useState(true);

    const isFirstBlock = (index: number): boolean => {
        if (!hideDetails) return false;
        return index === 0;
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
                        <div css={productBlockIconStyle}>
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
                        <EuiText>{`${t(
                            'subscriptionInstanceId',
                        )}: ${subscriptionInstanceId}`}</EuiText>
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
                        <tbody>
                            {!hideDetails && (
                                <>
                                    <tr key={-2}>
                                        <td
                                            valign={'top'}
                                            css={productBlockFirstLeftColStyle}
                                        >
                                            <b>{t('ownerSubscriptionId')}</b>
                                        </td>
                                        <td
                                            valign={'top'}
                                            css={productBlockFirstRightColStyle}
                                        >
                                            {subscriptionId ===
                                            ownerSubscriptionId ? (
                                                <>
                                                    {subscriptionId}
                                                    <EuiBadge>
                                                        {t('self')}
                                                    </EuiBadge>
                                                </>
                                            ) : (
                                                <a
                                                    href={`${PATH_SUBSCRIPTIONS}/${ownerSubscriptionId}`}
                                                >
                                                    {ownerSubscriptionId}
                                                </a>
                                            )}
                                        </td>
                                    </tr>
                                    <tr key={-1}>
                                        <td
                                            valign={'top'}
                                            css={productBlockLeftColStyle}
                                        >
                                            <b>{t('inUseByRelations')}</b>
                                        </td>
                                        <td
                                            valign={'top'}
                                            css={productBlockRightColStyle}
                                        >
                                            <EuiCodeBlock language="json">
                                                {JSON.stringify(
                                                    inUseByRelations,
                                                    null,
                                                    4,
                                                )}
                                            </EuiCodeBlock>
                                        </td>
                                    </tr>
                                </>
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
                                            css={
                                                isFirstBlock(index)
                                                    ? productBlockFirstLeftColStyle
                                                    : productBlockLeftColStyle
                                            }
                                        >
                                            <b>
                                                {camelToHuman(
                                                    productBlockInstanceValue.field,
                                                )}
                                            </b>
                                        </td>
                                        <td
                                            valign={'top'}
                                            css={
                                                isFirstBlock(index)
                                                    ? productBlockFirstRightColStyle
                                                    : productBlockRightColStyle
                                            }
                                        >
                                            {typeof productBlockInstanceValue.value ===
                                            'boolean' ? (
                                                <EuiBadge>
                                                    {productBlockInstanceValue.value.toString()}
                                                </EuiBadge>
                                            ) : (
                                                productBlockInstanceValue.value
                                            )}
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                }
            </EuiPanel>
        </>
    );
};
