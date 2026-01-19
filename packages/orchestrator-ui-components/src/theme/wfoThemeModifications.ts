import type { EuiThemeComputed, EuiThemeModifications } from '@elastic/eui';

import {
    shadeOrchestratorColor,
    tintOrchestratorColor,
} from '../hooks/useOrchestratorTheme';

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
            backgroundBaseAccent: '#9CA3AF',
            backgroundBaseDisabled: '#4B5563',
            backgroundBaseNeutral: '#101827',
            backgroundBasePlain: '#1F2937',
            borderBasePlain: '#4B5563',
            borderBaseSubdued: '#374151',
            danger: '#FF4F46',
            header: '#04385F',
            highlight: '#51482F',
            link: '#1F8DD8',
            primary: '#0077C8',
            backgroundLightPrimary: shadeOrchestratorColor('#0077C8'),
            backgroundFilledPrimary: '#0077C8',
            shadow: '#000000',
            success: '#13B054',
            textAccent: '#E67300',
            textDanger: '#FF4F46',
            textDisabled: '#9CA3AF',
            textHeading: '#ffffff',
            textParagraph: '#FFFFFF',
            textPrimary: '#1F8DD8',
            textSubdued: '#9CA3AF',
            textSuccess: '#13B054',
            textWarning: '#FFC514',
            warning: '#FFC514',
            textInverse: '#FFFFFF',
        },
        LIGHT: {
            accent: '#E67300',
            backgroundBaseAccent: '#64758B',
            backgroundBaseDisabled: '#CCD5E2',
            backgroundBaseNeutral: '#FFFFFF',
            backgroundBaseSubdued: '#f4f7fd',
            backgroundBasePlain: '#FFFFFF',
            borderBasePlain: '#CCD5E2',
            borderBaseSubdued: '#CCD5E2',
            danger: '#BD271F',
            header: '#04385F',
            highlight: '#FFF6DE',
            link: '#0067AC',
            primary: '#0077C8',
            backgroundLightPrimary: tintOrchestratorColor('#0077C8'),
            backgroundFilledPrimary: '#0077C8',
            shadow: '#000000',
            success: '#008939',
            textAccent: '#B05200',
            textDanger: '#AC0A01',
            textDisabled: '#64758B',
            textHeading: '#0F172B',
            textParagraph: '#334255',
            textPrimary: '#0067AC',
            textSubdued: '#64758B',
            textSuccess: '#007832',
            textWarning: '#8E6A00',
            warning: '#FFC514',
        },
    },
};
