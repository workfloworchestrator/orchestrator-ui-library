import React, { FC, useState } from 'react';

import { EuiButtonEmpty } from '@elastic/eui';

import { ProductLifecycleStatus } from '@/types';

import { WfoProductStatusBadge } from '../WfoBadges';
import { WfoPopover } from '../WfoPopover';

interface WfoMetadataStatusFieldProps {
  onSave: (updatedStatus: ProductLifecycleStatus) => void;
  currentStatus: ProductLifecycleStatus;
}

export const WfoMetadataStatusField: FC<WfoMetadataStatusFieldProps> = ({ onSave, currentStatus }) => {
  const [isPopoverOpen, setPopover] = useState<boolean>(false);
  const onButtonClick = () => setPopover(!isPopoverOpen);
  const button = (
    <EuiButtonEmpty iconType="arrowDown" iconSide="right" onClick={onButtonClick} color={'text'}>
      <WfoProductStatusBadge status={currentStatus} />
    </EuiButtonEmpty>
  );

  const handleOnSelectOption = (updatedStatus: ProductLifecycleStatus) => {
    setPopover(false);
    onSave(updatedStatus);
  };

  const setNewStatusBadges = () =>
    Object.values(ProductLifecycleStatus).map((productStatus) => (
      <EuiButtonEmpty onClick={() => handleOnSelectOption(productStatus)}>
        <WfoProductStatusBadge status={productStatus} />
      </EuiButtonEmpty>
    ));

  return (
    <WfoPopover
      id={'productStatusPopover'}
      isLoading={false}
      button={button}
      isPopoverOpen={isPopoverOpen}
      closePopover={() => setPopover(false)}
      PopoverContent={setNewStatusBadges}
    />
  );
};

export default WfoMetadataStatusField;
