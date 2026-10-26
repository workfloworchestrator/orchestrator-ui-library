import React, { useCallback, useEffect } from 'react';
import { useFieldArray } from 'react-hook-form';

import { useTranslations } from 'next-intl';
import {
  PydanticFormElementProps,
  RenderFields,
  disableField,
  fieldToComponentMatcher,
  itemizeArrayItem,
  useGetConfig,
  useGetForm,
} from 'pydantic-forms';

import { EuiIcon, EuiText, EuiTextColor } from '@elastic/eui';

import { useOrchestratorTheme } from '@/hooks';

import { getWfoArrayFieldStyles } from './styles';

export const MinusButton = ({
  index,
  onRemove,
  testId,
}: {
  index: number;
  onRemove: (index: number) => void;
  testId: string;
}) => {
  const { theme } = useOrchestratorTheme();
  const { minusButton } = getWfoArrayFieldStyles(theme);

  return (
    <span css={minusButton} onClick={() => onRemove(index)}>
      <EuiIcon type="minus" size="xxl" color={theme.colors.danger} data-testid={testId} />
    </span>
  );
};

export const PlusButton = ({ onClick, testId }: { onClick: () => void; testId: string }) => {
  const { theme } = useOrchestratorTheme();
  const { plusButtonWrapper } = getWfoArrayFieldStyles(theme);

  return (
    <div css={plusButtonWrapper}>
      <EuiIcon onClick={onClick} type="plus" size="xxl" color={theme.colors.success} data-testid={testId} />
    </div>
  );
};

export const WfoArrayField = ({ pydanticFormField }: PydanticFormElementProps) => {
  const config = useGetConfig();
  const reactHookForm = useGetForm();

  const disabled = pydanticFormField.attributes?.disabled || false;
  const { control } = reactHookForm;
  const { id: arrayName, arrayItem } = pydanticFormField;
  const { minItems, maxItems } = pydanticFormField.validations;
  const { theme } = useOrchestratorTheme();
  const { container, fieldWrapper } = getWfoArrayFieldStyles(theme);
  const t = useTranslations('pydanticForms.widgets.arrayField');

  const { fields, append, remove } = useFieldArray({
    control,
    name: arrayName,
  });

  const appendDefault = useCallback(() => {
    append({
      [arrayName]: arrayItem?.default ?? undefined,
    });
  }, [append, arrayItem?.default, arrayName]);

  useEffect(() => {
    if (arrayName && arrayItem && minItems && fields) {
      const missingCount = Math.max(0, minItems - fields.length);
      Array.from({ length: missingCount }).forEach(() => appendDefault());
    }
  }, [minItems, append, remove, arrayItem, arrayName, fields, appendDefault]);

  const showMinus = (!minItems || fields.length > minItems) && !disabled;
  const showPlus = (maxItems === undefined || fields.length < maxItems) && !disabled;
  const showNoItemsAvailable = fields.length === 0 && maxItems === 0;

  if (!arrayItem) return null;

  const component = fieldToComponentMatcher(arrayItem, config?.componentMatcher);

  const renderField = (field: Record<'id', string>, index: number) => {
    const itemizedField = itemizeArrayItem(index, arrayItem, arrayName);
    // We have decided - for now - on the convention that all descendants of disabled fields will be disabled as well
    // so we will not displaying any interactive elements inside a disabled element
    const arrayItemField = disabled ? disableField(itemizedField) : itemizedField;

    return (
      <div key={field.id} css={fieldWrapper}>
        <RenderFields
          pydanticFormComponents={[
            {
              Element: component.Element,
              pydanticFormField: arrayItemField,
            },
          ]}
          extraTriggerFields={[arrayName]}
        />
        {showMinus && <MinusButton index={index} onRemove={remove} testId={`${arrayName}-minus-button-${index}`} />}
      </div>
    );
  };

  return (
    <div data-testid={arrayName} css={container}>
      {showNoItemsAvailable && (
        <EuiText size="s">
          <EuiTextColor color="subdued">{t('noItemsAvailable')}</EuiTextColor>
        </EuiText>
      )}
      {fields.map(renderField)}

      {showPlus && <PlusButton onClick={appendDefault} testId={`${arrayName}-plus-button`} />}
    </div>
  );
};
