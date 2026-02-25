/**
 * Pydantic Forms
 *
 * Form footer component
 */
import React, { useCallback, useContext, useEffect } from 'react';

import { useTranslations } from 'next-intl';
import type { PydanticFormFooterProps } from 'pydantic-forms';

import { EuiButton, EuiFlexGroup, EuiHorizontalRule } from '@elastic/eui';

import { ConfirmationDialogContext } from '@/contexts';
import { useOrchestratorTheme } from '@/hooks';
import { WfoPlayCircle } from '@/icons';
import { WfoComputedTheme } from '@/theme';

import { RenderFormErrors } from './RenderFormErrors';

type FooterProps = PydanticFormFooterProps & {
  isTask?: boolean;
};

const submitButtonId = 'button-submit-form-submit';
const previousButtonId = 'button-submit-form-previous';
const cancelButtonId = 'button-submit-form-cancel';

export const Footer = ({ onCancel, onPrevious, hasNext, hasPrevious, isTask = false, buttons }: FooterProps) => {
  const { theme } = useOrchestratorTheme();
  const t = useTranslations('pydanticForms.userInputForm');
  const { showConfirmDialog } = useContext(ConfirmationDialogContext);

  const handlePrevious = useCallback(() => {
    if (onCancel) {
      showConfirmDialog({
        question: t('previousQuestion'),
        onConfirm: onCancel,
      });
    }
  }, [onCancel, showConfirmDialog, t]);

  const { next, previous } = buttons || {};

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const isPrimary = event.metaKey || event.ctrlKey;

      if (isPrimary && event.key === 'ArrowLeft') {
        event.preventDefault();

        if (hasPrevious) {
          onPrevious?.();
        } else {
          handlePrevious();
        }
      }

      if (isPrimary && event.key === 'ArrowRight') {
        event.preventDefault();
        document.getElementById(submitButtonId)?.click();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasPrevious, hasNext, onPrevious, onCancel, handlePrevious]);

  const PreviousButton = () => {
    const previousButtonColor =
      theme.colors[
        (previous?.color as keyof WfoComputedTheme['colors']) ?? ('primary' as keyof WfoComputedTheme['colors'])
      ];

    return (
      <EuiButton
        data-testid={previousButtonId}
        id={previousButtonId}
        tabIndex={0}
        fill
        onClick={() => {
          if (onPrevious) {
            onPrevious();
          }
        }}
        css={{
          backgroundColor: previousButtonColor.toString(),
          padding: '12px',
        }}
        iconSide="right"
        aria-label={t('previous')}
      >
        {previous?.text ?? t('previous')}
      </EuiButton>
    );
  };

  const CancelButton = () => (
    <div
      data-testid={cancelButtonId}
      onClick={handlePrevious}
      css={{
        cursor: 'pointer',
        color: theme.colors.link,
        fontWeight: theme.font.weight.bold,
        marginLeft: theme.base / 2,
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {t('cancel')}
    </div>
  );

  const SubmitButton = () => {
    /*
     * The submit button is used to submit the form data.
     * If there is a next step, it will be labeled as "Next".
     * If there is no next step, it will be labeled as "Start Workflow".
     * If there is a label provided in the buttonNextProps, it will be used instead.
     * The button is styled with primary color and has an icon on the right side.
     * We don't use the disable property based on the form valid state here. When calculating the form valid state
     * react-hook-form might return a false negative - marking the form invalid - when not all fields have a defaultValue
     * which is a valid use case. https://chatgpt.com/share/6874ce66-35e8-800c-9434-725ff895ac44
     */

    const submitButtonTranslated =
      hasNext ? t('next')
      : isTask ? t('startTask')
      : t('startWorkflow');

    const submitButtonLabel = next?.text ?? submitButtonTranslated;
    const submitIconType = !hasNext && !next?.text ? () => <WfoPlayCircle color="currentColor" /> : undefined;
    const submitButtonColor = next?.color ? (next?.color as keyof WfoComputedTheme['colors']) : 'primary';

    return (
      <EuiButton
        data-testid={submitButtonId}
        id={submitButtonId}
        tabIndex={0}
        fill
        css={{
          backgroundColor: submitButtonColor,
          padding: '12px',
        }}
        type="submit"
        iconSide="right"
        iconType={submitIconType}
        aria-label={submitButtonLabel}
      >
        {submitButtonLabel}
      </EuiButton>
    );
  };

  const PreviousCancelButtonGroup = () => {
    return (
      <EuiFlexGroup gutterSize="xl">
        <PreviousButton />
        <CancelButton />
      </EuiFlexGroup>
    );
  };

  return (
    <div data-testid="pydantic-form-footer">
      <RenderFormErrors />
      <EuiHorizontalRule />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>{(hasPrevious && <PreviousCancelButtonGroup />) || <CancelButton />}</div>

        <SubmitButton />
      </div>
    </div>
  );
};
