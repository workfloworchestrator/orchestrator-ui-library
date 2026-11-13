import React, { useCallback, useContext, useEffect } from 'react';
import { useFieldArray, useWatch } from 'react-hook-form';

import { useTranslations } from 'next-intl';
import {
  PydanticFormElementProps,
  PydanticFormFieldType,
  RenderFields,
  disableField,
  fieldToComponentMatcher,
  getPydanticFormComponents,
  itemizeArrayItem,
  useGetConfig,
  useGetForm,
} from 'pydantic-forms';

import { EuiButton, EuiButtonEmpty, EuiButtonIcon, EuiIcon, EuiText, EuiTextColor } from '@elastic/eui';

import { FormPageFieldsV2Context } from '@/components/WfoPydanticForm/formLayoutV2Context';
import { useOrchestratorTheme } from '@/hooks';

import { getWfoArrayFieldV2Styles } from './styles';

/*
 * List field for the new start-workflow layout (WfoStartProcessPageV2).
 * - Items with several fields (e.g. a contact person) become a card: title, "remove" action, one field per line.
 * - Simple items stay one row with an icon button.
 * - Add/remove are real buttons with text, so they work with keyboard and screen reader.
 */
export const WfoArrayFieldV2 = ({ pydanticFormField }: PydanticFormElementProps) => {
  const config = useGetConfig();
  const { control, getFieldState, formState } = useGetForm();
  const { theme } = useOrchestratorTheme();
  const { container, row, card, cardHeader, cardFields } = getWfoArrayFieldV2Styles(theme);
  const t = useTranslations('pydanticForms.widgets.arrayFieldV2');

  const disabled = pydanticFormField.attributes?.disabled || false;
  const { id: arrayName, arrayItem } = pydanticFormField;
  const { minItems, maxItems } = pydanticFormField.validations;

  const { fields, append, remove } = useFieldArray({ control, name: arrayName });
  const listValues: Record<string, unknown>[] | undefined = useWatch({ control, name: arrayName });

  // ponytail: contact list is detected by its name field's format (contactPersonName); other object lists get "Item n"
  const contactNameKey = Object.entries(arrayItem?.properties ?? {}).find(
    ([, property]) => property.format === 'contactPersonName',
  )?.[0];
  const isContactList = contactNameKey !== undefined;

  // Contacts are loaded per customer: lock the list until the customer field on this page has a value
  const pageFields = useContext(FormPageFieldsV2Context);
  const customerKey = Object.entries(pageFields).find(([, field]) => field.format === 'customerId')?.[0];
  const customerValue = useWatch({ control, name: customerKey ?? arrayName, disabled: !customerKey });
  const isLockedByCustomer = isContactList && customerKey !== undefined && !customerValue;

  const appendDefault = useCallback(() => {
    append({ [arrayName]: arrayItem?.default ?? undefined });
  }, [append, arrayItem?.default, arrayName]);

  useEffect(() => {
    if (arrayName && arrayItem && minItems && fields) {
      const missingCount = Math.max(0, minItems - fields.length);
      Array.from({ length: missingCount }).forEach(() => appendDefault());
    }
  }, [minItems, arrayItem, arrayName, fields, appendDefault]);

  if (!arrayItem) return null;

  const showRemove = (!minItems || fields.length > minItems) && !disabled;
  const showAdd = (maxItems === undefined || fields.length < maxItems) && !disabled;
  const showNoItemsAvailable = fields.length === 0 && maxItems === 0;

  const isObjectItem = arrayItem.type === PydanticFormFieldType.OBJECT;
  const itemLabel = (number: number) =>
    isContactList ? t('contactPersonNumber', { number }) : t('itemNumber', { number });

  const getItemField = (index: number) => {
    const itemizedField = itemizeArrayItem(index, arrayItem, arrayName);
    // Convention: all descendants of a disabled field are disabled too
    return disabled ? disableField(itemizedField) : itemizedField;
  };

  const renderCard = (field: Record<'id', string>, index: number) => {
    const itemField = getItemField(index);
    const label = itemLabel(index + 1);
    const components = getPydanticFormComponents(itemField.properties || {}, config?.componentMatcher);
    components.forEach((component) => {
      // Drop the backend grid layout (e.g. 3 columns side by side): a card shows one field per line
      const stackedField = { ...component.pydanticFormField, layout: undefined };
      component.pydanticFormField = disabled ? disableField(stackedField) : stackedField;
    });

    // Contact card: name first; e-mail/phone appear once a name is picked (filled in) or typed (empty).
    // Any value or validation error in the card also shows them, so no error can hide behind a collapsed card.
    const hasItemInput = Object.values(listValues?.[index] ?? {}).some(Boolean);
    const showContactDetails = hasItemInput || getFieldState(itemField.id, formState).invalid;
    const visibleComponents =
      isContactList && !showContactDetails ?
        components.filter((component) => component.pydanticFormField.id === contactNameKey)
      : components;

    return (
      // Native fieldset `disabled` also disables app widgets that ignore the disabled attribute
      <fieldset key={field.id} css={card} data-testid={itemField.id} disabled={isLockedByCustomer}>
        <div css={cardHeader}>
          <legend>
            <EuiText size="s">
              <strong>{label}</strong>
            </EuiText>
          </legend>
          {showRemove && (
            <EuiButtonEmpty
              size="xs"
              color="text"
              iconType="cross"
              onClick={() => remove(index)}
              aria-label={t('removeItem', { item: label })}
              data-testid={`${arrayName}-minus-button-${index}`}
            >
              {t('remove')}
            </EuiButtonEmpty>
          )}
        </div>
        <div css={cardFields}>
          <RenderFields
            pydanticFormComponents={visibleComponents}
            idPrefix={itemField.id}
            extraTriggerFields={[arrayName]}
          />
          {isLockedByCustomer && (
            <EuiText size="s" color="subdued">
              <EuiIcon type="iInCircle" size="s" /> {t('selectCustomerFirst')}
            </EuiText>
          )}
        </div>
      </fieldset>
    );
  };

  const renderRow = (field: Record<'id', string>, index: number) => {
    const component = fieldToComponentMatcher(arrayItem, config?.componentMatcher);
    return (
      <div key={field.id} css={row}>
        <RenderFields
          pydanticFormComponents={[{ Element: component.Element, pydanticFormField: getItemField(index) }]}
          extraTriggerFields={[arrayName]}
        />
        {showRemove && (
          <EuiButtonIcon
            iconType="cross"
            color="text"
            onClick={() => remove(index)}
            aria-label={t('removeItem', { item: itemLabel(index + 1) })}
            data-testid={`${arrayName}-minus-button-${index}`}
          />
        )}
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
      {fields.map(isObjectItem ? renderCard : renderRow)}
      {showAdd && (
        <div>
          <EuiButton
            size="s"
            iconType="plus"
            onClick={appendDefault}
            isDisabled={isLockedByCustomer}
            data-testid={`${arrayName}-plus-button`}
          >
            {isContactList ? t('addContactPerson') : t('add')}
          </EuiButton>
        </div>
      )}
    </div>
  );
};
