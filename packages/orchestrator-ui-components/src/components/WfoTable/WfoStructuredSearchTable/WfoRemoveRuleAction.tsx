import React from 'react';
import type { ActionProps } from 'react-querybuilder';

import { useTranslations } from 'next-intl';

import { EuiFlexItem } from '@elastic/eui';
import { EuiButtonIcon } from '@elastic/eui';

export const WfoRemoveRuleAction = (props: ActionProps) => {
  const t = useTranslations('search.page');
  return (
    <EuiFlexItem>
      <EuiButtonIcon onClick={props.handleOnClick} iconType="trash" color="danger" aria-label={t('removeRule')} />
    </EuiFlexItem>
  );
};
