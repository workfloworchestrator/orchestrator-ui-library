import React, { ReactNode, useState } from 'react';

import { EuiButtonGroup, EuiPopover } from '@elastic/eui';

import { WfoChevronDown, WfoPencilAlt } from '@/icons';

interface WfoDropdownButtonProps {
  label: string;
  isDisabled?: boolean;
  children: ReactNode;
}

export const WfoDropdownButton = ({ label, isDisabled = false, children }: WfoDropdownButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPopoverOpen, setPopoverOpen] = useState(false);

  const buttonOptions = [
    {
      id: 'id_1',
      label: label,
      iconType: () => <WfoPencilAlt color="currentColor" />,
      style: {
        textDecoration: isHovered && 'underline',
      },
    },
    {
      id: 'id_2',
      label: '',
      iconType: () => <WfoChevronDown color="currentColor" />,
      onMouseEnter: () => setIsHovered(true),
      onMouseLeave: () => setIsHovered(false),
    },
  ];

  const onButtonClick = () => {
    setPopoverOpen(!isPopoverOpen);
  };

  const closePopover = () => {
    setPopoverOpen(false);
  };

  return (
    <EuiPopover
      ownFocus
      button={
        <EuiButtonGroup
          type={'multi'}
          idToSelectedMap={{
            [buttonOptions[0].id]: true,
            [buttonOptions[1].id]: true,
          }}
          color={'primary'}
          buttonSize={'m'}
          legend={'Buttons'}
          options={buttonOptions}
          onChange={onButtonClick}
          isDisabled={isDisabled}
        />
      }
      isOpen={isPopoverOpen}
      closePopover={closePopover}
      anchorPosition="downRight"
    >
      {children}
    </EuiPopover>
  );
};
