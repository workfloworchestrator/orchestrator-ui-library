import React, { ReactNode } from 'react';

import { EuiFlexItem } from '@elastic/eui';
import { useOrchestratorTheme } from '@orchestrator-ui/orchestrator-ui-components';

import { getStyles } from '@/components/WfoAvatar/styles';
import { ServiceTicketLogType } from '@/types';

export interface WfoAvatarProps {
    stepStatus: ServiceTicketLogType;
    icon: ReactNode;
}

export const WfoAvatar = ({ stepStatus, icon }: WfoAvatarProps) => {
    const { theme, toSecondaryColor } = useOrchestratorTheme();

    const { openIconStyle, updateIconStyle, closedIconStyle } = getStyles(
        theme,
        toSecondaryColor,
    );

    const [stepStateStyle] = (() => {
        switch (stepStatus) {
            case ServiceTicketLogType.OPEN:
                return [openIconStyle];
            case ServiceTicketLogType.UPDATE:
                return [updateIconStyle];
            case ServiceTicketLogType.CLOSE:
                return [closedIconStyle];

            default:
                return [
                    closedIconStyle,
                    theme.colors.link,
                    true,
                    theme.colors.success,
                ];
        }
    })();

    return (
        <EuiFlexItem css={{ flexDirection: 'row', ...stepStateStyle }} grow={0}>
            {icon}
        </EuiFlexItem>
    );
};
