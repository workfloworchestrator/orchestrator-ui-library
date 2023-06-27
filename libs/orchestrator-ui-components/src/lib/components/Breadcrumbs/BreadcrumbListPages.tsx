import React from 'react';
import { EuiBreadcrumb, EuiBreadcrumbs, EuiSpacer } from '@elastic/eui';

interface IProps {
    route: string;
    routeTo: (route: string) => void;
}

export const BreadcrumbListPages = ({ route, routeTo }: IProps) => {
    // Setup initial breadcrumbs with navigation to home
    const breadcrumbs: EuiBreadcrumb[] = [
        {
            text: 'Start',
            href: '/',
            onClick: (e) => {
                e.preventDefault();
                routeTo('/');
            },
        },
    ];

    // Handle remaining breadcrumbs dynamic
    const parts = route.split('/');
    parts.forEach((p, index) => {
        if (index > 0) {
            let link = parts.slice(0, index + 1).join('/');
            if (link.includes('?')) {
                link = link.split('?').slice(0, -1).join();
            }
            let text = p.includes('-')
                ? p
                : p.charAt(0).toUpperCase() + p.slice(1);
            if (text.includes('?')) {
                text = text.split('?').slice(0, -1).join();
            }
            breadcrumbs.push({
                text: text,
                href: link,
                onClick: (e) => {
                    e.preventDefault();
                    routeTo(link);
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
