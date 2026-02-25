import React, { FC, ReactNode } from 'react';

import {
  EuiButton,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiSpacer,
} from '@elastic/eui';

export type WfoInformationModalProps = {
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export const WfoInformationModal: FC<WfoInformationModalProps> = ({ title, onClose, children }) => {
  return (
    <EuiModal onClose={onClose}>
      <EuiModalHeader>
        <EuiModalHeaderTitle size="xs">{title}</EuiModalHeaderTitle>
      </EuiModalHeader>

      <EuiSpacer size="s" />

      <EuiModalBody>{children}</EuiModalBody>

      <EuiModalFooter>
        <EuiButton onClick={onClose} fill>
          Close
        </EuiButton>
      </EuiModalFooter>
    </EuiModal>
  );
};
