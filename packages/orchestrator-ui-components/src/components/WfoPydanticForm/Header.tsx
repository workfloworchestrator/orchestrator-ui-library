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

    return <h3 css={headerStyling}>{pydanticFormSchema?.title}</h3>;
};
