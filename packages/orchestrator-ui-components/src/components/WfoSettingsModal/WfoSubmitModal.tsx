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

export type WfoSubmitModalProps = {
    title: string;
    onClose: () => void;
    onSubmit: () => void;
    children: ReactNode;
};

export const WfoSubmitModal: FC<WfoSubmitModalProps> = ({
    title,
    onClose,
    onSubmit,
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
                <EuiButton onClick={onSubmit}>Submit</EuiButton>
                <EuiButton onClick={onClose} fill>
                    Close
                </EuiButton>
            </EuiModalFooter>
        </EuiModal>
    );
};
