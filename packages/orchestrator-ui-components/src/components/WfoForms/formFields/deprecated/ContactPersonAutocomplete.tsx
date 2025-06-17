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

import scrollIntoView from 'scroll-into-view';

import { EuiFlexItem } from '@elastic/eui';

import { useWithOrchestratorTheme } from '@/hooks';

import { ContactPerson } from '../types';
import { isEmpty } from '../utils';
import { getContactPersonStyles } from './ContactPersonAutocompleteStyles';

interface ContactPersonAutocompleteProps {
    query: string;
    selectedItem: number;
    personIndex: number;
    itemSelected: (value: ContactPerson, index: number) => void;
    suggestions: ContactPerson[];
}

export const ContactPersonAutocomplete = ({
    query,
    selectedItem,
    personIndex,
    itemSelected,
    suggestions,
}: ContactPersonAutocompleteProps) => {
    const { contactPersonAutocompleteStyling } = useWithOrchestratorTheme(
        getContactPersonStyles,
    );

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
