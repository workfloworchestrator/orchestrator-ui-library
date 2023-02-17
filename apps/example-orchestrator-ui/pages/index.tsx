import React from 'react';
import { EuiText } from '@elastic/eui';
import { useEuiTheme } from '@elastic/eui';

export function Index() {
    const { euiTheme } = useEuiTheme();

    return (
        <>
            <EuiText
                css={{
                    background: euiTheme.colors.lightShade,
                }}
            >
                Content
            </EuiText>
        </>
    );
}

export default Index;
