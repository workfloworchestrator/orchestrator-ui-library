import React, { FC, ReactNode } from 'react';
import {
    EuiButton,
    EuiModal,
    EuiModalBody,
    EuiModalFooter,
    EuiModalHeader,
    EuiModalHeaderTitle,
    EuiSpacer,
} from '@elastic/eui';

export type WFOInformationModalProps = {
    title: string;
    onClose: () => void;
    children: ReactNode;
};

// Todo add translations
export const WFOInformationModal: FC<WFOInformationModalProps> = ({
    title,
    onClose,
    children,
}) => {
    return (
        <EuiModal onClose={onClose}>
            <EuiModalHeader>
                <EuiModalHeaderTitle size="xs">{title}</EuiModalHeaderTitle>
            </EuiModalHeader>

            <EuiSpacer size="s" />

            <EuiModalBody>{children}</EuiModalBody>

            <EuiModalFooter>
                <EuiButton onClick={onClose} fill>
                    Close
                </EuiButton>
            </EuiModalFooter>
        </EuiModal>
    );
};
