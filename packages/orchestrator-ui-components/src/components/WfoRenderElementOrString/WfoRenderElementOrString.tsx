import React, { FC, ReactElement } from 'react';

export type WfoRenderElementOrStringProps = {
    renderString?: (value: string) => ReactElement;
    children: ReactElement | ReactElement[] | string;
};
export const WfoRenderElementOrString: FC<WfoRenderElementOrStringProps> = ({
    children,
    renderString,
}): ReactElement => {
    if (typeof children === 'string' && renderString) {
        return renderString(children);
    }

    return <>{children}</>;
};
