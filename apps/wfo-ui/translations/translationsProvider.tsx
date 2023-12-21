import React from 'react';
import type { ReactNode } from 'react';

import { merge } from 'lodash';
import { IntlErrorCode, IntlProvider } from 'next-intl';
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

    const onError = (error: { code: IntlErrorCode }) => {
        if (
            error &&
            error.code &&
            error.code !== IntlErrorCode.MISSING_MESSAGE &&
            error.code !== IntlErrorCode.INSUFFICIENT_PATH
        ) {
            // Missing translations are expected and normal in the context of the
            // forms module (see UserInputForm.tsx) so we silently discard them
            // TODO: Think of a place to better log missing translations keys that shouldn't be missing
            console.error(error);
        }
    };

    const messages = merge(standardMessages, getCustomMessages());

    return (
        <IntlProvider
            locale={locale || Locale.enGB}
            messages={messages}
            onError={onError}
        >
            {children}
        </IntlProvider>
    );
};
