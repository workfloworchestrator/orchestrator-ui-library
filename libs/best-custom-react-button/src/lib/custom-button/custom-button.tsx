import { FC, useContext } from 'react';
import { EuiButton } from '@elastic/eui';
import { css, SerializedStyles } from '@emotion/react';
import { OrchestratorThemeContext } from '../theming/OrchestratorThemeContext';

export interface CustomButtonProps {
    buttonText: string;
}

export const CustomButton: FC<CustomButtonProps> = ({ buttonText }) => {
    const currentTheme = useContext(OrchestratorThemeContext);

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
