import React, { useState } from 'react';

import { useTranslations } from 'next-intl';

import {
    EuiButton,
    EuiFlexGroup,
    EuiFlexItem,
    EuiIcon,
    EuiTab,
    EuiTabs,
    EuiText,
} from '@elastic/eui';
import {
    WfoDropdownButton,
    WfoLoading,
    useFilterQueryWithRest,
} from '@orchestrator-ui/orchestrator-ui-components';

import { CIM_TICKETS_ENDPOINT } from '../../constants-surf';
import {
    ServiceTicketProcessState,
    ServiceTicketWithDetails,
} from '../../types';
import { ServiceTicketDropdownItems } from './WfoServiceTicketDropdownItems';
import { WfoServiceTicketGeneral } from './WfoServiceTicketGeneral';
import { ServiceTicketTabIds } from './utils';

type WfoServiceTicketProps = {
    serviceTicketId: string;
};

const abortEnabledValues: ServiceTicketProcessState[] = [
    ServiceTicketProcessState.OPEN_RELATED,
    ServiceTicketProcessState.OPEN_ACCEPTED,
    ServiceTicketProcessState.OPEN,
];

const tabs = [
    {
        id: ServiceTicketTabIds.GENERAL_TAB,
        translationKey: 'tabs.general',
        prepend: <EuiIcon type="devToolsApp" />,
        append: <></>,
    },
    {
        id: ServiceTicketTabIds.NOTIFICATION_LOG,
        translationKey: 'tabs.notificationLog',
        prepend: <EuiIcon type="bell" />,
    },
    {
        id: ServiceTicketTabIds.SENT_EMAILS,
        translationKey: 'tabs.sentEmails',
        prepend: <EuiIcon type="email" />,
    },
];

export const WfoServiceTicket = ({
    serviceTicketId,
}: WfoServiceTicketProps) => {
    const t = useTranslations('cim.serviceTickets.detail');

    const [selectedTabId, setSelectedTabId] = useState<ServiceTicketTabIds>(
        ServiceTicketTabIds.GENERAL_TAB,
    );

    const { data, isFetching } =
        useFilterQueryWithRest<ServiceTicketWithDetails>(
            CIM_TICKETS_ENDPOINT + '/' + serviceTicketId,
            ['serviceTickets', serviceTicketId],
        );

    const onSelectedTabChanged = (id: ServiceTicketTabIds) => {
        setSelectedTabId(id);
    };

    const renderTabs = () =>
        tabs.map((tab, index) => (
            <EuiTab
                key={index}
                onClick={() => onSelectedTabChanged(tab.id)}
                isSelected={tab.id === selectedTabId}
                prepend={tab.prepend}
                append={tab.append}
            >
                {t(tab.translationKey)}
            </EuiTab>
        ));

    return (
        <>
            {(isFetching && <WfoLoading />) ||
                (data && (
                    <>
                        <EuiFlexGroup
                            css={{ marginBottom: 10 }}
                            justifyContent="spaceBetween"
                        >
                            <EuiFlexItem grow={true}>
                                <EuiText>
                                    <h2>{data.title_nl}</h2>
                                </EuiText>
                            </EuiFlexItem>
                            <EuiFlexItem grow={false}>
                                <EuiFlexGroup>
                                    <EuiFlexItem grow={false}>
                                        <EuiButton
                                            iconType="error"
                                            color="danger"
                                            isDisabled={
                                                !abortEnabledValues.includes(
                                                    data.process_state,
                                                )
                                            }
                                        >
                                            {t('buttons.abort')}
                                        </EuiButton>
                                    </EuiFlexItem>
                                    <EuiFlexItem grow={false}>
                                        <WfoDropdownButton
                                            label={t('buttons.sendNewEmail')}
                                        >
                                            <ServiceTicketDropdownItems
                                                serviceTicket={data}
                                            />
                                        </WfoDropdownButton>
                                    </EuiFlexItem>
                                </EuiFlexGroup>
                            </EuiFlexItem>
                        </EuiFlexGroup>
                        <>
                            <EuiTabs>{renderTabs()}</EuiTabs>
                        </>
                        {selectedTabId === ServiceTicketTabIds.GENERAL_TAB && (
                            <WfoServiceTicketGeneral
                                serviceTicketGeneral={data}
                            />
                        )}
                    </>
                ))}
        </>
    );
};
