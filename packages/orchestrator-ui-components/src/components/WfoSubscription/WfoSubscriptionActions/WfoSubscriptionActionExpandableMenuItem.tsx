import React, { FC, useState } from 'react';

import Link from 'next/link';

import { EuiButtonIcon, EuiText } from '@elastic/eui';
import { ReactJSXElement } from '@emotion/react/types/jsx-namespace';

import { PATH_SUBSCRIPTIONS } from '@/components';
import { SubscriptionAction } from '@/types';

export type WfoSubscriptionActionExpandableMenuItemProps = {
    subscriptionAction: SubscriptionAction;
    onClickLockedRelation: (relation: string) => void;
    children: ReactJSXElement;
};

export const WfoSubscriptionActionExpandableMenuItem: FC<
    WfoSubscriptionActionExpandableMenuItemProps
> = ({ subscriptionAction, onClickLockedRelation, children }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div>
            <div
                css={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    '&:hover, & :hover': {
                        cursor: 'pointer',
                    },
                }}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div>{children}</div>
                {subscriptionAction.locked_relations && (
                    <EuiButtonIcon
                        css={{
                            marginRight: '12px',
                        }}
                        iconType={isExpanded ? 'arrowDown' : 'arrowRight'}
                        onClick={() => setIsExpanded(!isExpanded)}
                    />
                )}
            </div>
            {subscriptionAction.locked_relations && isExpanded && (
                <div
                    css={{
                        marginLeft: '50px',
                        paddingBottom: '12px',
                        paddingRight: '12px',
                    }}
                >
                    {subscriptionAction.locked_relations.map((relation) => (
                        <EuiText key={relation}>
                            <Link
                                css={{
                                    display: 'block',
                                }}
                                href={`${PATH_SUBSCRIPTIONS}/${relation}`}
                                onClick={() => onClickLockedRelation(relation)}
                            >
                                {/* Todo: decide if we want this */}
                                <code>{relation}</code>
                            </Link>
                        </EuiText>
                    ))}
                </div>
            )}
        </div>
    );
};
