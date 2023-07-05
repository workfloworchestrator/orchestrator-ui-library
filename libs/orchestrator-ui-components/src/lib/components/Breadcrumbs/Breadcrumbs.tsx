import React from 'react';
import { EuiBreadcrumb, EuiBreadcrumbs, EuiSpacer } from '@elastic/eui';
import { useRouter } from 'next/router';
import { isUuid4, removeSuffix, upperCaseFirstChar } from '../../utils';

export const Breadcrumbs = () => {
    const router = useRouter();
    // Setup initial breadcrumbs with navigation to home
    const breadcrumbs: EuiBreadcrumb[] = [
        {
            text: 'Start',
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
            const link = removeSuffix(parts.slice(0, index + 1).join('/'));
            // Handle UUID's: so you can have breadcrumb like: `Start / Subscriptions / 12312aa-cbc ...`
            const text = isUuid4(p) ? p : removeSuffix(upperCaseFirstChar(p));

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
            <EuiBreadcrumbs
                breadcrumbs={breadcrumbs}
                truncate={false}
                aria-label="Current page"
            />
            <EuiSpacer size="m" />
        </>
    );
};
