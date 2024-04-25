import React from 'react';

import type { WfoTableColumns } from '@/components';

import { TableLoader } from './TableLoader';
import { WfoMetadataPageLayout } from './WfoMetadataPageLayout';

export const WfoTestPage = () => {
    const dataLoader = () => {
        return Promise.resolve({
            data: ['a', 'b', 'c'],
            total: 0,
        });
    };

    const tableColumns: WfoTableColumns<TaskListItem> = {
        name: {
            field: 'name',
            name: t('name'),
            width: '20%',
            render: (name) => (
                <WfoProductBlockBadge badgeType={BadgeType.TASK}>
                    {name}
                </WfoProductBlockBadge>
            ),
        },
        description: {
            field: 'description',
            name: t('description'),
            width: '40%',
        },
    };

    return (
        <WfoMetadataPageLayout>
            <div>
                <TableLoader dataLoader={dataLoader} data={[]} columns={[]} />
            </div>
        </WfoMetadataPageLayout>
    );
};
