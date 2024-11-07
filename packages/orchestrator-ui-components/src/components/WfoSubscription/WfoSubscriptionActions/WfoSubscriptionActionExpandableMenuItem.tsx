import React, { FC, useState } from 'react';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { EuiButtonIcon, EuiText } from '@elastic/eui';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';

import { PATH_SUBSCRIPTIONS } from '@/components';
import { useWithOrchestratorTheme } from '@/hooks';
import { SubscriptionAction } from '@/types';

import { getSubscriptionActionStyles } from './styles';

export type WfoSubscriptionActionExpandableMenuItemProps = {
    subscriptionAction: SubscriptionAction;
    onClickLockedRelation: (relation: string) => void;
    children: ReactJSXElement;
};

export const WfoSubscriptionActionExpandableMenuItem: FC<
    WfoSubscriptionActionExpandableMenuItemProps
> = ({ subscriptionAction, onClickLockedRelation, children }) => {
    const t = useTranslations('subscriptions.detail.actions');

    const {
        clickableStyle,
        expandableMenuItemStyle,
        expandButtonStyle,
        expandedContentStyle,
        linkStyle,
    } = useWithOrchestratorTheme(getSubscriptionActionStyles);
    const [isExpanded, setIsExpanded] = useState(false);

    const { locked_relations } = subscriptionAction;

    return (
        <div>
            <div
                css={[
                    expandableMenuItemStyle,
                    locked_relations && clickableStyle,
                ]}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div>{children}</div>
                {locked_relations && (
                    <EuiButtonIcon
                        css={expandButtonStyle}
                        iconType={isExpanded ? 'arrowDown' : 'arrowRight'}
                        onClick={() => setIsExpanded(!isExpanded)}
                    />
                )}
            </div>
            {locked_relations && isExpanded && (
                <div css={expandedContentStyle}>
                    <EuiText size="xs">{t('lockedBySubscriptions')}</EuiText>
                    {locked_relations.map((relation) => (
                        <EuiText key={relation} size="xs">
                            <Link
                                css={linkStyle}
                                href={`${PATH_SUBSCRIPTIONS}/${relation}`}
                                onClick={() => onClickLockedRelation(relation)}
                            >
                                {relation}
                            </Link>
                        </EuiText>
                    ))}
                </div>
            )}
        </div>
    );
};
