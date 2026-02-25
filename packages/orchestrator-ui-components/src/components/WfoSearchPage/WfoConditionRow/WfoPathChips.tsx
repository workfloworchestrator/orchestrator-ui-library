import React, { FC } from 'react';

import { EuiIcon } from '@elastic/eui';

import { WfoBadge, WfoToolTip } from '@/components';
import { useOrchestratorTheme } from '@/hooks';

import { getTypeColor } from '../utils';

interface WfoPathChipsProps {
  fullPath: string;
  label: string;
  fieldType?: string;
  isAnyPath?: boolean;
}

export const WfoPathChips: FC<WfoPathChipsProps> = ({ fullPath, label, fieldType, isAnyPath = false }) => {
  const { theme } = useOrchestratorTheme();

  // For "Any path" case, just show the label
  if (isAnyPath) {
    return (
      <WfoToolTip tooltipContent={label}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: `${theme.size.xs} ${theme.size.s} ${theme.size.xs} 0`,
            textDecoration: 'none',
            width: '100%',
            boxSizing: 'border-box',
            minHeight: theme.size.xl,
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: theme.size.xs,
              alignItems: 'center',
              flexWrap: 'nowrap',
              textDecoration: 'none',
              marginRight: theme.size.s,
              flex: 1,
              overflow: 'visible',
            }}
          >
            <div
              style={{
                textDecoration: 'none',
                borderBottom: 'none',
              }}
            >
              <WfoBadge color="primary" textColor={theme.colors.textGhost} size="xs">
                <span
                  style={{
                    textDecoration: 'none',
                    borderBottom: 'none',
                    outline: 'none',
                    textDecorationLine: 'none',
                    textDecorationColor: 'transparent',
                  }}
                >
                  {label}
                </span>
              </WfoBadge>
            </div>
          </div>
          {fieldType && (
            <div style={{ flexShrink: 0 }}>
              <WfoBadge color={getTypeColor(fieldType, theme)} textColor={theme.colors.textInk} size="xs">
                <span style={{ textDecoration: 'none' }}>{fieldType}</span>
              </WfoBadge>
            </div>
          )}
        </div>
      </WfoToolTip>
    );
  }

  // Extract the last two meaningful segments from the full path
  const completePath = fullPath || label;
  const allSegments = completePath
    .split('.')
    .filter((segment) => segment && !segment.match(/^\d+$/) && !segment.includes('('));

  // Only show the last two segments
  const pathSegments = allSegments.slice(-2);

  return (
    <WfoToolTip tooltipContent={completePath}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: `${theme.size.xs} ${theme.size.s} ${theme.size.xs} 0`,
          textDecoration: 'none',
          width: '100%',
          boxSizing: 'border-box',
          minHeight: theme.size.xl,
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: theme.size.xs,
            alignItems: 'center',
            flexWrap: 'nowrap',
            textDecoration: 'none',
            marginRight: theme.size.s,
            flex: 1,
            overflow: 'visible',
          }}
        >
          {pathSegments.map((segment, index) =>
            [
              <div
                key={`segment-${index}`}
                style={{
                  textDecoration: 'none',
                  borderBottom: 'none',
                }}
              >
                <WfoBadge color="primary" textColor={theme.colors.textGhost} size="xs">
                  <span
                    style={{
                      textDecoration: 'none',
                      borderBottom: 'none',
                      outline: 'none',
                      textDecorationLine: 'none',
                      textDecorationColor: 'transparent',
                    }}
                  >
                    {segment}
                  </span>
                </WfoBadge>
              </div>,
              index < pathSegments.length - 1 && (
                <EuiIcon
                  key={`arrow-${index}`}
                  type="arrowRight"
                  size="s"
                  color={theme.colors.backgroundBaseDisabled}
                  title=""
                  style={{
                    flexShrink: 0,
                    marginTop: '1px',
                  }}
                />
              ),
            ].filter(Boolean),
          )}
        </div>
        {fieldType && (
          <div style={{ flexShrink: 0 }}>
            <WfoBadge color={getTypeColor(fieldType, theme)} textColor={theme.colors.textInk} size="xs">
              <span style={{ textDecoration: 'none' }}>{fieldType}</span>
            </WfoBadge>
          </div>
        )}
      </div>
    </WfoToolTip>
  );
};
