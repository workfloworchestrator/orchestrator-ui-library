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
import { FieldValue, InUseByRelation } from '@/types';

import { WfoInUseByRelations } from '../WfoInUseByRelations';
import {
    getFieldFromProductBlockInstanceValues,
    getProductBlockTitle,
} from '../utils';
import { getStyles } from './styles';

interface WfoSubscriptionProductBlockProps {
    ownerSubscriptionId: string;
    subscriptionInstanceId: string;
    productBlockInstanceValues: FieldValue[];
    inUseByRelations: InUseByRelation[];
    id: number;
    isOutsideCurrentSubscription?: boolean;
}

export const HIDDEN_KEYS = ['title', 'name', 'label'];

export const WfoSubscriptionProductBlock = ({
    ownerSubscriptionId,
    subscriptionInstanceId,
    productBlockInstanceValues,
    inUseByRelations,
    isOutsideCurrentSubscription = false,
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

    const [hideDetails, setHideDetails] = useState(true);

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
                                    productBlockInstanceValues,
                                )}
                            </h3>
                        </EuiText>
                        <EuiText size="s">
                            {getFieldFromProductBlockInstanceValues(
                                productBlockInstanceValues,
                                'name',
                            )}
                        </EuiText>
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
                                    <tr key={-3} css={rowStyle}>
                                        <td css={leftColumnStyle}>
                                            <b>{t('subscriptionInstanceId')}</b>
                                        </td>
                                        <td css={rightColumnStyle}>
                                            {subscriptionInstanceId}
                                        </td>
                                    </tr>
                                    <tr key={-2} css={rowStyle}>
                                        <td css={leftColumnStyle}>
                                            <b>{t('ownerSubscriptionId')}</b>
                                        </td>
                                        <td css={rightColumnStyle}>
                                            {!isOutsideCurrentSubscription ? (
                                                <>
                                                    <EuiBadge>
                                                        {t('self')}
                                                    </EuiBadge>
                                                </>
                                            ) : (
                                                <a
                                                    href={`${PATH_SUBSCRIPTIONS}/${ownerSubscriptionId}`}
                                                    target="_blank"
                                                >
                                                    {ownerSubscriptionId}
                                                </a>
                                            )}
                                        </td>
                                    </tr>
                                    <tr key={-1} css={rowStyle}>
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

                            {productBlockInstanceValues
                                .filter(
                                    (productBlockInstanceValue) =>
                                        !HIDDEN_KEYS.includes(
                                            productBlockInstanceValue.field,
                                        ),
                                )
                                .map((productBlockInstanceValue, index) => (
                                    <WfoProductBlockKeyValueRow
                                        fieldValue={productBlockInstanceValue}
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
