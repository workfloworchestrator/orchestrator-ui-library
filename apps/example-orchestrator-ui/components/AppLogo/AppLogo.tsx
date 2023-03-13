import React, { ReactElement } from 'react';
import { EuiFlexGroup, EuiFlexItem } from '@elastic/eui';
import Image from 'next/image';
import Logo from './logo-orchestrator.svg';

export function getAppLogo(navigationLogo: number): ReactElement {
    return (
        <EuiFlexGroup alignItems="center" css={{ height: navigationLogo }}>
            <EuiFlexItem>
                <Image
                    src={Logo}
                    alt="Orchestrator Logo"
                    width={134}
                    height={32}
                />
            </EuiFlexItem>
        </EuiFlexGroup>
    );
}
