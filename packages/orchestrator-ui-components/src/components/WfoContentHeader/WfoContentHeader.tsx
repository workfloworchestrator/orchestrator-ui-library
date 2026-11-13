import React, { FC, ReactElement } from 'react';

import { EuiFlexGroup, EuiFlexItem, EuiPageHeader, EuiSpacer, EuiSpacerProps } from '@elastic/eui';

import { WfoRenderElementOrString } from '@/components';

export type WfoContentHeaderProps = {
  title: ReactElement | string;
  subtitle?: ReactElement | string;
  children?: ReactElement | ReactElement[] | string;
  spacerSize?: EuiSpacerProps['size'];
};

export const WfoContentHeader: FC<WfoContentHeaderProps> = ({ title, subtitle, children, spacerSize = 'l' }) => (
  <>
    <EuiFlexGroup>
      <EuiFlexItem>
        <WfoRenderElementOrString renderString={(value) => <EuiPageHeader pageTitle={value} />}>
          {title}
        </WfoRenderElementOrString>
        {subtitle && (
          <div>
            <EuiSpacer size="s" />
            <WfoRenderElementOrString>{subtitle}</WfoRenderElementOrString>
          </div>
        )}
      </EuiFlexItem>

      {children && (
        <EuiFlexItem grow={0}>
          <EuiFlexGroup justifyContent="flexEnd" alignItems="flexStart">
            <WfoRenderElementOrString>{children}</WfoRenderElementOrString>
          </EuiFlexGroup>
        </EuiFlexItem>
      )}
    </EuiFlexGroup>

    <EuiSpacer size={spacerSize} />
  </>
);
