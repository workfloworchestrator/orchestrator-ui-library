import { FC } from 'react';
import { EuiButton } from '@elastic/eui';
import { css } from '@emotion/react';

const contentStyles = css`
    height: 300px;
    width: 300px;
    background-color: aqua;
`;

const buttonStyles = css`
    background-color: red;
`;

/* eslint-disable-next-line */
export interface CustomButtonProps {
    buttonText: string;
}

export const CustomButton: FC<CustomButtonProps> = ({ buttonText }) => (
    <div css={contentStyles}>
        <EuiButton css={buttonStyles} fill>
            {buttonText}
        </EuiButton>
    </div>
);
