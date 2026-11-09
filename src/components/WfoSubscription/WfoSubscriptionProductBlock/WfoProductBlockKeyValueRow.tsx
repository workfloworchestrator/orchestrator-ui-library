import React, { FC } from 'react';

import { EuiBadge } from '@elastic/eui';

import { useSubscriptionDetailValueOverride } from '@/components';
import { useWithOrchestratorTheme } from '@/hooks';
import { FieldValue, RenderableFieldValue } from '@/types';
import { camelToHuman } from '@/utils';

import { getStyles } from './styles';

export const KEY_CELL_CLASS_NAME = 'key-cell';
export const VALUE_CELL_CLASS_NAME = 'value-cell';

export type WfoProductBlockKeyValueRowProps = {
  fieldValue: FieldValue | RenderableFieldValue;
  allFieldValues: FieldValue[] | RenderableFieldValue[];
  className?: string;
};

export const WfoProductBlockKeyValueRow: FC<WfoProductBlockKeyValueRowProps> = ({
  fieldValue,
  allFieldValues,
  className,
}) => {
  const { leftColumnStyle, rowStyle } = useWithOrchestratorTheme(getStyles);
  const { getOverriddenValue } = useSubscriptionDetailValueOverride();

  const { field, value } = fieldValue;

  const WfoProductBlockValue: FC<{
    value: RenderableFieldValue['value'];
  }> = ({ value }) => {
    if (typeof value === 'boolean') {
      return <EuiBadge>{value.toString()}</EuiBadge>;
    } else if (Array.isArray(value)) {
      const result = value.join(', ');
      return <>{result}</>;
    } else {
      return <>{value}</>;
    }
  };

  return (
    <tr className={className} css={rowStyle}>
      <td className={KEY_CELL_CLASS_NAME} css={leftColumnStyle}>
        <b>{camelToHuman(field)}</b>
      </td>
      <td className={VALUE_CELL_CLASS_NAME}>
        {getOverriddenValue(fieldValue, allFieldValues) ?? <WfoProductBlockValue value={value} />}
      </td>
    </tr>
  );
};
