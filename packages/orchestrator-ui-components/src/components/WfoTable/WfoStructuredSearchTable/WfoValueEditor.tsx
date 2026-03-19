import React, { useState } from 'react';
import type { ChangeEventHandler } from 'react';
import type { ValueEditorProps } from 'react-querybuilder';

import { EuiFieldText } from '@elastic/eui';

enum UiFieldType {
  text = 'text',
  number = 'number',
  boolean = 'boolean',
}

export const WfoValueEditor = (props: ValueEditorProps) => {
  const [value, setValue] = useState(props.value);
  const fieldPathInfoMap = props.context?.fieldPathInfoMap;
  const fieldName = props.field;
  const fieldInfo = fieldPathInfoMap && fieldPathInfoMap.has(fieldName) ? fieldPathInfoMap.get(fieldName) : undefined;

  const uiFieldType = fieldInfo?.uiField || UiFieldType.text;

  const handleOnChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const newValue = e.target.value || '';
    props.handleOnChange(newValue);
    setValue(newValue);
  };

  const displayField = () => {
    switch (uiFieldType) {
      default:
        return <EuiFieldText value={value} onChange={handleOnChange} />;
    }
  };

  return displayField();
};
