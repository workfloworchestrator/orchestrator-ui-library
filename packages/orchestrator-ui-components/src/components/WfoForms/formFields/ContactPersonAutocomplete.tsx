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
import React, { useEffect, useRef } from 'react';

import { EuiFlexItem } from '@elastic/eui';
import { isDate } from 'moment';
import scrollIntoView from 'scroll-into-view';

import { getStyles } from './ContactPersonAutocompleteStyles';
import { ContactPerson } from './types';
import { useWithOrchestratorTheme } from '../../../hooks';

interface ContactPersonAutocompleteProps {
    query: string;
    selectedItem: number;
    personIndex: number;
    itemSelected: (value: ContactPerson, index: number) => void;
    suggestions: ContactPerson[];
}

const isEmpty = (obj: unknown) => {
    if (obj === undefined || obj === null) {
        return true;
    }
    if (isDate(obj)) {
        return false;
    }
    if (Array.isArray(obj)) {
        return obj.length === 0;
    }
    if (typeof obj === 'string') {
        return obj.trim().length === 0;
    }
    if (typeof obj === 'object') {
        return Object.keys(obj).length === 0;
    }
    return false;
};

export const ContactPersonAutocomplete = ({
    query,
    selectedItem,
    personIndex,
    itemSelected,
    suggestions,
}: ContactPersonAutocompleteProps) => {
    const { contactPersonAutocompleteStyling } =
        useWithOrchestratorTheme(getStyles);

    // Intentionally not done with state since we don't need a rerender
    // This is only to store a ref for the scroll into view part
    const selectedRowRef = useRef(null);

    useEffect(() => {
        if (!isEmpty(suggestions) && selectedRowRef.current) {
            scrollIntoView(selectedRowRef.current);
        }
    }, [selectedItem, suggestions]);

    const itemName = (item: ContactPerson, query: string) => {
        const name = item.name;
        const nameToLower = name.toLowerCase();
        const indexOf = nameToLower.indexOf(query.toLowerCase());
        const first = name.substring(0, indexOf);
        const middle = name.substring(indexOf, indexOf + query.length);
        const last = name.substring(indexOf + query.length);
        return (
            <span>
                {first}
                <span className="matched">{middle}</span>
                {last}
            </span>
        );
    };

    return isEmpty(suggestions) ? null : (
        <EuiFlexItem css={contactPersonAutocompleteStyling}>
            <section className={`autocomplete`}>
                <table className="result">
                    <tbody>
                        {suggestions.map((item, index) => (
                            <tr
                                key={index}
                                className={
                                    selectedItem === index ? 'active' : ''
                                }
                                onClick={() => itemSelected(item, personIndex)}
                                ref={
                                    selectedItem === index
                                        ? selectedRowRef
                                        : null
                                }
                            >
                                <td>{itemName(item, query)}</td>
                                <td>{item.email || ''}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </EuiFlexItem>
    );
};
