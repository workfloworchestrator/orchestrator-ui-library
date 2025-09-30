import React, { FC } from 'react';

import Link from 'next/link';

import { PATH_WORKFLOWS, parseErrorDetail } from '@/components';

export const WfoInSyncErrorToastMessage: FC<{ errorDetail: string }> = ({
    errorDetail,
}) => {
    const { failedIds, filteredInput } = parseErrorDetail(errorDetail);

    return (
        <div css={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
            <div>{filteredInput}</div>
            {failedIds.map((processId) => {
                const processUrl = `${PATH_WORKFLOWS}/${processId}`;
                return (
                    <div key={processId}>
                        <Link href={processUrl}>{processId}</Link>
                    </div>
                );
            })}
        </div>
    );
};
