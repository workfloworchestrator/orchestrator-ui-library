import { EuiThemeModifications } from '@elastic/eui';

export const defaultOrchestratorTheme: EuiThemeModifications = {
    colors: {
        DARK: {},
        LIGHT: {
            primary: '#0077C8',
            accent: '#E67300',
            success: '#008939',
            warning: '#FFC514',
            danger: '#BD271F',
            primaryText: '#0067AC',
            accentText: '#B05200',
            successText: '#007832',
            warningText: '#8E6A00',
            dangerText: '#AC0A01',
            emptyShade: '#FFFFFF',
            lightestShade: '#F1F5F9',
            lightShade: '#CCD5E2',
            mediumShade: '#94A4B8',
            darkShade: '#64758B',
            darkestShade: '#334255',
            fullShade: '#0F172B',
            text: '#334255',
            title: '#0F172B',
            subduedText: '#64758B',
            link: '#0067AC',
            body: '#F1F5F9',
            highlight: '#FFF6DE',
            disabled: '#94A4B8',
            disabledText: '#94A4B8',
            shadow: '#000000',
        },
    },
    font: {
        weight: {
            regular: 400,
            medium: 500,
            semiBold: 600,
            bold: 700,
        },
    },
};
