import { CustomButton } from '@orchestrator-ui/orchestrator-ui-components';
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
                    padding: euiTheme.size.xl,
                }}
            >
                <p>A box with some text using the global theme</p>
            </EuiText>
            <CustomButton buttonText="Button text" />
        </>
    );
}

export default Index;
