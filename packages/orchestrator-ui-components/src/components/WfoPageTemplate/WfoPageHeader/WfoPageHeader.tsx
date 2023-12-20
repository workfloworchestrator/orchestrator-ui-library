import React, { FC, ReactElement } from 'react';

import {
    EuiBadgeGroup,
    EuiButtonIcon,
    EuiHeader,
    EuiHeaderLogo,
    EuiHeaderSection,
    EuiHeaderSectionItem,
} from '@elastic/eui';
import { EuiThemeColorMode } from '@elastic/eui/src/services/theme/types';

import { WfoEngineStatusBadge } from '@/components';
import { WfoEnvironmentBadge } from '@/components';
import { WfoFailedTasksBadge } from '@/components';
import { useOrchestratorTheme } from '@/hooks';
import { WfoLogoutIcon } from '@/icons';

function getLocalStorage(key: string): string | null {
    if (typeof window !== 'undefined') {
        return localStorage.getItem(key);
    }
    // console.log('Returning null, as localstorage is not yet initialized');
    return null;
}

export interface WfoPageHeaderProps {
    // todo: should be part of theme!
    navigationHeight: number;
    getAppLogo: (navigationHeight: number) => ReactElement;
    handleSideMenuClick: () => void;
    handleLogoutClick: () => void;
    themeSwitch: (themeMode: EuiThemeColorMode) => void;
}

export const WfoPageHeader: FC<WfoPageHeaderProps> = ({
    navigationHeight,
    getAppLogo,
    handleSideMenuClick,
    handleLogoutClick,
    themeSwitch,
}) => {
    const { theme, multiplyByBaseUnit } = useOrchestratorTheme();

    function handleThemeSwitch(themeMode: EuiThemeColorMode) {
        themeSwitch(themeMode);
    }

    return (
        <EuiHeader
            css={{
                backgroundColor: theme.colors.primary,
                height: navigationHeight,
            }}
        >
            <EuiHeaderSection>
                <EuiHeaderSectionItem>
                    <EuiHeaderLogo
                        iconType={() => getAppLogo(navigationHeight)}
                    />
                </EuiHeaderSectionItem>
                <EuiHeaderSectionItem>
                    <WfoEnvironmentBadge />
                </EuiHeaderSectionItem>
                <EuiButtonIcon
                    aria-label="Logout"
                    display="empty"
                    iconType={() => (
                        <WfoLogoutIcon color={theme.colors.emptyShade} />
                    )}
                    css={{ width: 48, height: 48, marginLeft: 10 }}
                    onClick={handleSideMenuClick}
                />
            </EuiHeaderSection>

            <EuiHeaderSection>
                <EuiHeaderSectionItem>
                    <EuiBadgeGroup css={{ marginRight: multiplyByBaseUnit(2) }}>
                        <WfoEngineStatusBadge />
                        <WfoFailedTasksBadge />
                    </EuiBadgeGroup>

                    {getLocalStorage('themeMode') == 'light' ? (
                        <EuiButtonIcon
                            aria-label="Dark Mode"
                            display="empty"
                            iconType="moon"
                            css={{
                                width: '48px',
                                height: '48px',
                                color: theme.colors.emptyShade,
                            }}
                            title="Dark Mode"
                            onClick={() => handleThemeSwitch('dark')}
                        />
                    ) : (
                        <EuiButtonIcon
                            aria-label="Light Mode"
                            display="empty"
                            iconType="sun"
                            css={{
                                width: '48px',
                                height: '48px',
                                color: theme.colors.emptyShade,
                            }}
                            title="Light Mode"
                            onClick={() => handleThemeSwitch('light')}
                        />
                    )}

                    <EuiButtonIcon
                        aria-label="Logout"
                        display="empty"
                        iconType={() => (
                            <WfoLogoutIcon color={theme.colors.emptyShade} />
                        )}
                        css={{
                            width: 48,
                            height: 48,
                        }}
                        onClick={handleLogoutClick}
                    />
                </EuiHeaderSectionItem>
            </EuiHeaderSection>
        </EuiHeader>
    );
};
