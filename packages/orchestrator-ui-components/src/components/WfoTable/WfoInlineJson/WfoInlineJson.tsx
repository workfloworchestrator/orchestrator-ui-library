import React, { FC } from 'react';

export type WfoInlineJsonProps = {
  data: object | null;
};

export const WfoInlineJson: FC<WfoInlineJsonProps> = ({ data }) => {
  if (!data) {
    return null;
  }

  const valueAsString = JSON.stringify(data);
  return <span>{valueAsString}</span>;
};
