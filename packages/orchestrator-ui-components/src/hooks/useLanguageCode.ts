import { useLocale } from 'next-intl';

export const useLanguageCode = () => {
  const locale = useLocale();
  if (!locale) return 'en';
  try {
    return typeof Intl !== 'undefined' && 'Locale' in Intl ? new Intl.Locale(locale).language : locale.split(/[-_]/)[0];
  } catch {
    return locale.split(/[-_]/)[0] || 'en';
  }
};
