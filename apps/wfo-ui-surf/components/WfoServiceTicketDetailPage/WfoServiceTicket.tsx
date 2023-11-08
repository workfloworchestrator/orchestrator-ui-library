import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
    EuiFlexGroup,
    EuiFlexItem,
    EuiTab,
    EuiTabs,
    EuiText,
} from '@elastic/eui';
import {
    useFilterQueryWithRest,
    WfoLoading,
} from '@orchestrator-ui/orchestrator-ui-components';
import { CIM_TICKETS_ENDPOINT } from '../../constants-surf';
import { ServiceTicketTabIds, tabs } from './utils';
import { ServiceTicketDefinition } from '../../types';

type WfoServiceTicketProps = {
    serviceTicketId: string;
};

export const WfoServiceTicket = ({
    serviceTicketId,
}: WfoServiceTicketProps) => {
    const t = useTranslations('cim.serviceTickets.detail');

    const [selectedTabId, setSelectedTabId] = useState<ServiceTicketTabIds>(
        ServiceTicketTabIds.GENERAL_TAB,
    );

    const { data, isFetching } =
        useFilterQueryWithRest<ServiceTicketDefinition>(
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
                            style={{ marginBottom: 10 }}
                            justifyContent="spaceBetween"
                        >
                            <EuiFlexItem grow={true}>
                                <EuiText>
                                    <h2>{data.jira_ticket_id}</h2>
                                    {/*<h2>tosadadasds</h2>*/}
                                </EuiText>
                            </EuiFlexItem>
                            <EuiFlexItem grow={false}>
                                <EuiText>
                                    <h2>{data.process_state}</h2>
                                    {/*<h2>fdfdfdf</h2>*/}
                                </EuiText>
                            </EuiFlexItem>
                        </EuiFlexGroup>
                        <>
                            <EuiTabs>{renderTabs()}</EuiTabs>
                        </>
                    </>
                ))}
        </>
    );
};
