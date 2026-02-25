import React, { useState } from 'react';

import { EuiButtonEmpty, EuiFlexGroup, EuiPopover, EuiRadioGroup } from '@elastic/eui';
import { EuiRadioGroupOption } from '@elastic/eui/src/components/form/radio/radio_group';

export interface WfoRadioDropdownProps<T> {
  options: WfoRadioDropdownOption<T>[];
  selectedOption: WfoRadioDropdownOption<T>;
  onUpdateOption: (value: WfoRadioDropdownOption<T>) => void;
}

export type WfoRadioDropdownOption<T> = {
  label: string;
  id: string;
  value: T;
};

export const WfoRadioDropdown = <T,>({ options, onUpdateOption, selectedOption }: WfoRadioDropdownProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    if (isOpen) {
      setIsOpen(false);
    }
  };
  const handleSelectRadio = (id: string) => {
    const updatedOption = options.find((option) => option.id === id);
    setTimeout(handleClose, 100);
    if (updatedOption) {
      onUpdateOption(updatedOption);
    }
  };

  const buttonLabel = options.find((option) => option.id === selectedOption.id)?.label;
  const radioGroupOptions: EuiRadioGroupOption[] = options.map((option) => ({
    id: option.id,
    label: option.label,
  }));

  return (
    <EuiFlexGroup gutterSize="s" alignItems="center" justifyContent="flexEnd">
      <EuiPopover
        button={
          <EuiButtonEmpty
            size="s"
            iconType="arrowDown"
            iconSide="right"
            onClick={() => {
              setIsOpen((isOpen) => !isOpen);
            }}
            css={{
              '&:focus': {
                backgroundColor: 'transparent',
                textDecoration: 'none',
              },
            }}
          >
            {buttonLabel}
          </EuiButtonEmpty>
        }
        isOpen={isOpen}
        closePopover={handleClose}
        anchorPosition="downLeft"
      >
        <EuiRadioGroup options={radioGroupOptions} idSelected={selectedOption.id} onChange={handleSelectRadio} />
      </EuiPopover>
    </EuiFlexGroup>
  );
};
