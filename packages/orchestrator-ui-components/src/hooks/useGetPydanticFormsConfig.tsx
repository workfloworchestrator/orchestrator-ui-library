import React, { useCallback } from 'react';

import _ from 'lodash';
import { AbstractIntlMessages, useMessages, useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import {
  ComponentMatcherExtender,
  Locale,
  PydanticComponentMatcher,
  PydanticFormApiProvider,
  PydanticFormConfig,
  PydanticFormFieldFormat,
  PydanticFormFieldType,
  PydanticFormLabelProvider,
  TranslationsJSON,
  zodValidationPresets,
} from 'pydantic-forms';

import { WfoLoading } from '@/components';
import { Header } from '@/components/WfoPydanticForm/Header';
import { Row } from '@/components/WfoPydanticForm/Row';
import {
  WfoArrayField,
  WfoCheckbox,
  WfoDivider,
  WfoDropdown,
  WfoInteger,
  WfoLabel,
  WfoMultiCheckboxField,
  WfoObjectField,
  WfoRadio,
  WfoSummary,
  WfoText,
  WfoTextArea,
  WfoTimestampField,
} from '@/components/WfoPydanticForm/fields';
import { WfoCallout } from '@/components/WfoPydanticForm/fields';
import { useAppSelector } from '@/rtk/hooks';

const useGetComponentMatcherExtender = (): ComponentMatcherExtender => {
  const componentMatcherExtender = useAppSelector((state) => state.pydanticForm?.componentMatcherExtender);

  const wfoComponentMatcherExtender = useCallback<ComponentMatcherExtender>(
    (currentMatchers) => {
      const wfoMatchers: PydanticComponentMatcher[] = [
        {
          id: 'textarea',
          ElementMatch: {
            Element: WfoTextArea,
            isControlledElement: true,
          },
          matcher(field) {
            return field.type === PydanticFormFieldType.STRING && field.format === PydanticFormFieldFormat.LONG;
          },
        },
        {
          id: 'radio',
          ElementMatch: {
            Element: WfoRadio,
            isControlledElement: true,
          },
          matcher(field) {
            return field.type === PydanticFormFieldType.STRING && field.format === PydanticFormFieldFormat.RADIO;
          },
        },
        {
          id: 'summary',
          ElementMatch: {
            Element: WfoSummary,
            isControlledElement: false,
          },
          matcher(field) {
            return field.type === PydanticFormFieldType.STRING && (field.format as string) === 'summary';
          },
        },
        {
          id: 'label',
          ElementMatch: {
            Element: WfoLabel,
            isControlledElement: false,
          },
          matcher(field) {
            return field.type === PydanticFormFieldType.STRING && field.format === PydanticFormFieldFormat.LABEL;
          },
        },
        {
          id: 'divider',
          ElementMatch: {
            Element: WfoDivider,
            isControlledElement: false,
          },
          matcher(field) {
            return field.type === PydanticFormFieldType.STRING && field.format === PydanticFormFieldFormat.DIVIDER;
          },
        },
        {
          id: 'checkbox',
          ElementMatch: {
            Element: WfoCheckbox,
            isControlledElement: true,
          },
          matcher(field) {
            return field.type === PydanticFormFieldType.BOOLEAN;
          },
        },
        {
          id: 'buttonTypes',
          ElementMatch: {
            isControlledElement: false,
            Element: () => null,
          },
          matcher: ({ type, title }) => {
            return (
              [PydanticFormFieldType.STRING, PydanticFormFieldType.OBJECT].includes(type)
              && ['ButtonConfig', 'Buttons', 'ButtonColor'].includes(title)
            );
          },
        },
        {
          id: 'dropdown',
          ElementMatch: {
            Element: WfoDropdown,
            isControlledElement: true,
          },
          matcher(field) {
            // We are looking for a single value from a set list of options.
            // We are not using a radio button component to maintain being able to deselect options
            return field.type === PydanticFormFieldType.STRING && _.isArray(field.options) && field.options.length > 0;
          },
        },
        {
          id: 'timestampField',
          ElementMatch: {
            isControlledElement: true,
            Element: WfoTimestampField,
          },
          matcher: (field) => {
            const { type, format } = field;

            return (
              type === PydanticFormFieldType.NUMBER
              && (format === PydanticFormFieldFormat.DATETIME || format === PydanticFormFieldFormat.TIMESTAMP)
            );
          },
        },
        {
          id: 'integerfield',
          ElementMatch: {
            Element: WfoInteger,
            isControlledElement: true,
          },
          matcher(field) {
            return field.type === PydanticFormFieldType.INTEGER;
          },
          validator: zodValidationPresets.integer,
        },
        {
          id: 'multicheckbox',
          ElementMatch: {
            Element: WfoMultiCheckboxField,
            isControlledElement: true,
          },
          matcher(field) {
            return (
              field.type === PydanticFormFieldType.ARRAY
              && _.isArray(field.options)
              && field.options?.length > 0
              && field.options?.length <= 5
            );
          },
          validator: zodValidationPresets.multiSelect,
        },
        {
          id: 'callout',
          ElementMatch: {
            isControlledElement: false,
            Element: WfoCallout,
          },
          matcher: ({ type, format }) => {
            return type === PydanticFormFieldType.STRING && format === ('callout' as PydanticFormFieldFormat);
          },
        },
        ...currentMatchers
          .filter((matcher) => matcher.id !== 'text')
          .filter((matcher) => matcher.id !== 'array')
          .filter((matcher) => matcher.id !== 'object'),
        {
          id: 'object',
          ElementMatch: {
            isControlledElement: false,
            Element: WfoObjectField,
          },
          matcher: (field) => field.type === PydanticFormFieldType.OBJECT,
        },
        {
          id: 'array',
          ElementMatch: {
            isControlledElement: true,
            Element: WfoArrayField,
          },
          matcher: (field) => field.type === PydanticFormFieldType.ARRAY,
        },
        {
          id: 'text',
          ElementMatch: {
            Element: WfoText,
            isControlledElement: true,
          },
          matcher(field) {
            return field.type === PydanticFormFieldType.STRING;
          },
          validator: zodValidationPresets.string,
        },
      ];

      return componentMatcherExtender ? componentMatcherExtender(wfoMatchers) : wfoMatchers;
    },
    [componentMatcherExtender],
  );

  return wfoComponentMatcherExtender;
};

const useGetLabelProvider = (): PydanticFormLabelProvider => {
  const translationMessages: AbstractIntlMessages = useMessages();
  const formTranslations =
    translationMessages?.pydanticForms && typeof translationMessages?.pydanticForms !== 'string' ?
      translationMessages.pydanticForms.backendTranslations
    : {};

  const orchestratorTranslations = formTranslations as unknown;

  const pydanticLabelProvider = useCallback<PydanticFormLabelProvider>(async () => {
    return {
      labels: {
        ...(orchestratorTranslations as object),
      },
      data: {},
    };
  }, [orchestratorTranslations]);

  return pydanticLabelProvider;
};

const useGetCustomTranslations = (): TranslationsJSON => {
  const t = useTranslations('pydanticForms.userInputForm');
  const translationMessages: AbstractIntlMessages = useMessages();

  const widgetsTranslations =
    translationMessages?.pydanticForms && typeof translationMessages?.pydanticForms !== 'string' ?
      translationMessages.pydanticForms.widgets
    : {};

  return {
    cancel: t('cancel'),
    startWorkflow: t('startWorkflow'),
    widgets: {
      ...(widgetsTranslations as object),
    },
    ...translationMessages,
  };
};

export const useGetPydanticFormsConfig = (
  getApiProvider: () => PydanticFormApiProvider,
  Footer: PydanticFormConfig['footerRenderer'],
): PydanticFormConfig => {
  const router = useRouter();
  const getLocale = () => {
    if (router.locale) {
      return router.locale as Locale;
    }
    return Locale.enGB; // Default to enGB if no locale is set
  };

  return {
    apiProvider: getApiProvider(),
    footerRenderer: Footer,
    headerRenderer: Header,
    componentMatcherExtender: useGetComponentMatcherExtender(),
    labelProvider: useGetLabelProvider(),
    rowRenderer: Row,
    customTranslations: useGetCustomTranslations(),
    loadingComponent: <WfoLoading />,
    locale: getLocale(),
  };
};
