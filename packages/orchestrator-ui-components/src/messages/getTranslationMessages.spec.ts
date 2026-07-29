import { Locale } from '../types';
import enGB from './en-GB.json';
import nlNL from './nl-NL.json';
import { useGetTranslationMessages } from './useGetTranslationMessages';

jest.mock('../rtk/endpoints/translations', () => ({
  useTranslationsQuery: () => ({ data: undefined, isLoading: false }),
}));

// The hook merges backend translations into the local messages; with the
// query mocked to return nothing, that merge adds an empty object.
const withEmptyBackendTranslations = (messages: typeof enGB) => ({
  ...messages,
  pydanticForms: {
    ...messages.pydanticForms,
    backendTranslations: {},
  },
});

const getTranslationKeys = (messages: object, prefix = ''): string[] =>
  Object.entries(messages).flatMap(([key, value]) =>
    value && typeof value === 'object' ? getTranslationKeys(value, `${prefix}${key}.`) : [`${prefix}${key}`],
  );

describe('translation files', () => {
  it('en-GB.json and nl-NL.json contain the same translation keys', () => {
    const enGBKeys = getTranslationKeys(enGB).sort();
    const nlNLKeys = getTranslationKeys(nlNL).sort();

    expect(nlNLKeys).toEqual(enGBKeys);
  });
});

describe('useGetTranslationMessages', () => {
  it('Returns nl-NL translation when nl-NL locale is requested', () => {
    const translation = useGetTranslationMessages(Locale.nlNL);
    expect(translation).toEqual(withEmptyBackendTranslations(nlNL));
  });

  it('Returns en-GB translation when en-GB locale is requested', () => {
    const translation = useGetTranslationMessages(Locale.enGB);
    expect(translation).toEqual(withEmptyBackendTranslations(enGB));
  });

  it('Returns en-GB translation when no locale is requested', () => {
    const translation = useGetTranslationMessages(undefined);
    expect(translation).toEqual(withEmptyBackendTranslations(enGB));
  });
  it('Returns en-GB translation unknown locale is requested', () => {
    const translation = useGetTranslationMessages('UNKNOWN-LOCALE');
    expect(translation).toEqual(withEmptyBackendTranslations(enGB));
  });
});
