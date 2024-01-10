import React from 'react';

import { useRouter } from 'next/router';

import { EuiFlexGroup, EuiFlexItem, EuiPanel, EuiText } from '@elastic/eui';
import {
    WfoPlusCircleFill,
    useOrchestratorTheme,
} from '@orchestrator-ui/orchestrator-ui-components';

import { EmailListItem } from '@/types';

import { getStyles } from './styles';

export const WfoSendEmailButton = ({
    emailListItem,
}: {
    emailListItem: EmailListItem;
}) => {
    const { theme } = useOrchestratorTheme();
    const { sendEmailButtonStyle } = getStyles(theme);
    const router = useRouter();

    const navigateToNewEmailPage = () => {
        const currentPath = router.asPath;
        router.push(`${currentPath}/new-email`);
    };

    return (
        <EuiPanel
            onClick={navigateToNewEmailPage}
            paddingSize={'l'}
            hasShadow={false}
            hasBorder={false}
            css={sendEmailButtonStyle}
        >
            <EuiFlexGroup
                alignItems="center"
                gutterSize="xs"
                justifyContent="center"
            >
                <EuiFlexItem grow={false}>
                    <WfoPlusCircleFill color={theme.colors.primaryText} />
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                    <EuiText color={theme.colors.primaryText}>
                        send new {emailListItem.step.status.toUpperCase()} email
                    </EuiText>
                </EuiFlexItem>
            </EuiFlexGroup>
        </EuiPanel>
    );
};
