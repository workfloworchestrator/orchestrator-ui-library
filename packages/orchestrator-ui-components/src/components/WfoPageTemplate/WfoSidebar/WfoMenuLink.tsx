import React, { FC } from 'react';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { useWithOrchestratorTheme } from '@/hooks';

import { getMenuItemStyles } from './styles';

type WfoMenuItemLinkProps = {
    path: string;
    translationString: string;
    isSelected: boolean;
    isSubItem?: boolean;
};

export const WfoMenuItemLink: FC<WfoMenuItemLinkProps> = ({
    path,
    translationString,
    isSelected,
    isSubItem,
}) => {
    const {
        menuItemStyle,
        selectedMenuItem,
        selectedSubMenuItem,
        subMenuItemStyle,
    } = useWithOrchestratorTheme(getMenuItemStyles);

    const getMenuItemStyle = () => {
        if (isSubItem) {
            return isSelected ? selectedSubMenuItem : subMenuItemStyle;
        } else {
            return isSelected ? selectedMenuItem : menuItemStyle;
        }
    };

    const t = useTranslations('main');
    return (
        <Link css={getMenuItemStyle()} href={path}>
            {t(translationString)}
        </Link>
    );
};
