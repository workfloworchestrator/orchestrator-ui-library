import React, { FC, ReactNode } from 'react';

import { EuiBadgeProps } from '@elastic/eui';
import { TextColor } from '@elastic/eui/src/components/text/text_color';

import { WfoBadge } from '../WfoBadge/WfoBadge';

export type HeaderBadgeProps = EuiBadgeProps & {
    textColor: TextColor | string;
    children?: ReactNode;
};

export const WfoHeaderBadge: FC<HeaderBadgeProps> = ({
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
        <WfoBadge {...restProps} css={css}>
            {children}
        </WfoBadge>
    );
};
