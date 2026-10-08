import React from 'react';

import { EuiHealth } from '@elastic/eui';

import { useOrchestratorTheme } from '@/hooks/useOrchestratorTheme';
import { WfoCheckmarkCircleFill } from '@/icons';
import { toPercentage } from '@/utils';

export const mapScoreToHealthColor = (score: number): 'success' | 'warning' | 'subdued' => {
  if (score >= 0.8) return 'success';
  if (score >= 0.5) return 'warning';
  return 'subdued';
};

export const WfoConfidenceScore = ({ score, fullyConfident }: { score?: number; fullyConfident?: boolean }) => {
  const { theme } = useOrchestratorTheme();

  if (score === undefined) {
    return <>-</>;
  }

  if (fullyConfident) {
    return <WfoCheckmarkCircleFill height={20} width={20} color={theme.colors.success} />;
  }

  return <EuiHealth color={mapScoreToHealthColor(score)}>{toPercentage(score, 0)}</EuiHealth>;
};
