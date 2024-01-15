import React, { ReactNode } from 'react';

import { EuiFlexItem } from '@elastic/eui';
import {
    WfoCheckmarkCircleFill,
    useOrchestratorTheme,
} from '@orchestrator-ui/orchestrator-ui-components';

import { getStyles } from '@/components/WfoAvatar/styles';
import { ServiceTicketLogType } from '@/types';

export interface WfoAvatarProps {
    stepStatus: ServiceTicketLogType | null;
    icon: ReactNode;
    hasCheckmark?: boolean;
}

export const WfoAvatar = ({
    stepStatus,
    icon,
    hasCheckmark,
}: WfoAvatarProps) => {
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
                return [closedIconStyle];
        }
    })();

    return (
        <EuiFlexItem css={{ flexDirection: 'row' }} grow={0}>
            <div css={{ ...stepStateStyle }}>{icon}</div>
            {hasCheckmark && (
                <div
                    css={{
                        transform: 'translate(-16px, -8px)',
                        width: `${theme.base}`,
                    }}
                >
                    <WfoCheckmarkCircleFill color={theme.colors.success} />
                </div>
            )}
        </EuiFlexItem>
    );
};
