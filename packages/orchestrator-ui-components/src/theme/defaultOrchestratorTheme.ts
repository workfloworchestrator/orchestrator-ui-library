import { EuiThemeModifications } from '@elastic/eui';

export const defaultOrchestratorTheme: EuiThemeModifications = {
    base: 16,
    breakpoint: {
        xs: 0,
        s: 575,
        m: 768,
        l: 992,
        xl: 1200,
        xxl: 1600,
    },
    size: {
        base: '16px',
        xxs: '2px',
        xs: '4px',
        s: '8px',
        m: '12px',
        l: '24px',
        xl: '32px',
        xxl: '40px',
        xxxl: '48px',
        xxxxl: '64px',
    },
    colors: {
        DARK: {
            primary: '#265391',
            accent: '#F68FBE',
            success: '#7DDED8',
            warning: '#F3D371',
            danger: '#F86B63',
            primaryText: '#3EA6fA',
            accentText: '#F68FBE',
            successText: '#7DDEd8',
            warningText: '#F3D371',
            dangerText: '#F86B63',
            emptyShade: '#1D1E24',
            lightestShade: '#25262E',
            lightShade: '#343741',
            mediumShade: '#535966',
            darkShade: '#98A2B3',
            darkestShade: '#D4DAE5',
            fullShade: '#FFFFFF',
            text: '#DFE5EF',
            title: '#DFE5EF',
            subduedText: '#81858f',
            link: '#3EA6fA',
            body: '#141519',
            highlight: '#262830',
            disabled: '#515761',
            disabledText: '#515761',
            shadow: '#FFFFFF',
        },
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
    border: {
        thin: 'solid 1px #ddd',
    },
};
