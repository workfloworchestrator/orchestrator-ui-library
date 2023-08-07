import React from 'react';
import { EuiBadge, EuiBadgeProps, EuiText } from '@elastic/eui';
import { FC, ReactNode } from 'react';
import { TextColor } from '@elastic/eui/src/components/text/text_color';

export type WFOBadgeProps = EuiBadgeProps & {
    textColor: TextColor | string;
    children: ReactNode;
};

export const WFOBadge: FC<WFOBadgeProps> = ({
    textColor,
    children,
    ...restProps
}) => (
    <EuiBadge {...restProps}>
        <EuiText color={textColor} size="xs">
            <b>{children}</b>
        </EuiText>
    </EuiBadge>
);
