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

export type SubscriptionActionsProps = {
    subscriptionId: string | string[];
};

export const SubscriptionActions: FC<SubscriptionActionsProps> = ({
    subscriptionId,
}) => {
    const [isPopoverOpen, setPopover] = useState(false);
    const { data: subscriptionActions } = useSubscriptionActions(
        '8e22de88-1140-49eb-8c09-498f69654b4b',
    );

    const onButtonClick = () => {
        setPopover(!isPopoverOpen);
    };

    const closePopover = () => {
        setPopover(false);
    };

    const createWorkflows = [];
    const modifyWorkflows = [];
    const terminateWorkflows = [];
    const systemWorkflows = [];

    if (subscriptionActions) {
        subscriptionActions.create.map((item) =>
            createWorkflows.push(
                <EuiContextMenuItem icon={<EuiAvatar name="Create" size="s" />}>
                    {item.description}
                </EuiContextMenuItem>,
            ),
        );
        subscriptionActions.modify.map((item) =>
            modifyWorkflows.push(
                <EuiContextMenuItem icon={<EuiAvatar name="M" size="s" />}>
                    {item.description}
                </EuiContextMenuItem>,
            ),
        );

        subscriptionActions.terminate.map((item) =>
            terminateWorkflows.push(
                <EuiContextMenuItem icon={<EuiAvatar name="Te" size="s" />}>
                    {item.description}
                </EuiContextMenuItem>,
            ),
        );
        subscriptionActions.system.map((item) =>
            systemWorkflows.push(
                <EuiContextMenuItem icon={<EuiAvatar name="Sys" size="s" />}>
                    {item.description}
                </EuiContextMenuItem>,
            ),
        );

        // subscriptionActions.modify.map((item) =>
        //     panels[1].items.push({
        //         name: item.description,
        //         icon: <EuiAvatar name="M" size="s" />,
        //         onClick: () => {
        //             closePopover();
        //         },
        //     }),
        // );
        // subscriptionActions.terminate.map((item) =>
        //     panels[2].items.push({
        //         name: item.description,
        //         icon: <EuiAvatar name="M" size="s" />,
        //         onClick: () => {
        //             closePopover();
        //         },
        //     }),
        // );
    }
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
                    <EuiTitle size="xxxs">
                        <h3>Create workflows</h3>
                    </EuiTitle>
                    {createWorkflows}
                    <EuiTitle size="xxxs">
                        <h3>Modify workflows</h3>
                    </EuiTitle>
                    {modifyWorkflows}
                    <EuiTitle size="xxxs">
                        <h3>Terminate workflows</h3>
                    </EuiTitle>
                    {terminateWorkflows}
                    <EuiTitle size="xxxs">
                        <h3>System workflows</h3>
                    </EuiTitle>
                    {systemWorkflows}
                </EuiPanel>
            </EuiContextMenuPanel>
        </EuiPopover>
    );
};
