import React, { ButtonHTMLAttributes, ReactNode, forwardRef } from 'react';

import { Button } from '@base-ui/react/button';

import { joinClassNames } from '@/utils/joinClassNames';

import { WfoSpinner } from '../../feedback/WfoSpinner';
import styles from './WfoButton.module.css';

export type WfoButtonVariant = 'primary' | 'secondary' | 'ghost';
export type WfoButtonColor = 'default' | 'danger';
export type WfoButtonSize = 'small' | 'medium';

export type WfoButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> & {
  /** primary: filled, the main action. secondary: outlined. ghost: text only, for toolbars. */
  variant?: WfoButtonVariant;
  /** danger: for actions that delete or stop something. */
  color?: WfoButtonColor;
  /** small: in dense places such as toolbars and card headers. */
  size?: WfoButtonSize;
  /** Decorative icon. Screen readers skip it. Without children, give the button an aria-label. */
  icon?: ReactNode;
  /** Side of the text where the icon goes. */
  iconPosition?: 'start' | 'end';
  /** Shows a spinner in place of the icon and blocks clicks. The button stays focusable. */
  isLoading?: boolean;
  /** Takes the full width of its container. */
  isFullWidth?: boolean;
};

/**
 * Starts an action, for example save or reset. To go to another page, use `WfoLink`.
 * Takes every native `<button>` prop. Replaces EuiButton, EuiButtonEmpty and EuiButtonIcon.
 */
export const WfoButton = forwardRef<HTMLButtonElement, WfoButtonProps>(
  (
    {
      variant = 'primary',
      color = 'default',
      size = 'medium',
      icon,
      iconPosition = 'start',
      isLoading = false,
      isFullWidth = false,
      disabled,
      className,
      children,
      ...buttonProps
    },
    ref,
  ) => {
    const iconSlot = (isLoading || icon) && (
      <span aria-hidden="true" className={styles.icon}>
        {isLoading ?
          <WfoSpinner label="" />
        : icon}
      </span>
    );

    return (
      <Button
        {...buttonProps}
        ref={ref}
        disabled={disabled || isLoading}
        focusableWhenDisabled={isLoading}
        aria-busy={isLoading || undefined}
        data-variant={variant}
        data-color={color}
        data-size={size}
        data-icon-only={children ? undefined : ''}
        data-full-width={isFullWidth ? '' : undefined}
        className={joinClassNames(styles.root, className)}
      >
        {iconPosition === 'start' && iconSlot}
        {children}
        {iconPosition === 'end' && iconSlot}
      </Button>
    );
  },
);
WfoButton.displayName = 'WfoButton';
