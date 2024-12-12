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

import { WfoProductBlockKeyValueRow, WfoValueCell } from '@/components';
import { useWithOrchestratorTheme } from '@/hooks';
import { ProductBlockInstance, Subscription } from '@/types';
import { getFirstUuidPart } from '@/utils';

import { WfoInUseByRelations } from '../WfoInUseByRelations';
import {
    getFieldFromProductBlockInstanceValues,
    getProductBlockTitle,
} from '../utils';
import { getStyles } from './styles';

interface WfoSubscriptionProductBlockProps {
    productBlock: ProductBlockInstance;
    subscriptionId: Subscription['subscriptionId'];
    subscriptionPath: string;
}

export const HIDDEN_KEYS = ['title', 'name', 'label', 'inUseByIds'];

export const WfoSubscriptionProductBlock = ({
    productBlock,
    subscriptionId,
    subscriptionPath,
}: WfoSubscriptionProductBlockProps) => {
    const t = useTranslations('subscriptions.detail');
    const {
        iconStyle,
        iconOutsideCurrentSubscriptionStyle,
        panelStyle,
        panelStyleOutsideCurrentSubscription,
        leftColumnStyle,
        leftColumnStyleWithAlignSelf,
        outsideSubscriptionIdTextStyle,
        rowStyle,
    } = useWithOrchestratorTheme(getStyles);

    const [showDetails, setShowDetails] = useState(false);

    const ownerSubscriptionId = productBlock.subscription.subscriptionId;
    const isOutsideCurrentSubscription = ownerSubscriptionId !== subscriptionId;
    const inUseByRelations = productBlock.inUseByRelations.filter(
        (inUseByRelation) => inUseByRelation.subscription_id !== subscriptionId,
    );
    const showProductBlockValues = !isOutsideCurrentSubscription || showDetails;

    // On previous attempts lodash isEmpty was used here but it signals integer values and false as empty so we don't use it here
    const isEmpty = (value: unknown) => {
        return (
            value === null ||
            value === undefined ||
            value === '' ||
            (Array.isArray(value) && value.length === 0)
        );
    };

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
                        <div
                            css={
                                isOutsideCurrentSubscription
                                    ? iconOutsideCurrentSubscriptionStyle
                                    : iconStyle
                            }
                        >
                            <EuiIcon type="filebeatApp" color="currentColor" />
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
                                    <td css={leftColumnStyleWithAlignSelf}>
                                        <b>{t('ownerSubscriptionId')}</b>
                                    </td>
                                    <td>
                                        <WfoValueCell
                                            value={
                                                <>
                                                    <a
                                                        href={`${subscriptionPath}/${ownerSubscriptionId}`}
                                                        target="_blank"
                                                    >
                                                        {
                                                            productBlock
                                                                .subscription
                                                                .description
                                                        }
                                                    </a>
                                                    <EuiText
                                                        css={
                                                            outsideSubscriptionIdTextStyle
                                                        }
                                                    >
                                                        -
                                                    </EuiText>
                                                    {getFirstUuidPart(
                                                        ownerSubscriptionId,
                                                    )}
                                                </>
                                            }
                                            textToCopy={ownerSubscriptionId}
                                            rowNumber={-1}
                                            enableCopyIcon={true}
                                        />
                                    </td>
                                </tr>
                            )}
                            {showDetails && (
                                <>
                                    <tr key={-2} css={rowStyle}>
                                        <td css={leftColumnStyle}>
                                            <b>{t('subscriptionInstanceId')}</b>
                                        </td>
                                        <td>
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
                                            <td>
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
                                        <td>
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
                                    .sort(
                                        (
                                            { field: fieldNameA },
                                            { field: fieldNameB },
                                        ) => {
                                            if (fieldNameA < fieldNameB) {
                                                return -1;
                                            }
                                            if (fieldNameA > fieldNameB) {
                                                return 1;
                                            }
                                            return 0;
                                        },
                                    )
                                    .map((productBlockInstanceValue, index) => {
                                        if (
                                            productBlockInstanceValue &&
                                            (!isEmpty(
                                                productBlockInstanceValue.value,
                                            ) ||
                                                showDetails)
                                        ) {
                                            return (
                                                <WfoProductBlockKeyValueRow
                                                    fieldValue={
                                                        productBlockInstanceValue
                                                    }
                                                    key={index}
                                                />
                                            );
                                        }
                                    })}
                        </tbody>
                    </table>
                }
            </EuiPanel>
        </>
    );
};
