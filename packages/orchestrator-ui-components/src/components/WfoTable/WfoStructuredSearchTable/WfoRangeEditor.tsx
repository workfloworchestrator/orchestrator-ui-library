import React, { useEffect, useState } from 'react';
import type { ValueEditorProps } from 'react-querybuilder';

import { EuiFlexGroup } from '@elastic/eui';

import type { EditorComponent } from './WfoValueEditor';

interface WfoRangeEditorProps {
  handleOnChange: ValueEditorProps['handleOnChange'];
  value: string;
  InputElement: EditorComponent;
  onInput?: () => void;
}

export const WfoRangeEditor = ({ handleOnChange, InputElement, value: currentValue, onInput }: WfoRangeEditorProps) => {
  const startValue = currentValue ? currentValue?.toString().split(',') : [];
  const [value, setValue] = useState<(string | undefined)[]>(startValue);

  const handleRangeChange = (newValue: string | number | boolean | undefined, rangeIndex: number) => {
    setValue((currentValues) => {
      const next = [...currentValues];
      const isCleared = newValue === undefined || (typeof newValue === 'number' && Number.isNaN(newValue));
      next[rangeIndex] = isCleared ? undefined : String(newValue);
      return next;
    });
  };

  useEffect(() => {
    if (value[0] !== undefined && value[1] !== undefined) {
      handleOnChange(`${value[0]},${value[1]}`);
      onInput?.();
    }
    // handleOnChange comes from react-querybuilder and is not referentially stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <EuiFlexGroup direction="row" gutterSize="s">
      <InputElement
        handleOnChange={(value) => {
          handleRangeChange(value, 0);
        }}
        value={value[0]}
      />
      <InputElement
        handleOnChange={(value) => {
          handleRangeChange(value, 1);
        }}
        value={value[1]}
      />
    </EuiFlexGroup>
  );
};
