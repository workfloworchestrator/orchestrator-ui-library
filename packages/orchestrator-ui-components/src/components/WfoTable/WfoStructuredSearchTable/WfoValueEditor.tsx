import React, { type KeyboardEventHandler, useEffect, useState } from 'react';
import type { ChangeEventHandler } from 'react';
import type { ValueEditorProps } from 'react-querybuilder';

import { EuiButtonGroup, EuiFieldText } from '@elastic/eui';

import { getWfoStructuredSearchTableStyles } from '@/components/WfoTable/WfoStructuredSearchTable/styles';
import { useWithOrchestratorTheme } from '@/hooks';

enum UiFieldType {
  text = 'text',
  number = 'number',
  boolean = 'boolean',
}

const BooleanToggle = ({
  handleOnChange,
  currentValue,
}: {
  handleOnChange: (value: unknown) => void;
  currentValue?: boolean;
}) => {
  const [value, setValue] = useState<string>('true');

  useEffect(() => {
    if (!currentValue && currentValue !== false) {
      handleOnChange(true);
    }
  }, [currentValue, handleOnChange]);

  const { buttonGroupStyles } = useWithOrchestratorTheme(getWfoStructuredSearchTableStyles);
  const options = [
    {
      id: 'true',
      label: 'True',
    },
    {
      id: 'false',
      label: 'False',
    },
  ];

  return (
    <EuiButtonGroup
      css={buttonGroupStyles}
      legend="Combinator"
      type="single"
      options={options}
      idSelected={value}
      onChange={(id) => {
        setValue(id);
        handleOnChange(id === 'true' ? true : false);
      }}
      buttonSize="m"
      color="primary"
    />
  );
};

export const WfoValueEditor = (props: ValueEditorProps) => {
  const [value, setValue] = useState<string>(props.value);
  const fieldPathInfoMap = props.context?.fieldPathInfoMap;
  const fieldName = props.field;
  const fieldInfo = fieldPathInfoMap && fieldPathInfoMap.has(fieldName) ? fieldPathInfoMap.get(fieldName) : undefined;

  const uiFieldType = fieldInfo?.ui_types[0] || UiFieldType.text;

  if (uiFieldType === UiFieldType.boolean) {
    return <BooleanToggle handleOnChange={props.handleOnChange} currentValue={props.value as boolean} />;
  }

  const handleOnChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue(e.target.value || '');
  };

  const handleOnBlur = () => {
    props.handleOnChange(value);
  };

  const handleOnKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  return <EuiFieldText value={value} onChange={handleOnChange} onBlur={handleOnBlur} onKeyDown={handleOnKeyDown} />;
};
