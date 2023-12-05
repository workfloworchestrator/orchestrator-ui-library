import React, { useContext, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import { useTranslations } from 'next-intl';

import {
    EuiDescriptionList,
    EuiDescriptionListDescription,
    EuiDescriptionListTitle,
    EuiRadioGroup,
    EuiSpacer,
    EuiSuperSelect,
    EuiText,
} from '@elastic/eui';
import {
    EngineStatus,
    OrchestratorConfigContext,
    WfoBadge,
    WfoSubmitModal,
    useEngineStatusMutation,
    useOrchestratorTheme,
    useSessionWithToken,
} from '@orchestrator-ui/orchestrator-ui-components';

import { ORCHESTRATOR_CIM_BASE_URL } from '../../constants';
import { PATCH_IMPACT_OVERRIDE_ENDPOINT } from '../../constants-surf';
import {
    ImpactLevel,
    ImpactTableColumns,
    ImpactedObjectWithIndex,
    ServiceTicketWithDetails,
} from '../../types';
import { WfoImpactLevelBadge } from '../WfoBadges/WfoImpactLevelBadge';

interface PatchImpactOverridePayload {
    impact_override: ImpactLevel;
    serviceTicketId: string;
    index: number;
}

const usePatchImpactedObject = () => {
    const queryClient = useQueryClient();
    const { session } = useSessionWithToken();
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
            ORCHESTRATOR_CIM_BASE_URL +
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
        console.log('serviceTicketId', serviceTicketId);
        return await response.json();
    };

    return useMutation(setImpactOverride, {
        onMutate: () => {
            console.log('serviceTicketId2', serviceTicketId);
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
    const [value, setValue] = useState(impactedObject.impact_override);
    const t = useTranslations(
        'cim.serviceTickets.detail.tabDetails.general.subscriptionImpactTable',
    );
    const { theme } = useOrchestratorTheme();
    const { mutate, data } = usePatchImpactedObject();
    const { isLoading } = useQuery(['serviceTickets', serviceTicketDetail._id]);

    const onChange = (value: any) => {
        setValue(value);
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
        // inputDisplay: <WfoImpactLevelBadge impactedObjectImpact={value} />,
        // 'data-test-subj': 'superSelectOption',
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
                name="radio group"
            />
        </WfoSubmitModal>
    );
};
