import { useLocale } from 'next-intl';

export const useLanguageCode = () => {
  const locale = useLocale();
  return locale ? new Intl.Locale(locale).language : 'en';
};
