import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import {
    EuiButton,
    EuiFlexGroup,
    EuiFlexItem,
    EuiTab,
    EuiTabs,
    EuiText,
    EuiButtonGroup,
    EuiPopover,
} from '@elastic/eui';
import {
    useFilterQueryWithRest,
    WfoLoading,
} from '@orchestrator-ui/orchestrator-ui-components';
import { CIM_TICKETS_ENDPOINT } from '../../constants-surf';
import { ServiceTicketTabIds, tabs } from './utils';
import { ServiceTicketWithDetails } from '../../types';
import { WfoServiceTicketGeneral } from './WfoServiceTicketGeneral';

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

    //TODO: Move this to a separate component
    const sendEmailButtonValues = [
        {
            id: 'id_1',
            label: `${t('buttons.sendNewEmail')}`,
            iconType: 'documentEdit',
        },
        {
            id: 'id_2',
            label: '',
            iconType: 'arrowDown',
        },
    ];

    const WfoDropdownButton = () => {
        const [isPopoverOpen, setPopoverOpen] = useState(false);

        const onButtonClick = () => {
            setPopoverOpen(!isPopoverOpen);
        };

        const closePopover = () => {
            setPopoverOpen(false);
        };

        return (
            <EuiPopover
                ownFocus
                button={
                    <EuiButtonGroup
                        type={'multi'}
                        idToSelectedMap={{
                            [sendEmailButtonValues[0].id]: true,
                            [sendEmailButtonValues[1].id]: true,
                        }}
                        color={'primary'}
                        buttonSize={'m'}
                        legend={'Buttons'}
                        options={sendEmailButtonValues}
                        onChange={onButtonClick}
                    />
                }
                isOpen={isPopoverOpen}
                closePopover={closePopover}
                anchorPosition="downRight"
            >
                <div style={{ width: '300px' }}>
                    {/* Dropdown content goes here */}
                    <EuiText>
                        <p>Dropdown content goes here.</p>
                    </EuiText>
                    <EuiText>
                        <p>Dropdown content goes here.</p>
                    </EuiText>
                    <EuiText>
                        <p>Dropdown content goes here.</p>
                    </EuiText>
                    <EuiText>
                        <p>Dropdown content goes here.</p>
                    </EuiText>
                </div>
            </EuiPopover>
        );
    };

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
                                    <h2>{data.title_nl}</h2>
                                </EuiText>
                            </EuiFlexItem>
                            <EuiFlexItem grow={false}>
                                <EuiFlexGroup>
                                    <EuiFlexItem grow={false}>
                                        <EuiButton
                                            iconType="error"
                                            color="danger"
                                        >
                                            {t('buttons.abort')}
                                        </EuiButton>
                                    </EuiFlexItem>
                                    <EuiFlexItem grow={false}>
                                        {/*<EuiButton fill iconType="documentEdit" color="primary" > {t("buttons.sendNewEmail")}</EuiButton>*/}
                                        <WfoDropdownButton></WfoDropdownButton>
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
