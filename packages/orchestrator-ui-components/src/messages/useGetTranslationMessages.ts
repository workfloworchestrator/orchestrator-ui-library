import { useTranslationsQuery } from '@/rtk/endpoints/translations';
import { Locale } from '@/types';

import enGB from './en-GB.json';
import nlNL from './nl-NL.json';

export const useGetTranslationMessages = (locale: string | undefined) => {
    const { data, isLoading } = useTranslationsQuery({ locale: locale ?? '' });

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
