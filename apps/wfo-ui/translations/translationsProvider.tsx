import React from 'react';
import { NextIntlProvider } from 'next-intl';
import type { ReactNode } from 'react';
import {
    Locale,
    getTranslationMessages,
} from '@orchestrator-ui/orchestrator-ui-components';
import {
    Locale as FormLocale,
    getTranslationMessages as getFormTranslationMessages,
} from '@orchestrator-ui/pydantic-forms';
import type { TranslationMessagesMap } from '@orchestrator-ui/orchestrator-ui-components';
import { useRouter } from 'next/router';
import { merge } from 'lodash';

import enUS from './en-US.json';
import nlNL from './nl-NL.json';

interface TranslationsProviderProps {
    children: ReactNode;
}

export const TranslationsProvider = ({
    children,
}: TranslationsProviderProps) => {
    const { locale } = useRouter();

    const standardMessages = getTranslationMessages(locale);
    const customMessageMap: TranslationMessagesMap = new Map([
        [Locale.enUS, FormLocale.enUS, enUS],
        [Locale.nlNL, FormLocale.nlNL, nlNL],
    ]);
    const customMessages = getTranslationMessages(locale, customMessageMap);

    const messages = merge(standardMessages, customMessages);

    return <NextIntlProvider messages={messages}>{children}</NextIntlProvider>;
};
