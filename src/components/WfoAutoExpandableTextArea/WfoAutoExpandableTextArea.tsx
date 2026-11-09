import React, { useCallback, useEffect, useRef } from 'react';

import { EuiTextArea, EuiTextAreaProps } from '@elastic/eui';

import { useWithOrchestratorTheme } from '@/hooks';

import { getStyles } from './styles';

export const WfoAutoExpandableTextArea = ({ inputRef, onChange, ...restProps }: EuiTextAreaProps) => {
  const { autoExpandableTextAreaStyles } = useWithOrchestratorTheme(getStyles);
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const adjustTextAreaHeight = (textArea: HTMLTextAreaElement | null) => {
    if (!textArea) {
      return;
    }
    textArea.style.height = 'auto';
    textArea.style.height = `${textArea.scrollHeight}px`;
  };

  useEffect(() => {
    adjustTextAreaHeight(textAreaRef.current);
  }, [restProps.value]);

  const handleInputRef = useCallback(
    (node: HTMLTextAreaElement | null) => {
      textAreaRef.current = node;
      adjustTextAreaHeight(node);

      if (typeof inputRef === 'function') {
        inputRef(node);
      } else if (inputRef) {
        (inputRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
      }
    },
    [inputRef],
  );

  return (
    <EuiTextArea
      css={autoExpandableTextAreaStyles}
      rows={1}
      fullWidth={true}
      isClearable={true}
      resize={'none'}
      {...restProps}
      inputRef={handleInputRef}
      onChange={(event) => {
        adjustTextAreaHeight(event.target);
        onChange?.(event);
      }}
    />
  );
};
