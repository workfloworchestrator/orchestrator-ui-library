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
  value: T;
  operator?: string;
}

const BooleanEditor = ({ handleOnChange, value: currentValue = true }: EditorProps<boolean>) => {
  const [value, setValue] = useState<string>(currentValue.toString());

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
        handleOnChange(id === 'true');
      }}
      buttonSize="m"
      color="primary"
    />
  );
};

const TextEditor = ({ handleOnChange, value: currentValue = '' }: EditorProps<string>) => {
  const [value, setValue] = useState<string>(currentValue);

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

const NumberEditor = ({ handleOnChange, rangeIndex, value: currentValue }: WfoRangeElementProps) => {
  const [value, setValue] = useState<string>(currentValue?.toString() || '');

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

const DatePicker = ({ handleOnChange, rangeIndex, value: currentValue }: WfoRangeElementProps) => {
  const [date, setDate] = useState<string>(currentValue || '');
  const t = useTranslations('search.page');

  return (
    <EuiDatePicker
      selected={date && date !== '' ? moment.utc(date) : undefined}
      onChange={(date) => {
        const utcDate = date ? moment.utc(date) : undefined;
        setDate(utcDate?.toISOString() || '');
        handleOnChange(utcDate?.toISOString(), rangeIndex);
      }}
      id={rangeIndex ? `date-range-${rangeIndex}` : 'date-range'}
      css={{ width: '330px' }}
      showTimeSelect
      dateFormat="yyyy-MM-dd HH:mm"
      timeFormat="HH:mm"
      placeholderText={t('selectDateAndTime')}
      locale="nl"
      shouldCloseOnSelect={true}
    />
  );
};

export const WfoValueEditor = ({
  field: fieldName,
  context,
  handleOnChange,
  operator,
  value,
  className,
}: ValueEditorProps) => {
  const fieldPathInfoMap = context?.fieldPathInfoMap;

  const fieldInfo = fieldPathInfoMap && fieldPathInfoMap.has(fieldName) ? fieldPathInfoMap.get(fieldName) : undefined;
  const uiFieldType = fieldInfo?.ui_types[0] || UiFieldType.text;

  const getEditor = () => {
    if (uiFieldType === UiFieldType.boolean) {
      return <BooleanEditor handleOnChange={handleOnChange} value={value} />;
    }

    if (uiFieldType === UiFieldType.datetime) {
      return <WfoRangeEditor handleOnChange={handleOnChange} operator={operator} Element={DatePicker} value={value} />;
    }

    if (uiFieldType === UiFieldType.number) {
      return (
        <WfoRangeEditor handleOnChange={handleOnChange} operator={operator} Element={NumberEditor} value={value} />
      );
    }

    return <TextEditor handleOnChange={handleOnChange} value={value} />;
  };

  const handleWrapperKeyDown: KeyboardEventHandler<HTMLDivElement> = (event) => {
    if (event.key !== 'Enter') return;
    // Restrict to the editor inputs: the editors' own Enter handlers have already run
    // (bubble phase) and committed the value via blur, so the search sees it. Enter on
    // the boolean buttons means "select" — its click fires only after this keydown, so
    // searching there would use the pre-toggle value.
    if (!(event.target instanceof HTMLInputElement)) return;
    context?.onValueEditorEnter?.();
  };

  // react-querybuilder delivers the standard `rule-value` class via this prop; the wrapper
  // makes it queryable in the DOM (WfoFieldSelector relies on it to move focus here).
  // `display: contents` keeps the children direct participants in the rule's flex row.
  return (
    <div className={className} style={{ display: 'contents' }} onKeyDown={handleWrapperKeyDown}>
      {getEditor()}
    </div>
  );
};
