import { EuiButton } from '@elastic/eui';
import React from 'react';

interface EngineStatusButtonProps {
    isLoading: boolean;
    isRunning: boolean;
    changeEngineStatus: () => void;
}

export const EngineStatusButton = ({
    isLoading,
    isRunning,
    changeEngineStatus,
}: EngineStatusButtonProps) => {
    if (isLoading) {
        return (
            <EuiButton isLoading fill>
                Loading...
            </EuiButton>
        );
    } else {
        if (isRunning) {
            return (
                <EuiButton
                    onClick={changeEngineStatus}
                    color="warning"
                    fill
                    iconType="pause"
                >
                    Pause the engine
                </EuiButton>
            );
        } else {
            return (
                <EuiButton
                    onClick={changeEngineStatus}
                    color="primary"
                    fill
                    iconType="play"
                >
                    Start the engine
                </EuiButton>
            );
        }
    }
};
