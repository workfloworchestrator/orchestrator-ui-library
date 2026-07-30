import React, { type KeyboardEventHandler, useEffect, useState } from 'react';
import type { ChangeEventHandler } from 'react';
import type { ValueEditorProps } from 'react-querybuilder';

import moment from 'moment';
import { useTranslations } from 'next-intl';

import { EuiButtonGroup, EuiDatePicker, EuiFieldNumber, EuiFieldText } from '@elastic/eui';

import { WfoRangeEditor } from '@/components/WfoTable/WfoStructuredSearchTable/WfoRangeEditor';
import { getWfoStructuredSearchTableStyles } from '@/components/WfoTable/WfoStructuredSearchTable/styles';
import { useWithOrchestratorTheme } from '@/hooks';

export interface EditorInputFieldProps<T = string> {
  handleOnChange: ValueEditorProps['handleOnChange'];
  value: T;
}
export type EditorComponent = React.ComponentType<EditorInputFieldProps<ValueEditorProps['value']>>;

enum UiFieldType {
  text = 'text',
  number = 'number',
  boolean = 'boolean',
  datetime = 'datetime',
}

const BooleanEditor = ({ handleOnChange, value: currentValue }: EditorInputFieldProps<boolean>) => {
  // A restored query (URL / filter string) delivers a real boolean; anything else —
  // a freshly selected field ('') or a value left behind by another editor — means
  // there is no boolean value yet and the editor starts at its default, true.
  const initialValue = typeof currentValue === 'boolean' ? currentValue : true;
  const [value, setValue] = useState<string>(initialValue.toString());

  useEffect(() => {
    // Commit the default so a fresh rule is complete without user interaction. When the
    // rule already holds a boolean there is nothing to commit — committing anyway makes
    // every mount dispatch a query change, which loops when the query update remounts
    // this editor (e.g. while a restored query's rule ids are still settling).
    if (typeof currentValue !== 'boolean') {
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

const TextEditor = ({ handleOnChange, value: currentValue = '' }: EditorInputFieldProps<string>) => {
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

const NumberEditor = ({ handleOnChange, value: currentValue }: EditorInputFieldProps<number>) => {
  const [value, setValue] = useState<string>(currentValue?.toString() || '');

  const handleNumberChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue(e.target.value || '');
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

  const fieldPathInfoMap = context?.fieldPathInfoMap;

  const fieldInfo = fieldPathInfoMap && fieldPathInfoMap.has(fieldName) ? fieldPathInfoMap.get(fieldName) : undefined;
  const uiFieldType = fieldInfo?.ui_types?.[0] || UiFieldType.text;

  const getEditor = () => {
    const InputElement = getComponentByType();

    if (operator === 'between') {
      return <WfoRangeEditor handleOnChange={handleOnChange} value={value} InputElement={InputElement} />;
    }

    return <InputElement handleOnChange={handleOnChange} value={value} />;
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
