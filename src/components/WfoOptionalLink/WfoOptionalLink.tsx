import React, { FC, ReactNode } from 'react';

import Link from 'next/link';
import type { UrlObject } from 'url';

export type WfoOptionalLinkProps = {
  children: ReactNode;
  href?: UrlObject | string;
};

export const WfoOptionalLink: FC<WfoOptionalLinkProps> = ({ children, href }) => {
  if (!href) {
    return <span>{children}</span>;
  }

  return <Link href={href}>{children}</Link>;
};
