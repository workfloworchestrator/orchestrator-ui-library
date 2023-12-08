import React, { useContext, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import { useTranslations } from 'next-intl';

import { EuiRadioGroup } from '@elastic/eui';
import {
    WfoSubmitModal,
    useOrchestratorTheme,
    useSessionWithToken,
} from '@orchestrator-ui/orchestrator-ui-components';

import { PATCH_IMPACT_OVERRIDE_ENDPOINT } from '@/constants-surf';
import { SurfConfigContext } from '@/contexts/SurfConfigContext';
import { ImpactLevel, ServiceTicketWithDetails } from '@/types';

interface PatchImpactOverridePayload {
    impact_override: ImpactLevel;
    serviceTicketId: string;
    index: number;
}

const usePatchImpactedObject = () => {
    const queryClient = useQueryClient();
    const { session } = useSessionWithToken();
    const { cimApiBaseUrl } = useContext(SurfConfigContext);
    let requestHeaders = {};

    if (session) {
        const { accessToken } = session;

        requestHeaders = {
            Authorization: `Bearer ${accessToken}`,
        };
    }

    let serviceTicketId = '';
    const setImpactOverride = async (payload: PatchImpactOverridePayload) => {
        serviceTicketId = payload.serviceTicketId;

        const data = {
            impact_override: payload.impact_override,
        };

        const response = await fetch(
            cimApiBaseUrl +
                PATCH_IMPACT_OVERRIDE_ENDPOINT +
                serviceTicketId +
                '/' +
                payload.index,
            {
                method: 'PATCH',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                    ...requestHeaders,
                },
            },
        );
        return await response.json();
    };

    return useMutation(setImpactOverride, {
        onMutate: () => {
            queryClient.setQueryData(['serviceTickets', serviceTicketId], null); // Set loading state of the button
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['serviceTickets', serviceTicketId]);
        },
    });
};

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
