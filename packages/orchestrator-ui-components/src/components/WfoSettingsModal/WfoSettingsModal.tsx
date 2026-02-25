import React, { FC, ReactNode } from 'react';

import { useTranslations } from 'next-intl';

import {
  EuiButton,
  EuiButtonEmpty,
  EuiFlexGroup,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiSpacer,
} from '@elastic/eui';

export type WfoSettingsModalProps = {
  title: string;
  onClose: () => void;
  onResetToDefaults: () => void;
  onUpdateTableConfig: () => void;
  children: ReactNode;
};

export const WfoSettingsModal: FC<WfoSettingsModalProps> = ({
  title,
  onClose,
  onResetToDefaults,
  onUpdateTableConfig,
  children,
}) => {
  const t = useTranslations('main');

  return (
    <EuiModal onClose={onClose} maxWidth={400}>
      <EuiModalHeader>
        <EuiModalHeaderTitle size="xs">{title}</EuiModalHeaderTitle>
      </EuiModalHeader>

      <EuiSpacer size="s" />

      <EuiModalBody>{children}</EuiModalBody>

      <EuiModalFooter>
        <EuiFlexGroup justifyContent="spaceBetween">
          <EuiButtonEmpty onClick={onResetToDefaults} flush="left">
            {t('resetToDefault')}
          </EuiButtonEmpty>
          <EuiButton onClick={onUpdateTableConfig} fill>
            {t('savePreferences')}
          </EuiButton>
        </EuiFlexGroup>
      </EuiModalFooter>
    </EuiModal>
  );
};
