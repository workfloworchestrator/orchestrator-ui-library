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

    const createWorkflows = [];
    const modifyWorkflows = [];
    const terminateWorkflows = [];
    const systemWorkflows = [];

    if (subscriptionActions) {
        subscriptionActions.create.map((item, index) =>
            createWorkflows.push(
                <EuiContextMenuItem
                    key={`c_${index}`}
                    icon={<EuiAvatar name="Create" size="s" />}
                >
                    {item.description}
                </EuiContextMenuItem>,
            ),
        );
        subscriptionActions.modify.map((item, index) =>
            modifyWorkflows.push(
                <EuiContextMenuItem
                    key={`m_${index}`}
                    icon={<EuiAvatar name="M" size="s" />}
                >
                    {item.description}
                </EuiContextMenuItem>,
            ),
        );

        subscriptionActions.terminate.map((item, index) =>
            terminateWorkflows.push(
                <EuiContextMenuItem
                    key={`t_${index}`}
                    icon={<EuiAvatar name="Te" size="s" />}
                >
                    {item.description}
                </EuiContextMenuItem>,
            ),
        );
        subscriptionActions.system.map((item, index) =>
            systemWorkflows.push(
                <EuiContextMenuItem
                    key={`s_${index}`}
                    icon={<EuiAvatar name="Sys" size="s" />}
                >
                    {item.description}
                </EuiContextMenuItem>,
            ),
        );
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
