import React from 'react';

import { useTranslations } from 'next-intl';

export const WfoPageUnauthorized = () => {
  const t = useTranslations('common');
  return <p>{t('unauthorizedPage')}</p>;
};
