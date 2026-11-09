import React, { FC } from 'react';

import { useTranslations } from 'next-intl';

import { EuiButton, EuiFlexGroup, EuiFlexItem, EuiFormRow, EuiText } from '@elastic/eui';

import { WfoToolTip } from '@/components';
import { useOrchestratorTheme } from '@/hooks';

import { getButtonColor, getButtonFill, getOperatorDisplay } from '../utils';
import { OperatorSelectorProps } from './types';

export const WfoOperatorSelector: FC<OperatorSelectorProps> = ({ selectedPathInfo, condition, onOperatorChange }) => {
  const t = useTranslations('search.page');
  const { theme } = useOrchestratorTheme();

  return (
    <EuiFormRow label={t('operatorLabel')}>
      <EuiFlexGroup gutterSize="xs" wrap>
        {selectedPathInfo?.operators?.map((operator) => {
          const { symbol, description } = getOperatorDisplay(operator, selectedPathInfo);

          const tooltipContent =
            operator === 'like' ?
              <div>
                <strong>{description}</strong>
                <br />
                <br />
                <strong>Wildcards:</strong>
                <br />• <code>%</code> matches any number of characters
                <br />• <code>_</code> matches exactly one character
                <br />
                <br />
                <strong>Examples:</strong>
                <br />• <code>%test%</code> finds anything containing "test"
                <br />• <code>test%</code> finds anything starting with "test"
                <br />• <code>test_</code> finds "test" + one character
              </div>
            : description;

          return (
            <EuiFlexItem key={operator} grow={false}>
              <WfoToolTip tooltipContent={tooltipContent}>
                <EuiButton
                  size="s"
                  color={getButtonColor(operator, selectedPathInfo, condition)}
                  fill={getButtonFill(operator, selectedPathInfo, condition)}
                  onClick={() => onOperatorChange(operator)}
                  style={{
                    minWidth: theme.size.xxl,
                    fontSize: theme.size.base,
                    fontWeight: theme.font.weight.bold,
                  }}
                >
                  {symbol}
                </EuiButton>
              </WfoToolTip>
            </EuiFlexItem>
          );
        })}
        {(!selectedPathInfo || selectedPathInfo.operators.length === 0) && (
          <EuiFlexItem grow={false}>
            <EuiText size="s" color={theme.colors.textSubdued}>
              {t('selectFieldFirst')}
            </EuiText>
          </EuiFlexItem>
        )}
      </EuiFlexGroup>
    </EuiFormRow>
  );
};
