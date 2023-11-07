/*
 * Copyright 2019-2023 SURF.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import { EuiFieldText, EuiFormRow, EuiText } from '@elastic/eui';
import { isFunction } from 'lodash';
import get from 'lodash/get';
import React, { Ref, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import {
    connectField,
    filterDOMProps,
    joinName,
    useField,
    useForm,
} from 'uniforms';

import { ContactPersonAutocomplete } from './ContactPersonAutocomplete';
import { FieldProps, ContactPerson } from './types';
import { useAxiosApiClient } from '../useAxiosApiClient';

export function stop(e: React.SyntheticEvent) {
    if (e !== undefined && e !== null) {
        e.preventDefault();
        e.stopPropagation();
    }
}

export type ContactPersonNameFieldProps = FieldProps<
    string,
    { organisationId?: string; organisationKey?: string }
>;

declare module 'uniforms' {
    interface FilterDOMProps {
        organisationId: never;
        organisationKey: never;
    }
}
filterDOMProps.register('organisationId', 'organisationKey');

function ContactPersonName({
    disabled,
    id,
    inputRef = React.createRef() as Ref<HTMLInputElement>,
    label,
    description,
    name,
    onChange,
    placeholder,
    readOnly,
    value,
    error,
    showInlineError,
    errorMessage,
    organisationId,
    organisationKey,
    ...props
}: ContactPersonNameFieldProps) {
    const apiClient = useAxiosApiClient();
    const t = useTranslations('forms');
    const { model, onChange: formOnChange, schema } = useForm();

    const contactsPersonFieldNameArray = joinName(null, name).slice(0, -1);
    const emailFieldName = joinName(contactsPersonFieldNameArray, 'email');
    const contactsFieldName = joinName(
        contactsPersonFieldNameArray.slice(0, -1),
    );

    const chosenPersons: ContactPerson[] = get(model, contactsFieldName, []);
    // We cant call useField conditionally so if we don't have a parent we call it for ourself
    const useFieldName = contactsPersonFieldNameArray.length
        ? contactsFieldName
        : name;
    const contactsField = useField(useFieldName, {}, { absoluteName: true })[0];

    const organisationFieldName =
        organisationKey ||
        contactsField.field.organisationKey ||
        'organisation';

    // Get initial value for org field if it exists (we cant really test)
    let organisationInitialValue;
    try {
        organisationInitialValue = schema.getInitialValue(
            organisationFieldName,
            {},
        );
    } catch {
        organisationInitialValue = '';
    }

    const organisationIdValue =
        organisationId ||
        contactsField.field.organisationId ||
        get(model, organisationFieldName, organisationInitialValue);

    const [displayAutocomplete, setDisplayAutocomplete] = useState(false);
    const [contactPersons, setContactPersons] = useState<ContactPerson[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);

    const suggestions = value
        ? contactPersons
              .filter(
                  (item) =>
                      item.name.toLowerCase().indexOf(value.toLowerCase()) > -1,
              )
              .filter(
                  (item) =>
                      !chosenPersons.some(
                          (person) => person.email === item.email,
                      ),
              )
        : [];

    useEffect(() => {
        if (organisationIdValue) {
            apiClient
                .axiosFetch<ContactPerson[]>(
                    `/surf/crm/contacts/${organisationIdValue}`,
                    {},
                    {},
                    false,
                )
                .then((result) => {
                    if (result) {
                        setContactPersons(result);
                    }
                })
                .catch(() => {
                    setContactPersons([]);
                });
        }
    }, [organisationIdValue, apiClient]);

    useEffect(() => {
        // Set focus to the last name component to be created
        if (!isFunction(inputRef)) {
            inputRef!.current?.focus();
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    function onChangeInternal(e: React.FormEvent<HTMLInputElement>) {
        stop(e);
        const target = e.target as HTMLInputElement;
        const value = target.value;

        onChange(value);
        setDisplayAutocomplete(true);
    }

    function itemSelected(item: ContactPerson) {
        onChange(item.name || '');
        formOnChange(emailFieldName, item.email || '');
        setDisplayAutocomplete(false);
        setSelectedIndex(-1);
    }

    function onAutocompleteKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (!suggestions) {
            return;
        }
        if (e.keyCode === 40 && selectedIndex < suggestions.length - 1) {
            //keyDown
            stop(e);
            setSelectedIndex(selectedIndex + 1);
        }
        if (e.keyCode === 38 && selectedIndex >= 0) {
            //keyUp
            stop(e);
            setSelectedIndex(selectedIndex - 1);
        }
        if (e.keyCode === 13) {
            //enter
            if (selectedIndex >= 0) {
                stop(e);
                itemSelected(suggestions[selectedIndex]);
            }
        }
        if (e.keyCode === 27) {
            //escape
            stop(e);
            setDisplayAutocomplete(false);
            setSelectedIndex(-1);
        }
    }

    function onBlurAutoComplete(e: React.FocusEvent<HTMLElement>) {
        stop(e);
        setTimeout(() => setDisplayAutocomplete(false), 350);
    }

    return (
        <section {...filterDOMProps(props)}>
            <EuiFormRow
                label={label}
                labelAppend={<EuiText size="m">{description}</EuiText>}
                error={showInlineError ? errorMessage : false}
                isInvalid={error}
                id={id}
                fullWidth
                css={{ marginBottom: 0 }}
            >
                <>
                    <EuiFieldText
                        disabled={disabled}
                        fullWidth
                        name={name}
                        isInvalid={error}
                        onChange={onChangeInternal}
                        placeholder={
                            placeholder ||
                            t('widgets.contactPersonName.placeholder')
                        }
                        readOnly={readOnly}
                        type="text"
                        value={value ?? ''}
                        onKeyDown={onAutocompleteKeyDown}
                        onBlur={onBlurAutoComplete}
                        autoComplete="off"
                    />{' '}
                    <div className="autocomplete-container">
                        {!!(displayAutocomplete && suggestions.length) && (
                            <ContactPersonAutocomplete
                                query={value ?? ''}
                                itemSelected={itemSelected}
                                selectedItem={selectedIndex}
                                suggestions={suggestions}
                                personIndex={0}
                            />
                        )}
                    </div>
                </>
            </EuiFormRow>
        </section>
    );
}

export const ContactPersonNameField = connectField(ContactPersonName, {
    kind: 'leaf',
});
