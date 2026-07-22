import React, { useMemo, useRef, useState } from 'react';

import { CronExpressionParser } from 'cron-parser';
import cronstrue from 'cronstrue/i18n';
import _ from 'lodash';
import moment from 'moment';
import { useTranslations } from 'next-intl';
import type { PydanticFormControlledElement } from 'pydantic-forms';
import { getFormFieldIdWithPath } from 'pydantic-forms';

import { EuiFieldText, EuiText } from '@elastic/eui';

import { useLanguageCode, useWithOrchestratorTheme } from '@/hooks';
import { getFormFieldsBaseStyle } from '@/theme';

import { getWfoCronFieldStyles } from './styles';

const CRON_FIELD_KEYS = ['second', 'minute', 'hour', 'dayOfMonth', 'month', 'dayOfWeek'] as const;

type CronFieldKey = (typeof CRON_FIELD_KEYS)[number];

type CronHintRow = {
  symbol: string;
  translationKey: string;
};

const SPECIAL_CHARACTER_HINTS: CronHintRow[] = [
  { symbol: '*', translationKey: 'anyValue' },
  { symbol: ',', translationKey: 'valueListSeparator' },
  { symbol: '-', translationKey: 'rangeOfValues' },
  { symbol: '/', translationKey: 'stepValues' },
];

const CRON_FIELD_HINTS: Record<CronFieldKey, CronHintRow[]> = {
  second: [{ symbol: '0-59', translationKey: 'allowedValues' }],
  minute: [{ symbol: '0-59', translationKey: 'allowedValues' }],
  hour: [{ symbol: '0-23', translationKey: 'allowedValues' }],
  dayOfMonth: [{ symbol: '1-31', translationKey: 'allowedValues' }],
  month: [
    { symbol: '1-12', translationKey: 'allowedValues' },
    { symbol: 'JAN-DEC', translationKey: 'alternativeSingleValues' },
  ],
  dayOfWeek: [
    { symbol: '0-6', translationKey: 'allowedValues' },
    { symbol: 'SUN-SAT', translationKey: 'alternativeSingleValues' },
    { symbol: '7', translationKey: 'sundayNonStandard' },
  ],
};

// cron-parser and cronstrue treat a 5 field expression as starting with minute;
// only with 6 fields does the first field become second
export const getCronFieldLayout = (expression: string): readonly CronFieldKey[] => {
  const fieldCount = expression.trim().split(/\s+/).filter(Boolean).length;
  return fieldCount >= CRON_FIELD_KEYS.length ? CRON_FIELD_KEYS : CRON_FIELD_KEYS.slice(1);
};

export const getCronFieldIndexAtCursor = (expression: string, cursorPosition: number): number => {
  const textBeforeCursor = expression.slice(0, cursorPosition);
  const fieldsBeforeCursor = textBeforeCursor.split(/\s+/).filter(Boolean);
  const cursorIsBetweenFields = /\s$/.test(textBeforeCursor) || fieldsBeforeCursor.length === 0;
  const fieldIndex = cursorIsBetweenFields ? fieldsBeforeCursor.length : fieldsBeforeCursor.length - 1;
  return Math.min(fieldIndex, getCronFieldLayout(expression).length - 1);
};

export const getCronFieldSelectionRange = (expression: string, fieldIndex: number): [number, number] | null => {
  const fieldPattern = /\S+/g;
  let match = fieldPattern.exec(expression);
  let index = 0;
  while (match) {
    if (index === fieldIndex) {
      return [match.index, match.index + match[0].length];
    }
    index++;
    match = fieldPattern.exec(expression);
  }
  return null;
};

export const WfoCron: PydanticFormControlledElement = ({ onChange, value, disabled, pydanticFormField }) => {
  const { formFieldBaseStyle } = useWithOrchestratorTheme(getFormFieldsBaseStyle);
  const {
    cronFieldWrapperStyle,
    cronPossibleValuesStyle,
    cronLegendStyle,
    cronLegendItemStyle,
    cronActiveLegendItemStyle,
    cronInactiveLegendItemStyle,
    cronDescriptionStyle,
    cronHintStyle,
    cronHintListStyle,
    cronHintSymbolStyle,
    cronErrorStyle,
    cronDescriptionContainerStyle,
  } = useWithOrchestratorTheme(getWfoCronFieldStyles);
  const t = useTranslations('pydanticForms.widgets.cron');
  const cronstrueLocale = useLanguageCode();
  const [activeFieldIndex, setActiveFieldIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // If the field is part of an array the value is passed in as an object with the field name as key
  // this is imposed by react-hook-form. We try to detect this and extract the actual value
  const fieldName = getFormFieldIdWithPath(pydanticFormField.id);
  const fieldValue = _.isObject(value) && _.has(value, fieldName) ? _.get(value, fieldName) : value;

  const { description, parseError, nextOccurrences } = useMemo(() => {
    const expression = typeof fieldValue === 'string' ? fieldValue.trim() : '';
    if (!expression) {
      return { description: undefined, parseError: undefined, nextOccurrences: [] };
    }
    try {
      // cron-parser validates the expression, cronstrue turns it into a human readable description
      const cronExpression = CronExpressionParser.parse(expression);

      return {
        description: cronstrue.toString(expression, {
          locale: cronstrueLocale,
          throwExceptionOnParseError: true,
        }),
        parseError: undefined,
        nextOccurrences: cronExpression.take(1).map((cronDate) => cronDate.toDate()),
      };
    } catch (error) {
      return {
        description: undefined,
        parseError: error instanceof Error ? error.message : String(error),
        nextOccurrences: [],
      };
    }
  }, [fieldValue, cronstrueLocale]);

  const updateActiveField = (event: React.SyntheticEvent<HTMLInputElement>) => {
    const { selectionStart, value: expression } = event.currentTarget;
    setActiveFieldIndex(selectionStart === null ? null : getCronFieldIndexAtCursor(expression, selectionStart));
  };

  const fieldLayout = getCronFieldLayout(typeof fieldValue === 'string' ? fieldValue : '');
  const activeFieldKey =
    activeFieldIndex !== null ? fieldLayout[Math.min(activeFieldIndex, fieldLayout.length - 1)] : null;
  const hintFieldKey = activeFieldKey ?? fieldLayout[0];

  const focusCronField = (fieldKey: CronFieldKey) => {
    const input = inputRef.current;
    const fieldIndex = fieldLayout.indexOf(fieldKey);
    // The second field is not part of the layout when the expression has 5 fields
    if (!input || fieldIndex === -1) {
      return;
    }
    const expression = typeof fieldValue === 'string' ? fieldValue : '';
    input.focus();
    const selectionRange = getCronFieldSelectionRange(expression, fieldIndex);
    if (selectionRange) {
      input.setSelectionRange(selectionRange[0], selectionRange[1]);
    } else {
      input.setSelectionRange(expression.length, expression.length);
    }
    setActiveFieldIndex(fieldIndex);
  };

  return (
    <div css={cronFieldWrapperStyle}>
      <EuiFieldText
        data-testid={pydanticFormField.id}
        css={formFieldBaseStyle}
        inputRef={inputRef}
        disabled={disabled}
        isInvalid={!!parseError}
        placeholder="* * * * *"
        onChange={(event) => {
          onChange(event.target.value);
        }}
        onSelect={updateActiveField}
        onFocus={updateActiveField}
        onBlur={() => setActiveFieldIndex(null)}
        value={fieldValue}
        fullWidth
      />
      <div css={[cronLegendStyle]}>
        {CRON_FIELD_KEYS.map((fieldKey) => {
          const isInLayout = fieldLayout.includes(fieldKey);
          return (
            <button
              key={fieldKey}
              type="button"
              disabled={disabled || !isInLayout}
              onClick={() => focusCronField(fieldKey)}
              css={[
                cronLegendItemStyle,
                fieldKey === activeFieldKey && cronActiveLegendItemStyle,
                !isInLayout && cronInactiveLegendItemStyle,
              ]}
            >
              {t(fieldKey)}
            </button>
          );
        })}
      </div>
      {hintFieldKey && (
        <>
          <div css={cronPossibleValuesStyle}>{t('possibleValues')}</div>
          <div css={cronHintListStyle}>
            {[...SPECIAL_CHARACTER_HINTS, ...CRON_FIELD_HINTS[hintFieldKey]].map(({ symbol, translationKey }) => (
              <React.Fragment key={symbol}>
                <span css={cronHintSymbolStyle}>{symbol}</span>
                <span>{t(translationKey)}</span>
              </React.Fragment>
            ))}
          </div>
        </>
      )}
      {parseError && (
        <EuiText size="s" css={cronErrorStyle}>
          {t('invalidExpression', { error: parseError })}
        </EuiText>
      )}
      {description && (
        <div css={cronDescriptionContainerStyle}>
          <EuiText size="s" css={cronDescriptionStyle}>
            {description}
          </EuiText>
          {nextOccurrences.length > 0 && (
            <EuiText size="xs" css={cronHintStyle}>
              {t('nextOccurrences', {
                dates: nextOccurrences.map((date) => moment(date).format('YYYY-MM-DD HH:mm:ss')).join(', '),
              })}
            </EuiText>
          )}
        </div>
      )}
    </div>
  );
};
