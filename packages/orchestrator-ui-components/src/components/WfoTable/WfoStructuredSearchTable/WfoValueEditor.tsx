import React, { type KeyboardEventHandler, useEffect, useState } from 'react';
import type { ChangeEventHandler } from 'react';
import type { ValueEditorProps } from 'react-querybuilder';

import moment from 'moment';
import { useTranslations } from 'next-intl';

import { EuiButtonGroup, EuiDatePicker, EuiFieldText } from '@elastic/eui';

import { getWfoStructuredSearchTableStyles } from '@/components/WfoTable/WfoStructuredSearchTable/styles';
import { useWithOrchestratorTheme } from '@/hooks';

enum UiFieldType {
  text = 'text',
  number = 'number',
  boolean = 'boolean',
  datetime = 'datetime',
}

interface EditorProps<T = boolean> {
  handleOnChange: (value: unknown) => void;
  currentValue?: T;
  operator?: string;
}

const BooleanEditor = ({ handleOnChange, currentValue }: EditorProps<boolean>) => {
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

const TextEditor = ({ handleOnChange, currentValue }: EditorProps<string>) => {
  const [value, setValue] = useState<string>(currentValue || '');

  const handleTextChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue(e.target.value || '');
  };

  const handleOnBlur = () => {
    handleOnChange(value);
  };

  const handleOnKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  return <EuiFieldText value={value} onChange={handleTextChange} onBlur={handleOnBlur} onKeyDown={handleOnKeyDown} />;
};

interface DatePickerProps {
  value: string;
  handleOnChange: (value: string | undefined) => void;
  // rangeIndex: number;
}
const DatePicker = ({ value, handleOnChange }: DatePickerProps) => {
  const [date, setDate] = useState<string | undefined>(value);
  const t = useTranslations('search.page');

  return (
    <EuiDatePicker
      selected={date ? moment.utc(date) : null}
      onChange={(date) => {
        const utcDate = date ? moment.utc(date) : null;
        setDate(utcDate?.toISOString() || undefined);
        handleOnChange(utcDate?.toISOString() || undefined);
      }}
      css={{ width: '330px' }}
      showTimeSelect
      dateFormat="yyyy-MM-dd HH:mm"
      timeFormat="HH:mm"
      placeholderText={t('selectDateAndTime')}
      locale="nl"
    />
  );
};

/*
const DatetimeEditor = ({ currentValue, handleOnChange, operator }: EditorProps<string>) => {
  const [value, setValue] = useState<[string|undefined][]>(currentValue || []);

  const onChange = (value: string, rangeIndex: number = 0) => {
    if (operator === 'between') {
      setValue((currentValue) => {

      });
    } else {
      setValue(value);
      handleOnChange(value);
    }
  };

  if (operator === 'between') {
    return (
      <div>
        <DatePicker value={value} onChange={onChange} rangeIndex={0} />;
        <DatePicker value={value} onChange={onChange} rangeIndex={1} />;
      </div>
    );
  }

  return <DatePicker value={value} onChange={onChange} rangeIndex={0} />;
};
*/
export const WfoValueEditor = ({ field: fieldName, context, handleOnChange, value }: ValueEditorProps) => {
  const fieldPathInfoMap = context?.fieldPathInfoMap;

  const fieldInfo = fieldPathInfoMap && fieldPathInfoMap.has(fieldName) ? fieldPathInfoMap.get(fieldName) : undefined;
  const uiFieldType = fieldInfo?.ui_types[0] || UiFieldType.text;

  if (uiFieldType === UiFieldType.boolean) {
    return <BooleanEditor handleOnChange={handleOnChange} />;
  }

  if (uiFieldType === UiFieldType.datetime) {
    return <DatePicker handleOnChange={handleOnChange} value={value as string} />;
  }

  return <TextEditor handleOnChange={handleOnChange} />;
};
