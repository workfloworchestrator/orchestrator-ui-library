import React, { FC, ReactNode } from 'react';
import { EuiBadgeProps } from '@elastic/eui';
import { WFOBadge } from '../WFOBadge/WFOBadge';
import { TextColor } from '@elastic/eui/src/components/text/text_color';

export type HeaderBadgeProps = EuiBadgeProps & {
    textColor: TextColor | string;
    children: ReactNode;
};

export const WFOHeaderBadge: FC<HeaderBadgeProps> = ({
    children,
    ...restProps
}) => {
    const css = restProps.iconType
        ? {
              height: 24,
              display: 'flex',
              paddingLeft: 0,
          }
        : {
              height: 24,
              display: 'flex',
          };

    return (
        <WFOBadge {...restProps} css={css}>
            {children}
        </WFOBadge>
    );
};
