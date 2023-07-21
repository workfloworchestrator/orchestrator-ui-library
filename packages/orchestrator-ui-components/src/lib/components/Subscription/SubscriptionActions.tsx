import React, { FC, useState } from 'react';
import {
    EuiButton,
    EuiContextMenuItem,
    EuiContextMenuPanel,
    EuiPanel,
    EuiAvatar,
    EuiTitle,
    EuiPopover,
} from '@elastic/eui';
import { useSubscriptionActions } from '../../hooks/useSubscriptionActions';

type MenuItemProps = {
    key: string;
    icon: string;
    description: string;
    index: number;
};

const MenuItem: FC<MenuItemProps> = ({ icon, description, key }) => (
    <EuiContextMenuItem key={key} icon={<EuiAvatar name={icon} size="s" />}>
        {description}
    </EuiContextMenuItem>
);

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

export const SubscriptionActions: FC<SubscriptionActionsProps> = ({
    subscriptionId,
}) => {
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
            Actions
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
                            <MenuBlock title={'Create workflow'}></MenuBlock>
                            {subscriptionActions.create.map((item, index) => (
                                <MenuItem
                                    key={`c_${index}`}
                                    icon={'CreateLong'}
                                    description={item.description}
                                    index={index}
                                />
                            ))}
                        </>
                    )}

                    {subscriptionActions && subscriptionActions.modify && (
                        <>
                            <MenuBlock title={'Modify workflow'}></MenuBlock>
                            {subscriptionActions.modify.map((item, index) => (
                                <MenuItem
                                    key={`m_${index}`}
                                    icon={'M'}
                                    description={item.description}
                                    index={index}
                                />
                            ))}
                        </>
                    )}

                    {subscriptionActions && subscriptionActions.system && (
                        <>
                            <MenuBlock title={'System workflow'}></MenuBlock>
                            {subscriptionActions.system.map((item, index) => (
                                <MenuItem
                                    key={`s_${index}`}
                                    icon={'Syste'}
                                    description={item.description}
                                    index={index}
                                />
                            ))}
                        </>
                    )}

                    {subscriptionActions && subscriptionActions.terminate && (
                        <>
                            <MenuBlock title={'Terminate workflow'}></MenuBlock>
                            {subscriptionActions.terminate.map(
                                (item, index) => (
                                    <MenuItem
                                        key={`t_${index}`}
                                        icon={'Terminate'}
                                        description={item.description}
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
