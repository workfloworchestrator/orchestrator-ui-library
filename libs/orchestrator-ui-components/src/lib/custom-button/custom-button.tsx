import { FC } from 'react';
import { css, SerializedStyles } from '@emotion/react';

export interface CustomButtonProps {
    buttonText: string;
}

export const CustomButton: FC<CustomButtonProps> = ({ buttonText }) => {
    const contentStyles: SerializedStyles = css({
        height: '300px',
        width: '300px',
        backgroundColor: 'lightgrey',
    });

    const buttonStyles = css({
        backgroundColor: 'grey',
    });

    return (
        <div css={contentStyles}>
            <button css={buttonStyles}>{buttonText}</button>
        </div>
    );
};
