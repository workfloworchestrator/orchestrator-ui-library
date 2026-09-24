import React from 'react';

import { PydanticFormElementProps } from 'pydantic-forms';

import { EuiMarkdownFormat } from '@elastic/eui';

import { WfoCallOut } from '@/components/WfoCallOut';

import { CALLOUT_COLORS, CalloutColor } from './WfoCallout';

type MarkdownFieldDefault = string | { content: string; color: CalloutColor };

export const WfoMarkdownField = ({ pydanticFormField }: PydanticFormElementProps) => {
  const markdownValue: MarkdownFieldDefault = pydanticFormField.default;
  const content = typeof markdownValue === 'string' ? markdownValue : (markdownValue?.content ?? '');
  const color =
    typeof markdownValue === 'object' && CALLOUT_COLORS.includes(markdownValue?.color) ?
      markdownValue?.color
    : undefined;

  return (
    <div data-testid={pydanticFormField.id} css={{ marginBottom: '2rem' }}>
      <WfoCallOut color={color}>
        <EuiMarkdownFormat>{content}</EuiMarkdownFormat>
      </WfoCallOut>
    </div>
  );
};
