import React, { FC, HTMLAttributeAnchorTarget } from 'react';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { useWithOrchestratorTheme } from '@/hooks';

import { getMenuItemStyles } from './styles';

type WfoMenuItemLinkProps = {
  path: string;
  target?: HTMLAttributeAnchorTarget;
  translationString: string;
  isSelected?: boolean;
  isSubItem?: boolean;
  hasSubItems?: boolean;
};

export const WfoMenuItemLink: FC<WfoMenuItemLinkProps> = ({
  path,
  target,
  translationString,
  isSelected,
  isSubItem,
  hasSubItems,
}) => {
  const { menuItemStyle, selectedMenuItem, selectedSubMenuItem, subMenuHeaderStyle, subMenuItemStyle } =
    useWithOrchestratorTheme(getMenuItemStyles);

  const getMenuItemStyle = () => {
    if (isSubItem) {
      return isSelected ? selectedSubMenuItem : subMenuItemStyle;
    } else if (isSelected && hasSubItems) {
      return subMenuHeaderStyle;
    } else {
      return isSelected ? selectedMenuItem : menuItemStyle;
    }
  };

  const t = useTranslations('main');

  // This is a workaround to use the translation string as the link text if it's not found in the translation file.
  const linkText = t(translationString) === `main.${translationString}` ? translationString : t(translationString);
  return (
    <Link css={getMenuItemStyle()} href={path} target={target}>
      {linkText}
    </Link>
  );
};
