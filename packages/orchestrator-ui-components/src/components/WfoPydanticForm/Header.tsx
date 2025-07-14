import React from 'react';

import { usePydanticFormContext } from 'pydantic-forms';

import { css } from '@emotion/react';

const headerStyling = css`
    padding: 20px 0;
    font-size: larger;
    font-weight: bold;
    margin-bottom: 15px;
`;

export const Header = () => {
    const { pydanticFormSchema } = usePydanticFormContext();

    return pydanticFormSchema?.title &&
        pydanticFormSchema.title !== 'unknown' ? (
        <h3 data-testid="pydantic-form-row" css={headerStyling}>
            {pydanticFormSchema?.title}
        </h3>
    ) : undefined;
};
