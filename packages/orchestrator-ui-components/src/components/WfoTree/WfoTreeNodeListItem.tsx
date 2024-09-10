import React, { useContext } from 'react';

import { useTranslations } from 'next-intl';

import {
    EuiButtonIcon,
    EuiFlexGroup,
    EuiFlexItem,
    EuiText,
    EuiTextTruncate,
} from '@elastic/eui';

import { getStyles } from '@/components/WfoTree/styles';
import { TreeContext, TreeContextType } from '@/contexts';
import { useOrchestratorTheme, useWithOrchestratorTheme } from '@/hooks';
import { WfoXMarkSmall } from '@/icons/WfoXMarkSmall';
import { TreeBlock } from '@/types';

interface WfoTreeNodeListItemProps {
    item: TreeBlock;
    selected: boolean;
}

export const WfoTreeNodeListItem = ({
    item,
    selected,
}: WfoTreeNodeListItemProps) => {
    const t = useTranslations('common');
    const { toggleSelectedId } = useContext(TreeContext) as TreeContextType;
    const { theme } = useOrchestratorTheme();
    const { selectedTreeItemStyle, treeItemStyle } =
        useWithOrchestratorTheme(getStyles);

    const { isOutsideCurrentSubscription, id, label } = item;
    const textLabel = label.toString();

    return (
        <EuiFlexGroup
            alignItems="center"
            css={
                selected
                    ? selectedTreeItemStyle(isOutsideCurrentSubscription)
                    : treeItemStyle(isOutsideCurrentSubscription)
            }
            onClick={() => toggleSelectedId(id)}
            gutterSize="xs"
            justifyContent="spaceBetween"
        >
            <EuiFlexItem>
                <EuiText title={textLabel}>
                    <EuiTextTruncate text={textLabel} />
                </EuiText>
            </EuiFlexItem>
            <EuiFlexItem css={{ maxWidth: theme.size.l }}>
                <EuiButtonIcon
                    color="primary"
                    iconType={() => <WfoXMarkSmall color="currentColor" />}
                    size="xs"
                    aria-label={t('deselect')}
                    css={{ display: selected ? 'block' : 'none' }}
                />
            </EuiFlexItem>
        </EuiFlexGroup>
    );
};
