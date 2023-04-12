import React, { FC, ReactNode } from 'react';
import { EuiBadge } from '@elastic/eui';
import { EuiBadgeProps } from '@elastic/eui';

export type HeaderBadgeProps = EuiBadgeProps & {
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
        : { height: 24, display: 'flex' };

    return (
        <EuiBadge {...restProps} css={css}>
            {children}
        </EuiBadge>
    );
};
