import React, { type KeyboardEventHandler, useEffect, useState } from 'react';
import type { ChangeEventHandler } from 'react';
import type { ValueEditorProps } from 'react-querybuilder';

import moment from 'moment';
import { useTranslations } from 'next-intl';

import { EuiButtonGroup, EuiDatePicker, EuiFieldNumber, EuiFieldText } from '@elastic/eui';

import { WfoRangeEditor } from '@/components/WfoTable/WfoStructuredSearchTable/WfoRangeEditor';
import { getWfoStructuredSearchTableStyles } from '@/components/WfoTable/WfoStructuredSearchTable/styles';
import { useWithOrchestratorTheme } from '@/hooks';
import type { WfoQueryBuilderContext } from '@/types';

export interface EditorInputFieldProps<T = string> {
  handleOnChange: ValueEditorProps['handleOnChange'];
  value: T;
  onInput?: () => void;
}
export type EditorComponent = React.ComponentType<EditorInputFieldProps<ValueEditorProps['value']>>;

enum UiFieldType {
  text = 'text',
  number = 'number',
  boolean = 'boolean',
  datetime = 'datetime',
}

// The value is only a boolean for rules committed by this editor; a rule parsed from a
// CEL string can carry anything, e.g. a half-typed literal ('fals') or a quoted string.
const BooleanEditor = ({
  handleOnChange,
  value: currentValue,
}: EditorInputFieldProps<boolean | string | undefined>) => {
  // A restored query (URL / filter string) delivers a real boolean; anything else —
  // a freshly selected field ('') or a value left behind by another editor — means
  // there is no boolean value yet and the editor starts at its default, true.
  const initialValue = typeof currentValue === 'boolean' ? currentValue : true;
  const [value, setValue] = useState<string>(initialValue.toString());

  useEffect(() => {
    // Commit the default only for a rule without a value yet (a freshly selected field)
    // so it is complete without user interaction. Any other value belongs to someone
    // else and is left alone: a boolean restored from CEL has nothing to commit (and
    // committing anyway loops when the query update remounts this editor), and the
    // half-typed literal of a CEL string being edited in the textarea ('fals') must not
    // be overwritten — the commit would echo a normalized boolean back into the filter
    // string, snapping the textarea back mid-edit.
    if (currentValue === undefined || currentValue === '') {
      handleOnChange(initialValue);
    }
    // Only on mount: currentValue is this editor's own output after that
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

const TextEditor = ({ handleOnChange, value: currentValue = '', onInput }: EditorInputFieldProps<string>) => {
  const [value, setValue] = useState<string>(currentValue);

  const handleTextChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const nextValue = e.target.value || '';
    setValue(nextValue);
    handleOnChange(nextValue);
    onInput?.();
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

const NumberEditor = ({ handleOnChange, value: currentValue, onInput }: EditorInputFieldProps<number>) => {
  const [value, setValue] = useState<string>(currentValue?.toString() || '');

  const handleNumberChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const nextValue = e.target.value || '';
    setValue(nextValue);
    const numberValue = parseFloat(nextValue);
    if (Number.isNaN(numberValue)) return;
    handleOnChange(numberValue);
    onInput?.();
  };

  const handleOnBlur = () => {
    const numberValue = parseFloat(value);
    handleOnChange(numberValue);
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

const DatePicker = ({ handleOnChange, value: currentValue }: EditorInputFieldProps<string>) => {
  const [date, setDate] = useState<string>(currentValue || '');
  const t = useTranslations('search.page');

  return (
    <EuiDatePicker
      selected={date && date !== '' ? moment.utc(date) : undefined}
      onChange={(date) => {
        const utcDate = date ? moment.utc(date) : undefined;
        setDate(utcDate?.toISOString() || '');
        handleOnChange(utcDate?.toISOString());
      }}
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
  // For components that don't take a value in addition to an operator - for example where you
  // only choose 'Has component' or 'Does not have component' - the WfoValueEditor should not be rendered.
  // React-query-builder handles this by default by setting the unary constant in the getOperators
  // property of the QueryBuilder component (see WfoFilterBuilder)
  // Because this check might not have run yet when the query is rebuild from an URL
  // we make the check explicitly here aswell.
  if (operator === 'null' || operator === 'notNull') {
    return null;
  }

  const getComponentByType = (): EditorComponent => {
    if (uiFieldType === UiFieldType.boolean) return BooleanEditor;
    if (uiFieldType === UiFieldType.datetime) return DatePicker;
    if (uiFieldType === UiFieldType.number) return NumberEditor;
    return TextEditor;
  };

  const queryBuilderContext: WfoQueryBuilderContext | undefined = context;
  const fieldPathInfoMap = queryBuilderContext?.fieldPathInfoMap;

  const fieldInfo = fieldPathInfoMap && fieldPathInfoMap.has(fieldName) ? fieldPathInfoMap.get(fieldName) : undefined;
  const uiFieldType = fieldInfo?.ui_types?.[0] || UiFieldType.text;

  const handleInput = () => queryBuilderContext?.onValueEditorInput();

  const getEditor = () => {
    const InputElement = getComponentByType();

    if (operator === 'between') {
      return (
        <WfoRangeEditor
          handleOnChange={handleOnChange}
          value={value}
          InputElement={InputElement}
          onInput={handleInput}
        />
      );
    }

    return <InputElement handleOnChange={handleOnChange} value={value} onInput={handleInput} />;
  };

  // react-querybuilder delivers the standard `rule-value` class via this prop; the wrapper
  // makes it queryable in the DOM (WfoFieldSelector relies on it to move focus here).
  // `display: contents` keeps the children direct participants in the rule's flex row.
  return (
    <div className={className} style={{ display: 'contents' }}>
      {getEditor()}
    </div>
  );
};
