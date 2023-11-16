import React, {
    FC,
    ReactElement,
    ReactNode,
    useContext,
    useState,
} from 'react';
import { EuiPageTemplate } from '@elastic/eui';
import { WfoPageHeader } from '../WfoPageHeader';
import { WfoSidebar } from '../WfoSidebar';
import { useOrchestratorTheme } from '../../../hooks/useOrchestratorTheme';
import { WfoBreadcrumbs } from '../WfoBreadcrumbs';
import { EuiSideNavItemType } from '@elastic/eui/src/components/side_nav/side_nav_types';
import { signOut } from 'next-auth/react';
import ConfirmationDialogContext from '../../../contexts/ConfirmationDialogProvider';

export interface WfoPageTemplateProps {
    getAppLogo: (navigationHeight: number) => ReactElement;
    overrideMenuItems?: (
        defaultMenuItems: EuiSideNavItemType<object>[],
    ) => EuiSideNavItemType<object>[];
    children: ReactNode;
}

export const WfoPageTemplate: FC<WfoPageTemplateProps> = ({
    children,
    getAppLogo,
    overrideMenuItems,
}) => {
    const { theme, multiplyByBaseUnit } = useOrchestratorTheme();
    const [isSideMenuVisible, setIsSideMenuVisible] = useState(true);

    const { showConfirmDialog } = useContext(ConfirmationDialogContext);

    const navigationHeight = multiplyByBaseUnit(3);

    return (
        <>
            <WfoPageHeader
                getAppLogo={getAppLogo}
                navigationHeight={navigationHeight}
                handleSideMenuClick={() =>
                    // setIsSideMenuVisible((prevState) => !prevState)
                    // Todo: remove this example usage of confirmation dialog
                    showConfirmDialog({
                        question:
                            'Are you sure you want to close the side menu?',
                        confirmAction: () => console.log('confirm'),
                        cancelAction: () => console.log('cancel'),
                    })
                }
                handleLogoutClick={signOut}
            />

            {/* Sidebar and content area */}
            <EuiPageTemplate
                panelled={false}
                grow={false}
                contentBorder={false}
                minHeight={`calc(100vh - ${navigationHeight}px)`}
                restrictWidth={false}
            >
                {isSideMenuVisible && (
                    <EuiPageTemplate.Sidebar
                        css={{
                            backgroundColor: theme.colors.body,
                        }}
                    >
                        <WfoSidebar overrideMenuItems={overrideMenuItems} />
                    </EuiPageTemplate.Sidebar>
                )}
                <EuiPageTemplate.Section
                    css={{
                        backgroundColor: theme.colors.emptyShade,
                    }}
                >
                    <WfoBreadcrumbs />
                    {children}
                </EuiPageTemplate.Section>
            </EuiPageTemplate>
        </>
    );
};
