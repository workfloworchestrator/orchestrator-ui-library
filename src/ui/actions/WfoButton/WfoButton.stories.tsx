import React from 'react';

import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { WfoRefresh } from '@/icons';
import { withRow } from '@/storybook/decorators';

import { WfoButton } from './WfoButton';

const icon = <WfoRefresh width={16} height={16} color="currentColor" />;

const meta: Meta<typeof WfoButton> = {
  title: 'Design system/Button',
  component: WfoButton,
  args: { children: 'Reset layout', variant: 'primary', color: 'default', size: 'medium', iconPosition: 'start' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'ghost'] },
    color: { control: 'inline-radio', options: ['default', 'danger'] },
    size: { control: 'inline-radio', options: ['small', 'medium'] },
    iconPosition: { control: 'inline-radio', options: ['start', 'end'] },
    icon: { control: false },
  },
};
export default meta;

type Story = StoryObj<typeof WfoButton>;

/** Change every prop in the controls. */
export const Playground: Story = { args: { icon } };

/** primary for the main action, secondary next to it, ghost in toolbars. */
export const Variants: Story = {
  decorators: [withRow],
  render: () => (
    <>
      <WfoButton variant="primary">Save</WfoButton>
      <WfoButton variant="secondary">Cancel</WfoButton>
      <WfoButton variant="ghost">Reset layout</WfoButton>
    </>
  ),
};

/** For actions that delete or stop something. */
export const Danger: Story = {
  decorators: [withRow],
  render: () => (
    <>
      <WfoButton color="danger">Delete</WfoButton>
      <WfoButton color="danger" variant="secondary">
        Delete
      </WfoButton>
      <WfoButton color="danger" variant="ghost">
        Delete
      </WfoButton>
    </>
  ),
};

/** The icon goes before or after the text. Without text, give the button an `aria-label`. */
export const WithIcon: Story = {
  decorators: [withRow],
  render: () => (
    <>
      <WfoButton icon={icon}>Refresh</WfoButton>
      <WfoButton icon={icon} iconPosition="end">
        Refresh
      </WfoButton>
      <WfoButton variant="ghost" icon={icon} aria-label="Refresh" />
    </>
  ),
};

/** small for dense places such as toolbars and card headers. */
export const Sizes: Story = {
  decorators: [withRow],
  render: () => (
    <>
      <WfoButton size="small">Small</WfoButton>
      <WfoButton size="medium">Medium</WfoButton>
    </>
  ),
};

/** isLoading shows a spinner and blocks clicks, but the button stays focusable. */
export const States: Story = {
  decorators: [withRow],
  render: () => (
    <>
      <WfoButton isLoading>Saving</WfoButton>
      <WfoButton disabled>Save</WfoButton>
    </>
  ),
};
