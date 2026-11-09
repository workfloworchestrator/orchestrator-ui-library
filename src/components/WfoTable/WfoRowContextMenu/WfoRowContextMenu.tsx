import React, { FC, useEffect, useRef, useState } from 'react';

import { EuiButtonIcon, EuiContextMenu, EuiContextMenuPanelDescriptor, EuiPopover } from '@elastic/eui';

import { WfoDotsHorizontal } from '@/icons/WfoDotsHorizontal';

export type WfoRowContextMenuProps = {
  items: EuiContextMenuPanelDescriptor[];
  onOpenContextMenu?: () => void;
};

export const WfoRowContextMenu: FC<WfoRowContextMenuProps> = ({ items, onOpenContextMenu }) => {
  const [isOpen, setIsOpen] = useState(false);

  const onOpenContextMenuRef = useRef(onOpenContextMenu);

  useEffect(() => {
    if (isOpen) {
      onOpenContextMenuRef.current?.();
    }
  }, [isOpen, onOpenContextMenuRef]);

  const closePopover = () => setIsOpen(false);
  const togglePopover = () => setIsOpen(!isOpen);

  return (
    <EuiPopover
      button={
        <EuiButtonIcon iconType={() => <WfoDotsHorizontal />} onClick={togglePopover} aria-label="Row context menu" />
      }
      isOpen={isOpen}
      closePopover={closePopover}
      panelPaddingSize="none"
      anchorPosition="leftUp"
    >
      <EuiContextMenu initialPanelId={0} panels={items} onClick={closePopover} />
    </EuiPopover>
  );
};
