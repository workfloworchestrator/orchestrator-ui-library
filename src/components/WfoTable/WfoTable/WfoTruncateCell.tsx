import React, { FC, ReactElement } from 'react';

export type WfoTruncateCellProps = {
  children?: ReactElement | string | null;
};

export const WfoTruncateCell: FC<WfoTruncateCellProps> = ({ children }) => {
  if (!children) {
    return null;
  }

  return (
    <p
      css={{
        textOverflow: 'ellipsis',
        overflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </p>
  );
};
