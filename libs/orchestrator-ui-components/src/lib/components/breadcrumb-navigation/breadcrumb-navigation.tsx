import React, { useCallback, useEffect, useState } from 'react';
import { EuiBreadcrumb, EuiBreadcrumbs } from '@elastic/eui';
import { NextRouter } from 'next/router';

interface IProps {
    router: NextRouter;
}

export const BreadcrumbNavigation = ({ router }: IProps) => {
    const [breadcrumbs, setBreadcrumbs] = useState<EuiBreadcrumb[]>([]);
    const renderBreadCrumbs = useCallback(() => {
        const route = router.asPath;
        const parts = route.split('/').slice(1);

        let routeString = '';
        const routes: string[] = [];
        parts.map((part) => {
            routeString += '/' + part;
            routes.push(routeString);
        });

        const newBreadcrumbs: EuiBreadcrumb[] = [
            {
                text: 'Start',
                href: '#',
                onClick: () => {
                    router.push('/');
                },
            },
        ];

        if (route !== '/') {
            for (let i = 0; i < parts.length; i++) {
                const part = parts[i];
                newBreadcrumbs.push({
                    text: part.charAt(0).toUpperCase() + part.slice(1),
                    href: '#',
                    onClick: () => {
                        router.push(routes[i]);
                    },
                });
            }
        }

        newBreadcrumbs.push({
            text: '',
        });

        setBreadcrumbs(newBreadcrumbs);
    }, [router, setBreadcrumbs]);
    useEffect(() => {
        renderBreadCrumbs();
    }, [renderBreadCrumbs, router.asPath]);

    return (
        <EuiBreadcrumbs
            breadcrumbs={breadcrumbs}
            truncate={false}
            aria-label="Current page"
        />
    );
};
