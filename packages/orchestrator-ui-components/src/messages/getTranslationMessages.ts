import { AbstractIntlMessages } from 'next-intl';

import { Locale } from '../types';
import enUS from './en-US.json';
import nlNL from './nl-NL.json';

export type TranslationMessagesMap = Map<Locale, AbstractIntlMessages>;

const standardMessageMap: TranslationMessagesMap = new Map([
    [Locale.enUS, enUS],
    [Locale.nlNL, nlNL],
]);

export const getTranslationMessages = (
    locale: string | undefined,
    messages: TranslationMessagesMap = standardMessageMap,
) => {
    switch (locale) {
        case Locale.enUS:
            return messages.get(Locale.enUS);
        case Locale.nlNL:
            return messages.get(Locale.nlNL);
        default:
            return messages.get(Locale.enUS);
    }
};
