import React from 'react';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/router';

import {
    EuiBreadcrumb,
    EuiBreadcrumbs,
    EuiButtonIcon,
    EuiFlexGroup,
    EuiFlexItem,
    EuiSpacer,
} from '@elastic/eui';

import { useOrchestratorTheme } from '@/hooks';
import { WfoSideMenu } from '@/icons';
import {
    isAllUpperCase,
    isUuid4,
    removeSuffix,
    upperCaseFirstChar,
} from '@/utils';

interface WfoBreadcrumbsProps {
    handleSideMenuClick: () => void;
}

export const WfoBreadcrumbs = ({
    handleSideMenuClick,
}: WfoBreadcrumbsProps) => {
    const router = useRouter();
    const { theme } = useOrchestratorTheme();
    const t = useTranslations('main');
    // Setup initial breadcrumbs with navigation to home
    const breadcrumbs: EuiBreadcrumb[] = [
        {
            text: t('start'),
            href: '/',
            onClick: (e) => {
                e.preventDefault();
                router.push('/').then();
            },
        },
    ];

    // Handle remaining breadcrumbs dynamic
    const parts = router.asPath.split('/');
    parts.forEach((p, index) => {
        if (index > 0) {
            const link = parts.slice(0, index + 1).join('/');
            // Handle UUID's: so you can have breadcrumb like: `Start / Subscriptions / b2312aa-cbc ...`
            // first remove the suffix, like ?activeTab=....
            const _p = removeSuffix(p);
            const text =
                isUuid4(_p) || isAllUpperCase(_p) ? _p : upperCaseFirstChar(_p);

            breadcrumbs.push({
                text: text,
                href: link,
                onClick: (e) => {
                    e.preventDefault();
                    router.push(link).then();
                },
            });
        }
    });

    return (
        <>
            <EuiFlexGroup
                direction="row"
                alignItems="center"
                justifyContent="flexStart"
                gutterSize="none"
            >
                <EuiFlexItem grow={0}>
                    <EuiButtonIcon
                        aria-label={t('ariaLabelToggleSideMenu')}
                        display="empty"
                        iconType={() => (
                            <WfoSideMenu color={theme.colors.subduedText} />
                        )}
                        color="text"
                        css={{
                            width: `${theme.size.l}px`,
                            height: `${theme.size.l}px`,
                            marginRight: `${theme.base * 0.375}px`,
                        }}
                        onClick={handleSideMenuClick}
                    />
                </EuiFlexItem>
                <EuiFlexItem>
                    <EuiBreadcrumbs
                        breadcrumbs={breadcrumbs}
                        truncate={false}
                        aria-label={t('ariaLabelCurrentPage')}
                    />
                </EuiFlexItem>
            </EuiFlexGroup>
            <EuiSpacer size="m" />
        </>
    );
};
