import React, { useMemo, useState } from 'react';

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

export const getCronFieldIndexAtCursor = (expression: string, cursorPosition: number): number => {
  const textBeforeCursor = expression.slice(0, cursorPosition);
  const fieldsBeforeCursor = textBeforeCursor.split(/\s+/).filter(Boolean);
  const cursorIsBetweenFields = /\s$/.test(textBeforeCursor) || fieldsBeforeCursor.length === 0;
  const fieldIndex = cursorIsBetweenFields ? fieldsBeforeCursor.length : fieldsBeforeCursor.length - 1;
  return Math.min(fieldIndex, CRON_FIELD_KEYS.length - 1);
};

export const WfoCron: PydanticFormControlledElement = ({ onChange, value, disabled, pydanticFormField }) => {
  const { formFieldBaseStyle } = useWithOrchestratorTheme(getFormFieldsBaseStyle);
  const {
    cronFieldWrapperStyle,
    cronPossibleValuesStyle,
    cronLegendStyle,
    cronLegendItemStyle,
    cronActiveLegendItemStyle,
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

      console.log('expression', expression);
      console.log('interval', cronExpression);

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

  const activeFieldKey = activeFieldIndex !== null ? CRON_FIELD_KEYS[activeFieldIndex] : 'second';

  return (
    <div css={cronFieldWrapperStyle}>
      <EuiFieldText
        data-testid={pydanticFormField.id}
        css={formFieldBaseStyle}
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
        {CRON_FIELD_KEYS.map((fieldKey, index) => (
          <span key={fieldKey} css={[cronLegendItemStyle, index === activeFieldIndex && cronActiveLegendItemStyle]}>
            {t(fieldKey)}
          </span>
        ))}
      </div>
      {activeFieldKey && (
        <>
          <div css={cronPossibleValuesStyle}>{t('possibleValues')}</div>
          <div css={cronHintListStyle}>
            {[...SPECIAL_CHARACTER_HINTS, ...CRON_FIELD_HINTS[activeFieldKey]].map(({ symbol, translationKey }) => (
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
