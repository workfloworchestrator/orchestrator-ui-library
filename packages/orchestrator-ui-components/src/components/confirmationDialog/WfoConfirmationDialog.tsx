/*
 * Copyright 2019-2023 SURF.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
import React from 'react';

import { useTranslations } from 'next-intl';

import {
  EuiButton,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiOverlayMask,
} from '@elastic/eui';

import { ConfirmDialogHandler } from '@/contexts/ConfirmationDialogProvider';

import { confirmationDialogStyling } from './ConfirmationDialogStyling';

interface WfoConfirmationDialogProps {
  isOpen?: boolean;
  onCancel: ConfirmDialogHandler;
  onConfirm: ConfirmDialogHandler;
  question: string;
  subQuestion?: string;
  cancelButtonText?: string;
  confirmButtonText?: string;
  isError?: boolean;
}

export default function WfoConfirmationDialog({
  isOpen = false,
  onCancel,
  onConfirm,
  question = '',
  subQuestion = '',
  cancelButtonText = '',
  confirmButtonText = '',
  isError = false,
}: WfoConfirmationDialogProps) {
  const t = useTranslations('confirmationDialog');

  return (
    <div className="confirmation-dialog-overlay">
      {isOpen && (
        <EuiOverlayMask>
          <EuiModal
            css={confirmationDialogStyling}
            className="confirm-modal"
            onClose={() => onCancel}
            initialFocus="[name=popfirst]"
          >
            <EuiModalHeader>
              <EuiModalHeaderTitle>{t('title')}</EuiModalHeaderTitle>
            </EuiModalHeader>

            <EuiModalBody>
              <div>
                <section className={`dialog-content ${isError ? ' error' : ''}`}>
                  <h2>{question}</h2>
                  {subQuestion && <p>{subQuestion}</p>}
                </section>
              </div>
            </EuiModalBody>

            <EuiModalFooter>
              <EuiButton onClick={onCancel} id="dialog-cancel" fill={false}>
                {cancelButtonText || t('cancel')}
              </EuiButton>

              <EuiButton onClick={onConfirm} fill id="dialog-confirm">
                {confirmButtonText || t('confirm')}
              </EuiButton>
            </EuiModalFooter>
          </EuiModal>
        </EuiOverlayMask>
      )}
    </div>
  );
}
