import React from 'react';
import { FC, ReactNode } from 'react';

import { EuiBadge, EuiBadgeProps, EuiText } from '@elastic/eui';
import { TextSize } from '@elastic/eui/src/components/text/text';
import { TextColor } from '@elastic/eui/src/components/text/text_color';

export type WfoBadgeProps = EuiBadgeProps & {
  textColor: TextColor | string;
  children: ReactNode;
  size?: TextSize;
};

export const WfoBadge: FC<WfoBadgeProps> = ({ textColor, children, size, ...restProps }) => {
  return (
    <EuiBadge title="" {...restProps} css={{ borderRadius: '2px', backgroundColor: '' }}>
      <EuiText color={textColor} size={size ?? 'xs'}>
        <b>{children}</b>
      </EuiText>
    </EuiBadge>
  );
};
