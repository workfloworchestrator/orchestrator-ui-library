import React, { useEffect, useState } from 'react';

import { EuiFlexGroup } from '@elastic/eui';

interface RangeElementProps {
  handleOnChange: (value: string | number | boolean | undefined, rangeIndex?: number) => void;
  operator?: string;
  rangeIndex?: number;
}
interface WfoRangeEditorProps {
  handleOnChange: (value: string | number | boolean | undefined, rangeIndex?: number) => void;
  operator: string;
  Element: React.ComponentType<RangeElementProps>;
}

export const WfoRangeEditor = ({ handleOnChange, operator, Element }: WfoRangeEditorProps) => {
  const [currentOperator, setCurrentOperator] = useState(operator);
  const [, setValue] = useState<string[]>([]);

  useEffect(() => {
    console.log('currentOperator: ', currentOperator, ' operator: ', operator);
    if (operator !== currentOperator && (operator === 'between' || currentOperator === 'between')) {
      console.log('BOOOM');
      setValue([]);
      handleOnChange('');
      setCurrentOperator(operator);
    }
  }, [currentOperator, operator]);

  const handleChange = (value: string | number | boolean | undefined, rangeIndex: number = 0) => {
    if (operator === 'between') {
      setValue((currentDates) => {
        // remove value if set to undefined
        if (value === undefined) {
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
        <Element handleOnChange={handleChange} rangeIndex={0} />
        <Element handleOnChange={handleChange} rangeIndex={1} />
      </EuiFlexGroup>
    );
  }

  return <Element handleOnChange={handleOnChange} />;
};
