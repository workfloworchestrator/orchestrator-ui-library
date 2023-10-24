import { getTranslationMessages } from './getTranslationMessages';
import { Locale } from '../types';
import enUS from './en-US.json';
import nlNL from './nl-NL.json';

describe('getTransalationMessages', () => {
    it('Returns nl-NL translation when nl-NL locale is requested', () => {
        const translation = getTranslationMessages(Locale.nlNL);
        expect(translation).toEqual(nlNL);
    });

    it('Returns en-US translation when en-US locale is requested', () => {
        const translation = getTranslationMessages(Locale.enUS);
        expect(translation).toEqual(enUS);
    });

    it('Returns en-US translation when no locale is requested', () => {
        const translation = getTranslationMessages(undefined);
        expect(translation).toEqual(enUS);
    });
    it('Returns en-US translation unknown locale is requested', () => {
        const translation = getTranslationMessages('UNKNOWN-LOCALE');
        expect(translation).toEqual(enUS);
    });
    it('Returns custom translation when custom translations map array is provided', () => {
        const customEN = {
            metadata: {
                product: {
                    name: 'CUSTOM-EN-NAME',
                },
            },
        };

        const customMap = new Map([[Locale.enUS, customEN]]);
        const translation = getTranslationMessages(Locale.enUS, customMap);
        expect(translation).toEqual(customEN);
    });
    it('Returns en-Us translation if unknown locale is requested together with custom translations map', () => {
        const customEN = {
            metadata: {
                product: {
                    name: 'CUSTOM-EN-NAME',
                },
            },
        };

        const customMap = new Map([[Locale.enUS, customEN]]);
        const translation = getTranslationMessages('UNKNOWN-LOCALE', customMap);
        expect(translation).toEqual(customEN);
    });
});
