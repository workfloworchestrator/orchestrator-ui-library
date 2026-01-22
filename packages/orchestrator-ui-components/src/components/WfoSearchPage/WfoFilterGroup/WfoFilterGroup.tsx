import React, { FC } from 'react';

import { useTranslations } from 'next-intl';

import {
    EuiButton,
    EuiButtonIcon,
    EuiCallOut,
    EuiCode,
    EuiFlexGroup,
    EuiFlexItem,
    EuiPanel,
    EuiSpacer,
    EuiText,
} from '@elastic/eui';

import { WfoToolTip } from '@/components';
import { isCondition } from '@/components/WfoSearchPage/utils';
import { useOrchestratorTheme } from '@/hooks';
import { Condition, EntityKind, Group } from '@/types';

import { ConditionRow } from '../WfoConditionRow';

interface FilterGroupProps {
    group: Group;
    entityType: EntityKind;
    onChange: (group: Group) => void;
    onRemove?: () => void;
    depth?: number;
    isRoot?: boolean;
}

export const FilterGroup: FC<FilterGroupProps> = ({
    group,
    entityType,
    onChange,
    onRemove,
    depth = 0,
    isRoot = false,
}) => {
    const t = useTranslations('search.page');

    const { theme } = useOrchestratorTheme();
    const MAX_DEPTH = 5;
    const canAddGroup = depth < MAX_DEPTH;

    const addCondition = () => {
        const newCondition: Condition = {
            path: '',
            condition: { op: '', value: undefined },
        };
        onChange({
            ...group,
            children: [...group.children, newCondition],
        });
    };

    const addGroup = () => {
        if (!canAddGroup) return;

        const newGroup: Group = {
            op: 'AND',
            children: [],
        };
        onChange({
            ...group,
            children: [...group.children, newGroup],
        });
    };

    const updateChild = (index: number, child: Group | Condition) => {
        const newChildren = [...group.children];
        newChildren[index] = child;
        onChange({
            ...group,
            children: newChildren,
        });
    };

    const removeChild = (index: number) => {
        onChange({
            ...group,
            children: group.children.filter((_, i) => i !== index),
        });
    };

    const toggleOperator = () => {
        onChange({
            ...group,
            op: group.op === 'AND' ? 'OR' : 'AND',
        });
    };

    return (
        <EuiPanel
            paddingSize="m"
            color={depth % 2 === 0 ? 'primary' : 'plain'}
            hasBorder
        >
            <EuiFlexGroup
                gutterSize="s"
                alignItems="center"
                justifyContent="spaceBetween"
            >
                <EuiFlexItem grow={false}>
                    <EuiFlexGroup gutterSize="s" alignItems="center">
                        <EuiFlexItem grow={false}>
                            <EuiText size="s">
                                <strong>{t('groupLabel')}</strong>
                            </EuiText>
                        </EuiFlexItem>
                        <EuiFlexItem grow={false}>
                            <EuiButton
                                size="s"
                                fill={true}
                                color="primary"
                                onClick={toggleOperator}
                            >
                                {group.op}
                            </EuiButton>
                        </EuiFlexItem>
                    </EuiFlexGroup>
                </EuiFlexItem>

                <EuiFlexItem grow={false}>
                    <EuiFlexGroup gutterSize="s" alignItems="center">
                        <EuiFlexItem grow={false}>
                            <EuiButton
                                size="s"
                                iconType="plusInCircle"
                                onClick={addCondition}
                            >
                                {t('addCondition')}
                            </EuiButton>
                        </EuiFlexItem>
                        <EuiFlexItem grow={false}>
                            <WfoToolTip
                                tooltipContent={
                                    !canAddGroup
                                        ? t('maxNestingDepth')
                                        : t('addNestedGroup')
                                }
                            >
                                <EuiButton
                                    size="s"
                                    iconType="nested"
                                    onClick={addGroup}
                                    disabled={!canAddGroup}
                                >
                                    {t('addGroup')}
                                </EuiButton>
                            </WfoToolTip>
                        </EuiFlexItem>
                        {!isRoot && onRemove && (
                            <EuiFlexItem grow={false}>
                                <EuiButtonIcon
                                    iconType="trash"
                                    color="danger"
                                    onClick={onRemove}
                                    aria-label={t('removeGroup')}
                                />
                            </EuiFlexItem>
                        )}
                    </EuiFlexGroup>
                </EuiFlexItem>
            </EuiFlexGroup>

            {group.children.length > 0 && (
                <>
                    <EuiSpacer size="m" />
                    <EuiPanel
                        paddingSize={isRoot ? 'none' : 's'}
                        color="transparent"
                        hasShadow={false}
                    >
                        {group.children.map((child, index) => (
                            <div key={index}>
                                {index > 0 && (
                                    <EuiFlexGroup
                                        gutterSize="none"
                                        alignItems="center"
                                        justifyContent="center"
                                    >
                                        <EuiFlexItem grow={false}>
                                            <EuiText
                                                size="s"
                                                color={theme.colors.textSubdued}
                                                textAlign="center"
                                            >
                                                <EuiCode>{group.op}</EuiCode>
                                            </EuiText>
                                        </EuiFlexItem>
                                    </EuiFlexGroup>
                                )}
                                <EuiSpacer size="s" />
                                {isCondition(child) ? (
                                    <ConditionRow
                                        condition={child}
                                        entityType={entityType}
                                        onChange={(newCondition) =>
                                            updateChild(index, newCondition)
                                        }
                                        onRemove={() => removeChild(index)}
                                    />
                                ) : (
                                    <FilterGroup
                                        group={child}
                                        entityType={entityType}
                                        onChange={(newGroup) =>
                                            updateChild(index, newGroup)
                                        }
                                        onRemove={() => removeChild(index)}
                                        depth={depth + 1}
                                    />
                                )}
                                <EuiSpacer size="s" />
                            </div>
                        ))}
                    </EuiPanel>
                </>
            )}

            {group.children.length === 0 && (
                <>
                    <EuiSpacer size="s" />
                    <EuiCallOut
                        title={t('emptyGroupTitle')}
                        color="primary"
                        iconType="info"
                        size="s"
                    >
                        <p>{t('emptyGroupDescription')}</p>
                    </EuiCallOut>
                </>
            )}
        </EuiPanel>
    );
};
