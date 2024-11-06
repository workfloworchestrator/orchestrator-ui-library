import React, { FC, useState } from 'react';

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
    const {
        expandableMenuItemStyle,
        expandButtonStyle,
        expandedContentStyle,
        linkStyle,
    } = useWithOrchestratorTheme(getSubscriptionActionStyles);
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div>
            <div
                css={expandableMenuItemStyle}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div>{children}</div>
                {subscriptionAction.locked_relations && (
                    <EuiButtonIcon
                        css={expandButtonStyle}
                        iconType={isExpanded ? 'arrowDown' : 'arrowRight'}
                        onClick={() => setIsExpanded(!isExpanded)}
                    />
                )}
            </div>
            {subscriptionAction.locked_relations && isExpanded && (
                <div css={expandedContentStyle}>
                    {/* TODO: Adds text */}
                    <EuiText size="s">Todo!!!</EuiText>
                    {subscriptionAction.locked_relations.map((relation) => (
                        <EuiText key={relation} size="s">
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
