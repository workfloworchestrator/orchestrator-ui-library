import { BaseQueryTypes, orchestratorApi } from '@/rtk';

const TRANSLATIONS_URL = 'translations';

export type BackendTranslationsResponse = {
  forms: {
    fields: Record<string, string>;
  };
};

const translationsApi = orchestratorApi.injectEndpoints({
  endpoints: (build) => ({
    translations: build.query<BackendTranslationsResponse, { locale: string }>({
      query: ({ locale }) => ({
        url: `${TRANSLATIONS_URL}/${locale}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
      extraOptions: {
        baseQueryType: BaseQueryTypes.fetch,
      },
    }),
  }),
});

export const { useTranslationsQuery } = translationsApi;
