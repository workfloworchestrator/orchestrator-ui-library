import React, { FC } from 'react';

import { useTranslations } from 'next-intl';

import { EuiButton, EuiCallOut, EuiCode, EuiSpacer, EuiText } from '@elastic/eui';

interface WfoBackendUnavailableProps {
  featureType: 'search';
  onRetry?: () => void;
}

export const WfoBackendUnavailable: FC<WfoBackendUnavailableProps> = ({ featureType, onRetry }) => {
  const t = useTranslations(`${featureType}.availability.unavailable`);

  const getInstructionSteps = () => ['setEnvironmentVariable', 'checkVersion', 'restartService', 'checkDockerConfig'];

  const renderInstruction = (step: string) => {
    if (step === 'setEnvironmentVariable') {
      return (
        <>
          {t('instructions.setEnvironmentVariable.before')}
          <EuiCode>SEARCH_ENABLED=True</EuiCode>
          {t('instructions.setEnvironmentVariable.after')}
        </>
      );
    } else {
      return t(`instructions.${step}`);
    }
  };

  return (
    <EuiCallOut title={t('title')} color="warning" iconType="alert" data-testid={`backend-unavailable-${featureType}`}>
      <EuiText size="s">
        <ul>
          {getInstructionSteps().map((step, index) => (
            <li key={index}>{renderInstruction(step)}</li>
          ))}
        </ul>
      </EuiText>

      <EuiSpacer size="s" />

      <EuiText size="s" color="subdued">
        {t('documentation')}
      </EuiText>

      {onRetry && (
        <>
          <EuiSpacer size="m" />
          <EuiButton size="s" onClick={onRetry} data-testid={`retry-${featureType}-backend`}>
            {t('retryButton')}
          </EuiButton>
        </>
      )}
    </EuiCallOut>
  );
};
