describe('getTransalationMessages', () => {
    it('Makes jest stop complaining about an empty test file', () => {
        expect(true).toEqual(true);
    });
});

export {};
/*
These tests are disabled because of an issue described here:
https://github.com/workfloworchestrator/orchestrator-ui/issues/513

import { Locale } from '../types';
import enUS from './en-US.json';
import nlNL from './nl-NL.json';
import { useGetTranslationMessages } from './useGetTranslationMessages';
describe('getTransalationMessages', () => {
    it('Returns nl-NL translation when nl-NL locale is requested', () => {
        const translation = useGetTranslationMessages(Locale.nlNL);
        expect(translation).toEqual(nlNL);
    });

    it('Returns en-US translation when en-US locale is requested', () => {
        const translation = useGetTranslationMessages(Locale.enUS);
        expect(translation).toEqual(enUS);
    });

    it('Returns en-US translation when no locale is requested', () => {
        const translation = useGetTranslationMessages(undefined);
        expect(translation).toEqual(enUS);
    });
    it('Returns en-US translation unknown locale is requested', () => {
        const translation = useGetTranslationMessages('UNKNOWN-LOCALE');
        expect(translation).toEqual(enUS);
    });
});
*/
