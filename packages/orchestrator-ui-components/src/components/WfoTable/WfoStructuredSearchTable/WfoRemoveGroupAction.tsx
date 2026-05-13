import React from 'react';
import type { ActionProps } from 'react-querybuilder';

import { useTranslations } from 'next-intl';

import { EuiButtonIcon } from '@elastic/eui';

export const WfoRemoveGroupAction = (props: ActionProps) => {
  const t = useTranslations('search.page');
  return <EuiButtonIcon onClick={props.handleOnClick} iconType="trash" color="danger" aria-label={t('removeGroup')} />;
};
