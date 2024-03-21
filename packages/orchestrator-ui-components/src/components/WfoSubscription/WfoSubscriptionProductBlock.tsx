import React, { FC, useState } from 'react';

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

import { PATH_SUBSCRIPTIONS } from '@/components';
import { useOverrideValueRender } from '@/contexts';
import { useOrchestratorTheme, useWithOrchestratorTheme } from '@/hooks';
import { FieldValue, InUseByRelation } from '@/types';
import { camelToHuman } from '@/utils';

import { getStyles } from './styles';
import {
    getFieldFromProductBlockInstanceValues,
    getProductBlockTitle,
} from './utils';

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
                                    <tr key={-3}>
                                        <td
                                            valign={'top'}
                                            css={productBlockFirstLeftColStyle}
                                        >
                                            <b>{t('subscriptionInstanceId')}</b>
                                        </td>
                                        <td
                                            valign={'top'}
                                            css={productBlockFirstRightColStyle}
                                        >
                                            {subscriptionInstanceId}
                                        </td>
                                    </tr>
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
                                    <WfoProductBlockKeyValueRow
                                        fieldValue={productBlockInstanceValue}
                                        isFirstBlock={isFirstBlock(index)}
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

// Todo: move to a separate file
export type WfoProductBlockKeyValueRowProps = {
    fieldValue: FieldValue;
    isFirstBlock: boolean;
};

export const WfoProductBlockKeyValueRow: FC<
    WfoProductBlockKeyValueRowProps
> = ({ fieldValue, isFirstBlock }) => {
    const {
        productBlockFirstLeftColStyle,
        productBlockLeftColStyle,
        productBlockFirstRightColStyle,
        productBlockRightColStyle,
    } = useWithOrchestratorTheme(getStyles);
    const { overrideValueRender } = useOverrideValueRender();

    const { field, value } = fieldValue;

    return (
        <tr>
            <td
                css={
                    isFirstBlock
                        ? productBlockFirstLeftColStyle
                        : productBlockLeftColStyle
                }
            >
                <b>{camelToHuman(field)}</b>
            </td>
            <td
                css={
                    isFirstBlock
                        ? productBlockFirstRightColStyle
                        : productBlockRightColStyle
                }
            >
                {overrideValueRender?.(field, value) ?? (
                    <WfoProductBlockValue value={value} />
                )}
            </td>
        </tr>
    );
};

// Todo: move to a separate file
export type WfoProductBlockValueProps = {
    value: FieldValue['value'];
};

export const WfoProductBlockValue: FC<WfoProductBlockValueProps> = ({
    value,
}) =>
    typeof value === 'boolean' ? (
        <EuiBadge>{value.toString()}</EuiBadge>
    ) : (
        <>{value}</>
    );
