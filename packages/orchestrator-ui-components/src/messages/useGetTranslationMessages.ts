import { useEffect, useState } from 'react';

import { AbstractIntlMessages } from 'next-intl';

import { useAxiosApiClient } from '../components/WfoForms/useAxiosApiClient';
import { Locale } from '../types';
import enGB from './en-GB.json';
import nlNL from './nl-NL.json';

export type TranslationMessagesMap = Map<Locale, AbstractIntlMessages>;

export const useGetTranslationMessages = (locale: string | undefined) => {
    const apiClient = useAxiosApiClient();
    const [backendMessages, setBackendMessages] = useState<
        Record<string, string>
    >({});

    useEffect(() => {
        apiClient
            .axiosFetch<{ forms: { fields: Record<string, string> } }>(
                `translations/${locale}`,
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
            case Locale.enGB:
                return enGB;
            case Locale.nlNL:
                return nlNL;

            default:
                return enGB;
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
