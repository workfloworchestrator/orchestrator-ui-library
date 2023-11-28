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
import enGB from './en-GB.json';
import nlNL from './nl-NL.json';
import { useGetTranslationMessages } from './useGetTranslationMessages';
describe('useGetTranslationMessages', () => {
    it('Returns nl-NL translation when nl-NL locale is requested', () => {
        const translation = useGetTranslationMessages(Locale.nlNL);
        expect(translation).toEqual(nlNL);
    });

    it('Returns en-GB translation when en-GB locale is requested', () => {
        const translation = useGetTranslationMessages(Locale.enGB);
        expect(translation).toEqual(enGB);
    });

    it('Returns en-GB translation when no locale is requested', () => {
        const translation = useGetTranslationMessages(undefined);
        expect(translation).toEqual(enGB);
    });
    it('Returns en-GB translation unknown locale is requested', () => {
        const translation = useGetTranslationMessages('UNKNOWN-LOCALE');
        expect(translation).toEqual(enGB);
    });
});
*/
