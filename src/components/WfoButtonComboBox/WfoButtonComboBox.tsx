import React, { FC, useEffect, useState } from 'react';

import { EuiPopover, EuiSelectable, EuiSelectableOption, EuiSpacer, EuiText } from '@elastic/eui';

import { getWfoButtonComboBoxStyles } from '@/components/WfoButtonComboBox/styles';
import { useWithOrchestratorTheme } from '@/hooks';

export type WfoStartButtonComboBoxProps = {
  options: EuiSelectableOption[];
  onOptionChange: (selectedOption: EuiSelectableOption) => void;
  title?: string;
  children: (togglePopover: () => void) => React.ReactElement;
  className?: string;
};

export const WfoButtonComboBox: FC<WfoStartButtonComboBoxProps> = ({
  options,
  onOptionChange,
  title,
  children,
  className,
}) => {
  const [isPopoverOpen, setPopoverOpen] = useState(false);
  const [optionsState, setOptionsState] = useState<EuiSelectableOption[]>(options);

  const { selectableStyle, titleStyle } = useWithOrchestratorTheme(getWfoButtonComboBoxStyles);

  useEffect(() => {
    if (!isPopoverOpen) {
      setOptionsState(options);
    }
  }, [isPopoverOpen, options]);

  return (
    <EuiPopover
      initialFocus={`.euiSelectable .euiFieldSearch`}
      button={children(() => setPopoverOpen(!isPopoverOpen))}
      isOpen={isPopoverOpen}
      closePopover={() => setPopoverOpen(false)}
    >
      {title && (
        <>
          <EuiText size="s" css={titleStyle}>
            {title}
          </EuiText>
          <EuiSpacer size="s"></EuiSpacer>
        </>
      )}
      <EuiSelectable
        className={className}
        css={selectableStyle}
        options={optionsState}
        searchable
        // EUI 122 renders a checkbox indicator for unselected options in multi-select
        // EuiSelectables; EUI 113 rendered an `empty` icon, i.e. nothing visible.
        listProps={{ showIcons: false }}
        onChange={(options, _, changedOption) => {
          onOptionChange(changedOption);
          setOptionsState(options);
        }}
        height={200}
      >
        {(list, search) => (
          <>
            {search}
            <EuiSpacer size="s" />
            {list}
          </>
        )}
      </EuiSelectable>
    </EuiPopover>
  );
};
