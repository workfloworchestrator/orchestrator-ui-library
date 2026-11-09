import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';
import type { PydanticFormFooterProps, PydanticFormHeaderProps, RowRenderComponent } from 'pydantic-forms';

import {
  EuiButton,
  EuiButtonEmpty,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFlyout,
  EuiFlyoutBody,
  EuiFlyoutHeader,
  EuiFormErrorText,
  EuiFormLabel,
  EuiHorizontalRule,
  EuiIcon,
  EuiLoadingSpinner,
  EuiMarkdownFormat,
  EuiPanel,
  EuiSpacer,
  EuiText,
  EuiTitle,
} from '@elastic/eui';

import { PATH_TASKS, PATH_WORKFLOWS, WfoTitleWithWebsocketBadge } from '@/components';
import { WfoContentHeader } from '@/components/WfoContentHeader/WfoContentHeader';
import { WfoPydanticForm } from '@/components/WfoPydanticForm';
import { RenderFormErrors } from '@/components/WfoPydanticForm/RenderFormErrors';
import { ConfirmationDialogContext } from '@/contexts';
import { useGetOrchestratorConfig, useOrchestratorTheme } from '@/hooks';
import { WfoPlayCircle } from '@/icons';
import { useGetDescriptionForWorkflowNameQuery, useGetWorkflowGuideQuery } from '@/rtk';

import { getInitialProcessPayload } from './WfoStartProcessPage';

/*
 * New start-workflow layout (shown with ?newUi=1 next to the current page):
 * - Cancel and Help live in the page header (page-level actions)
 * - Vertical step list on the left, only with the form pages the user has seen so far
 *   (the backend sends one page at a time, so the total is unknown)
 * - Back sits above the step title, so Shift+Tab from the focused title reaches it (WCAG 2.4.3 focus order)
 * - Per field: label, description, input, error
 */

type FormSteps = { titles: string[]; index: number; key?: string };

type FormStepsContextValue = {
  steps: FormSteps;
  hasPrevious: boolean;
  onPageShown: (key: string, title: string) => void;
  setPrevious: (hasPrevious: boolean, onPrevious?: () => void) => void;
  goBack: () => void;
};

const FormStepsContext = createContext<FormStepsContextValue>({
  steps: { titles: [], index: -1 },
  hasPrevious: false,
  onPageShown: () => {},
  setPrevious: () => {},
  goBack: () => {},
});

const StepHeader = ({ pydanticFormSchema }: PydanticFormHeaderProps) => {
  const t = useTranslations('pydanticForms.userInputForm');
  const { steps, hasPrevious, onPageShown, goBack } = useContext(FormStepsContext);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const rawTitle = pydanticFormSchema?.title;
  const title = rawTitle && rawTitle !== 'unknown' ? rawTitle : '';
  const fieldNames = Object.keys(pydanticFormSchema?.properties ?? {});
  // pydantic-forms renders the header once with an empty schema while loading; that is not a form page
  const isFormPage = fieldNames.length > 0;
  const pageKey = `${title}|${fieldNames.join(',')}`;

  useEffect(() => {
    if (isFormPage) onPageShown(pageKey, title);
  }, [isFormPage, pageKey, title, onPageShown]);

  // Move focus to the new step title, but not on the first page load
  useEffect(() => {
    if (steps.index > 0 || hasPrevious) headingRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [steps.index]);

  if (!isFormPage) return null;

  return (
    <div>
      {hasPrevious && (
        <EuiButtonEmpty size="s" flush="left" iconType="arrowLeft" onClick={goBack}>
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

const StepRow: RowRenderComponent = ({ title, description, error, isInvalid, required, children }) => (
  <div css={{ marginBottom: 24 }} data-testid="pydantic-form-row">
    {title && (
      <EuiFormLabel isInvalid={isInvalid} css={{ display: 'block' }}>
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

const StepFooter = ({
  hasNext,
  hasPrevious,
  onPrevious,
  buttons,
  isTask,
}: PydanticFormFooterProps & { isTask: boolean }) => {
  const t = useTranslations('pydanticForms.userInputForm');
  const { setPrevious } = useContext(FormStepsContext);

  useEffect(() => {
    setPrevious(hasPrevious, onPrevious);
  }, [hasPrevious, onPrevious, setPrevious]);

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
        <EuiButton
          fill
          type="submit"
          iconSide="right"
          iconType={hasNext ? 'arrowRight' : () => <WfoPlayCircle color="currentColor" />}
        >
          {label}
        </EuiButton>
      </EuiFlexGroup>
    </div>
  );
};

const WfoFormStepList = ({ steps, isTask }: { steps: FormSteps; isTask: boolean }) => {
  const t = useTranslations('pydanticForms.userInputForm');
  const { theme } = useOrchestratorTheme();

  const items = [
    ...steps.titles.map((title, i) => ({
      label: title || t('stepNumber', { number: i + 1 }),
      state:
        i < steps.index ? 'done'
        : i === steps.index ? 'current'
        : 'upcoming',
    })),
    { label: isTask ? t('startTask') : t('startWorkflow'), state: 'upcoming' },
  ];

  return (
    <EuiPanel hasBorder hasShadow={false} paddingSize="m" css={{ position: 'sticky', top: theme.size.l }}>
      <ol css={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {items.map(({ label, state }, i) => (
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
                width: 2,
                background: state === 'done' ? theme.colors.primary : theme.colors.borderBasePlain,
              },
            }}
          >
            <span
              css={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: 20,
                height: 20,
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                border: `2px solid ${state === 'upcoming' ? theme.colors.borderBasePlain : theme.colors.primary}`,
                background: state === 'done' ? theme.colors.primary : theme.colors.backgroundBasePlain,
              }}
            >
              {state === 'done' && <EuiIcon type="check" size="s" color="ghost" />}
              {state === 'current' && (
                <span css={{ width: 8, height: 8, borderRadius: '50%', background: theme.colors.primary }} />
              )}
            </span>
            <EuiText size="xs" color="subdued">
              {i < items.length - 1 ? t('stepNumber', { number: i + 1 }) : '\u00a0'}
            </EuiText>
            <EuiText
              size="s"
              css={{
                fontWeight: state === 'current' ? theme.font.weight.bold : theme.font.weight.regular,
                color:
                  state === 'current' ? theme.colors.primary
                  : state === 'upcoming' ? theme.colors.textSubdued
                  : undefined,
              }}
            >
              {label}
            </EuiText>
          </li>
        ))}
      </ol>
    </EuiPanel>
  );
};

export const WfoWorkflowHelpFlyout = ({
  workflowName,
  title,
  onClose,
}: {
  workflowName: string;
  title: string;
  onClose: () => void;
}) => {
  const t = useTranslations('workflowGuide');
  const { data, isLoading, isError } = useGetWorkflowGuideQuery({ workflowName });
  const content = data?.content ?? '';

  return (
    <EuiFlyout onClose={onClose} size="s" ownFocus aria-labelledby="workflow-help-title">
      <EuiFlyoutHeader hasBorder>
        <EuiTitle size="s">
          <h2 id="workflow-help-title">{title}</h2>
        </EuiTitle>
      </EuiFlyoutHeader>
      <EuiFlyoutBody>
        {(isLoading && <EuiLoadingSpinner size="m" />)
          || ((isError || !content) && (
            <EuiText size="m" color="subdued">
              {t('noGuideAvailable')}
            </EuiText>
          )) || <EuiMarkdownFormat>{content}</EuiMarkdownFormat>}
      </EuiFlyoutBody>
    </EuiFlyout>
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
  const { showWorkflowUserGuide } = useGetOrchestratorConfig();
  const [isHelpOpen, setIsHelpOpen] = useState(false);
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
  const goingBack = useRef(false);
  const previousRef = useRef<(() => void) | undefined>(undefined);

  const onPageShown = useCallback((key: string, title: string) => {
    const back = goingBack.current;
    goingBack.current = false;
    setSteps((current) => {
      if (current.key === key) return current;
      if (back) return { ...current, index: Math.max(0, current.index - 1), key };
      const index = current.index + 1;
      return { titles: [...current.titles.slice(0, index), title], index, key };
    });
  }, []);

  const setPrevious = useCallback((has: boolean, onPrevious?: () => void) => {
    previousRef.current = onPrevious;
    setHasPrevious(has);
  }, []);

  const goBack = useCallback(() => {
    goingBack.current = true;
    previousRef.current?.();
  }, []);

  const contextValue = useMemo(
    () => ({ steps, hasPrevious, onPageShown, setPrevious, goBack }),
    [steps, hasPrevious, onPageShown, setPrevious, goBack],
  );

  const renderers = useMemo(
    () => ({
      headerRenderer: StepHeader,
      rowRenderer: StepRow,
      footerRenderer: (props: PydanticFormFooterProps) => <StepFooter {...props} isTask={isTask} />,
    }),
    [isTask],
  );

  const handleCancel = () =>
    showConfirmDialog({
      question: t('previousQuestion'),
      onConfirm: () => router.replace(isTask ? PATH_TASKS : PATH_WORKFLOWS),
    });

  const headerButtons = [
    ...(showWorkflowUserGuide ?
      [
        <EuiButton key="help" iconType="question" onClick={() => setIsHelpOpen(true)}>
          {t('help')}
        </EuiButton>,
      ]
    : []),
    <EuiButton key="cancel" onClick={handleCancel}>
      {t('cancel')}
    </EuiButton>,
  ];

  return (
    <FormStepsContext.Provider value={contextValue}>
      <WfoContentHeader title={<WfoTitleWithWebsocketBadge title={pageTitle} />}>{headerButtons}</WfoContentHeader>
      <EuiFlexGroup gutterSize="xl" alignItems="flexStart">
        <EuiFlexItem grow={false} css={{ width: 240 }}>
          <WfoFormStepList steps={steps} isTask={isTask} />
        </EuiFlexItem>
        <EuiFlexItem css={{ maxWidth: 640, minWidth: 0 }}>
          <EuiPanel hasBorder hasShadow={false} paddingSize="l">
            <WfoPydanticForm
              processName={processName}
              startProcessPayload={startProcessPayload}
              isTask={isTask}
              renderers={renderers}
            />
          </EuiPanel>
        </EuiFlexItem>
      </EuiFlexGroup>
      {isHelpOpen && (
        <WfoWorkflowHelpFlyout workflowName={processName} title={pageTitle} onClose={() => setIsHelpOpen(false)} />
      )}
    </FormStepsContext.Provider>
  );
};
