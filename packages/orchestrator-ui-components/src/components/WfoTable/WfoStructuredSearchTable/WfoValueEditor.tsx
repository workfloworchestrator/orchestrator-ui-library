import React, { type KeyboardEventHandler, useEffect, useState } from 'react';
import type { ChangeEventHandler } from 'react';
import type { ValueEditorProps } from 'react-querybuilder';

import moment from 'moment';
import { useTranslations } from 'next-intl';

import { EuiButtonGroup, EuiDatePicker, EuiFieldNumber, EuiFieldText } from '@elastic/eui';

import { getWfoStructuredSearchTableStyles } from '@/components/WfoTable/WfoStructuredSearchTable/styles';
import { useWithOrchestratorTheme } from '@/hooks';

import { WfoRangeEditor, WfoRangeElementProps } from './WfoRangeEditor';

enum UiFieldType {
  text = 'text',
  number = 'number',
  boolean = 'boolean',
  datetime = 'datetime',
}

export type HandleOnChange<T> = (value: T | undefined, rangeIndex?: number) => void;

export interface EditorProps<T> {
  handleOnChange: HandleOnChange<T>;
  operator?: string;
}

const BooleanEditor = ({ handleOnChange }: EditorProps<boolean>) => {
  const [value, setValue] = useState<string>('true');

  useEffect(() => {
    handleOnChange(true);
    // Sets the initial value to true so we allow empty dep array here
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

const TextEditor = ({ handleOnChange }: EditorProps<string>) => {
  const [value, setValue] = useState<string>('');

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

const NumberEditor = ({ handleOnChange, rangeIndex }: WfoRangeElementProps) => {
  const [value, setValue] = useState<string>('');

  const handleNumberChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue(e.target.value || '');
  };

  const handleOnBlur = () => {
    const numberValue = parseFloat(value);
    handleOnChange(numberValue, rangeIndex);
  };

  const handleOnKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  return (
    <EuiFieldNumber
      value={value || undefined}
      onChange={handleNumberChange}
      onBlur={handleOnBlur}
      onKeyDown={handleOnKeyDown}
    />
  );
};

const DatePicker = ({ handleOnChange, rangeIndex }: WfoRangeElementProps) => {
  const [date, setDate] = useState<string | undefined>(undefined);
  const t = useTranslations('search.page');

  return (
    <EuiDatePicker
      selected={date ? moment.utc(date) : undefined}
      onChange={(date) => {
        const utcDate = date ? moment.utc(date) : undefined;
        setDate(utcDate?.toISOString() || undefined);
        handleOnChange(utcDate?.toISOString() || null, rangeIndex);
      }}
      id={rangeIndex ? `date-range-${rangeIndex}` : 'date-range'}
      css={{ width: '330px' }}
      showTimeSelect
      dateFormat="yyyy-MM-dd HH:mm"
      timeFormat="HH:mm"
      placeholderText={t('selectDateAndTime')}
      locale="nl"
    />
  );
};

export const WfoValueEditor = ({ field: fieldName, context, handleOnChange, operator }: ValueEditorProps) => {
  const fieldPathInfoMap = context?.fieldPathInfoMap;

  const fieldInfo = fieldPathInfoMap && fieldPathInfoMap.has(fieldName) ? fieldPathInfoMap.get(fieldName) : undefined;
  const uiFieldType = fieldInfo?.ui_types[0] || UiFieldType.text;

  if (uiFieldType === UiFieldType.boolean) {
    return <BooleanEditor handleOnChange={handleOnChange} />;
  }

  if (uiFieldType === UiFieldType.datetime) {
    return <WfoRangeEditor handleOnChange={handleOnChange} operator={operator} Element={DatePicker} />;
  }

  if (uiFieldType === UiFieldType.number) {
    return <WfoRangeEditor handleOnChange={handleOnChange} operator={operator} Element={NumberEditor} />;
  }

  return <TextEditor handleOnChange={handleOnChange} />;
};
