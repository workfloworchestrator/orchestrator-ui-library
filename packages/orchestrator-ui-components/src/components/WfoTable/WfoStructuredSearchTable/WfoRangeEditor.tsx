import React, { useEffect, useState } from 'react';

import { EuiFlexGroup } from '@elastic/eui';

export interface WfoRangeElementProps {
  handleOnChange: (value: string | number | undefined, rangeIndex?: number) => void;
  value: string;
  operator?: string;
  rangeIndex?: number;
}

interface WfoRangeEditorProps {
  handleOnChange: (value: string | number | undefined, rangeIndex?: number) => void;
  operator: string;
  value: string;
  Element: React.ComponentType<WfoRangeElementProps>;
}

export const WfoRangeEditor = ({ handleOnChange, operator, Element, value: currentValue }: WfoRangeEditorProps) => {
  const [currentOperator, setCurrentOperator] = useState(operator);
  const startValue = currentValue ? currentValue?.toString().split(',') : [];
  const [value, setValue] = useState<string[]>(startValue);

  useEffect(() => {
    if (operator !== currentOperator && (operator === 'between' || currentOperator === 'between')) {
      setValue([]);
      handleOnChange('');
      setCurrentOperator(operator);
    }
  }, [currentOperator, handleOnChange, operator]);

  const handleChange = (value: string | number | undefined, rangeIndex: number = 0) => {
    if (operator === 'between') {
      setValue((currentDates) => {
        // remove value if set to undefined
        if (value === null) {
          return currentDates.filter((_, index) => index !== rangeIndex);
        }
        // add value at supplied index
        currentDates[rangeIndex] = value as string;

        // call the parent if 2 values are present
        if (currentDates.length === 2) {
          handleOnChange(`${currentDates[0]},${currentDates[1]}`);
        }

        return currentDates;
      });
    } else {
      handleOnChange(value);
    }
  };

  if (operator === 'between') {
    return (
      <EuiFlexGroup direction="row" gutterSize="s">
        <Element handleOnChange={handleChange} rangeIndex={0} value={value[0]} />
        <Element handleOnChange={handleChange} rangeIndex={1} value={value[1]} />
      </EuiFlexGroup>
    );
  }

  return <Element handleOnChange={handleOnChange} value={value[0]} />;
};
