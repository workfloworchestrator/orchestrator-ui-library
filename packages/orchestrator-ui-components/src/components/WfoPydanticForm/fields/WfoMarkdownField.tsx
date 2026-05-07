import React from 'react';

import { PydanticFormElementProps } from 'pydantic-forms';

import { EuiCallOut, EuiMarkdownFormat } from '@elastic/eui';

import { CALLOUT_COLORS } from './WfoCallout';

type MarkdownFieldDefault = string | { content: string; color?: string };

export const WfoMarkdownField = ({ pydanticFormField }: PydanticFormElementProps) => {
  const raw: MarkdownFieldDefault = pydanticFormField.default;
  const content = typeof raw === 'string' ? raw : (raw?.content ?? '');
  const color =
    typeof raw === 'object' && CALLOUT_COLORS.includes(raw?.color ?? '') ?
      (raw.color as 'primary' | 'success' | 'warning' | 'danger' | 'accent')
    : 'primary';

  return (
    <div data-testid={pydanticFormField.id} css={{ marginBottom: '2rem' }}>
      <EuiCallOut color={color}>
        <EuiMarkdownFormat>{content}</EuiMarkdownFormat>
      </EuiCallOut>
    </div>
  );
};
