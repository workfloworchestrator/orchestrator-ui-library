import React from 'react';
import { EuiBreadcrumb, EuiBreadcrumbs, EuiSpacer } from '@elastic/eui';
import { useRouter } from 'next/router';
import { containsUuid4, isUuid4, upperCaseFirstChar } from '../../utils';

export const Breadcrumbs = () => {
    const router = useRouter();
    // Setup initial breadcrumbs with navigation to home
    const breadcrumbs: EuiBreadcrumb[] = [
        {
            text: 'Start',
            href: '/',
            onClick: (e) => {
                e.preventDefault();
                router.push('/');
            },
        },
    ];

    // Handle remaining breadcrumbs dynamic
    const parts = router.asPath.split('/');
    parts.forEach((p, index) => {
        if (index > 0) {
            let link = parts.slice(0, index + 1).join('/');
            if (link.includes('?')) {
                link = link.split('?').slice(0, -1).join();
            }
            // Handle UUID's: so you can have breadcrumb like: `Start / Subscriptions / 12312aa-cbc ...`
            let text = isUuid4(p) ? p : upperCaseFirstChar(p);
            if (text.includes('?')) {
                text = upperCaseFirstChar(text.split('?').slice(0, -1).join());
            }

            breadcrumbs.push({
                text: text,
                href: link,
                onClick: (e) => {
                    e.preventDefault();
                    if (
                        text === 'Subscriptions' &&
                        containsUuid4(router.asPath)
                    ) {
                        // Todo: make URLS more consistent or design a better way to handle breadcrumbs
                        // When possible try to use the browser back; so the user has active tab + correct page
                        router.back();
                    } else {
                        router.push(link);
                    }
                },
            });

            // Handle tabs if any
            const tabs = parts.slice(0, index + 1).join('/');
            if (tabs.includes('?activeTab=')) {
                const tabName = upperCaseFirstChar(
                    tabs.split('?activeTab=')[1].split('&')[0],
                );
                breadcrumbs.push({
                    text: tabName,
                    href: `/subscriptions?activeTab=${tabName}`,
                    onClick: (e) => {
                        e.preventDefault();
                        router.push(`/subscriptions?activeTab=${tabName}`);
                    },
                });
            }
        }
    });

    return (
        <>
            <EuiBreadcrumbs
                breadcrumbs={breadcrumbs}
                truncate={false}
                aria-label="Current page"
            />
            <EuiSpacer size="m" />
        </>
    );
};
