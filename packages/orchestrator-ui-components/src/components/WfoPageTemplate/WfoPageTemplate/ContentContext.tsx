import React, { FC, ReactNode, createContext } from 'react';

import { getPageTemplateStyles } from '@/components/WfoPageTemplate/WfoPageTemplate/styles';
import { useWithOrchestratorTheme } from '@/hooks';

export type ContentType = {
    contentRef: React.RefObject<HTMLDivElement>;
};
export const ContentContext = createContext<ContentType | undefined>(undefined);
export type ContentContextProviderProps = ContentType & {
    navigationHeight: number;
    children: ReactNode;
};
export const ContentContextProvider: FC<ContentContextProviderProps> = ({
    contentRef,
    navigationHeight,
    children,
}) => {
    const { getContentStyle } = useWithOrchestratorTheme(getPageTemplateStyles);

    return (
        <div ref={contentRef} css={getContentStyle(navigationHeight)}>
            <ContentContext.Provider value={{ contentRef }}>
                {children}
            </ContentContext.Provider>
        </div>
    );
};
