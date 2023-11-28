import React from 'react';
import type { ReactNode } from 'react';

import { merge } from 'lodash';
import { NextIntlProvider } from 'next-intl';
import { useRouter } from 'next/router';

import {
    Locale,
    useGetTranslationMessages,
} from '@orchestrator-ui/orchestrator-ui-components';

import enGB from './en-GB.json';
import nlNL from './nl-NL.json';

interface TranslationsProviderProps {
    children: ReactNode;
}

export const TranslationsProvider = ({
    children,
}: TranslationsProviderProps) => {
    const { locale } = useRouter();

    const standardMessages = useGetTranslationMessages(locale);

    const getCustomMessages = () => {
        switch (locale) {
            case Locale.enGB:
                return enGB;
            case Locale.nlNL:
                return nlNL;
            default:
                return enGB;
        }
    };

    const messages = merge(standardMessages, getCustomMessages());

    return <NextIntlProvider messages={messages}>{children}</NextIntlProvider>;
};
