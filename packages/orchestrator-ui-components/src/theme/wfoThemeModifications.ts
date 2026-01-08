import type { EuiThemeComputed, EuiThemeModifications } from '@elastic/eui';

type WfoThemeExtraColors = {
    colors: {
        LIGHT: {
            header: string;
        };
        DARK: {
            header: string;
        };
    };
};

export type WfoComputedModifications = {
    colors: {
        header: string;
    };
};

type WfoThemeModifications = EuiThemeModifications<WfoThemeExtraColors>;

export type WfoComputedTheme = EuiThemeComputed<WfoComputedModifications>;

/*
 * Eui's default theme is Borealis. This is applied automatically. These are the modifications passed into modify
 * property when calling EuiProvider
 */
export const wfoThemeModifications: WfoThemeModifications = {
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
            accent: '#E67300',
            danger: '#FF4F46',
            primary: '#0077C8',
            success: '#13B054',
            textAccent: '#E67300',
            textDanger: '#FF4F46',
            textPrimary: '#1F8DD8',
            textSuccess: '#13B054',
            textWarning: '#FFC514',
            warning: '#FFC514',

            borderBaseSubdued: '#374151',
            borderBasePlain: '#4B5563',

            backgroundBasePlain: '#1F2937',
            backgroundBaseNeutral: '#101827',

            backgroundBaseDisabled: '#4B5563',
            backgroundBaseAccent: '#64758B',

            text: '#9CA3AF', //
            textParagraph: '#9CA3AF',
            title: '#ffffff', //
            textHeading: '#ffffff',
            subduedText: '#9CA3AF', //
            textSubdued: '#9CA3AF',
            link: '#1F8DD8', //
            highlight: '#51482F',
            disabled: '#4B5563', //

            disabledText: '#4B5563', //
            textDisabled: '#4B5563',
            shadow: '#000000',
            header: '#04385F',
        },
        LIGHT: {
            accent: '#E67300',
            danger: '#BD271F',
            primary: '#0077C8',
            success: '#008939',
            textAccent: '#B05200',
            textDanger: '#AC0A01',
            textPrimary: '#0067AC',
            textSuccess: '#007832',
            textWarning: '#8E6A00',
            warning: '#FFC514',

            backgroundBasePlain: '#F1F5F9',
            backgroundBaseNeutral: '#FFFFFF',

            borderBaseSubdued: '#CCD5E2',
            borderBasePlain: '#94A4B8',

            backgroundBaseAccent: '#64758B',
            backgroundBaseDisabled: '#94A4B8',

            text: '#334255', //
            textParagraph: '#334255',
            title: '#0F172B', //
            textHeading: '#0F172B',
            subduedText: '#64758B', //
            textSubdued: '#64758B',
            link: '#0067AC',

            highlight: '#FFF6DE',
            disabled: '#94A4B8', //

            disabledText: '#94A4B8', //
            textDisabled: '#94A4B8',
            shadow: '#000000',
            header: '#04385F',
        },
    },
};
