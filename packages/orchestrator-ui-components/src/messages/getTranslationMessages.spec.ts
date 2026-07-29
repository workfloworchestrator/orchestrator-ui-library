import enGB from './en-GB.json';
import nlNL from './nl-NL.json';

const getTranslationKeys = (messages: object, prefix = ''): string[] =>
  Object.entries(messages).flatMap(([key, value]) =>
    value && typeof value === 'object' ? getTranslationKeys(value, `${prefix}${key}.`) : [`${prefix}${key}`],
  );

describe('translation files', () => {
  it('en-GB.json and nl-NL.json contain the same translation keys', () => {
    const enGBKeys = getTranslationKeys(enGB).sort();
    const nlNLKeys = getTranslationKeys(nlNL).sort();

    expect(nlNLKeys).toEqual(enGBKeys);
  });
});
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
