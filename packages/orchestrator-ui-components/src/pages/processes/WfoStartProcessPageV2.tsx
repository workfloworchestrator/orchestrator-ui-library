import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import {
  PydanticComponentMatcher,
  PydanticFormFieldType,
  type PydanticFormFooterProps,
  type PydanticFormHeaderProps,
  type RowRenderComponent,
} from 'pydantic-forms';

import {
  EuiButton,
  EuiButtonEmpty,
  EuiFlexGroup,
  EuiFormErrorText,
  EuiFormLabel,
  EuiHorizontalRule,
  EuiIcon,
  EuiLink,
  EuiPanel,
  EuiSpacer,
  EuiText,
  EuiTitle,
  euiFontSizeFromScale,
  euiLineHeightFromBaseline,
  useIsWithinBreakpoints,
} from '@elastic/eui';
import { css } from '@emotion/react';

import { PATH_TASKS, PATH_WORKFLOWS, WfoTitleWithWebsocketBadge } from '@/components';
import { WfoContentHeader } from '@/components/WfoContentHeader/WfoContentHeader';
import { FormLayoutV2Context, FormPageFieldsV2Context, WfoPydanticForm } from '@/components/WfoPydanticForm';
import { RenderFormErrors } from '@/components/WfoPydanticForm/RenderFormErrors';
import { WfoArrayFieldV2 } from '@/components/WfoPydanticForm/fields';
import { WfoWorkflowGuideExpandablePanel } from '@/components/WfoWorkflowUserGuide/WfoWorkflowGuideExpandablePanel';
import { ConfirmationDialogContext } from '@/contexts';
import { useGetOrchestratorConfig, useOrchestratorTheme } from '@/hooks';
import { useGetDescriptionForWorkflowNameQuery } from '@/rtk';
import type { WfoComputedTheme } from '@/theme';

import { getInitialProcessPayload } from './WfoStartProcessPage';

/*
 * New start-workflow layout (shown with ?newUi=1 next to the current page):
 * - Cancel and Help live in the page header (page-level actions)
 * - Vertical step list on the left, with the form pages the user has seen so far
 *   (the backend sends one page at a time, so the total is unknown). A "Next steps" placeholder shows
 *   that more pages come (backend hasNext). Done steps are links to jump back.
 * - Back sits above the step title, so Shift+Tab from the focused title reaches it (WCAG 2.4.3 focus order)
 * - Per field: label, description, input, error
 */

type FormSteps = { titles: string[]; index: number; key?: string };
type PageFields = NonNullable<PydanticFormHeaderProps['pydanticFormSchema']>['properties'];

type FormStepsContextValue = {
  steps: FormSteps;
  hasPrevious: boolean;
  onPageShown: (key: string, title: string, fields: PageFields) => void;
  setNavigation: (hasPrevious: boolean, hasNext: boolean, onPrevious?: () => void) => void;
  goBack: (stepCount?: number) => void;
};

const FormStepsContext = createContext<FormStepsContextValue>({
  steps: { titles: [], index: -1 },
  hasPrevious: false,
  onPageShown: () => {},
  setNavigation: () => {},
  goBack: () => {},
});

const StepHeader = ({ pydanticFormSchema }: PydanticFormHeaderProps) => {
  const t = useTranslations('pydanticForms.userInputForm');
  const { steps, hasPrevious, onPageShown, goBack } = useContext(FormStepsContext);
  const properties = pydanticFormSchema?.properties;
  const headingRef = useRef<HTMLHeadingElement>(null);

  const rawTitle = pydanticFormSchema?.title;
  const title = rawTitle && rawTitle !== 'unknown' ? rawTitle : '';
  const fieldNames = Object.keys(pydanticFormSchema?.properties ?? {});
  // pydantic-forms renders the header once with an empty schema while loading; that is not a form page
  const isFormPage = fieldNames.length > 0;
  const pageKey = `${title}|${fieldNames.join(',')}`;

  useEffect(() => {
    if (isFormPage) onPageShown(pageKey, title, properties ?? {});
  }, [isFormPage, pageKey, title, properties, onPageShown]);

  // Move focus to the new step title, but not on the first page load
  useEffect(() => {
    if (steps.index > 0 || hasPrevious) headingRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [steps.index]);

  if (!isFormPage) return null;

  return (
    <div>
      {hasPrevious && (
        <EuiButtonEmpty size="s" flush="left" onClick={() => goBack()}>
          {t('back')}
        </EuiButtonEmpty>
      )}
      <EuiText size="xs" color="subdued">
        <strong>{t('stepNumber', { number: steps.index + 1 })}</strong>
      </EuiText>
      <EuiTitle size="s">
        <h2 ref={headingRef} tabIndex={-1} css={{ outlineOffset: 4 }}>
          {title || t('stepNumber', { number: steps.index + 1 })}
        </h2>
      </EuiTitle>
      <EuiSpacer size="l" />
    </div>
  );
};

const FORM_INPUT_MAX_WIDTH = 400;
// React 18 passes unknown attributes through as strings; its types only know the React 19 boolean form
const inertWhen = (on: boolean) => (on ? ({ inert: '' } as object) : {});
const STEP_COLUMN_WIDTH = 272; // 240 list + 32 gap
const FORM_COLUMN_MAX_WIDTH = 640;

// Enabled inputs get the plain (white) form surface: the grey subdued surface reads as "disabled".
// Covers EUI inputs and react-select controls (also the ones from app-level widgets we don't own).
const getInputSurfaceStyle = (theme: WfoComputedTheme) =>
  css({
    'input:not(:disabled):not([type="checkbox"]):not([type="radio"]), textarea:not(:disabled), [class*="-control"]:not([aria-disabled="true"])':
      {
        backgroundColor: theme.components.forms.background,
      },
    // EuiComboBox paints its own wrapper (app widgets may set it grey); .euiComboBox twice beats their single class
    '.euiComboBox.euiComboBox:not(.euiComboBox-isDisabled), .euiComboBox.euiComboBox:not(.euiComboBox-isDisabled) .euiComboBox__inputWrap':
      {
        backgroundColor: theme.components.forms.background,
      },

    // One field per line: pydantic-forms puts fields with a backend `layout` in a 12-column grid (inline style)
    '.pf-grid': { display: 'block !important' },
    // Inputs 400px wide (easy to scan, the width hints at the expected length); label, description and error
    // stay full width. react-select (`*-container`) and EUI controls; textareas stay full width for long text.
    '.euiFormControlLayout, .euiFieldText, .euiFieldNumber, .euiSelect, .euiComboBox, [class$="-container"]': {
      maxWidth: FORM_INPUT_MAX_WIDTH,
    },
  });

// New-layout-only field components; checked before the shared ones
const v2ComponentOverrides: PydanticComponentMatcher[] = [
  {
    id: 'arrayV2',
    ElementMatch: { isControlledElement: true, Element: WfoArrayFieldV2 },
    matcher: (field) => field.type === PydanticFormFieldType.ARRAY,
  },
];

const StepRow: RowRenderComponent = ({ title, description, error, isInvalid, required, children }) => {
  const { theme } = useOrchestratorTheme();
  return (
    <div css={{ marginBottom: 24 }} data-testid="pydantic-form-row">
      {title && (
        // Same blue label as the current layout (see getCommonFormFieldStyles)
        <EuiFormLabel
          isInvalid={isInvalid}
          css={{
            display: 'block',
            fontSize: euiFontSizeFromScale('m', theme),
            lineHeight: euiLineHeightFromBaseline('m', theme),
            color: isInvalid ? theme.colors.textDanger : theme.colors.link,
          }}
        >
          {title}
          {required && ' *'}
        </EuiFormLabel>
      )}
      {description && (
        <EuiText size="s" color="subdued" css={{ margin: '2px 0 8px' }}>
          {description}
        </EuiText>
      )}
      {title && !description && <EuiSpacer size="xs" />}
      {children}
      {error && <EuiFormErrorText>{error}</EuiFormErrorText>}
    </div>
  );
};

const StepFooter = ({
  hasNext,
  hasPrevious,
  onPrevious,
  buttons,
  isTask,
}: PydanticFormFooterProps & { isTask: boolean }) => {
  const t = useTranslations('pydanticForms.userInputForm');
  const { setNavigation } = useContext(FormStepsContext);

  useEffect(() => {
    setNavigation(hasPrevious, hasNext, onPrevious);
  }, [hasPrevious, hasNext, onPrevious, setNavigation]);

  const label =
    buttons?.next?.text
    ?? (hasNext ? t('next')
    : isTask ? t('startTask')
    : t('startWorkflow'));

  return (
    <div data-testid="pydantic-form-footer">
      <RenderFormErrors />
      <EuiHorizontalRule />
      <EuiFlexGroup justifyContent="flexEnd">
        <EuiButton fill type="submit">
          {label}
        </EuiButton>
      </EuiFlexGroup>
    </div>
  );
};

type StepItem = {
  label: string;
  caption: string;
  state: 'done' | 'current' | 'upcoming' | 'unknown' | 'final';
  onClick?: () => void;
};

type StepListProps = {
  steps: FormSteps;
  isTask: boolean;
  hasNext: boolean;
  canGoBack: boolean;
  goBack: (stepCount: number) => void;
};

const useStepItems = ({ steps, isTask, hasNext, canGoBack, goBack }: StepListProps): StepItem[] => {
  const t = useTranslations('pydanticForms.userInputForm');
  return [
    ...steps.titles.map((title, i): StepItem => {
      const state =
        i < steps.index ? 'done'
        : i === steps.index ? 'current'
        : 'upcoming';
      return {
        label: title || t('stepNumber', { number: i + 1 }),
        caption: t('stepNumber', { number: i + 1 }),
        state,
        // Done steps are links: jump back over all steps in between (the backend keeps the answers)
        onClick: state === 'done' && canGoBack ? () => goBack(steps.index - i) : undefined,
      };
    }),
    // The backend sends one page at a time and its hasNext is often false while a page still follows,
    // so after the last known step always show a placeholder: the form may go on
    ...(steps.index === steps.titles.length - 1 ?
      [
        {
          label: t('nextSteps'),
          caption: hasNext ? t('nextStepsHint') : t('nextStepsMaybeHint'),
          state: 'unknown' as const,
        },
      ]
    : []),
    { label: isTask ? t('startTask') : t('startWorkflow'), caption: t('lastStep'), state: 'final' },
  ];
};

const StepMarker = ({ state, className }: { state: StepItem['state']; className?: string }) => {
  const { theme } = useOrchestratorTheme();
  const border =
    state === 'unknown' ? `2px dashed ${theme.colors.borderBasePlain}`
    : state === 'upcoming' || state === 'final' ? `2px solid ${theme.colors.borderBasePlain}`
    : `2px solid ${theme.colors.primary}`;
  return (
    <span
      aria-hidden
      className={className}
      css={{
        flexShrink: 0,
        width: 20,
        height: 20,
        borderRadius: '50%',
        display: 'grid',
        placeItems: 'center',
        border,
        background: state === 'done' ? theme.colors.primary : theme.colors.backgroundBasePlain,
      }}
    >
      {state === 'done' && <EuiIcon type="check" size="s" color="ghost" />}
      {state === 'final' && <EuiIcon type="play" size="s" color="subdued" />}
      {state === 'current' && (
        <span css={{ width: 8, height: 8, borderRadius: '50%', background: theme.colors.primary }} />
      )}
    </span>
  );
};

// Horizontal variant, shown above the form while the guide takes the side space: markers on one line,
// only the current step shows its name (the others are named for screen readers and on hover)
const WfoInlineStepper = (props: StepListProps) => {
  const { theme } = useOrchestratorTheme();
  const items = useStepItems(props);
  return (
    <ol css={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
      {items.map(({ label, caption, state, onClick }, i) => {
        const marker = <StepMarker state={state} />;
        return (
          <React.Fragment key={i}>
            {i > 0 && (
              <li
                aria-hidden
                css={{
                  flex: '1 1 12px',
                  minWidth: 12,
                  height: 0,
                  borderTop: `2px ${state === 'unknown' ? 'dashed' : 'solid'} ${
                    i <= props.steps.index ? theme.colors.primary : theme.colors.borderBasePlain
                  }`,
                }}
              />
            )}
            <li
              aria-current={state === 'current' ? 'step' : undefined}
              title={`${caption}: ${label}`}
              css={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}
            >
              {onClick ?
                <button
                  type="button"
                  onClick={onClick}
                  aria-label={`${caption}: ${label}`}
                  css={{ display: 'flex', padding: 0, border: 0, background: 'none', cursor: 'pointer' }}
                >
                  {marker}
                </button>
              : marker}
              {state === 'current' && (
                <EuiText
                  size="s"
                  css={{
                    fontWeight: theme.font.weight.bold,
                    color: theme.colors.primary,
                    // Long titles shrink with an ellipsis; the full name is in the li title
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {label}
                </EuiText>
              )}
              {state !== 'current' && <span css={visuallyHidden}>{`${caption}: ${label}`}</span>}
            </li>
          </React.Fragment>
        );
      })}
    </ol>
  );
};

const visuallyHidden = {
  position: 'absolute',
  width: 1,
  height: 1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
} as const;

const WfoFormStepList = (props: StepListProps) => {
  const { theme } = useOrchestratorTheme();
  const items = useStepItems(props);

  return (
    <EuiPanel hasBorder hasShadow={false} paddingSize="m" css={{ position: 'sticky', top: theme.size.l }}>
      <ol css={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {items.map(({ label, caption, state, onClick }, i) => {
          const isUnknown = state === 'unknown';
          const labelColor =
            state === 'current' ? theme.colors.primary
            : state === 'upcoming' || state === 'final' || isUnknown ? theme.colors.textSubdued
            : undefined;
          return (
            <li
              key={i}
              aria-current={state === 'current' ? 'step' : undefined}
              css={{
                position: 'relative',
                padding: `0 0 ${theme.size.l} 32px`,
                '&:not(:last-child)::before': {
                  content: '""',
                  position: 'absolute',
                  left: 9,
                  top: 22,
                  bottom: 2,
                  borderLeft: `2px ${isUnknown ? 'dashed' : 'solid'} ${
                    state === 'done' ? theme.colors.primary : theme.colors.borderBasePlain
                  }`,
                },
              }}
            >
              <StepMarker state={state} css={{ position: 'absolute', left: 0, top: 0 }} />
              {!isUnknown && (
                <EuiText size="xs" color="subdued">
                  {caption}
                </EuiText>
              )}
              <EuiText
                size="s"
                css={{
                  fontWeight: state === 'current' ? theme.font.weight.bold : theme.font.weight.regular,
                  fontStyle: isUnknown ? 'italic' : undefined,
                  color: labelColor,
                }}
              >
                {onClick ?
                  <EuiLink onClick={onClick}>{label}</EuiLink>
                : label}
              </EuiText>
              {isUnknown && (
                <EuiText size="xs" color="subdued">
                  {caption}
                </EuiText>
              )}
            </li>
          );
        })}
      </ol>
    </EuiPanel>
  );
};

interface WfoStartProcessPageV2Props {
  processName: string;
  isTask?: boolean;
}

export const WfoStartProcessPageV2 = ({ processName, isTask = false }: WfoStartProcessPageV2Props) => {
  const t = useTranslations('pydanticForms.userInputForm');
  const router = useRouter();
  const { showConfirmDialog } = useContext(ConfirmationDialogContext);
  const { theme } = useOrchestratorTheme();
  const { showWorkflowUserGuide, expandWorkflowUserGuideOnStart } = useGetOrchestratorConfig();
  const [isGuideOpen, setIsGuideOpen] = useState(expandWorkflowUserGuideOnStart);
  // Below xl the guide stacks (see WfoWorkflowGuideExpandablePanel); only a side-by-side guide needs the space
  const isBigScreen = useIsWithinBreakpoints(['xl', 'xxl']);
  const isCompact = showWorkflowUserGuide && isGuideOpen && isBigScreen;
  const { productId, subscriptionId } = router.query as { productId?: string; subscriptionId?: string };

  const { data: workflowMetadata, isError: isErrorWorkflowDescription } = useGetDescriptionForWorkflowNameQuery({
    workflowName: processName,
  });
  const pageTitle = workflowMetadata?.description || (isErrorWorkflowDescription && processName) || '';

  const startProcessPayload = useMemo(
    () => getInitialProcessPayload({ productId, subscriptionId }),
    [productId, subscriptionId],
  );

  // Step tracking: one entry per form page the backend has sent so far
  const [steps, setSteps] = useState<FormSteps>({ titles: [], index: -1 });
  const [hasPrevious, setHasPrevious] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const [pageFields, setPageFields] = useState<PageFields>({});
  const goingBack = useRef(0);
  const shownKey = useRef<string | undefined>(undefined);
  const previousRef = useRef<(() => void) | undefined>(undefined);

  const onPageShown = useCallback((key: string, title: string, fields: PageFields) => {
    // The header also re-renders the same page (e.g. while going back): ignore that, keep the back flag
    if (key === shownKey.current) return;
    shownKey.current = key;
    const back = goingBack.current;
    goingBack.current = 0;
    setPageFields(fields);
    setSteps((current) => {
      if (back) return { ...current, index: Math.max(0, current.index - back), key };
      const index = current.index + 1;
      return {
        titles: [...current.titles.slice(0, index), title],
        index,
        key,
      };
    });
  }, []);

  const setNavigation = useCallback((previous: boolean, next: boolean, onPrevious?: () => void) => {
    previousRef.current = onPrevious;
    setHasPrevious(previous);
    setHasNext(next);
  }, []);

  // pydantic-forms goes back one page per onPrevious call (sync slice of its step history), so call it n times
  const goBack = useCallback((stepCount = 1) => {
    goingBack.current = stepCount;
    for (let i = 0; i < stepCount; i++) previousRef.current?.();
  }, []);

  const contextValue = useMemo(
    () => ({ steps, hasPrevious, onPageShown, setNavigation, goBack }),
    [steps, hasPrevious, onPageShown, setNavigation, goBack],
  );

  const renderers = useMemo(
    () => ({
      headerRenderer: StepHeader,
      rowRenderer: StepRow,
      footerRenderer: (props: PydanticFormFooterProps) => <StepFooter {...props} isTask={isTask} />,
    }),
    [isTask],
  );

  const stepListProps = { steps, isTask, hasNext, canGoBack: hasPrevious, goBack };

  const handleCancel = () =>
    showConfirmDialog({
      question: t('previousQuestion'),
      onConfirm: () => router.replace(isTask ? PATH_TASKS : PATH_WORKFLOWS),
    });

  const headerButtons = [
    <EuiButton key="cancel" onClick={handleCancel}>
      {t('cancel')}
    </EuiButton>,
  ];

  return (
    <FormLayoutV2Context.Provider value={true}>
      <FormStepsContext.Provider value={contextValue}>
        <WfoContentHeader title={<WfoTitleWithWebsocketBadge title={pageTitle} />}>{headerButtons}</WfoContentHeader>
        <div
          css={{
            display: 'grid',
            alignItems: 'start',
            // Column widths are animated (not swapped), so opening the guide slides the form instead of jumping
            gridTemplateColumns: `${isCompact ? 0 : STEP_COLUMN_WIDTH}px minmax(0, ${FORM_COLUMN_MAX_WIDTH}px) minmax(0, 1fr)`,
            transition: 'grid-template-columns 300ms cubic-bezier(0.2, 0, 0, 1)',
            '@media (prefers-reduced-motion: reduce)': { transition: 'none', '*': { transition: 'none !important' } },
          }}
        >
          <div
            aria-hidden={isCompact}
            // `inert` keeps the hidden list out of the tab order
            {...inertWhen(isCompact)}
            css={{
              overflow: 'hidden',
              paddingInlineEnd: theme.size.xl,
              opacity: isCompact ? 0 : 1,
              transition: 'opacity 200ms ease',
              // Fixed inner width: the list fades out while the column shrinks, its text never re-wraps
              '> *': { width: STEP_COLUMN_WIDTH - 32 },
            }}
          >
            <WfoFormStepList {...stepListProps} />
          </div>
          <div css={{ minWidth: 0 }}>
            {/* 0fr -> 1fr grid row: the stepper grows in without a measured height */}
            <div
              aria-hidden={!isCompact}
              {...inertWhen(!isCompact)}
              css={{
                display: 'grid',
                gridTemplateRows: isCompact ? '1fr' : '0fr',
                opacity: isCompact ? 1 : 0,
                transition: 'grid-template-rows 300ms cubic-bezier(0.2, 0, 0, 1), opacity 200ms ease',
              }}
            >
              <div css={{ overflow: 'hidden', minHeight: 0 }}>
                <EuiPanel hasBorder hasShadow={false} paddingSize="m" css={{ marginBottom: theme.size.base }}>
                  <WfoInlineStepper {...stepListProps} />
                </EuiPanel>
              </div>
            </div>
            <EuiPanel hasBorder hasShadow={false} paddingSize="l" css={getInputSurfaceStyle(theme)}>
              <FormPageFieldsV2Context.Provider value={pageFields}>
                <WfoPydanticForm
                  processName={processName}
                  startProcessPayload={startProcessPayload}
                  isTask={isTask}
                  renderers={renderers}
                  componentOverrides={v2ComponentOverrides}
                />
              </FormPageFieldsV2Context.Provider>
            </EuiPanel>
          </div>
          {showWorkflowUserGuide && (
            <div
              css={{
                display: 'flex',
                alignSelf: 'stretch',
                paddingInlineStart: theme.size.xl,
                // closed: the info strip sits at the far end; open: the guide fills the rest
                justifyContent: isGuideOpen ? 'stretch' : 'flex-end',
              }}
            >
              <EuiFlexGroup gutterSize="none" css={{ position: 'relative', flexGrow: isGuideOpen ? 1 : 0 }}>
                <WfoWorkflowGuideExpandablePanel
                  workflowName={processName}
                  isExpanded={isGuideOpen}
                  onToggle={() => setIsGuideOpen((open) => !open)}
                />
              </EuiFlexGroup>
            </div>
          )}
        </div>
      </FormStepsContext.Provider>
    </FormLayoutV2Context.Provider>
  );
};
