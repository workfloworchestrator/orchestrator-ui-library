import React, { type KeyboardEventHandler, useState } from 'react';
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

  const displayField = () => {
    switch (uiFieldType) {
      default:
        return <EuiFieldText value={value} onChange={handleOnChange} onBlur={handleOnBlur} onKeyDown={handleOnKeyDown} />;
    }
  };

  return displayField();
};
