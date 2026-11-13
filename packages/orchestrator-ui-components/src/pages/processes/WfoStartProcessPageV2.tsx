import React, { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from 'react';

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
} from '@elastic/eui';
import { css } from '@emotion/react';

import { PATH_TASKS, PATH_WORKFLOWS, WfoTitleWithWebsocketBadge } from '@/components';
import { WfoContentHeader } from '@/components/WfoContentHeader/WfoContentHeader';
import { FormLayoutV2Context, FormPageFieldsV2Context, WfoPydanticForm } from '@/components/WfoPydanticForm';
import { RenderFormErrors } from '@/components/WfoPydanticForm/RenderFormErrors';
import { WfoArrayFieldV2 } from '@/components/WfoPydanticForm/fields';
import { WfoWorkflowGuideMarkdown } from '@/components/WfoWorkflowUserGuide/WfoWorkflowGuideExpandablePanel';
import { ConfirmationDialogContext } from '@/contexts';
import { useGetOrchestratorConfig, useOrchestratorTheme } from '@/hooks';
import { useGetDescriptionForWorkflowNameQuery } from '@/rtk';
import type { WfoComputedTheme } from '@/theme';

import { getInitialProcessPayload } from './WfoStartProcessPage';

/*
 * New start-workflow layout (shown with ?newUi=1 next to the current page):
 * - Back is a link above the step title; Next and Cancel sit under the form. DOM order = visual order, so Tab
 *   from the last field goes straight to Next, and Shift+Tab from the (focused) step title reaches Back.
 *   The sticky step list is the second way back, also from the bottom of a long step.
 * - Vertical step list on the left, with the form pages the user has seen so far
 *   (the backend sends one page at a time, so the total is unknown). A "Next steps" placeholder shows
 *   that more pages come (backend hasNext). Done steps are links to jump back.
 * - On a step change focus moves to the new step title (WCAG 2.4.3); done steps in the list are links back
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
  onCancel: () => void;
};

const FormStepsContext = createContext<FormStepsContextValue>({
  steps: { titles: [], index: -1 },
  hasPrevious: false,
  onPageShown: () => {},
  setNavigation: () => {},
  goBack: () => {},
  onCancel: () => {},
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

  // Move focus to the new step title, but not on the first page load. titles.length > 1 also covers going
  // back to step 1: index is 0 and hasPrevious false there, while the focused Back link unmounts.
  useEffect(() => {
    if (steps.index > 0 || steps.titles.length > 1 || hasPrevious) headingRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [steps.index]);

  if (!isFormPage) return null;

  return (
    <div>
      {hasPrevious && (
        <>
          <EuiButtonEmpty size="s" flush="left" iconType="chevronSingleLeft" onClick={() => goBack()}>
            {t('back')}
          </EuiButtonEmpty>
          <EuiSpacer size="m" />
        </>
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
const RAIL_WIDTH = 56; // collapsed step list: markers only
const STEP_LIST_EXPANDED_WIDTH = 300; // step list on hover or focus, shown over the page
// 24px gap + 640px panel: room for one field pair from a backend layout; more width only makes lines longer
// and takes reading space from the guide
const FORM_COLUMN_MAX_WIDTH = 664;
const GUIDE_GAP = 8;
const GUIDE_STRIP_WIDTH = 32;
const GUIDE_MIN_WIDTH = 480; // open guide incl. strip: room for ~55 characters of guide text
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
        // 65ch: readable line length for UI descriptions (45–65 characters)
        <EuiText size="s" color="subdued" css={{ margin: '2px 0 8px', maxWidth: '65ch' }}>
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
  const { setNavigation, onCancel } = useContext(FormStepsContext);

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
      <EuiFlexGroup justifyContent="spaceBetween" alignItems="center" responsive={false} wrap>
        <EuiButton fill type="submit" iconType="chevronSingleRight" iconSide="right">
          {label}
        </EuiButton>
        <EuiButtonEmpty color="text" onClick={onCancel}>
          {t('cancel')}
        </EuiButtonEmpty>
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

/*
 * Guide as a page tucked under the form panel: a strip sticks to the right edge of the panel (reachable by
 * moving straight right from any field), and the guide panel slides out from behind the form panel.
 * The form never moves; like the current layout, the open guide fills the space right of the form.
 */
const WfoTuckedGuide = ({
  workflowName,
  isOpen,
  onToggle,
}: {
  workflowName: string;
  isOpen: boolean;
  onToggle: () => void;
}) => {
  const t = useTranslations('workflowGuide');
  const { theme } = useOrchestratorTheme();
  const guideBorder = `2px solid ${theme.colors.backgroundLightPrimary}`;
  const guideId = useId();

  return (
    <div
      css={{
        position: 'sticky',
        top: theme.size.l,
        // viewport minus the top navigation and a gap above and below
        height: `calc(100vh - ${theme.base * 3}px - 2 * ${theme.size.l})`,
        minHeight: theme.base * 25,
        // clips the guide while it is "under" the form panel
        overflow: 'hidden',
      }}
    >
      <div
        css={{
          display: 'flex',
          // Guide and strip share the same gap above and below, so the open guide is as high as the strip
          height: `calc(100% - 2 * ${theme.size.xl})`,
          marginBlock: theme.size.xl,
          width: `calc(100% - ${GUIDE_GAP}px)`,
          // Closed: shifted left by the guide width, so only the strip shows, attached to the form panel.
          // Open: slides out GUIDE_GAP past the panel edge; a small gap, smaller than the one to the step list,
          // so the guide reads as its own object that still belongs to the form (law of proximity).
          transform: isOpen ? `translateX(${GUIDE_GAP}px)` : `translateX(calc(-100% + ${GUIDE_STRIP_WIDTH}px))`,
          transition: 'transform 300ms cubic-bezier(0.2, 0, 0, 1)',
          '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
        }}
      >
        <section
          id={guideId}
          aria-label={t('title')}
          {...inertWhen(!isOpen)}
          css={{ flex: 1, minWidth: 0, display: 'flex' }}
        >
          {/* Same guide panel as the current layout; mounted while closed so the slide shows content */}
          <WfoWorkflowGuideMarkdown workflowName={workflowName} isBigScreen />
        </section>
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={guideId}
          aria-label={isOpen ? t('hide') : t('show')}
          title={isOpen ? t('hide') : t('show')}
          onClick={onToggle}
          css={{
            // Same look as the current guide strip
            alignSelf: 'stretch',
            width: GUIDE_STRIP_WIDTH,
            flexShrink: 0,
            display: 'grid',
            placeItems: 'center',
            padding: 0,
            background: theme.colors.backgroundBasePrimary,
            border: guideBorder,
            // Open it joins the guide panel, closed the form panel: no left border, rounded on the right only
            borderInlineStart: 0,
            borderRadius: `0 ${theme.border.radius.medium} ${theme.border.radius.medium} 0`,
            cursor: 'pointer',
            transition: 'border-color 100ms ease-in-out',
            '&:hover': { borderColor: theme.colors.borderBasePrimary },
          }}
        >
          <EuiIcon type={isOpen ? 'chevronSingleLeft' : 'info'} size="l" color="primary" />
        </button>
      </div>
    </div>
  );
};

/*
 * Step list as a rail: collapsed it shows only the markers (RAIL_WIDTH), so the wizard and guide get the space.
 * Hover or keyboard focus expands it over the page (never pushes the form). Done steps stay real links, and
 * the titles stay in the DOM while collapsed, so screen readers always get the names.
 * WCAG 1.4.13: the expanded list stays open while the pointer is on it, and Escape hides it.
 */
const WfoFormStepList = (props: StepListProps) => {
  const { theme } = useOrchestratorTheme();
  const items = useStepItems(props);
  const [isHovered, setIsHovered] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const isExpanded = (isHovered || hasFocus) && !isDismissed;
  const textStyle = { opacity: isExpanded ? 1 : 0, transition: 'opacity 120ms ease' };
  const t = useTranslations('pydanticForms.userInputForm');

  // Escape hides the expanded list wherever focus is (also while typing in the form under a hovered list)
  useEffect(() => {
    if (!isExpanded) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsDismissed(true);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [isExpanded]);

  return (
    <nav
      aria-label={t('steps')}
      css={{ position: 'relative', zIndex: 2 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsDismissed(false);
      }}
      onFocus={() => {
        setHasFocus(true);
        setIsDismissed(false);
      }}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setHasFocus(false);
      }}
    >
      <EuiPanel
        hasBorder
        hasShadow={false}
        paddingSize="m"
        css={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: isExpanded ? STEP_LIST_EXPANDED_WIDTH : RAIL_WIDTH,
          // Many steps on a short screen: the list scrolls instead of running off the bottom
          maxHeight: `calc(100vh - ${theme.base * 3}px - 2 * ${theme.size.l})`,
          overflowX: 'hidden',
          overflowY: 'auto',
          boxShadow: isExpanded ? '0 8px 24px rgba(0, 0, 0, 0.15)' : 'none',
          transition: 'width 160ms ease, box-shadow 160ms ease',
          '@media (prefers-reduced-motion: reduce)': { transition: 'none', '*': { transition: 'none !important' } },
        }}
      >
        {/* Fixed inner width: the titles never re-wrap while the panel opens */}
        <ol css={{ listStyle: 'none', margin: 0, padding: 0, width: STEP_LIST_EXPANDED_WIDTH - 2 * theme.base }}>
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
                  // No space under the last step: the panel's own padding closes the list. Collapsed, the hidden
                  // two-line text (caption 16 + label 20) is 16px higher than the marker; pull that up as well,
                  // so the space under the last marker equals the space above the first one.
                  '&:last-child': { paddingBottom: 0, marginBottom: isExpanded ? 0 : `-${theme.size.base}` },
                  // Collapsed (after Escape) the focused link text is hidden: show the focus on its marker (WCAG 2.4.7)
                  ...(!isExpanded && {
                    '&:focus-within > [aria-hidden]': {
                      outline: `2px solid ${theme.colors.primary}`,
                      outlineOffset: 2,
                    },
                  }),
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
                  <EuiText size="xs" color="subdued" css={textStyle}>
                    {caption}
                  </EuiText>
                )}
                <EuiText
                  size="s"
                  title={label}
                  css={{
                    ...textStyle,
                    fontWeight: state === 'current' ? theme.font.weight.bold : theme.font.weight.regular,
                    fontStyle: isUnknown ? 'italic' : undefined,
                    color: labelColor,
                    // One line per title: long titles get an ellipsis (full title on hover)
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {onClick ?
                    <EuiLink onClick={onClick}>{label}</EuiLink>
                  : label}
                </EuiText>
                {isUnknown && (
                  <EuiText size="xs" color="subdued" css={textStyle}>
                    {caption}
                  </EuiText>
                )}
              </li>
            );
          })}
        </ol>
      </EuiPanel>
    </nav>
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

  const handleCancel = useCallback(
    () =>
      showConfirmDialog({
        question: t('previousQuestion'),
        onConfirm: () => router.replace(isTask ? PATH_TASKS : PATH_WORKFLOWS),
      }),
    [showConfirmDialog, t, router, isTask],
  );

  const contextValue = useMemo(
    () => ({ steps, hasPrevious, onPageShown, setNavigation, goBack, onCancel: handleCancel }),
    [steps, hasPrevious, onPageShown, setNavigation, goBack, handleCancel],
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

  return (
    <FormLayoutV2Context.Provider value={true}>
      <FormStepsContext.Provider value={contextValue}>
        <WfoContentHeader title={<WfoTitleWithWebsocketBadge title={pageTitle} />} spacerSize="xxl" />
        <div
          css={{
            display: 'grid',
            alignItems: 'start',
            // Fixed columns, open or closed: the guide always has its space, so opening it never moves the form.
            // On a wide screen the form gets its max width and the guide the rest; on a laptop the form gives way.
            // Without the guide (config off) no space is reserved for it.
            gridTemplateColumns: `${RAIL_WIDTH}px minmax(0, ${FORM_COLUMN_MAX_WIDTH}px) minmax(${
              showWorkflowUserGuide ? GUIDE_MIN_WIDTH : 0
            }px, 1fr)`,
          }}
        >
          {/* Sticky on the grid item itself: a sticky child of a content-high cell has no room to stick */}
          <div css={{ position: 'sticky', top: theme.size.l, zIndex: 2 }}>
            <WfoFormStepList {...stepListProps} />
          </div>
          <div css={{ minWidth: 0, paddingInlineStart: theme.size.l }}>
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
            <WfoTuckedGuide
              workflowName={processName}
              isOpen={isGuideOpen}
              onToggle={() => setIsGuideOpen((open) => !open)}
            />
          )}
        </div>
      </FormStepsContext.Provider>
    </FormLayoutV2Context.Provider>
  );
};
