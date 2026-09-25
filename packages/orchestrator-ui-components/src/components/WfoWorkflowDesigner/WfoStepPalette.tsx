import React, { FC, useMemo, useState } from 'react';

import { useTranslations } from 'next-intl';

import {
  EuiBadge,
  EuiButtonEmpty,
  EuiButtonIcon,
  EuiDraggable,
  EuiDroppable,
  EuiFieldSearch,
  EuiFlexGroup,
  EuiFlexItem,
  EuiPanel,
  EuiSelect,
  EuiSpacer,
  EuiSwitch,
  EuiText,
  EuiTitle,
  EuiToolTip,
} from '@elastic/eui';

import { useWithOrchestratorTheme } from '@/hooks';
import { WorkflowDesignerPaletteStatus, WorkflowDesignerStep } from '@/types';

import { getWorkflowDesignerStyles } from './styles';
import {
  PALETTE_DRAGGABLE_PREFIX,
  PALETTE_DROPPABLE_ID,
  PaletteFilter,
  filterPaletteSteps,
  stepCategories,
} from './utils';

// Rendering hundreds of draggables makes dragging sluggish; the search narrows the list down instead.
const PAGE_SIZE = 50;

const STATUS_COLOR: Record<WorkflowDesignerPaletteStatus['status'], string> = {
  ok: 'success',
  warning: 'warning',
  needs_form: 'primary',
  incompatible: 'danger',
  unusable: 'default',
};

export type WfoStepPaletteProps = {
  steps: WorkflowDesignerStep[];
  palette: Record<string, WorkflowDesignerPaletteStatus> | null;
  onAdd: (step: WorkflowDesignerStep) => void;
  onSelect: (step: WorkflowDesignerStep) => void;
  onVisibleStepsChange: (steps: WorkflowDesignerStep[]) => void;
};

export const isInsertable = (status?: WorkflowDesignerPaletteStatus) =>
  !status || ['ok', 'warning', 'needs_form'].includes(status.status);

export const WfoStepPalette: FC<WfoStepPaletteProps> = ({ steps, palette, onAdd, onSelect, onVisibleStepsChange }) => {
  const t = useTranslations('workflowDesigner.palette');
  const { paletteItemStyle, disabledPaletteItemStyle, scrollAreaStyle, monospaceStyle } =
    useWithOrchestratorTheme(getWorkflowDesignerStyles);

  const [filter, setFilter] = useState<PaletteFilter>({
    search: '',
    category: '',
    showUnusable: false,
    showSubscriptionWriters: false,
  });
  const [onlyCompatible, setOnlyCompatible] = useState(false);
  const [limit, setLimit] = useState(PAGE_SIZE);

  const categories = useMemo(() => stepCategories(steps), [steps]);
  const filtered = useMemo(
    () =>
      filterPaletteSteps(steps, filter).filter(
        (step) => !onlyCompatible || ['ok', 'warning'].includes(palette?.[step.id]?.status ?? 'ok'),
      ),
    [steps, filter, onlyCompatible, palette],
  );
  const visible = useMemo(() => filtered.slice(0, limit), [filtered, limit]);

  // The drag result only carries an index into what is rendered, so the parent needs the same list.
  React.useEffect(() => onVisibleStepsChange(visible), [visible, onVisibleStepsChange]);

  const updateFilter = (update: Partial<PaletteFilter>) => {
    setFilter((previous) => ({ ...previous, ...update }));
    setLimit(PAGE_SIZE);
  };

  return (
    <EuiPanel hasBorder paddingSize="m">
      <EuiTitle size="xs">
        <h3>{t('title')}</h3>
      </EuiTitle>
      <EuiText size="xs" color="subdued">
        {t('help')}
      </EuiText>
      <EuiSpacer size="s" />
      <EuiFieldSearch
        placeholder={t('search')}
        value={filter.search}
        onChange={(event) => updateFilter({ search: event.target.value })}
        fullWidth
        compressed
      />
      <EuiSpacer size="s" />
      <EuiSelect
        compressed
        fullWidth
        value={filter.category}
        onChange={(event) => updateFilter({ category: event.target.value })}
        options={[{ value: '', text: t('allCategories') }, ...categories.map((value) => ({ value, text: value }))]}
      />
      <EuiSpacer size="s" />
      <EuiSwitch
        compressed
        label={t('onlyCompatible')}
        checked={onlyCompatible}
        onChange={(e) => setOnlyCompatible(e.target.checked)}
      />
      <EuiSpacer size="xs" />
      <EuiSwitch
        compressed
        label={t('showSubscriptionWriters')}
        checked={filter.showSubscriptionWriters}
        onChange={(event) => updateFilter({ showSubscriptionWriters: event.target.checked })}
      />
      <EuiSpacer size="xs" />
      <EuiSwitch
        compressed
        label={t('showUnusable')}
        checked={filter.showUnusable}
        onChange={(event) => updateFilter({ showUnusable: event.target.checked })}
      />
      <EuiSpacer size="s" />
      <EuiText size="xs" color="subdued">
        {t('count', { shown: visible.length, total: filtered.length })}
      </EuiText>
      <EuiSpacer size="s" />
      <div css={scrollAreaStyle}>
        <EuiDroppable droppableId={PALETTE_DROPPABLE_ID} cloneDraggables spacing="s">
          {visible.map((step, index) => {
            const status = palette?.[step.id];
            const insertable = step.usable && isInsertable(status);
            return (
              <EuiDraggable
                key={step.id}
                index={index}
                draggableId={`${PALETTE_DRAGGABLE_PREFIX}${step.id}`}
                spacing="s"
                isDragDisabled={!insertable}
                hasInteractiveChildren
              >
                <EuiPanel
                  paddingSize="none"
                  hasBorder
                  css={[paletteItemStyle, !insertable && disabledPaletteItemStyle]}
                >
                  <EuiFlexGroup gutterSize="s" alignItems="center" responsive={false}>
                    <EuiFlexItem css={{ minWidth: 0 }}>
                      <EuiText size="s">
                        <strong>{step.name}</strong>
                      </EuiText>
                      <EuiText size="xs" color="subdued" css={monospaceStyle}>
                        {step.kind === 'helper' ? t('helper') : step.id}
                      </EuiText>
                      <EuiFlexGroup gutterSize="xs" wrap responsive={false}>
                        {status && (
                          <EuiFlexItem grow={false}>
                            <EuiToolTip content={status.message || t(`status.${status.status}`)}>
                              <EuiBadge color={STATUS_COLOR[status.status]}>{t(`status.${status.status}`)}</EuiBadge>
                            </EuiToolTip>
                          </EuiFlexItem>
                        )}
                        {step.writes_subscription && (
                          <EuiFlexItem grow={false}>
                            <EuiBadge color="warning">{t('writesSubscription')}</EuiBadge>
                          </EuiFlexItem>
                        )}
                        {step.pauses && (
                          <EuiFlexItem grow={false}>
                            <EuiBadge color="hollow">{t('pauses')}</EuiBadge>
                          </EuiFlexItem>
                        )}
                      </EuiFlexGroup>
                    </EuiFlexItem>
                    <EuiFlexItem grow={false}>
                      <EuiButtonIcon iconType="info" aria-label={t('details')} onClick={() => onSelect(step)} />
                      <EuiButtonIcon
                        iconType="plusInCircle"
                        aria-label={t('add')}
                        isDisabled={!insertable}
                        onClick={() => onAdd(step)}
                      />
                    </EuiFlexItem>
                  </EuiFlexGroup>
                </EuiPanel>
              </EuiDraggable>
            );
          })}
        </EuiDroppable>
        {filtered.length > visible.length && (
          <EuiButtonEmpty size="s" onClick={() => setLimit(limit + PAGE_SIZE)}>
            {t('showMore')}
          </EuiButtonEmpty>
        )}
      </div>
    </EuiPanel>
  );
};
