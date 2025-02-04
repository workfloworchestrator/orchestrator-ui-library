import React, {
    FC,
    ReactElement,
    ReactNode,
    createContext,
    useRef,
    useState,
} from 'react';

import type { EuiThemeColorMode } from '@elastic/eui';
import { EuiPageTemplate } from '@elastic/eui';
import { EuiSideNavItemType } from '@elastic/eui/src/components/side_nav/side_nav_types';

import { WfoBreadcrumbs, WfoPageHeader, WfoSidebar } from '@/components';
import { useOrchestratorTheme } from '@/hooks';

export interface WfoPageTemplateProps {
    getAppLogo: (navigationHeight: number) => ReactElement;
    overrideMenuItems?: (
        defaultMenuItems: EuiSideNavItemType<object>[],
    ) => EuiSideNavItemType<object>[];
    onThemeSwitch: (theme: EuiThemeColorMode) => void;
    children: ReactNode;
}

export type ContentType = {
    contentRef: React.RefObject<HTMLDivElement>;
};
export const ContentContext = createContext<ContentType | undefined>(undefined);

export const WfoPageTemplate: FC<WfoPageTemplateProps> = ({
    children,
    getAppLogo,
    overrideMenuItems,
    onThemeSwitch,
}) => {
    const { theme, multiplyByBaseUnit } = useOrchestratorTheme();
    const [isSideMenuVisible, setIsSideMenuVisible] = useState(true);
    const navigationHeight = multiplyByBaseUnit(3);

    const headerRowRef = useRef<HTMLDivElement>(null);

    return (
        <>
            <WfoPageHeader
                getAppLogo={getAppLogo}
                navigationHeight={navigationHeight}
                onThemeSwitch={onThemeSwitch}
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
                            overflowY: 'auto',
                            maxHeight: `calc(100vh - ${navigationHeight}px)`,
                        }}
                    >
                        <WfoSidebar overrideMenuItems={overrideMenuItems} />
                    </EuiPageTemplate.Sidebar>
                )}

                <div
                    ref={headerRowRef}
                    css={{
                        backgroundColor: theme.colors.emptyShade,
                        overflowY: 'auto',
                        maxHeight: `calc(100vh - ${navigationHeight}px)`,
                    }}
                >
                    <ContentContext.Provider
                        value={{ contentRef: headerRowRef }}
                    >
                        <EuiPageTemplate.Section className="test-contnt-area">
                            <WfoBreadcrumbs
                                handleSideMenuClick={() =>
                                    setIsSideMenuVisible(
                                        (prevState) => !prevState,
                                    )
                                }
                            />
                            {children}
                        </EuiPageTemplate.Section>
                    </ContentContext.Provider>
                </div>
            </EuiPageTemplate>
        </>
    );
};
