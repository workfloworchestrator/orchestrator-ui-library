import React, { FC, ReactNode } from 'react';
import {
    EuiButton,
    EuiButtonEmpty,
    EuiFlexGroup,
    EuiModal,
    EuiModalBody,
    EuiModalFooter,
    EuiModalHeader,
    EuiModalHeaderTitle,
    EuiSpacer,
} from '@elastic/eui';

export type SettingsModalProps = {
    title: string;
    onClose: () => void;
    onResetToDefaults: () => void;
    onUpdateTableConfig: () => void;
    children: ReactNode;
};

export const SettingsModal: FC<SettingsModalProps> = ({
    title,
    onClose,
    onResetToDefaults,
    onUpdateTableConfig,
    children,
}) => (
    <EuiModal onClose={onClose} maxWidth={400}>
        <EuiModalHeader>
            <EuiModalHeaderTitle size="xs">{title}</EuiModalHeaderTitle>
        </EuiModalHeader>

        <EuiSpacer size="s" />

        <EuiModalBody>{children}</EuiModalBody>

        <EuiModalFooter>
            <EuiFlexGroup justifyContent="spaceBetween">
                <EuiButtonEmpty onClick={onResetToDefaults} flush="left">
                    Reset to default
                </EuiButtonEmpty>
                <EuiButton onClick={onUpdateTableConfig} fill>
                    Save preference
                </EuiButton>
            </EuiFlexGroup>
        </EuiModalFooter>
    </EuiModal>
);
