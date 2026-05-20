import React, { type KeyboardEventHandler, useEffect, useState } from 'react';
import type { ChangeEventHandler } from 'react';
import type { ValueEditorProps } from 'react-querybuilder';

import moment from 'moment';
import { useTranslations } from 'next-intl';

import { EuiButtonGroup, EuiDatePicker, EuiFieldText, EuiFlexGroup } from '@elastic/eui';

import { getWfoStructuredSearchTableStyles } from '@/components/WfoTable/WfoStructuredSearchTable/styles';
import { useWithOrchestratorTheme } from '@/hooks';

enum UiFieldType {
  text = 'text',
  number = 'number',
  boolean = 'boolean',
  datetime = 'datetime',
}

interface EditorProps {
  handleOnChange: (value: unknown) => void;
  operator?: string;
}

const BooleanEditor = ({ handleOnChange }: EditorProps) => {
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

const TextEditor = ({ handleOnChange }: EditorProps) => {
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

type DatePickerProps = {
  handleOnChange: (selectedDate: string | undefined, rangeIndex?: number) => void;
  rangeIndex?: number;
};

const DatePicker = ({ handleOnChange, rangeIndex }: DatePickerProps) => {
  const [date, setDate] = useState<string | undefined>(undefined);
  const t = useTranslations('search.page');

  return (
    <EuiDatePicker
      selected={date ? moment.utc(date) : null}
      onChange={(date) => {
        const utcDate = date ? moment.utc(date) : null;
        setDate(utcDate?.toISOString() || undefined);
        handleOnChange(utcDate?.toISOString() || undefined, rangeIndex);
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

const DatetimeEditor = ({ handleOnChange, operator }: EditorProps) => {
  useEffect(() => {
    setValue([]);
  }, [operator]);

  const [, setValue] = useState<string[]>([]);

  const handleChange = (selectedDate: string | undefined, rangeIndex: number = 0) => {
    if (operator === 'between') {
      setValue((currentDates) => {
        // remove value if set to undefined
        if (selectedDate === undefined) {
          return currentDates.filter((v, index) => index !== rangeIndex);
        }
        // add value at supplied index
        currentDates[rangeIndex] = selectedDate;

        // call the parent if 2 values are present
        if (currentDates.length === 2) {
          handleOnChange(`${currentDates[0]},${currentDates[1]}`);
        }

        return currentDates;
      });
    } else {
      handleOnChange(selectedDate);
    }
  };

  if (operator === 'between') {
    return (
      <EuiFlexGroup direction="row" gutterSize="s">
        <DatePicker handleOnChange={handleChange} rangeIndex={0} />
        <DatePicker handleOnChange={handleChange} rangeIndex={1} />
      </EuiFlexGroup>
    );
  }

  return <DatePicker handleOnChange={handleOnChange} />;
};

export const WfoValueEditor = ({ field: fieldName, context, handleOnChange, operator }: ValueEditorProps) => {
  const fieldPathInfoMap = context?.fieldPathInfoMap;

  const fieldInfo = fieldPathInfoMap && fieldPathInfoMap.has(fieldName) ? fieldPathInfoMap.get(fieldName) : undefined;
  const uiFieldType = fieldInfo?.ui_types[0] || UiFieldType.text;

  if (uiFieldType === UiFieldType.boolean) {
    return <BooleanEditor handleOnChange={handleOnChange} />;
  }

  if (uiFieldType === UiFieldType.datetime) {
    return <DatetimeEditor handleOnChange={handleOnChange} operator={operator} />;
  }

  return <TextEditor handleOnChange={handleOnChange} />;
};
