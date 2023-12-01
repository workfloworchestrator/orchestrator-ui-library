import React, { FC, ReactNode } from 'react';

import {
    EuiButton,
    EuiButtonEmpty,
    EuiFlexGroup,
    EuiFlexItem,
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
    submitButtonLabel: string;
    children: ReactNode;
};

export const WfoSubmitModal: FC<WfoSubmitModalProps> = ({
    title,
    onClose,
    onSubmit,
    submitButtonLabel = 'Submit',
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
                <EuiFlexGroup justifyContent={'spaceBetween'}>
                    <EuiFlexItem grow={false}>
                        <EuiButtonEmpty onClick={onClose}>Close</EuiButtonEmpty>
                    </EuiFlexItem>
                    <EuiFlexItem grow={false}>
                        <EuiButton fill onClick={onSubmit}>
                            {submitButtonLabel}
                        </EuiButton>
                    </EuiFlexItem>
                </EuiFlexGroup>
            </EuiModalFooter>
        </EuiModal>
    );
};
