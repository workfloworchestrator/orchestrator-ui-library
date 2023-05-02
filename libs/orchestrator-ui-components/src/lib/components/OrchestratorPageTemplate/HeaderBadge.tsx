import React, { FC, ReactNode } from 'react';
import { EuiBadgeProps } from '@elastic/eui';
import { Badge } from '../Badge/Badge';
import { TextColor } from '@elastic/eui/src/components/text/text_color';

export type HeaderBadgeProps = EuiBadgeProps & {
    textColor: TextColor | string;
    children: ReactNode;
};

export const HeaderBadge: FC<HeaderBadgeProps> = ({
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
        <Badge {...restProps} css={css}>
            {children}
        </Badge>
    );
};
