import { useContext } from 'react';

import { AbstractIntlMessages } from 'next-intl';

import { OrchestratorConfigContext } from '@/contexts';
import { useQueryWithFetch } from '@/hooks';
import { Locale } from '@/types';

import enGB from './en-GB.json';
import nlNL from './nl-NL.json';

export type TranslationMessagesMap = Map<Locale, AbstractIntlMessages>;

type BackendTranslationsResponse = {
    forms: {
        fields: Record<string, string>;
    };
};

export const useGetTranslationMessages = (locale: string | undefined) => {
    const { orchestratorApiBaseUrl } = useContext(OrchestratorConfigContext);
    const translationsUrl = `${orchestratorApiBaseUrl}/translations/${locale}`;
    const { isLoading, data } = useQueryWithFetch<
        BackendTranslationsResponse,
        Record<never, never>
    >(translationsUrl, {}, 'backendTranslations');

    const backendMessages = isLoading ? {} : data?.forms?.fields || {};

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
