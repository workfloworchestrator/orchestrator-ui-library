import React from 'react';
import type { CombinatorSelectorProps } from 'react-querybuilder';

import { EuiButtonGroup } from '@elastic/eui';

import { getWfoStructuredSearchTableStyles } from '@/components/WfoTable/WfoStructuredSearchTable/styles';
import { useWithOrchestratorTheme } from '@/hooks';

export const WfoCombinatorSelector = (props: CombinatorSelectorProps) => {
  const { buttonGroupStyles } = useWithOrchestratorTheme(getWfoStructuredSearchTableStyles);
  const options = props.options.map((option) => ({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore This seems to be a typing error in the react-querybuilde library. Option.name does exist
    id: option.name,
    label: option.label,
  }));

  return (
    <EuiButtonGroup
      css={buttonGroupStyles}
      legend="Combinator"
      type="single"
      options={options}
      idSelected={props.value || options[0].id}
      onChange={(id) => props.handleOnChange(id)}
      buttonSize="m"
      color="primary"
    />
  );
};
