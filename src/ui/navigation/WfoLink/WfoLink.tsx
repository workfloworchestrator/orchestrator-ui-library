import { mergeProps } from '@base-ui/react/merge-props';
import { useRender } from '@base-ui/react/use-render';

import styles from './WfoLink.module.css';

export type WfoLinkProps = useRender.ComponentProps<'a'>;

/**
 * Goes to another page or place. It renders an `<a>` and takes the font of the text or heading around it.
 * For an action on the same page, use `WfoButton`. Takes every native `<a>` prop.
 * For a router link, pass the router's link in `render`, for example `render={<NextLink href="/workflows" />}`.
 */
export const WfoLink = ({ render, ...linkProps }: WfoLinkProps) =>
  useRender({ defaultTagName: 'a', render, props: mergeProps<'a'>({ className: styles.root }, linkProps) });
