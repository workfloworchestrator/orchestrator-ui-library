import { useEffect, useState } from 'react';

import { AbstractIntlMessages } from 'next-intl';

import { useAxiosApiClient } from '../components/WfoForms/useAxiosApiClient';
import { Locale } from '../types';
import enUS from './en-US.json';
import nlNL from './nl-NL.json';

export type TranslationMessagesMap = Map<Locale, AbstractIntlMessages>;

export const useGetTranslationMessages = (locale: string | undefined) => {
    const apiClient = useAxiosApiClient();
    const [backendMessages, setBackendMessages] = useState<
        Record<string, string>
    >({});

    useEffect(() => {
        // Temporary fix: Mapping en-US to en-GB locale
        const backendLocale =
            locale === Locale.enUS.toString() ? 'en-GB' : locale;

        apiClient
            .axiosFetch<{ forms: { fields: Record<string, string> } }>(
                `translations/${backendLocale}`,
            )
            .then((response) => {
                const backendMessages = response.forms.fields;
                setBackendMessages(backendMessages);
            })
            .catch((error) => {
                console.error('error getting backend translations', error);
                setBackendMessages({});
            });
    }, [apiClient, locale]);

    const getLocalMessages = () => {
        switch (locale) {
            case Locale.enUS:
                return enUS;
            case Locale.nlNL:
                return nlNL;

            default:
                return enUS;
        }
    };

    const localMessages = getLocalMessages();

    return {
        ...localMessages,
        pydanticForms: {
            ...localMessages.pydanticForms,
            backendTranslations: backendMessages,
        },
    };
};
