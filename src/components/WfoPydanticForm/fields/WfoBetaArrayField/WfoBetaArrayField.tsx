import React, { createContext, useCallback, useContext, useEffect } from 'react';
import { useFieldArray, useWatch } from 'react-hook-form';

import { useTranslations } from 'next-intl';
import {
  PydanticFormElementProps,
  PydanticFormField,
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

import { useOrchestratorTheme } from '@/hooks';

import { getWfoBetaArrayFieldStyles } from './styles';

// True inside a group of a list of lists (e.g. ESI groups with endpoints), so the inner list can name its button
const NestedListContext = createContext(false);

/*
 * List field for the new start-workflow layout (WfoStartProcessPageBeta).
 * - Items with several fields (e.g. a contact person) become a card: title, "remove" action, one field per line.
 * - Simple items stay one row with an icon button.
 * - A list of lists becomes group boxes ("Group n"), each with its own item list: "Add item" inside, "Add group" below.
 * - Groups and the items in a group never go below 1 (no remove button then).
 * - Add/remove are real buttons with text, so they work with keyboard and screen reader.
 */
/** Per-field behaviour of the list. Without options the list is a plain generic list. */
export type WfoBetaArrayFieldOptions = {
  /** Title of item n (card title, remove label). Default: "Item n" */
  getItemLabel?: (number: number) => string;
  /** Text of the add button. Default: "Add" */
  addButtonLabel?: string;
  /**
   * Card items show only this field (id of the field inside the item) until any field of the item has a value or an
   * error. Also puts every field of the card on its own line, ignoring the backend grid layout.
   */
  leadingFieldKey?: string;
  /** When set, the list is locked (cannot add or edit) and this text explains why */
  lockedReason?: string;
};

/** Hook, so options can depend on form state (e.g. a sibling field) */
export type UseWfoBetaArrayFieldOptions = (pydanticFormField: PydanticFormField) => WfoBetaArrayFieldOptions;

const useNoOptions: UseWfoBetaArrayFieldOptions = () => ({});

/** Creates a list field with its own options, e.g. for a contact persons list. */
export const createWfoBetaArrayField = (useOptions: UseWfoBetaArrayFieldOptions) => {
  const WfoBetaArrayFieldWithOptions = (props: PydanticFormElementProps) => (
    <WfoBetaArray {...props} useOptions={useOptions} />
  );
  return WfoBetaArrayFieldWithOptions;
};

export const WfoBetaArrayField = (props: PydanticFormElementProps) => (
  <WfoBetaArray {...props} useOptions={useNoOptions} />
);

const WfoBetaArray = ({
  pydanticFormField,
  useOptions,
}: PydanticFormElementProps & { useOptions: UseWfoBetaArrayFieldOptions }) => {
  const config = useGetConfig();
  const { control, getFieldState, formState } = useGetForm();
  const { theme } = useOrchestratorTheme();
  const { container, row, card, group, cardHeader, cardFields } = getWfoBetaArrayFieldStyles(theme);
  const t = useTranslations('pydanticForms.widgets.betaArrayField');

  const disabled = pydanticFormField.attributes?.disabled || false;
  const { id: arrayName, arrayItem } = pydanticFormField;
  const { minItems, maxItems } = pydanticFormField.validations;

  const { fields, append, remove } = useFieldArray({ control, name: arrayName });
  const isInGroup = useContext(NestedListContext);
  const isGroupList = arrayItem?.type === PydanticFormFieldType.ARRAY;
  // An empty group means nothing: keep at least 1 item in a group, and 1 group in a required list of groups.
  // An optional list of groups follows the backend (may be empty).
  const isRequiredGroupList = isGroupList && pydanticFormField.required;
  const minimumItems = isRequiredGroupList || isInGroup ? Math.max(minItems ?? 0, 1) : (minItems ?? 0);
  const listValues: Record<string, unknown>[] | undefined = useWatch({ control, name: arrayName });

  const {
    getItemLabel,
    addButtonLabel: customAddButtonLabel,
    leadingFieldKey,
    lockedReason,
  } = useOptions(pydanticFormField);
  const isLocked = lockedReason !== undefined;

  const appendDefault = useCallback(() => {
    append({ [arrayName]: arrayItem?.default ?? undefined });
  }, [append, arrayItem?.default, arrayName]);

  useEffect(() => {
    if (arrayName && arrayItem && minimumItems && fields) {
      const missingCount = Math.max(0, minimumItems - fields.length);
      Array.from({ length: missingCount }).forEach(() => appendDefault());
    }
  }, [minimumItems, arrayItem, arrayName, fields, appendDefault]);

  if (!arrayItem) return null;

  const showRemove = fields.length > minimumItems && !disabled;
  const showAdd = (maxItems === undefined || fields.length < maxItems) && !disabled;
  const showNoItemsAvailable = fields.length === 0 && maxItems === 0;

  const isObjectItem = arrayItem.type === PydanticFormFieldType.OBJECT;
  const itemLabel = (number: number) => getItemLabel?.(number) ?? t('itemNumber', { number });
  const addButtonLabel =
    isGroupList ? t('addGroup')
    : isInGroup ? t('addItem')
    : (customAddButtonLabel ?? t('add'));

  // Only shown when removing is possible: at the minimum (e.g. the last group) there is nothing to click
  const renderRemoveButton = (index: number, label: string) =>
    showRemove && (
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
    );

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
      // Follow the backend grid layout (e.g. Subscription and Vlan side by side), like the current layout does.
      // Cards with a leading field stay one field per line (see below).
      const cardField =
        leadingFieldKey ? { ...component.pydanticFormField, layout: undefined } : component.pydanticFormField;
      component.pydanticFormField = disabled ? disableField(cardField) : cardField;
    });

    // Leading field first; the other fields appear once any field of the item has a value.
    // A validation error in the card also shows them, so no error can hide behind a collapsed card.
    const hasItemInput = Object.values(listValues?.[index] ?? {}).some(Boolean);
    const showAllFields = hasItemInput || getFieldState(itemField.id, formState).invalid;
    const visibleComponents =
      leadingFieldKey && !showAllFields ?
        components.filter((component) => component.pydanticFormField.id === leadingFieldKey)
      : components;

    return (
      // Native fieldset `disabled` also disables app widgets that ignore the disabled attribute
      <fieldset
        key={field.id}
        css={card}
        data-testid={itemField.id}
        disabled={isLocked}
        aria-labelledby={`${itemField.id}-label`}
      >
        <div css={cardHeader}>
          <legend id={`${itemField.id}-label`}>
            <EuiText size="s">
              <strong>{label}</strong>
            </EuiText>
          </legend>
          {renderRemoveButton(index, label)}
        </div>
        <div css={cardFields}>
          <RenderFields
            pydanticFormComponents={visibleComponents}
            idPrefix={itemField.id}
            extraTriggerFields={[arrayName]}
          />
          {isLocked && (
            <EuiText size="s" color="subdued">
              <EuiIcon type="iInCircle" size="s" /> {lockedReason}
            </EuiText>
          )}
        </div>
      </fieldset>
    );
  };

  const renderGroup = (field: Record<'id', string>, index: number) => {
    const label = t('groupNumber', { number: index + 1 });
    const innerList = fieldToComponentMatcher(arrayItem, config?.componentMatcher);
    return (
      <fieldset
        key={field.id}
        css={group}
        data-testid={`${arrayName}.${index}`}
        aria-labelledby={`${arrayName}.${index}-label`}
      >
        <div css={cardHeader}>
          <legend id={`${arrayName}.${index}-label`}>
            <EuiText size="s">
              <strong>{label}</strong>
            </EuiText>
          </legend>
          {renderRemoveButton(index, label)}
        </div>
        <NestedListContext.Provider value={true}>
          <RenderFields
            pydanticFormComponents={[{ Element: innerList.Element, pydanticFormField: getItemField(index) }]}
            extraTriggerFields={[arrayName]}
          />
        </NestedListContext.Provider>
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

  const renderListItem =
    isGroupList ? renderGroup
    : isObjectItem ? renderCard
    : renderRow;

  return (
    // "In a group" is only true for the direct inner list of a group, not for lists deeper inside its cards
    <NestedListContext.Provider value={false}>
      <div data-testid={arrayName} css={container}>
        {showNoItemsAvailable && (
          <EuiText size="s">
            <EuiTextColor color="subdued">{t('noItemsAvailable')}</EuiTextColor>
          </EuiText>
        )}
        {fields.map(renderListItem)}
        {showAdd && (
          <div>
            <EuiButton
              size="s"
              iconType="plus"
              fill={isGroupList}
              onClick={appendDefault}
              isDisabled={isLocked}
              data-testid={`${arrayName}-plus-button`}
            >
              {addButtonLabel}
            </EuiButton>
          </div>
        )}
      </div>
    </NestedListContext.Provider>
  );
};
