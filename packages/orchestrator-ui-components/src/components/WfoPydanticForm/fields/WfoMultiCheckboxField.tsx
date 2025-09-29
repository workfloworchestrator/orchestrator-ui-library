import React, { useEffect, useState } from 'react';

import { PydanticFormControlledElement } from 'pydantic-forms';

import { EuiCheckboxGroup } from '@elastic/eui';

type idMap = Record<string, boolean>;

export const WfoMultiCheckboxField: PydanticFormControlledElement = ({
    pydanticFormField,
    onChange,
    value,
}) => {
    // See: https://eui.elastic.co/docs/components/forms/selection/checkboxes-and-radios/#checkbox

    useEffect(() => {
        // Setting the ids is handled here to make sure the field repopulates when navigating back from another step
        const getInitialMap = () => {
            const initialIdMap: idMap = (value || []).reduce(
                (idMap: idMap, id: string) => {
                    idMap[id] = true;
                    return idMap;
                },
                {} as idMap,
            );
            return initialIdMap;
        };

        setCheckboxIdToSelectedMap(getInitialMap());
    }, [value]);

    const [checkboxIdToSelectedMap, setCheckboxIdToSelectedMap] = useState<
        Record<string, boolean>
    >({});

    const { options, id } = pydanticFormField;

    const checkboxes = options?.map((option, index) => ({
        label: option.label,
        id: option.value,
        'data-test-id': `${id}-${index}`,
    }));

    const handleCheckboxChange = (optionId: string) => {
        const newCheckboxIdToSelectedMap = {
            ...checkboxIdToSelectedMap,
            ...{
                [optionId]: !checkboxIdToSelectedMap[optionId],
            },
        };

        const selectedIds = Object.keys(newCheckboxIdToSelectedMap).filter(
            (key) => newCheckboxIdToSelectedMap[key],
        );

        onChange(selectedIds);
        setCheckboxIdToSelectedMap(newCheckboxIdToSelectedMap);
    };

    return (
        <EuiCheckboxGroup
            options={checkboxes || []}
            idToSelectedMap={checkboxIdToSelectedMap}
            onChange={(id) => handleCheckboxChange(id)}
            data-testid={id}
        />
    );
};
