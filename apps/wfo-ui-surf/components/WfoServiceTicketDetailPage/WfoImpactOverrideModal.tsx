import React, { useState } from 'react';
import { useQuery } from 'react-query';

import { useTranslations } from 'next-intl';

import { EuiRadioGroup } from '@elastic/eui';
import {
    WfoSubmitModal,
    useOrchestratorTheme,
} from '@orchestrator-ui/orchestrator-ui-components';

import { usePatchImpactedObject } from '@/hooks/modifyResourceHooks';
import { ImpactLevel, ServiceTicketWithDetails } from '@/types';

export const WfoImpactOverrideModal = ({
    serviceTicketDetail,
    index,
    closeAction,
}: {
    serviceTicketDetail: ServiceTicketWithDetails;
    index: number;
    closeAction: () => void;
}) => {
    const impactedObject = serviceTicketDetail.impacted_objects[index];
    const [value, setValue] = useState<ImpactLevel>(
        impactedObject.impact_override,
    );
    const t = useTranslations(
        'cim.serviceTickets.detail.tabDetails.general.subscriptionImpactTable',
    );
    const { theme } = useOrchestratorTheme();
    const { mutate } = usePatchImpactedObject();
    const { isLoading } = useQuery(['serviceTickets', serviceTicketDetail._id]);

    const onChange = (value: string) => {
        setValue(value as ImpactLevel);
    };

    const handleSubmit = () => {
        mutate({
            impact_override: value,
            serviceTicketId: serviceTicketDetail._id!,
            index: index,
        });
        !isLoading && closeAction();
    };

    const options = Object.values(ImpactLevel).map((impact) => ({
        label: impact,
        id: impact,
        css: {
            color:
                value === impact
                    ? theme.colors.primary
                    : theme.colors.darkShade,
        },
    }));

    return (
        <WfoSubmitModal
            title={t('impactOverrideModalTitle')}
            onClose={closeAction}
            onSubmit={handleSubmit}
            submitButtonLabel={t('overrideImpactButton')}
        >
            <EuiRadioGroup
                options={options}
                idSelected={value}
                onChange={onChange}
            />
        </WfoSubmitModal>
    );
};
