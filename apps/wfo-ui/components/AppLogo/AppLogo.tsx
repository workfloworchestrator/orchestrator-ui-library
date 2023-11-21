import React, { ReactElement } from 'react';

import Image from 'next/image';

import { EuiFlexGroup, EuiFlexItem } from '@elastic/eui';

import Logo from './logo-orchestrator.svg';

export function getAppLogo(navigationLogo: number): ReactElement {
    return (
        <EuiFlexGroup alignItems="center" css={{ height: navigationLogo }}>
            <EuiFlexItem>
                <Image
                    priority
                    src={Logo}
                    alt="Orchestrator Logo"
                    width={134}
                    height={32}
                />
            </EuiFlexItem>
        </EuiFlexGroup>
    );
}
