import { css } from '@emotion/react';

import type { UseOrchestratorThemeProps } from '@/hooks';

export const getWfoObjectFieldStyles = () => {
    const wfoObjectFieldStyles = css({
        width: '100%',
        '& > div': {
            width: '100%',
        },
    });
    return {
        wfoObjectFieldStyles,
    };
};

export const getCommonFormFieldStyles = ({
    theme,
}: UseOrchestratorThemeProps) => {
    const formRowStyle = css({
        marginBottom: theme.base * 2,

        '.euiText': {
            color: theme.colors.text,
        },
        '.euiFormLabel': {
            color: theme.colors.text,
            cursor: 'text',
            '&.euiFormLabel-isFocused': {
                color: theme.colors.primaryText,
            },
        },
        '.euiFormRow__labelWrapper': {
            display: 'flex',
            flexDirection: 'column',
        },
    });

    const errorStyle = css({
        color: theme.colors.dangerText,
    });
    return {
        errorStyle,
        formRowStyle,
    };
};

export const summaryFieldStyles = ({ theme }: UseOrchestratorThemeProps) => {
    const summaryFieldStyle = css({
        'div.emailMessage': {
            td: {
                color: theme.colors.textParagraph,
            },
            p: {
                color: theme.colors.textParagraph,
            },
            html: {
                marginLeft: '-10px',
            },
        },
        'section.table-summary': {
            marginTop: '20px',
            width: '100%',
            td: {
                padding: '10px',
                verticalAlign: 'top',
            },
            'td:not(:first-child):not(:last-child)': {
                borderRight: `1px solid ${theme.colors.borderBasePlain}`,
            },
            '.label': {
                fontWeight: 'bold',
                color: theme.colors.backgroundBaseSubdued,
                backgroundColor: theme.colors.primary,
                borderRight: `2px solid ${theme.colors.borderBasePlain}`,
                borderBottom: `1px solid ${theme.colors.borderBasePlain}`,
            },
            '.value': {
                backgroundColor: theme.colors.backgroundBasePrimary,
                borderBottom: `1px solid ${theme.colors.borderBasePlain}`,
            },
        },
    });
    return {
        summaryFieldStyle: summaryFieldStyle,
    };
};
