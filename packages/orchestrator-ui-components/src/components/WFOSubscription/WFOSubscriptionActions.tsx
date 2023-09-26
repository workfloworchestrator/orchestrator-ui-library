import React, { FC, useState } from 'react';
import Link from 'next/link';

import {
    EuiButton,
    EuiContextMenuItem,
    EuiContextMenuPanel,
    EuiPanel,
    EuiAvatar,
    EuiTitle,
    EuiPopover,
} from '@elastic/eui';
import { useTranslations } from 'next-intl';
import {
    SubscriptionAction,
    useSubscriptionActions,
} from '../../hooks/useSubscriptionActions';

type MenuItemProps = {
    key: string;
    icon: string;
    action: SubscriptionAction;
    index: number;
};

type MenuBlockProps = {
    title: string;
};
const MenuBlock: FC<MenuBlockProps> = ({ title }) => (
    <EuiTitle size="xxxs">
        <h3>{title}</h3>
    </EuiTitle>
);

export type SubscriptionActionsProps = {
    subscriptionId: string;
};

export const WFOSubscriptionActions: FC<SubscriptionActionsProps> = ({
    subscriptionId,
}) => {
    const MenuItem: FC<MenuItemProps> = ({ icon, action, key }) => {
        return (
            <Link
                href={{
                    pathname: `/start-workflow/${action.name}`,
                    query: { subscriptionId: subscriptionId },
                }}
            >
                <EuiContextMenuItem
                    key={key}
                    icon={<EuiAvatar name={icon} size="s" />}
                >
                    {action.description}
                </EuiContextMenuItem>
            </Link>
        );
    };

    const t = useTranslations('subscriptions.detail.workflow');
    const [isPopoverOpen, setPopover] = useState(false);
    const { data: subscriptionActions } =
        useSubscriptionActions(subscriptionId);

    const onButtonClick = () => {
        setPopover(!isPopoverOpen);
    };

    const closePopover = () => {
        setPopover(false);
    };

    const button = (
        <EuiButton
            iconType="arrowDown"
            iconSide="right"
            onClick={onButtonClick}
        >
            {t('actions')}
        </EuiButton>
    );

    return (
        <EuiPopover
            id="subscriptionActionPopover"
            button={button}
            isOpen={isPopoverOpen}
            closePopover={closePopover}
            panelPaddingSize="none"
            anchorPosition="downLeft"
        >
            <EuiContextMenuPanel>
                <EuiPanel color="transparent" paddingSize="s">
                    {subscriptionActions && subscriptionActions.create && (
                        <>
                            <MenuBlock title={t('create')}></MenuBlock>
                            {subscriptionActions.create.map((action, index) => (
                                <MenuItem
                                    key={`c_${index}`}
                                    icon={'CreateLong'}
                                    action={action}
                                    index={index}
                                />
                            ))}
                        </>
                    )}

                    {subscriptionActions && subscriptionActions.modify && (
                        <>
                            <MenuBlock title={t('modify')}></MenuBlock>
                            {subscriptionActions.modify.map((action, index) => (
                                <MenuItem
                                    key={`m_${index}`}
                                    icon={'M'}
                                    action={action}
                                    index={index}
                                />
                            ))}
                        </>
                    )}

                    {subscriptionActions && subscriptionActions.system && (
                        <>
                            <MenuBlock title={t('system')}></MenuBlock>
                            {subscriptionActions.system.map((action, index) => (
                                <MenuItem
                                    key={`s_${index}`}
                                    icon={'System'}
                                    action={action}
                                    index={index}
                                />
                            ))}
                        </>
                    )}

                    {subscriptionActions && subscriptionActions.terminate && (
                        <>
                            <MenuBlock title={t('terminate')}></MenuBlock>
                            {subscriptionActions.terminate.map(
                                (action, index) => (
                                    <MenuItem
                                        key={`t_${index}`}
                                        icon={'Terminate'}
                                        action={action}
                                        index={index}
                                    />
                                ),
                            )}
                        </>
                    )}
                </EuiPanel>
            </EuiContextMenuPanel>
        </EuiPopover>
    );
};
