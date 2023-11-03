import { ServiceTicketProcessState } from '../../types';
import React, { FC } from 'react';
import {
    useOrchestratorTheme,
    WfoBadge,
} from '@orchestrator-ui/orchestrator-ui-components';

export type WfoProcessStatusBadgeProps = {
    serviceTicketState: ServiceTicketProcessState;
};

export const WfoServiceTicketStatusBadge: FC<WfoProcessStatusBadgeProps> = ({
    serviceTicketState,
}) => {
    const { theme, toSecondaryColor } = useOrchestratorTheme();

    const getBadgeColorFromServiceTicketState = () => {
        const {
            primary,
            lightShade,
            primaryText,
            success,
            successText,
            text,
            warning,
            warningText,
        } = theme.colors;

        const {
            NEW,
            OPEN,
            OPEN_RELATED,
            OPEN_ACCEPTED,
            UPDATED,
            ABORTED,
            CLOSED,
        } = ServiceTicketProcessState;

        switch (serviceTicketState) {
            case OPEN || NEW:
                return {
                    badgeColor: toSecondaryColor(success),
                    textColor: successText,
                };
            case OPEN_ACCEPTED || OPEN_RELATED:
                return {
                    badgeColor: toSecondaryColor(warning),
                    textColor: warningText,
                };
            case UPDATED:
                return {
                    badgeColor: toSecondaryColor(primary),
                    textColor: primaryText,
                };
            case CLOSED || ABORTED:
                return {
                    badgeColor: toSecondaryColor(lightShade),
                    textColor: text,
                };
            default:
                return {
                    badgeColor: toSecondaryColor(lightShade),
                    textColor: text,
                };
        }
    };

    const { badgeColor, textColor } = getBadgeColorFromServiceTicketState();

    return (
        <WfoBadge textColor={textColor} color={badgeColor}>
            {serviceTicketState.toLowerCase()}
        </WfoBadge>
    );
};
