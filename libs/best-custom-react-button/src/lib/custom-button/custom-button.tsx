import { FC } from 'react';
import { EuiButton } from '@elastic/eui';
import { DataType } from 'csstype';
import { css, SerializedStyles, Theme, useTheme } from '@emotion/react';

export interface MyTheme {
    colors: {
        primary: DataType.Color;
        secondary: DataType.Color;
    };
}

export const defaultTheme: MyTheme = {
    colors: {
        primary: 'red',
        secondary: 'blue',
    },
};

export interface CustomButtonProps {
    buttonText: string;
}

export const CustomButton: FC<CustomButtonProps> = ({ buttonText }) => {
    // Todo fix this typecast
    const currentTheme = useTheme() as MyTheme;

    const contentStyles: SerializedStyles = css({
        height: '300px',
        width: '300px',
        backgroundColor: currentTheme.colors.secondary,
    });

    const buttonStyles = css({
        backgroundColor: currentTheme.colors.primary,
    });

    return (
        <div css={contentStyles}>
            <EuiButton css={buttonStyles} fill>
                {buttonText}
            </EuiButton>
        </div>
    );
};
