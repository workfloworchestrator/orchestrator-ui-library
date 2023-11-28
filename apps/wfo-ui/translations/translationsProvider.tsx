import React from 'react';
import type { ReactNode } from 'react';

import { merge } from 'lodash';
import { NextIntlProvider } from 'next-intl';
import { useRouter } from 'next/router';

import {
    Locale,
    useGetTranslationMessages,
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

    const standardMessages = useGetTranslationMessages(locale);
    console.log('standardMessages', standardMessages);
    const customMessageMap: TranslationMessagesMap = new Map([
        [Locale.enUS, enUS],
        [Locale.nlNL, nlNL],
    ]);

    const getCustomMessages = () => {
        switch (locale) {
            case Locale.enUS:
                return customMessageMap.get(Locale.enUS);
            case Locale.nlNL:
                return customMessageMap.get(Locale.nlNL);
            default:
                return customMessageMap.get(Locale.enUS);
        }
    };

    const messages = merge(standardMessages, getCustomMessages());

    return <NextIntlProvider messages={messages}>{children}</NextIntlProvider>;
};
