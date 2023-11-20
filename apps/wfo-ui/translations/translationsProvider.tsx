import React from 'react';
import type { ReactNode } from 'react';

import { merge } from 'lodash';
import { NextIntlProvider } from 'next-intl';
import { useRouter } from 'next/router';

import {
    Locale,
    getTranslationMessages,
} from '@orchestrator-ui/orchestrator-ui-components';
import type { TranslationMessagesMap } from '@orchestrator-ui/orchestrator-ui-components';

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
        [Locale.enUS, enUS],
        [Locale.nlNL, nlNL],
    ]);
    const customMessages = getTranslationMessages(locale, customMessageMap);

    const messages = merge(standardMessages, customMessages);

    return <NextIntlProvider messages={messages}>{children}</NextIntlProvider>;
};
