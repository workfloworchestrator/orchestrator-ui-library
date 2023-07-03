import type { ReactNode } from 'react';

interface MetadataLayoutProps {
    children: ReactNode;
}

export const MetaDataLayout = ({ children }: MetadataLayoutProps) => {
    return <div>{children}</div>;
};
