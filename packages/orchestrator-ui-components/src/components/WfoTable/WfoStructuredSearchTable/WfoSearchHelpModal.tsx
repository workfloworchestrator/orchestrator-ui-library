import React from 'react';

import { useTranslations } from 'next-intl';

import { EuiText } from '@elastic/eui';

import { WfoInformationModal } from '@/components';

export type WfoSearchHelpModalProps = {
  onClose: () => void;
};

export const WfoSearchHelpModal = ({ onClose }: WfoSearchHelpModalProps) => {
  const t = useTranslations('search.page');
  const tCommon = useTranslations('common');

  return (
    <WfoInformationModal title={t('help.title')} onClose={onClose}>
      <EuiText size="s">
        <p>
          <strong>{t('help.searchFieldTitle')}</strong> - {t('help.searchFieldDescription')}
        </p>

        <h4>{t('help.filterTitle')}</h4>
        <p>{t('help.filterIntro')}</p>
        <ul>
          <li>
            <strong>{t('addRule')}</strong> - {t('help.addRuleDescription')}
          </li>
          <li>
            <strong>{t('addGroup')}</strong> - {t('help.addGroupDescription')}
          </li>
        </ul>

        <h4>{t('help.quickFilterTitle')}</h4>
        <p>{t('help.quickFilterDescription')}</p>

        <h4>{t('help.matchingRowTitle')}</h4>
        <p>{t('help.matchingRowDescription')}</p>

        <h4>{t('help.tableSettingsTitle')}</h4>
        <ul>
          <li>
            <strong>{tCommon('showMatchDetails')}</strong> - {t('help.showMatchDetailsDescription')}
          </li>
          <li>
            <strong>{tCommon('retrieval')}</strong> - {t('help.retrievalDescription')}
          </li>
          <li>
            <strong>{tCommon('export')}</strong> - {t('help.exportDescription')}
          </li>
          <li>
            <strong>{t('help.advancedNestedSearchLabel')}</strong> - {t('help.advancedNestedSearchDescription')}
          </li>
        </ul>
      </EuiText>
    </WfoInformationModal>
  );
};
