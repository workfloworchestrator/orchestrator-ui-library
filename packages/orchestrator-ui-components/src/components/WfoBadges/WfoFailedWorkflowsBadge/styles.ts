import { css } from '@emotion/react';

export const getWorkflowBadgeStyles = () => {
  const failedWorkflowBadgeStyle = css({
    cursor: 'pointer',
    '&:hover': { textDecoration: 'underline' },
  });

  return { failedWorkflowBadgeStyle };
};
