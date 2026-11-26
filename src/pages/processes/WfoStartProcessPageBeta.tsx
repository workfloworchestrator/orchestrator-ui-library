import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
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
  EuiScreenReaderOnly,
  EuiSkeletonRectangle,
  EuiSkeletonText,
  EuiSkeletonTitle,
  EuiSpacer,
  EuiText,
  EuiTitle,
  euiFontSizeFromScale,
  euiLineHeightFromBaseline,
} from '@elastic/eui';
import { css } from '@emotion/react';

import { PATH_TASKS, PATH_WORKFLOWS, WfoTitleWithWebsocketBadge } from '@/components';
import { WfoContentHeader } from '@/components/WfoContentHeader/WfoContentHeader';
import { BetaLayoutContext, BetaPageFieldsContext, WfoPydanticForm } from '@/components/WfoPydanticForm';
import { RenderFormErrors } from '@/components/WfoPydanticForm/RenderFormErrors';
import { WfoBetaArrayField } from '@/components/WfoPydanticForm/fields';
import { TUCKED_GUIDE_MIN_WIDTH, WfoTuckedGuide } from '@/components/WfoWorkflowUserGuide/WfoTuckedGuide';
import { ConfirmationDialogContext } from '@/contexts';
import { useGetOrchestratorConfig, useOrchestratorTheme } from '@/hooks';
import { useGetDescriptionForWorkflowNameQuery, useGetSubscriptionDetailQuery } from '@/rtk';
import type { WfoComputedTheme } from '@/theme';

import { InfoItem, InfoLineItem, WfoProcessInfoLine } from './WfoProcessInfoLine';
import { getInitialProcessPayload } from './WfoStartProcessPage';

/*
 * New start-workflow layout (opt-in with the layout toggle, next to the current page):
 * - Back is a link above the step title; Next and Cancel sit under the form. DOM order = visual order, so Tab
 *   from the last field goes straight to Next, and Shift+Tab from the (focused) step title reaches Back.
 *   The sticky step list is the second way back, also from the bottom of a long step.
 * - Vertical step list on the left, with the form pages the user has seen so far
 *   (the backend sends one page at a time, so the total is unknown). A "Next steps" placeholder shows
 *   that more pages come (backend hasNext). Done steps are links to jump back.
 * - On a step change focus moves to the new step title (WCAG 2.4.3); done steps in the list are links back
 * - Per field: label, description, input, error
 */

// keys: what identifies a page (see StepHeader); the backend sends no step id, so title + field names it is
type FormSteps = { titles: string[]; keys: string[]; index: number };
type PageFields = NonNullable<PydanticFormHeaderProps['pydanticFormSchema']>['properties'];

type FormStepsContextValue = {
  steps: FormSteps;
  hasPrevious: boolean;
  onPageShown: (key: string, title: string, fields: PageFields) => void;
  setNavigation: (hasPrevious: boolean, hasNext: boolean, onPrevious?: () => void) => void;
  goBack: (stepCount?: number) => void;
  onCancel: () => void;
};

// A summary field ("check the settings") is how workflows end their form; no page follows it
const isSummaryPage = (fields: PageFields) =>
  Object.values(fields ?? {}).some((field) => (field.format as string | undefined) === 'summary');

const FormStepsContext = createContext<FormStepsContextValue>({
  steps: { titles: [], keys: [], index: -1 },
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

// Modify/terminate: which subscription the workflow changes (create has no subscription yet)
const SubscriptionInfoLine = ({ subscriptionId }: { subscriptionId: string }) => {
  const t = useTranslations('processes.detail');
  const { data: subscriptionDetail, isLoading } = useGetSubscriptionDetailQuery({ subscriptionId });
  const { theme } = useOrchestratorTheme();
  const subscription = subscriptionDetail?.subscription;
  // Same height as the info line, so the page does not move down when it comes in
  if (isLoading) {
    return (
      <div css={{ marginTop: theme.size.xs, marginBottom: theme.size.s }}>
        <EuiSkeletonRectangle width={420} height={20} borderRadius="s" css={{ maxWidth: '100%' }} />
      </div>
    );
  }
  if (!subscription) return null;

  const infoItems: InfoLineItem[] = [
    {
      key: 'product',
      node: (
        <InfoItem icon="package" label={t('product')}>
          {subscription.product.name}
        </InfoItem>
      ),
    },
    ...(subscription.customer?.fullname ?
      [
        {
          key: 'customer',
          node: (
            <InfoItem icon="users" label={t('customer')}>
              {subscription.customer.fullname}
            </InfoItem>
          ),
        },
      ]
    : []),
    {
      key: 'subscription',
      node: (
        <span css={{ display: 'inline-flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
          <EuiIcon type="link" size="m" color="subdued" aria-hidden />
          <EuiText size="s" css={{ minWidth: 0 }}>
            <Link
              href={`/subscriptions/${subscriptionId}`}
              title={`${t('subscription')}: ${subscription.description}`}
              css={{
                display: 'block',
                maxWidth: 'min(480px, 50vw)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {subscription.description}
            </Link>
          </EuiText>
        </span>
      ),
    },
  ];
  return <WfoProcessInfoLine infoItems={infoItems} />;
};

const FORM_INPUT_MAX_WIDTH = 400;
const RAIL_WIDTH = 56; // collapsed step list: markers only
const STEP_LIST_EXPANDED_WIDTH = 300; // step list on hover or focus, shown over the page
// 24px gap + 640px panel: room for one field pair from a backend layout; more width only makes lines longer
// and takes reading space from the guide
const FORM_COLUMN_MAX_WIDTH = 664;
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
const betaComponentOverrides: PydanticComponentMatcher[] = [
  {
    id: 'betaArray',
    ElementMatch: { isControlledElement: true, Element: WfoBetaArrayField },
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

/*
 * While the backend sends the next page (about a second: it runs the form again with all answers so far):
 * a skeleton shaped like a step, so the panel keeps about its size instead of collapsing to one line.
 * The text says it is loading for screen readers.
 */
const StepLoading = () => {
  const t = useTranslations('common');
  const tForm = useTranslations('pydanticForms.userInputForm');
  const { steps } = useContext(FormStepsContext);
  // First load: it is always step 1, so that is real text. Later (next or back) the number follows from the page.
  const isFirstLoad = steps.index === -1;
  return (
    <div role="status" data-testid="pydantic-form-loading">
      <EuiScreenReaderOnly>
        <span>{t('loading')}</span>
      </EuiScreenReaderOnly>
      {isFirstLoad ?
        <EuiText size="xs" color="subdued">
          <strong>{tForm('stepNumber', { number: 1 })}</strong>
        </EuiText>
      : <EuiSkeletonText lines={1} size="xs" css={{ width: 64 }} />}
      <EuiSpacer size="xs" />
      <EuiSkeletonTitle size="s" css={{ width: 240 }} />
      <EuiSpacer size="l" />
      {[0, 1, 2].map((rowIndex) => (
        <div key={rowIndex} css={{ marginBottom: 24 }}>
          <EuiSkeletonText lines={2} size="s" css={{ maxWidth: '65ch' }} />
          <EuiSpacer size="s" />
          <EuiSkeletonRectangle width="100%" height={40} borderRadius="s" css={{ maxWidth: FORM_INPUT_MAX_WIDTH }} />
        </div>
      ))}
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
        <EuiButton
          fill
          type="submit"
          iconType="chevronSingleRight"
          iconSide="right"
          id="button-submit-form-submit"
          data-testid="button-submit-form-submit"
        >
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
  isLastPage: boolean;
  canGoBack: boolean;
  goBack: (stepCount: number) => void;
};

const useStepItems = ({ steps, isTask, hasNext, isLastPage, canGoBack, goBack }: StepListProps): StepItem[] => {
  const t = useTranslations('pydanticForms.userInputForm');
  // First load, no page yet: step 1 is the current step (its title follows with the page)
  if (steps.index === -1) {
    return [
      { label: t('stepNumber', { number: 1 }), caption: '', state: 'current' },
      { label: t('nextSteps'), caption: t('nextStepsMaybeHint'), state: 'unknown' },
      { label: isTask ? t('startTask') : t('startWorkflow'), caption: t('lastStep'), state: 'final' },
    ];
  }
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
    // so after the last known step show a placeholder: the form may go on. Not on a summary page: that is the last.
    ...(steps.index === steps.titles.length - 1 && !isLastPage ?
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
      // A dropdown or dialog that handled this Escape marks it; then it was not meant for the step list
      if (event.key === 'Escape' && !event.defaultPrevented) setIsDismissed(true);
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

interface WfoStartProcessPageBetaProps {
  processName: string;
  isTask?: boolean;
}

export const WfoStartProcessPageBeta = ({ processName, isTask = false }: WfoStartProcessPageBetaProps) => {
  const t = useTranslations('pydanticForms.userInputForm');
  const router = useRouter();
  const { showConfirmDialog } = useContext(ConfirmationDialogContext);
  const { theme } = useOrchestratorTheme();
  const { showWorkflowUserGuide, expandWorkflowUserGuideOnStart } = useGetOrchestratorConfig();
  const [isGuideOpen, setIsGuideOpen] = useState(expandWorkflowUserGuideOnStart);
  const { productId, subscriptionId } = router.query as { productId?: string; subscriptionId?: string };

  const {
    data: workflowMetadata,
    isError: isErrorWorkflowDescription,
    isLoading: isLoadingWorkflowDescription,
  } = useGetDescriptionForWorkflowNameQuery({
    workflowName: processName,
  });
  const pageTitle = workflowMetadata?.description || (isErrorWorkflowDescription && processName) || '';

  const startProcessPayload = useMemo(
    () => getInitialProcessPayload({ productId, subscriptionId }),
    [productId, subscriptionId],
  );

  // Step tracking: one entry per form page the backend has sent so far
  const [steps, setSteps] = useState<FormSteps>({ titles: [], keys: [], index: -1 });
  const [hasPrevious, setHasPrevious] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const [pageFields, setPageFields] = useState<PageFields>({});
  // TODO: the backend should say which page is the last; until then a summary page counts as the last one
  const isLastPage = !hasNext && isSummaryPage(pageFields);
  const shownKey = useRef<string | undefined>(undefined);
  // The page we just left with Back. pydantic-forms renders it once more (stale schema) after the previous
  // page loads but before it swaps the schema; without this that stale render counts as a new step.
  const leftKey = useRef<string | undefined>(undefined);
  const previousRef = useRef<(() => void) | undefined>(undefined);
  const stepsRef = useRef(steps);
  stepsRef.current = steps;

  const onPageShown = useCallback((key: string, title: string, fields: PageFields) => {
    // The header also re-renders the page that is already shown (and the page we went back to): ignore that
    if (key === leftKey.current) return;
    if (key === shownKey.current) {
      leftKey.current = undefined; // the page we went back to is shown: the stale render is over
      setPageFields(fields); // else page-aware fields (e.g. contacts waiting for the customer) see the page we left
      return;
    }
    leftKey.current = undefined;
    shownKey.current = key;
    setPageFields(fields);
    setSteps((current) => {
      const index = current.index + 1;
      return {
        titles: [...current.titles.slice(0, index), title],
        keys: [...current.keys.slice(0, index), key],
        index,
      };
    });
  }, []);

  const setNavigation = useCallback((previous: boolean, next: boolean, onPrevious?: () => void) => {
    previousRef.current = onPrevious;
    setHasPrevious(previous);
    setHasNext(next);
  }, []);

  // pydantic-forms goes back one page per onPrevious call (sync slice of its step history), so call it n times.
  // The new step index is set here and not derived from the page that shows up: that page can look the same as
  // the current one (same title and fields), and then it would not be noticed.
  const goBack = useCallback((stepCount = 1) => {
    const onPrevious = previousRef.current;
    const { index, keys } = stepsRef.current;
    const target = Math.max(0, index - stepCount);
    if (!onPrevious || target === index) return;
    leftKey.current = keys[index];
    shownKey.current = keys[target];
    setSteps((current) => ({ ...current, index: target }));
    for (let i = 0; i < stepCount; i++) onPrevious();
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
      loadingComponent: <StepLoading />,
      footerRenderer: (props: PydanticFormFooterProps) => <StepFooter {...props} isTask={isTask} />,
    }),
    [isTask],
  );

  const stepListProps = { steps, isTask, hasNext, isLastPage, canGoBack: hasPrevious, goBack };

  return (
    <BetaLayoutContext.Provider value={true}>
      <FormStepsContext.Provider value={contextValue}>
        <WfoContentHeader
          title={
            <div>
              <WfoTitleWithWebsocketBadge
                title={
                  isLoadingWorkflowDescription ?
                    // A span (inside the h1); the height of the title line, so nothing moves when the name comes in
                    <EuiSkeletonRectangle width={320} height={36} borderRadius="s" />
                  : pageTitle
                }
              />
              {subscriptionId && <SubscriptionInfoLine subscriptionId={subscriptionId} />}
            </div>
          }
          spacerSize="xxl"
        />
        <div
          css={{
            display: 'grid',
            alignItems: 'start',
            // Fixed columns, open or closed: the guide always has its space, so opening it never moves the form.
            // On a wide screen the form gets its max width and the guide the rest; on a laptop the form gives way.
            // Without the guide (config off) no space is reserved for it.
            gridTemplateColumns: `${RAIL_WIDTH}px minmax(0, ${FORM_COLUMN_MAX_WIDTH}px) minmax(${
              showWorkflowUserGuide ? TUCKED_GUIDE_MIN_WIDTH : 0
            }px, 1fr)`,
          }}
        >
          {/* Sticky on the grid item itself: a sticky child of a content-high cell has no room to stick */}
          <div css={{ position: 'sticky', top: theme.size.l, zIndex: 2 }}>
            <WfoFormStepList {...stepListProps} />
          </div>
          <div css={{ minWidth: 0, paddingInlineStart: theme.size.l }}>
            <EuiPanel hasBorder hasShadow={false} paddingSize="l" css={getInputSurfaceStyle(theme)}>
              <BetaPageFieldsContext.Provider value={pageFields}>
                <WfoPydanticForm
                  processName={processName}
                  startProcessPayload={startProcessPayload}
                  isTask={isTask}
                  renderers={renderers}
                  componentOverrides={betaComponentOverrides}
                />
              </BetaPageFieldsContext.Provider>
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
    </BetaLayoutContext.Provider>
  );
};
