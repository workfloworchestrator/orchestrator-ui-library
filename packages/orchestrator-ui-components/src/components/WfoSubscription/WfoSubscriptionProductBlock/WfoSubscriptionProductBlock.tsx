import React, { useState } from 'react';

import { useTranslations } from 'next-intl';

import {
    EuiBadge,
    EuiButtonEmpty,
    EuiFlexGroup,
    EuiFlexItem,
    EuiIcon,
    EuiPanel,
    EuiSpacer,
    EuiText,
} from '@elastic/eui';

import { PATH_SUBSCRIPTIONS, WfoProductBlockKeyValueRow } from '@/components';
import { useOrchestratorTheme, useWithOrchestratorTheme } from '@/hooks';
import { ProductBlockInstance, Subscription } from '@/types';

import { WfoInUseByRelations } from '../WfoInUseByRelations';
import {
    getFieldFromProductBlockInstanceValues,
    getProductBlockTitle,
} from '../utils';
import { getStyles } from './styles';

interface WfoSubscriptionProductBlockProps {
    productBlock: ProductBlockInstance;
    subscriptionId: Subscription['subscriptionId'];
}

export const HIDDEN_KEYS = ['title', 'name', 'label'];

export const WfoSubscriptionProductBlock = ({
    productBlock,
    subscriptionId,
}: WfoSubscriptionProductBlockProps) => {
    const t = useTranslations('subscriptions.detail');
    const { theme } = useOrchestratorTheme();
    const {
        iconStyle,
        panelStyle,
        panelStyleOutsideCurrentSubscription,
        leftColumnStyle,
        rightColumnStyle,
        rowStyle,
    } = useWithOrchestratorTheme(getStyles);

    const [showDetails, setShowDetails] = useState(false);

    const ownerSubscriptionId = productBlock.subscription.subscriptionId;
    const isOutsideCurrentSubscription = ownerSubscriptionId !== subscriptionId;
    const inUseByRelations = productBlock.inUseByRelations.filter(
        (inUseByRelation) => inUseByRelation.subscription_id !== subscriptionId,
    );
    const showProductBlockValues = !isOutsideCurrentSubscription || showDetails;

    return (
        <>
            <EuiSpacer size={'m'}></EuiSpacer>
            <EuiPanel
                color="transparent"
                hasShadow={false}
                css={
                    isOutsideCurrentSubscription
                        ? panelStyleOutsideCurrentSubscription
                        : panelStyle
                }
            >
                <EuiFlexGroup>
                    <EuiFlexItem grow={false}>
                        <div css={iconStyle}>
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
                                    productBlock.productBlockInstanceValues,
                                )}
                            </h3>
                        </EuiText>
                        <EuiText size="s">
                            {getFieldFromProductBlockInstanceValues(
                                productBlock.productBlockInstanceValues,
                                'name',
                            )}
                        </EuiText>
                    </EuiFlexItem>
                    <EuiFlexItem grow={false}>
                        <EuiButtonEmpty
                            aria-label={
                                showDetails
                                    ? t('hideDetails')
                                    : t('showDetails')
                            }
                            size={'m'}
                            onClick={() => setShowDetails(!showDetails)}
                        >
                            {showDetails ? t('hideDetails') : t('showDetails')}
                        </EuiButtonEmpty>
                    </EuiFlexItem>
                </EuiFlexGroup>

                <EuiSpacer size={'m'}></EuiSpacer>
                {
                    <table width="100%">
                        <tbody>
                            {isOutsideCurrentSubscription && (
                                <tr key={-1} css={rowStyle}>
                                    <td css={leftColumnStyle}>
                                        <b>{t('ownerSubscriptionId')}</b>
                                    </td>
                                    <td css={rightColumnStyle}>
                                        <a
                                            href={`${PATH_SUBSCRIPTIONS}/${ownerSubscriptionId}`}
                                            target="_blank"
                                        >
                                            {ownerSubscriptionId}
                                        </a>
                                    </td>
                                </tr>
                            )}
                            {showDetails && (
                                <>
                                    <tr key={-2} css={rowStyle}>
                                        <td css={leftColumnStyle}>
                                            <b>{t('subscriptionInstanceId')}</b>
                                        </td>
                                        <td css={rightColumnStyle}>
                                            {
                                                productBlock.subscriptionInstanceId
                                            }
                                        </td>
                                    </tr>
                                    {!isOutsideCurrentSubscription && (
                                        <tr key={-3} css={rowStyle}>
                                            <td css={leftColumnStyle}>
                                                <b>
                                                    {t('ownerSubscriptionId')}
                                                </b>
                                            </td>
                                            <td css={rightColumnStyle}>
                                                <>
                                                    <EuiBadge>
                                                        {t('self')}
                                                    </EuiBadge>
                                                </>
                                            </td>
                                        </tr>
                                    )}
                                    <tr key={-4} css={rowStyle}>
                                        <td css={leftColumnStyle}>
                                            <b>{t('inUseByRelations')}</b>
                                        </td>
                                        <td css={rightColumnStyle}>
                                            {(inUseByRelations.length === 0 &&
                                                'None') || (
                                                <WfoInUseByRelations
                                                    inUseByRelations={
                                                        inUseByRelations
                                                    }
                                                />
                                            )}
                                        </td>
                                    </tr>
                                </>
                            )}

                            {showProductBlockValues &&
                                productBlock.productBlockInstanceValues
                                    .filter(
                                        (productBlockInstanceValue) =>
                                            !HIDDEN_KEYS.includes(
                                                productBlockInstanceValue.field,
                                            ),
                                    )
                                    .map((productBlockInstanceValue, index) => (
                                        <WfoProductBlockKeyValueRow
                                            fieldValue={
                                                productBlockInstanceValue
                                            }
                                            key={index}
                                        />
                                    ))}
                        </tbody>
                    </table>
                }
            </EuiPanel>
        </>
    );
};
