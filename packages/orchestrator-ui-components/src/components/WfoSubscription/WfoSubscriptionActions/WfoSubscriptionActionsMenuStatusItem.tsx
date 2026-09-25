import React, { FC } from 'react';

import { EuiContextMenuItem } from '@elastic/eui';

import { getSubscriptionActionStyles } from '@/components/WfoSubscription/WfoSubscriptionActions/styles';
import { useWithOrchestratorTheme } from '@/hooks';
import { WorkflowTarget } from '@/types';

import { WfoTargetTypeIcon } from '../WfoTargetTypeIcon';

interface MenuStatusItemProps {
  message: string | React.ReactNode;
  target: WorkflowTarget;
}

export const WfoSubscriptionActionsMenuStatusItem: FC<MenuStatusItemProps> = ({ message, target }) => {
  const { iconStyle } = useWithOrchestratorTheme(getSubscriptionActionStyles);

  return (
    <EuiContextMenuItem
      icon={
        <div css={iconStyle}>
          <WfoTargetTypeIcon target={target} disabled={true} />
        </div>
      }
      disabled={true}
      css={{ whiteSpace: 'nowrap' }}
    >
      {message}
    </EuiContextMenuItem>
  );
};
