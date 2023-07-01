import React from 'react';
import { EuiBreadcrumb, EuiBreadcrumbs, EuiSpacer } from '@elastic/eui';
import { useRouter } from 'next/router';

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
            // ugly way to handle UUID's: so you can have breadcrumb: `Start / Subscriptions / 12312aa-cbc ...`
            let text = p.includes('-')
                ? p
                : p.charAt(0).toUpperCase() + p.slice(1);
            if (text.includes('?')) {
                text = text.split('?').slice(0, -1).join();
                text =
                    text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
            }

            breadcrumbs.push({
                text: text,
                href: link,
                onClick: (e) => {
                    e.preventDefault();
                    router.push(link);
                },
            });

            const tabs = parts.slice(0, index + 1).join('/');
            if (tabs.includes('?activeTab=')) {
                let tabName = tabs.split('?activeTab=')[1].split('&')[0];
                tabName =
                    tabName.charAt(0).toUpperCase() +
                    tabName.slice(1).toLowerCase();

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
