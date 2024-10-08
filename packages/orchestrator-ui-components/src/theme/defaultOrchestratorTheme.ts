import type { EuiThemeComputed, EuiThemeModifications } from '@elastic/eui';

export type WfoThemeExtraColors = {
    colors: {
        header: string;
    };
};

export type WfoThemeComputed = EuiThemeComputed<WfoThemeExtraColors>;

export const defaultOrchestratorTheme: EuiThemeModifications<WfoThemeExtraColors> =
    {
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
                primary: '#0077C8',
                accent: '#E67300',
                success: '#13B054',
                warning: '#FFC514',
                danger: '#FF4F46',
                primaryText: '#1F8DD8',
                accentText: '#E67300',
                successText: '#13B054',
                warningText: '#FFC514',
                dangerText: '#FF4F46',
                emptyShade: '#101827',
                lightestShade: '#1F2937',
                lightShade: '#374151',
                mediumShade: '#4B5563',
                darkShade: '#64758B',
                darkestShade: '#F1F5F9',
                fullShade: '#ffffff',
                text: '#9CA3AF',
                title: '#ffffff',
                subduedText: '#9CA3AF',
                link: '#1F8DD8',
                body: '#1F2937',
                highlight: '#51482F',
                disabled: '#4B5563',
                disabledText: '#4B5563',
                shadow: '#000000',
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
            header: '#04385F',
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
